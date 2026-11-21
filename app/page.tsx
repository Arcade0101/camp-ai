import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-5 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
        <Link className="flex items-center gap-2 font-bold" href="/">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-pine text-sm text-white"
          >
            C
          </span>
          Camp AI
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-4">
          <a
            className="text-sm font-semibold text-pine underline-offset-4 hover:underline"
            href="#how-it-works"
          >
            How it works
          </a>
          <Link
            className="text-sm font-semibold text-pine underline-offset-4 hover:underline"
            href="/login"
          >
            Coordinator sign-in
          </Link>
        </nav>
      </header>

      <main>
        <section className="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-24">
          <div>
            <h1 className="max-w-xl text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Camp information, ready when teachers need it
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted sm:text-lg">
              Camp AI is an open-source project that helps teachers find
              schedules, meeting points, and preparation instructions in the
              documents their coordinator shares.
            </p>
            <a
              className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink"
              href="#how-it-works"
            >
              See how Camp AI works
            </a>
          </div>

          <figure className="min-w-0 rounded-3xl border border-line bg-mist p-4 sm:p-6">
            <figcaption className="mb-4 text-sm font-semibold text-pine">
              Sample conversation · Fictional camp
            </figcaption>
            <div className="rounded-2xl border border-line bg-white p-4 sm:p-6">
              <p className="border-b border-line pb-3 font-semibold">
                Cedar Creek Science Camp
              </p>
              <p className="mt-5 ml-auto w-fit rounded-xl bg-mist px-4 py-2.5 text-sm">
                Where should teachers meet?
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                Meet at the visitor center at 8:30 a.m. on the first day.
              </p>
              <p className="mt-2 text-sm font-semibold text-pine">
                Source · Teacher arrival guide
              </p>
            </div>
          </figure>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-6 border-t border-line py-10 sm:py-14"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-5">
              <dt className="font-semibold">For coordinators</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">
                Create a camp, upload its documents, and share a camp link with
                teachers. Add an access code when needed.
              </dd>
            </div>
            <div className="rounded-2xl border border-line p-5">
              <dt className="font-semibold">For teachers</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">
                Open the link on your phone and ask a question without creating
                an account. Answers cite the camp documents they use.
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-muted">
            Coordinators can sign in, manage camp details, and upload TXT or PDF
            files. Teacher chat is planned for a later phase.
          </p>
        </section>
      </main>
    </div>
  );
}
