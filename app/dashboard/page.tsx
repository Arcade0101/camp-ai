import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "../../lib/supabase/server";
import { signOut } from "./actions";

export const metadata = { title: "Coordinator dashboard | Camp AI" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createSupabaseClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: coordinator } = await supabase
    .from("coordinators")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!coordinator) redirect("/login?error=credentials");

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
        <form action={signOut}>
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
        <h2 className="text-lg font-semibold">Your camps</h2>
        {campsError ? (
          <p role="alert" className="mt-3 text-sm text-red-800">
            Camps couldn’t load. Refresh the page to try again.
          </p>
        ) : camps?.length ? (
          <ul className="mt-2 divide-y divide-line">
            {camps.map((camp) => (
              <li className="py-3" key={camp.id}>
                <p className="font-medium">{camp.name}</p>
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
