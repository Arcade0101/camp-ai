import { requireCoordinator } from "../../../../lib/supabase/coordinator";
import { CampForm } from "../camp-form";

export const metadata = { title: "Create camp | Camp AI" };
export const dynamic = "force-dynamic";

export default async function NewCampPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireCoordinator();
  const { error } = await searchParams;
  return <CampForm error={error} />;
}
