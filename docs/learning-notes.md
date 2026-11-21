# Learning notes

## Phase 1 — Project foundation

**What we built.** A static Next.js landing page and a reproducible development setup. This gives each later feature a working starting point and makes errors easier to isolate.

**Main files.** `app/page.tsx` is the route for `/`. `app/layout.tsx` defines the shared document and metadata. `app/globals.css` loads Tailwind and defines the colors used by the page. `package.json` defines recurring checks, and `package-lock.json` records the exact dependency tree for `npm ci`.

**How to test.** Start the app with `npm run dev`, visit `/`, and follow the “How it works” link. Resize to phone and desktop widths and use Tab and Enter to check navigation. Run the four verification commands in the README.

**What you learned.** An App Router route can render without client-side state or a backend. ESLint checks code conventions and common errors, TypeScript checks types, and Prettier checks consistent formatting. A production build checks that Next.js can compile and render the project for deployment.

**Suggested commit** — `feat: scaffold Camp AI and add the landing page`
