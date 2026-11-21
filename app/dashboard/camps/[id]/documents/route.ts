import { randomUUID } from "node:crypto";
import {
  isSameOriginForm,
  redirectAfterForm,
} from "../../../../../lib/supabase/auth-form";
import { getCoordinatorAccess } from "../../../../../lib/supabase/coordinator";
import { isCampId } from "../../fields";
import { extractPdfText } from "./pdf";
import {
  decodeTxt,
  maxPdfFileBytes,
  maxTextFileBytes,
  readUploadForm,
  splitDocumentText,
} from "./text";

const formats = {
  txt: { mimeType: "text/plain", maxBytes: maxTextFileBytes },
  pdf: { mimeType: "application/pdf", maxBytes: maxPdfFileBytes },
} as const;

function getExtension(filename: string) {
  const extension = /\.(txt|pdf)$/i.exec(filename)?.[1].toLowerCase();
  return extension === "txt" || extension === "pdf" ? extension : null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginForm(request))
    return new Response("Forbidden", { status: 403 });

  const access = await getCoordinatorAccess();
  if (access.loginPath) return redirectAfterForm(access.loginPath);
  const { supabase, user } = access;

  const { id } = await params;
  if (!isCampId(id)) return new Response("Camp not found", { status: 404 });

  const { data: camp, error: campError } = await supabase
    .from("camps")
    .select("id")
    .eq("id", id)
    .eq("coordinator_id", user.id)
    .maybeSingle();

  const path = `/dashboard/camps/${id}`;
  if (campError) return redirectAfterForm(`${path}?upload=failed`);
  if (!camp) return new Response("Camp not found", { status: 404 });

  const form = await readUploadForm(request);
  const file = form?.get("document");
  if (!(file instanceof File) || file.name.length > 255 || file.size === 0) {
    return redirectAfterForm(`${path}?upload=invalid`);
  }

  const extension = getExtension(file.name);
  if (!extension || file.size > formats[extension].maxBytes) {
    return redirectAfterForm(`${path}?upload=invalid`);
  }

  const bytes = await file.arrayBuffer();
  const text =
    extension === "pdf" ? await extractPdfText(bytes) : decodeTxt(bytes);
  const chunks = splitDocumentText(text);
  if (chunks.length === 0) {
    return redirectAfterForm(
      `${path}?upload=${extension === "pdf" ? "pdf-text" : "invalid"}`,
    );
  }

  const documentId = randomUUID();
  const storagePath = `${camp.id}/${documentId}.${extension}`;
  const { error: reserveError } = await supabase.from("documents").insert({
    id: documentId,
    camp_id: camp.id,
    filename: file.name,
    storage_path: storagePath,
    processing_status: "pending",
  });
  if (reserveError) return redirectAfterForm(`${path}?upload=failed`);

  const bucket = supabase.storage.from("camp-documents");
  const { error: uploadError } = await bucket.upload(storagePath, bytes, {
    contentType: formats[extension].mimeType,
    upsert: false,
  });

  if (!uploadError) {
    const { error: finishError } = await supabase.rpc("complete_txt_upload", {
      target_camp: camp.id,
      target_document: documentId,
      chunks,
    });
    if (!finishError) return redirectAfterForm(`${path}?upload=ready`);
  }

  // Remove the object only if the record is still pending. A committed RPC
  // can succeed even if the application never receives its response.
  const { data: failed } = await supabase
    .from("documents")
    .update({ processing_status: "failed" })
    .eq("id", documentId)
    .eq("camp_id", camp.id)
    .eq("processing_status", "pending")
    .select("id")
    .maybeSingle();
  if (failed) await bucket.remove([storagePath]);

  return redirectAfterForm(`${path}?upload=failed`);
}
