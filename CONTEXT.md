# ZotMate — project context

ZotMate is a UCI-focused web app for class-based matching and onboarding. The UI is a **Vite + React** SPA; **Firebase** handles auth and app data; a small **Express** API in **`server/`** proxies the **Anteater API** so **secret keys never ship to the browser**.

---

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 19, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`), Vite 8 |
| State | Zustand (`src/store/`), React context for auth |
| Backend (local/dev) | **Express 5**, ESM — isolated npm package under **`server/`** (`server/package.json`, `server/node_modules`) |
| BaaS | Firebase (Auth, Firestore, Messaging — `src/firebase/`) |
| Scheduled / serverless | Firebase Cloud Functions (`functions/`) — separate from the Express dev API |

---

## Repository layout (high signal)

### Frontend (`/` root app)

| Path | Role |
|------|------|
| `src/main.jsx`, `src/App.jsx` | SPA entry |
| `src/routes/` | `AppRouter.jsx`, `ProtectedRoute.jsx`, `OnboardingRoute.jsx` |
| `src/pages/auth/` | Login, SMS verify |
| `src/pages/onboarding/` | Onboarding steps: `PersonalInfoPage`, `VerifyEmailPage`, `ClassSchedulePage`, `IdentityPage`, `InterestsPage`, etc. |
| `src/pages/app/` | Logged-in app: `HomePage`, `SettingsPage`, `MatchesPage`, `ChatPage`, … |
| `src/components/onboarding/ClassSearch.jsx` | Single search bar; debounced **`searchCoursesFromQuery`** (catalog id, `dept:` / all-caps / `&` department browse, `dept + #` in one line, or title); full course on add via **`fetchCourseById`** |
| `src/utils/anteaterApi.js` | All browser calls to **`/api/...`** (Vite proxy in dev); course/major helpers |
| `src/store/useOnboardingStore.js` | Onboarding draft state including **`majorId`**, **`major`** (display string), **`classes`**, etc. |
| `src/context/AuthContext.jsx` | Mock auth + `completeOnboarding` profile payload (includes `majorId` from onboarding) |
| `src/firebase/` | Client Firebase config and helpers |
| `vite.config.js` | **`server.proxy`**: `/api` → `http://localhost:3001` |
| `package.json` (root) | Frontend deps + scripts; **`npm run server`** delegates to **`server/`** |

### Backend API (`server/` package, name `zot-mate-api`)

| Path | Role |
|------|------|
| `server/package.json` | Express, cors, dotenv; **`npm start`** → `node index.js`; **`npm run watch`** → `node --watch index.js` |
| `server/package-lock.json` | Lockfile for server deps |
| `server/node_modules/` | Server-only install (`cd server && npm install`) |
| `server/index.js` | Express app: CORS, JSON, **`GET /api/health`**, mounts routers, 404 + error handler. Loads **repo-root** `.env` via `path.join(__dirname, "..", ".env")` (so cwd can be `server/`) |
| `server/lib/anteaterClient.js` | `anteaterGet(path)` → `fetch` to **`ANTEATER_API_BASE`** (default `https://anteaterapi.com/v2/rest`) + optional **`Authorization: Bearer ANTEATER_API_KEY`** |
| `server/routes/programs.js` | **`GET /api/programs/majors`** → Anteater **`GET /v2/rest/programs/majors`** (optional query `id`) |
| `server/routes/courses.js` | **`GET /api/courses/:id`** (before list route) → **`GET /v2/rest/courses/{id}`**; **`GET /api/courses`** → list with **whitelisted** query keys only |

### Other

| Path | Role |
|------|------|
| `functions/` | Firebase Cloud Functions (e.g. weekly match job) |
| `public/sw.js` | Service worker |
| `eslint.config.js` | Flat ESLint: React app + **`server/**/*.js`** block with **Node** globals and `argsIgnorePattern: '^_'` |
| `.env` (gitignored) | **Single file at repo root** for both Vite (`VITE_*`) and Express (`ANTEATER_*`, `PORT`, `CORS_ORIGIN`) |

---

## Running locally

1. **Install frontend deps** (repo root): `npm install`
2. **Install API deps**: `cd server && npm install` (or whenever `server/package.json` changes)
3. **Terminal A — API:** from repo root, `npm run server` → runs `npm run start --prefix server` → **`http://localhost:3001`**
4. **Terminal B — Vite:** `npm run dev` → **`http://localhost:5173`**, proxies **`/api`** to port **3001**

Optional: **`npm run server:watch`** — uses `node --watch` inside `server/`; on some macOS setups this can hit **`EMFILE: too many open files`** — use plain **`npm run server`** if that happens.

If **`/api/*`** returns **`{"error":"Not found"}`** while **`/api/health`** works, an **old Node process** may still be bound to **3001** without the latest routes — stop it and restart **`npm run server`**.

---

## Environment variables

Values live in **repo-root `.env`** (gitignored). Names only:

**Vite (must be `VITE_*` for client exposure)**

- `VITE_FIREBASE_*` — Firebase web app (`src/firebase/config.js`)
- `VITE_API_BASE_URL` — Optional absolute API base in **production** when the client is not served behind the same `/api` reverse proxy. **Omit in local dev** so requests use relative **`/api`** and the Vite proxy.

**Express (read from root `.env` by `server/index.js`)**

- `PORT` — default **3001**
- `CORS_ORIGIN` — default **`http://localhost:5173`**
- `ANTEATER_API_KEY` — Secret; **`Authorization: Bearer …`** on upstream Anteater calls. **Never** put in `VITE_*` or `src/`.
- `ANTEATER_API_BASE` — Optional; default **`https://anteaterapi.com/v2/rest`**

Docs: [REST API](https://docs.icssc.club/docs/developer/anteaterapi/rest-api), [keys & rate limits](https://docs.icssc.club/docs/developer/anteaterapi/keys-limits).

---

## Express API surface (proxied Anteater)

| Method | Express path | Upstream |
|--------|----------------|----------|
| GET | `/api/health` | Local liveness |
| GET | `/api/programs/majors` | `GET /v2/rest/programs/majors` (forwards query `id` if present) |
| GET | `/api/courses/:id` | `GET /v2/rest/courses/{id}` (`encodeURIComponent` on id; rejects `..` and `/` in param) |
| GET | `/api/courses` | `GET /v2/rest/courses` — only these query keys are forwarded: `department`, `courseNumber`, `courseNumeric`, `titleContains`, `courseLevel`, `minUnits`, `maxUnits`, `descriptionContains`, `geCategory`, `take`, `skip` |

---

## Frontend ↔ Anteater (`src/utils/anteaterApi.js`)

All requests use **`apiUrl("/api/...")`**: empty base in dev → same-origin **`/api`** (Vite proxy); with **`VITE_API_BASE_URL`** → absolute origin.

| Export | Behavior |
|--------|----------|
| `fetchMajors(signal)` | `GET /api/programs/majors`; safe JSON + HTTP error handling |
| `fetchCourses(params, signal)` | `GET /api/courses?…` |
| `fetchCourseById(id, signal)` | `GET /api/courses/{encodeURIComponent(id)}` |
| `parseCourseSearchQuery(q)` | Maps main search text to list params: course #, `dept + number` (with optional **`courseNumeric`**), or **`titleContains`** |
| `departmentCourseParams(department, courseNumber)` | Params for `dept + number`; adds **`courseNumeric`** when the # starts with digits |
| `normalizeCatalogCourseId(raw)` | Trim + remove spaces (`COMPSCI 161` → `COMPSCI161`) |
| `looksLikeCourseCatalogId(raw)` | True for compact **catalog id** tokens ending with a digit block (e.g. `COMPSCI161`, `I&CSCI45C`); avoids treating `IN4MATX` as an id |
| `searchCoursesFromQuery(q, signal, opts?)` | Optional **`opts.department`**: filter-only browse when main query is short; else catalog **id** then list with **`parseCourseSearchQuery`**, merging **`department`** from the filter when set |
| `mapCatalogCourse`, `mapFullCourseDetail` | Normalize API rows for UI (`id`, `code`, `title`, optional `description`) |

**UI wiring**

- **`PersonalInfoPage.jsx`** — Loads majors via **`fetchMajors`**; select stores **`majorId`** + display **`major`** (`Name (Type)`); request-generation ref + **Retry** on failure; division buckets (**case-insensitive** undergrad/grad/other).
- **`ClassSearch.jsx`** — **Department filter** field plus **search** field; **`searchCoursesFromQuery(q, signal, { department })`**. On pick, **`fetchCourseById`** + **`mapFullCourseDetail`**. Used from **`ClassSchedulePage.jsx`** and **`SettingsPage.jsx`**.
- **`ClassSchedulePage.jsx`** — Shows optional **description** line for selected courses when present.
- **`InterestsPage.jsx`** — Passes **`majorId`** (and **`major`**) into **`completeOnboarding`**.

---

## Conventions for agents / contributors

- **ESM** everywhere (`"type": "module"` at root and in `server/package.json`).
- **Secrets**: only **`ANTEATER_API_KEY`** (and any future server secrets) in root `.env` / server process — not in Vite env or React imports.
- **New upstream proxies**: add route under `server/routes/`, mount in `server/index.js`, whitelist query/body params explicitly.
- **Lint**: `eslint.config.js` — `server/**/*.js` uses **Node** globals; use `_`-prefixed unused Express error-handler args if needed.
- **Do not** commit `.env`.

---

## Build / preview

- **`npm run build`** — Client output to **`dist/`**
- **`npm run preview`** — Serves **`dist/`**; Vite **dev** proxy is **not** active — set **`VITE_API_BASE_URL`** or put the API behind the same host’s **`/api`** path.
