import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

export default function config(phase: string): NextConfig {
  const serverConfig: NextConfig = {
    serverExternalPackages: ["pdfjs-dist"],
    outputFileTracingIncludes: {
      "/dashboard/camps/\\[id\\]/documents": [
        "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
        "./node_modules/pdfjs-dist/standard_fonts/**/*",
        "./node_modules/pdfjs-dist/cmaps/**/*",
        "./node_modules/@napi-rs/canvas*/**/*",
      ],
    },
  };
  const { CODESPACE_NAME, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN } =
    process.env;

  if (
    phase !== PHASE_DEVELOPMENT_SERVER ||
    !CODESPACE_NAME ||
    !GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ) {
    return serverConfig;
  }

  // Allow development assets from this Codespace's forwarded browser origin.
  const origin = `${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  return {
    ...serverConfig,
    allowedDevOrigins: [origin],
  };
}
