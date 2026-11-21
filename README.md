# Camp AI

Camp AI is an open-source learning project that helps teachers find schedules, meeting points, and preparation instructions for educational camps. A coordinator will share a camp link that teachers can open on their phones.

**Current milestone — Phase 1.** The landing page and its fictional chat preview run locally today. Sign-in, camp management, document uploads, and live chat are upcoming work.

## Planned MVP

- Coordinators sign in, manage camps, upload PDF, DOCX, or TXT files, and share camp links with optional access codes.
- Teachers open a camp link without registering and ask questions about that camp.
- Answers cite supporting documents. If the evidence is missing, the app directs the teacher to their coordinator.

## Stack

The foundation uses Next.js App Router, React, TypeScript, Tailwind CSS, ESLint, and Prettier. The MVP will add Supabase PostgreSQL, Auth, and private Storage, plus server-side Gemini Flash calls. GitHub Pages can host the Phase 1 landing page. The full app targets Vercel or another host that runs the Next.js server.

## Run locally

Install Node.js 22 (22.13+) or 24+ and npm. In the project directory, run:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>. The example on the landing page uses the fictional Cedar Creek Science Camp.

No environment file, database, or API key is needed for Phase 1. The placeholder names in `.env.example` show the planned configuration. Phase 2 will add Supabase migrations and instructions for creating a project and configuring Auth. The Gemini API key will be needed in Phase 4. Keep real values in `.env.local` or your hosting provider's environment settings when those phases are implemented.

## Verify changes

```sh
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Run `npm start` after a build to check the production server locally.

## Deployment and cost

### GitHub Pages for Phase 1

The source and static export both live on `main`. GitHub Pages publishes from `/docs` at <https://arcade0101.github.io/camp-ai/>.

After editing the landing page, rebuild and copy the export into the publishing folder. The base path matches the repository name. Next.js includes `.nojekyll` so GitHub Pages serves the `_next/` assets.

```sh
npm ci
CAMP_AI_STATIC_EXPORT=1 CAMP_AI_BASE_PATH=/camp-ai npm run build
cp -a out/. docs/
```

Preserve `docs/architecture.md` and `docs/learning-notes.md` when refreshing the export. Review the changes and commit the updated source and export to `main`. To set up Pages, open **Settings → Pages**, choose **Deploy from a branch**, and select **main** and **/docs**.

### Hosting the full application

GitHub Pages serves static files. Coordinator sign-in, private document processing, teacher sessions, and Gemini calls will require a Next.js server. The standard build stays compatible with Vercel. Later phases will document the database, Auth redirect URLs, and server-side secrets before deployment.

Local development has no service costs. Supabase, Gemini, and Vercel may offer free usage subject to eligibility and quotas. Storage, database or hosting usage, and model calls can incur costs when a paid plan or billing is enabled. The planned MVP limits upload size, retrieved text, and chat requests.

## Contributing and security

See the [contributing guide](CONTRIBUTING.md), [security policy](SECURITY.md), [architecture](docs/architecture.md), and [learning notes](docs/learning-notes.md).

The current app serves public static content. Before storing real camp data, later phases must establish and verify owner-only database access, private storage, teacher session checks, and cross-camp isolation. Use fictional data in examples and bug reports. Model answers will require grounding checks, and teachers should contact their coordinator when the documents lack an answer.

Camp AI is available under the [MIT License](LICENSE).
