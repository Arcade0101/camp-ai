# Learning notes

## Phase 1 — Project foundation

**What we built.** A static Next.js landing page and a reproducible development setup. This gives each later feature a working starting point and makes errors easier to isolate.

**Main files.** `app/page.tsx` is the route for `/`. `app/layout.tsx` defines the shared document and metadata. `app/globals.css` loads Tailwind and defines the colors used by the page. `package.json` defines recurring checks, and `package-lock.json` records the exact dependency tree for `npm ci`.

**How to test.** Start the app with `npm run dev`, visit `/`, and follow the “How it works” link. Resize to phone and desktop widths and use Tab and Enter to check navigation. Run the four verification commands in the README.

**What you learned.** An App Router route can render without client-side state or a backend. ESLint checks code conventions and common errors, TypeScript checks types, and Prettier checks consistent formatting. A production build checks that Next.js can compile and render the project for deployment.

**Suggested commit** — `feat: scaffold Camp AI and add the landing page`

## Phase 2 — Database and authentication

**What we built.** Coordinator password sign-in, a private dashboard, and database policies for coordinator-owned camp data. This gives camp management a verified user and a place to store records.

**Main files.** `supabase/migrations/20261121000100_phase_2.sql` creates the schema and access policies. `app/login/` and `app/dashboard/` implement the pages and server actions. `lib/supabase/` supplies the server client, and `proxy.ts` refreshes session cookies when necessary.

**How to test.** Follow the Supabase setup in the README. Sign in, check the camp list, sign out, and request the dashboard again. Compare two coordinators' camp lists and try an Auth account that has no coordinator membership.

**What you learned.** Authentication verifies identity. Authorization decides which actions that identity can take. Next.js checks who can enter the dashboard, while PostgreSQL independently checks which rows each user can access.

**Suggested commit** — `feat: add coordinator authentication and camp access policies`
