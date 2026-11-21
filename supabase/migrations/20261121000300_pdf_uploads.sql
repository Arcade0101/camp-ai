begin;

update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['text/plain', 'application/pdf']
where id = 'camp-documents';

commit;
