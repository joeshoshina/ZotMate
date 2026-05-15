const DEFAULT_BASE = "https://anteaterapi.com/v2/rest";

function anteaterBaseUrl() {
  return (process.env.ANTEATER_API_BASE ?? DEFAULT_BASE).replace(/\/$/, "");
}

/**
 * @param {string} pathWithQuery path starting with / (e.g. /courses?department=...)
 */
export async function anteaterGet(pathWithQuery) {
  const base = anteaterBaseUrl();
  const path = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = `${base}${path}`;

  const headers = { Accept: "application/json" };
  const key = process.env.ANTEATER_API_KEY;
  if (key) {
    headers.Authorization = `Bearer ${key}`;
  }

  const res = await fetch(url, { headers });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { ok: false, message: text || "Invalid JSON from Anteater API" };
  }
  return { status: res.status, body };
}
