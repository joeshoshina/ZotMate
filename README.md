# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Outside Resource Disclosure:

Evan - I utilized a cursor to conduct an accessibility audit as well as add limited features to support error prevention within the application. Some of the major items completed and manually reviewed was color palette updated to meet A11y Requirements, Metadata for React updated to be up to standards, and error prevention, such as editing added to the personal details page.

I further used a cursor to help me with fixing the sign-in page to take it from a manual sign-in/ create account button and making it check the Firebase for the onBoard tag that would be contained within the email.

Joe - Scaffolded an isolated Express API under server/ (own package.json, npm run server) to proxy Anteater API so ANTEATER_API_KEY stays in repo-root .env and never ships to the browser; wired Vite dev proxy (/api → localhost:3001) and documented env/scripts in CONTEXT.md. Used Cursor Agent to review that setup: split flat handlers into server/routes/courses.js and programs.js, shared server/lib/anteaterClient.js for auth + base URL, and aligned src/utils/anteaterApi.js with /api/courses and /api/programs/majors. Had the agent trace failures end-to-end (server running, proxy, response shape) when majors/course search broke, then wired PersonalInfoPage (major dropdown) and ClassSearch (catalog id + department filter) through the proxy. I reviewed diffs, ran both dev processes locally, and kept product choices (e.g. two search fields when a single bar was unreliable).
