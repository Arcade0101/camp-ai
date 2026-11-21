"use server";

import { redirect } from "next/navigation";
import { createSupabaseClient } from "../../lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    email.trim().length === 0 ||
    email.length > 254 ||
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 1024
  ) {
    redirect("/login?error=credentials");
  }

  const supabase = await createSupabaseClient(true);
  if (!supabase) redirect("/login");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) redirect("/login?error=credentials");

  const { data: coordinator } = await supabase
    .from("coordinators")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!coordinator) {
    await supabase.auth.signOut({ scope: "local" });
    redirect("/login?error=credentials");
  }

  redirect("/dashboard");
}
