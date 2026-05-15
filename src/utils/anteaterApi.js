function apiBase() {
  return String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
}

/** @param {string} path e.g. "/api/courses" or "api/courses" */
function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = apiBase();
  return base ? `${base}${p}` : p;
}

async function readJsonResponse(res) {
  const text = await res.text();
  try {
    return { parseOk: true, json: text ? JSON.parse(text) : {} };
  } catch {
    return { parseOk: false, json: null, raw: text };
  }
}

/**
 * Map Anteater catalog course to UI shape used by ClassSearch.
 * @param {{ id: string, department?: string, courseNumber?: string, title?: string }} c
 */
export function mapCatalogCourse(c) {
  const code = [c.department, c.courseNumber].filter(Boolean).join(" ").trim();
  return {
    id: c.id,
    code: code || c.id,
    title: c.title ?? "",
  };
}

/**
 * Build Anteater list params for department + course number.
 * Adds `courseNumeric` from leading digits of `courseNumber` when present (e.g. 45C → 45).
 * @param {string} department e.g. "I&C SCI", "IN4MATX"
 * @param {string} courseNumber e.g. "45C", "121"
 */
export function departmentCourseParams(department, courseNumber) {
  const d = String(department ?? "").trim();
  const n = String(courseNumber ?? "").trim();
  const params = { department: d, courseNumber: n };
  const leading = n.match(/^(\d+)/);
  if (leading) {
    params.courseNumeric = parseInt(leading[1], 10);
  }
  return params;
}

/**
 * Map the main search box to Anteater list-query params (course #, dept + #, or title).
 * @param {string} raw
 */
export function parseCourseSearchQuery(raw) {
  const q = raw.trim();
  if (!q) return {};
  if (/^\d+[A-Za-z]?$/i.test(q)) {
    const params = { courseNumber: q };
    const leading = q.match(/^(\d+)/);
    if (leading) params.courseNumeric = parseInt(leading[1], 10);
    return params;
  }
  const m = q.match(/^(.+?)\s+([A-Za-z0-9][A-Za-z0-9-]*)$/);
  if (m && m[1].trim().length >= 2) {
    return departmentCourseParams(m[1].trim(), m[2]);
  }
  return { titleContains: q };
}

/** Anteater catalog course id: department + courseNumber, no spaces (e.g. COMPSCI161, I&CSCI45C). */
export function normalizeCatalogCourseId(raw) {
  return raw.trim().replace(/\s+/g, "");
}

/**
 * True if the query should be resolved with GET /courses/{id} first.
 * Heuristic: compact token with digits, ends with a course-number chunk (digits + optional letters),
 * so department codes like IN4MATX are not mistaken for catalog ids.
 * @param {string} raw
 */
export function looksLikeCourseCatalogId(raw) {
  const q = normalizeCatalogCourseId(raw);
  if (q.length < 5) return false;
  if (!/[0-9]/.test(q)) return false;
  if (!/\d+[A-Za-z]*$/.test(q)) return false;
  return /^[A-Za-z][A-Za-z0-9.&]*$/.test(q);
}

/**
 * @param {Record<string, string | number>} params
 * @param {AbortSignal} [signal]
 */
export async function fetchCourses(params, signal) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  }
  const res = await fetch(apiUrl(`/api/courses?${search}`), {
    signal,
    headers: { Accept: "application/json" },
  });
  const parsed = await readJsonResponse(res);
  if (!parsed.parseOk || parsed.json == null) {
    return { ok: false, message: `Invalid response (${res.status})` };
  }
  if (!res.ok) {
    const d = parsed.json;
    return {
      ok: false,
      message:
        typeof d?.message === "string"
          ? d.message
          : typeof d?.error === "string"
            ? d.error
            : res.statusText || `HTTP ${res.status}`,
    };
  }
  return parsed.json;
}

const MIN_SEARCH_LEN = 2;

async function listParamsOrEmpty(params, signal) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
  if (Object.keys(filtered).length === 0) {
    return { ok: true, data: [] };
  }
  return fetchCourses({ ...filtered, take: 24 }, signal);
}

/**
 * Main class search + optional department filter (second field).
 *
 * - **Department filter only** (at least 2 chars, main query shorter than that): `GET /courses?department=…`
 * - **Main search** (at least 2 chars): if catalog id–like → `GET /courses/{id}`; on miss or otherwise → list with `parseCourseSearchQuery(main)`.
 * - When both apply, list requests include **`department`** from the filter (overrides a parsed dept from the main line).
 *
 * @param {string} query Main search text
 * @param {AbortSignal} [signal]
 * @param {{ department?: string }} [opts] Optional department filter from the separate field
 */
export async function searchCoursesFromQuery(query, signal, opts = {}) {
  const trimmed = query.trim();
  const deptFilter = String(opts.department ?? "").trim();

  if (deptFilter.length >= MIN_SEARCH_LEN && trimmed.length < MIN_SEARCH_LEN) {
    return fetchCourses({ department: deptFilter, take: 24 }, signal);
  }

  if (trimmed.length < MIN_SEARCH_LEN) {
    return { ok: true, data: [] };
  }

  const mergeDept = (parsed) =>
    deptFilter.length >= MIN_SEARCH_LEN
      ? { ...parsed, department: deptFilter }
      : parsed;

  if (looksLikeCourseCatalogId(trimmed)) {
    const id = normalizeCatalogCourseId(trimmed);
    const byId = await fetchCourseById(id, signal);
    if (byId?.ok === true && byId.data) {
      return { ok: true, data: [byId.data] };
    }
    if (signal?.aborted) {
      return { ok: true, data: [] };
    }
    const parsed = parseCourseSearchQuery(trimmed);
    return listParamsOrEmpty(mergeDept(parsed), signal);
  }

  const parsed = parseCourseSearchQuery(trimmed);
  return listParamsOrEmpty(mergeDept(parsed), signal);
}

/**
 * @param {AbortSignal} [signal]
 */
export async function fetchMajors(signal) {
  const res = await fetch(apiUrl("/api/programs/majors"), {
    signal,
    headers: { Accept: "application/json" },
  });
  const parsed = await readJsonResponse(res);
  if (!parsed.parseOk || parsed.json == null) {
    return {
      ok: false,
      message: `Could not read server response (${res.status}). Is the API running? Try npm run server.`,
    };
  }
  const body = parsed.json;
  if (!res.ok) {
    return {
      ok: false,
      message:
        typeof body?.message === "string"
          ? body.message
          : typeof body?.error === "string"
            ? body.error
            : res.statusText || `HTTP ${res.status}`,
    };
  }
  return body;
}

/**
 * @param {string} id Anteater catalog course id (e.g. I&CSCI45C)
 * @param {AbortSignal} [signal]
 */
export async function fetchCourseById(id, signal) {
  const enc = encodeURIComponent(id);
  const res = await fetch(apiUrl(`/api/courses/${enc}`), {
    signal,
    headers: { Accept: "application/json" },
  });
  const parsed = await readJsonResponse(res);
  if (!parsed.parseOk || parsed.json == null) {
    return { ok: false, message: `Invalid response (${res.status})` };
  }
  if (!res.ok) {
    const d = parsed.json;
    return {
      ok: false,
      message:
        typeof d?.message === "string"
          ? d.message
          : typeof d?.error === "string"
            ? d.error
            : res.statusText || `HTTP ${res.status}`,
    };
  }
  return parsed.json;
}

/**
 * Full course payload from GET /courses/{id} → UI row shape.
 * @param {Record<string, unknown>} data
 */
export function mapFullCourseDetail(data) {
  const row = mapCatalogCourse(data);
  return {
    ...row,
    description: typeof data.description === "string" ? data.description : "",
  };
}
