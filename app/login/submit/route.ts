import {
  isSameOriginForm,
  redirectAfterForm,
} from "../../../lib/supabase/auth-form";
import { createSupabaseClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  if (!isSameOriginForm(request))
    return new Response("Forbidden", { status: 403 });

  if (
    request.headers.get("content-type")?.split(";")[0] !==
    "application/x-www-form-urlencoded"
  ) {
    return new Response("Unsupported form submission", { status: 415 });
  }

  const formData = await request.formData();
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
    return redirectAfterForm("/login?error=credentials");
  }

  const supabase = await createSupabaseClient(true);
  if (!supabase) return redirectAfterForm("/login");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) return redirectAfterForm("/login?error=credentials");

  const { data: coordinator } = await supabase
    .from("coordinators")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!coordinator) {
    await supabase.auth.signOut({ scope: "local" });
    return redirectAfterForm("/login?error=credentials");
  }

  return redirectAfterForm("/dashboard");
}
