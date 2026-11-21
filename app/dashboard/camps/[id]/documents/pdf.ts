import { createRequire } from "node:module";
import { dirname, join, sep } from "node:path";

const maxPdfPages = 30;
const maxExtractedCharacters = 256 * 1024;

export async function extractPdfText(bytes: ArrayBuffer): Promise<string> {
  if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") return "";

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const resolve = createRequire(join(process.cwd(), "package.json")).resolve;
  const assets = dirname(resolve("pdfjs-dist/package.json"));
  // PDF.js may take ownership of its input. Storage still needs the original.
  const task = getDocument({
    data: new Uint8Array(bytes.slice(0)),
    standardFontDataUrl: join(assets, "standard_fonts") + sep,
    cMapUrl: join(assets, "cmaps") + sep,
    cMapPacked: true,
    stopAtErrors: true,
    disableFontFace: true,
    useSystemFonts: false,
    useWasm: false,
    enableXfa: false,
  });

  try {
    const document = await task.promise;
    if (document.numPages > maxPdfPages) return "";

    const text: string[] = [];
    let length = 0;
    for (let number = 1; number <= document.numPages; number += 1) {
      const page = await document.getPage(number);
      const reader = page.streamTextContent().getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          for (const item of value.items) {
            if (!("str" in item)) continue;

            const segment = item.str + (item.hasEOL ? "\n" : " ");
            length += segment.length;
            if (length > maxExtractedCharacters) return "";
            text.push(segment);
          }
        }
        text.push("\n");
      } finally {
        await reader.cancel();
        reader.releaseLock();
        page.cleanup();
      }
    }
    return text.join("");
  } catch {
    return "";
  } finally {
    await task.destroy();
  }
}
