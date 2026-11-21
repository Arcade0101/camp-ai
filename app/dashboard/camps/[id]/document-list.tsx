type CampDocument = {
  id: string;
  filename: string;
  processing_status: "pending" | "ready" | "failed";
};

const statuses = {
  pending: "Processing",
  ready: "Ready",
  failed: "Failed",
};

export function DocumentList({
  campId,
  documents,
  upload,
}: {
  campId: string;
  documents: CampDocument[] | null;
  upload?: string;
}) {
  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="text-xl font-semibold">Camp documents</h2>
      {upload === "ready" && (
        <p role="status" className="mt-3 text-sm text-pine">
          Document uploaded and text extracted.
        </p>
      )}
      {upload === "invalid" && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          Choose a non-empty TXT file up to 256 KB or a PDF up to 2 MB.
        </p>
      )}
      {upload === "pdf-text" && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          Text couldn’t be extracted. Use an unlocked PDF with selectable text
          and up to 30 pages.
        </p>
      )}
      {upload === "failed" && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          Upload couldn’t finish. Please try again.
        </p>
      )}
      {documents === null ? (
        <p role="alert" className="mt-3 text-sm text-red-800">
          Documents couldn’t load. Refresh the page to try again.
        </p>
      ) : documents.length ? (
        <ul className="mt-3 divide-y divide-line">
          {documents.map((document) => (
            <li
              key={document.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
            >
              <span className="min-w-0 wrap-anywhere">{document.filename}</span>
              <span className="text-muted">
                {statuses[document.processing_status]}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">No documents yet.</p>
      )}
      <form
        className="mt-5 grid gap-3"
        method="post"
        encType="multipart/form-data"
        action={`/dashboard/camps/${campId}/documents`}
      >
        <label className="grid gap-1 text-sm font-medium">
          Document (TXT up to 256 KB, PDF up to 2 MB)
          <input
            type="file"
            name="document"
            accept=".txt,text/plain,.pdf,application/pdf"
            required
            className="w-full rounded-lg border border-line p-2"
          />
        </label>
        <button className="min-h-11 justify-self-start rounded-lg border border-line px-4 text-sm font-semibold hover:bg-mist">
          Upload document
        </button>
      </form>
    </section>
  );
}
