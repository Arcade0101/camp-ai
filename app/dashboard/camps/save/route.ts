import {
  isSameOriginForm,
  redirectAfterForm,
} from "../../../../lib/supabase/auth-form";
import { getCoordinatorAccess } from "../../../../lib/supabase/coordinator";
import { isCampId, parseCamp } from "../fields";

export async function POST(request: Request) {
  if (!isSameOriginForm(request))
    return new Response("Forbidden", { status: 403 });

  const access = await getCoordinatorAccess();
  if (access.loginPath) return redirectAfterForm(access.loginPath);
  const { supabase, user } = access;
  if (
    request.headers.get("content-type")?.split(";")[0] !==
    "application/x-www-form-urlencoded"
  ) {
    return new Response("Unsupported form submission", { status: 415 });
  }

  const form = await request.formData();
  const id = form.get("id");
  if (id !== null && (typeof id !== "string" || !isCampId(id))) {
    return new Response("Camp not found", { status: 404 });
  }

  const path = id ? `/dashboard/camps/${id}` : "/dashboard/camps/new";
  const values = parseCamp(form);
  if (!values) return redirectAfterForm(`${path}?error=invalid`);

  const { data, error } = id
    ? await supabase
        .from("camps")
        .update(values)
        .eq("id", id)
        .eq("coordinator_id", user.id)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("camps")
        .insert({ ...values, coordinator_id: user.id })
        .select("id")
        .single();

  if (error) return redirectAfterForm(`${path}?error=save`);
  if (!data) return new Response("Camp not found", { status: 404 });
  return redirectAfterForm(`/dashboard/camps/${data.id}?saved=1`);
}
