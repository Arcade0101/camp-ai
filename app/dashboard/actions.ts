"use server";

import { redirect } from "next/navigation";
import { createSupabaseClient } from "../../lib/supabase/server";

export async function signOut() {
  const supabase = await createSupabaseClient(true);
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) redirect("/dashboard?error=signout");
  }
  redirect("/login");
}
