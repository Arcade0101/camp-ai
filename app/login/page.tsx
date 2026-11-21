import Link from "next/link";
import { getSupabaseConfig } from "../../lib/supabase/config";
import { signIn } from "./actions";

export const metadata = { title: "Coordinator sign-in | Camp AI" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = getSupabaseConfig() !== null;

  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <Link className="text-sm font-semibold text-pine underline" href="/">
        Camp AI
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Coordinator sign-in
      </h1>
      {configured ? (
        <form action={signIn} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              maxLength={254}
              required
              className="min-h-11 rounded-lg border border-muted px-3"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={1024}
              required
              className="min-h-11 rounded-lg border border-muted px-3"
            />
          </label>
          {error === "credentials" && (
            <p role="alert" className="text-sm text-red-800">
              Sign-in failed. Check your details or contact your administrator.
            </p>
          )}
          <button className="min-h-11 rounded-lg bg-pine px-4 font-semibold text-white hover:bg-ink">
            Sign in
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Coordinator sign-in is awaiting Supabase configuration.
        </p>
      )}
    </main>
  );
}
