import { notFound } from "next/navigation";
import { requireCoordinator } from "../../../../lib/supabase/coordinator";
import { CampForm } from "../camp-form";
import { isCampId } from "../fields";
import { DocumentList } from "./document-list";

export const metadata = { title: "Edit camp | Camp AI" };
export const dynamic = "force-dynamic";

export default async function EditCampPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; upload?: string }>;
}) {
  const { supabase, user } = await requireCoordinator();
  const { id } = await params;
  if (!isCampId(id)) notFound();

  const { data: camp, error: loadError } = await supabase
    .from("camps")
    .select(
      "id, name, description, location, start_date, end_date, meeting_time, instructions",
    )
    .eq("id", id)
    .eq("coordinator_id", user.id)
    .maybeSingle();

  if (loadError) throw new Error("Could not load camp details.");
  if (!camp) notFound();

  const { data: documents } = await supabase
    .from("documents")
    .select("id, filename, processing_status")
    .eq("camp_id", id)
    .order("created_at", { ascending: false });

  const { error, saved, upload } = await searchParams;
  return (
    <CampForm camp={camp} error={error} saved={saved === "1"}>
      <DocumentList campId={camp.id} documents={documents} upload={upload} />
    </CampForm>
  );
}
