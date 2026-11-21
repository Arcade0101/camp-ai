# Camp AI architecture

## Phase 1

Next.js renders the public landing page from `app/page.tsx`. The shared layout provides page metadata and loads Tailwind through `app/globals.css`. The page builds to static HTML and CSS and needs no credentials or external services at runtime.

| Path              | Purpose                                                                               |
| ----------------- | ------------------------------------------------------------------------------------- |
| `app/layout.tsx`  | Shared HTML, metadata, and styles                                                     |
| `app/page.tsx`    | Landing page and fictional chat preview                                               |
| `app/globals.css` | Tailwind import and shared color tokens                                               |
| `docs/`           | Architecture and implementation notes                                                 |
| Root config files | Package lockfile, TypeScript, ESLint, Prettier, PostCSS, and environment placeholders |

## Planned MVP data flow

1. A coordinator signs in with Supabase Auth. PostgreSQL row-level security limits them to their own camps and documents.
2. A coordinator uploads a document to private Storage. The server validates and extracts the text, then stores searchable chunks tagged with the camp and document IDs.
3. A teacher opens a camp-specific link. The server verifies the access code when required and issues a session scoped to that camp.
4. The server checks the session and rate limit, then selects relevant chunks from that camp using keyword matching. It sends a bounded selection and the question to Gemini Flash.
5. The server checks that returned references point to retrieved chunks. When the answer lacks support, the interface directs the teacher to their coordinator. Uploaded text is treated as untrusted input throughout.

Next.js owns the UI and server endpoints. Supabase handles authentication, relational data, and file storage. Gemini handles answer generation. Keeping extraction and retrieval in the app gives the initial version one deployment and avoids a separate worker or search service.
