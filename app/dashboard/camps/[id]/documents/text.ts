export const maxTextFileBytes = 256 * 1024;
export const maxPdfFileBytes = 2 * 1024 * 1024;
const maxFormBytes = maxPdfFileBytes + 8 * 1024;
const chunkLength = 1200;

export async function readUploadForm(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType?.startsWith("multipart/form-data;") || !request.body) {
    return null;
  }

  const reader = request.body.getReader();
  const parts: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxFormBytes) {
        await reader.cancel();
        return null;
      }
      parts.push(new Uint8Array(value));
    }

    return await new Response(new Blob(parts), {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export function decodeTxt(bytes: ArrayBuffer) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return "";
  }
}

export function splitDocumentText(text: string) {
  // Permit tab and line breaks while rejecting binary control characters.
  if (
    Array.from(text).some((character) => {
      const code = character.charCodeAt(0);
      return (
        (code < 32 &&
          character !== "\t" &&
          character !== "\r" &&
          character !== "\n") ||
        code === 127
      );
    })
  )
    return [];

  const characters = Array.from(text.replace(/\r\n?/g, "\n").trim());
  const chunks: string[] = [];
  let start = 0;

  while (start < characters.length) {
    let end = Math.min(start + chunkLength, characters.length);
    if (end < characters.length) {
      for (let index = end - 1; index >= end - 200; index -= 1) {
        if (/\s/u.test(characters[index])) {
          end = index + 1;
          break;
        }
      }
    }

    const chunk = characters.slice(start, end).join("").trim();
    if (chunk) chunks.push(chunk);
    start = end;
  }

  return chunks;
}
