import { redirect } from "next/navigation";
import { createSupabaseClient } from "./server";

export async function getCoordinatorAccess() {
  const supabase = await createSupabaseClient();
  if (!supabase) return { loginPath: "/login" } as const;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { loginPath: "/login" } as const;

  const { data: coordinator } = await supabase
    .from("coordinators")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!coordinator) return { loginPath: "/login?error=credentials" } as const;

  return { supabase, user };
}

export async function requireCoordinator() {
  const access = await getCoordinatorAccess();
  if (access.loginPath) redirect(access.loginPath);
  return access;
}
