import {
  isSameOriginForm,
  redirectAfterForm,
} from "../../../lib/supabase/auth-form";
import { createSupabaseClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  if (!isSameOriginForm(request))
    return new Response("Forbidden", { status: 403 });
  const supabase = await createSupabaseClient(true);
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) return redirectAfterForm("/dashboard?error=signout");
  }
  return redirectAfterForm("/login");
}
