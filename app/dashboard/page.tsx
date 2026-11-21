import Link from "next/link";
import { requireCoordinator } from "../../lib/supabase/coordinator";

export const metadata = { title: "Coordinator dashboard | Camp AI" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { supabase, user } = await requireCoordinator();

  const { data: camps, error: campsError } = await supabase
    .from("camps")
    .select("id, name, location")
    .eq("coordinator_id", user.id)
    .order("created_at", { ascending: false });

  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <Link className="font-bold text-pine" href="/">
          Camp AI
        </Link>
        <form method="post" action="/dashboard/sign-out">
          <button className="min-h-11 rounded-lg border border-line px-4 text-sm font-semibold hover:bg-mist">
            Sign out
          </button>
        </form>
      </header>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">
        Coordinator dashboard
      </h1>
      {error === "signout" && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          We couldn’t sign you out. Please try again.
        </p>
      )}
      <section className="mt-6 rounded-2xl border border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Your camps</h2>
          <Link
            href="/dashboard/camps/new"
            className="rounded-lg bg-pine px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink"
          >
            Create camp
          </Link>
        </div>
        {campsError ? (
          <p role="alert" className="mt-3 text-sm text-red-800">
            Camps couldn’t load. Refresh the page to try again.
          </p>
        ) : camps?.length ? (
          <ul className="mt-2 divide-y divide-line">
            {camps.map((camp) => (
              <li className="py-3" key={camp.id}>
                <Link
                  href={`/dashboard/camps/${camp.id}`}
                  className="font-medium text-pine underline underline-offset-4"
                >
                  {camp.name}
                </Link>
                {camp.location && (
                  <p className="text-sm text-muted">{camp.location}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">
            You don’t have any camps yet.
          </p>
        )}
      </section>
    </main>
  );
}
