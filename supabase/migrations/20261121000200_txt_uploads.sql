begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('camp-documents', 'camp-documents', false, 262144, array['text/plain']);

-- The documents table already filters rows to camps owned by the coordinator.
create policy coordinator_uploads_reserved_document
on storage.objects for insert to authenticated
with check (
  bucket_id = 'camp-documents'
  and exists (
    select 1 from public.documents as document
    where document.storage_path = name
      and document.processing_status = 'pending'
  )
);

create policy coordinator_reads_own_document_file
on storage.objects for select to authenticated
using (
  bucket_id = 'camp-documents'
  and exists (
    select 1 from public.documents as document where document.storage_path = name
  )
);

create policy coordinator_removes_failed_document_file
on storage.objects for delete to authenticated
using (
  bucket_id = 'camp-documents'
  and exists (
    select 1 from public.documents as document
    where document.storage_path = name
      and document.processing_status = 'failed'
  )
);

create function public.complete_txt_upload(
  target_camp uuid, target_document uuid, chunks text[]
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if coalesce(cardinality(chunks), 0) not between 1 and 512 then
    raise exception 'Invalid chunk count';
  end if;

  update public.documents
  set processing_status = 'ready'
  where id = target_document
    and camp_id = target_camp
    and processing_status = 'pending';

  if not found then
    raise exception 'Document not available';
  end if;

  insert into public.document_chunks (document_id, camp_id, chunk_index, content)
  select target_document, target_camp, (position - 1)::integer, content
  from unnest(chunks) with ordinality as entries (content, position);
end;
$$;

revoke all on function public.complete_txt_upload(uuid, uuid, text[]) from public, anon;
grant execute on function public.complete_txt_upload(uuid, uuid, text[]) to authenticated;

commit;
