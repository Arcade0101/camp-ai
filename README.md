# Camp AI

Camp AI is an open-source learning project that helps teachers find schedules, meeting points, and preparation instructions for educational camps. A coordinator will share a camp link that teachers can open on their phones.

**Current milestone — Phase 3, camp details.** The Next.js server app supports coordinator sign-in plus camp creation and editing in a private dashboard backed by Supabase. Document uploads and teacher chat are upcoming work. The Phase 1 preview is available as a static GitHub Pages export.

## Planned MVP

- Coordinators sign in, manage camps, upload PDF, DOCX, or TXT files, and share camp links with optional access codes.
- Teachers open a camp link without registering and ask questions about that camp.
- Answers cite supporting documents. If the evidence is missing, the app directs the teacher to their coordinator.

## Stack

The foundation uses Next.js App Router, React, TypeScript, Tailwind CSS, ESLint, and Prettier. The MVP will add Supabase PostgreSQL, Auth, and private Storage, plus server-side Gemini Flash calls. GitHub Pages can host the Phase 1 landing page. The full app targets Vercel or another host that runs the Next.js server.

## Work in the cloud

In GitHub, open **Code → Codespaces** and start a codespace if your account and usage allowance permit. Use Node.js 24 LTS or Node.js 22.13+. In the project directory, run:

```sh
npm ci
npm run dev
```

Open the forwarded port 3000 from the **Ports** tab. The same commands work in any Node development environment. The landing page needs no credentials. For coordinator sign-in, follow the setup below, then restart the development server if it was already running.

## Set up Supabase for Phase 2

1. Use a Supabase project you control. In **SQL Editor**, run the SQL in `supabase/migrations/20261121000100_phase_2.sql` once on that project.
2. In **Authentication**, keep email/password enabled and disable new user sign-ups for this invite-only app. Under **Users → Add user**, create a coordinator using a confirmed email and a strong password shared privately.
3. Copy the new user's UUID. In **SQL Editor**, authorize that account by running the following with the actual UUID.

   ```sql
   insert into public.coordinators (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

4. Copy `.env.example` to `.env.local` in the cloud workspace or set the two values through your host's environment settings. Use the project's URL and **publishable** key from Supabase. Phase 2 needs no service-role or Gemini key.
5. Open the server app at `/login`. Sign in with the coordinator account and confirm you reach the dashboard. Sign out, then reopen `/dashboard` to confirm it redirects to sign-in.

To verify boundaries on Supabase, create two authorized coordinators and one Auth user without a coordinator membership. Use the project SQL editor as administrator to insert one fictional camp per coordinator using the respective user IDs. Sign in as each coordinator and check that only their camp appears. The regular Auth user should be denied the dashboard. Remove these test accounts and camps when you finish.

## Test camp management

In your Codespace, pull the latest `main` and restart the development server. The existing Phase 2 migration already includes the camp fields.

1. Sign in and click **Create camp** on the dashboard.
2. Enter a fictional name such as **Cedar Creek Science Camp**. Add dates, a location, meeting time, or instructions if you want.
3. Save and check for **Camp saved**. Return to the dashboard, open the new camp, change its location, and save again.
4. Refresh the edit page to confirm the new location persisted. With a second coordinator account, the first coordinator's camp should be absent from the dashboard and unavailable at its edit URL.

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

The Phase 1 landing page is saved in `docs/`. To show it at <https://arcade0101.github.io/camp-ai/>, set **Settings → Pages** to **Deploy from a branch → main → /docs**. Selecting the root folder displays the repository README. The server-side sign-in and dashboard run on a separate Next.js host.

### Hosting the full application

GitHub Pages serves static files. Coordinator sign-in, private document processing, teacher sessions, and Gemini calls will require a Next.js server. The standard build stays compatible with Vercel. The server app uses the two Supabase environment settings above. Later phases will add deployment instructions for private storage, teacher sessions, and AI secrets.

Local development has no service costs. Supabase, Gemini, and Vercel may offer free usage subject to eligibility and quotas. Storage, database or hosting usage, and model calls can incur costs when a paid plan or billing is enabled. The planned MVP limits upload size, retrieved text, and chat requests.

## Contributing and security

See the [contributing guide](CONTRIBUTING.md), [security policy](SECURITY.md), [architecture](docs/architecture.md), and [learning notes](docs/learning-notes.md).

Phase 2 adds coordinator-only database policies. Before storing real camp data, verify these policies on your Supabase project and complete the later phases for private document storage, teacher session checks, and end-to-end camp isolation. Use fictional data in examples and bug reports. Model answers will require grounding checks, and teachers should contact their coordinator when the documents lack an answer.

Camp AI is available under the [MIT License](LICENSE).
