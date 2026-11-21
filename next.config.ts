import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

export default function config(phase: string): NextConfig {
  const { CODESPACE_NAME, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN } =
    process.env;

  if (
    phase !== PHASE_DEVELOPMENT_SERVER ||
    !CODESPACE_NAME ||
    !GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ) {
    return {};
  }

  // Allow development assets from this Codespace's forwarded browser origin.
  const origin = `${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  return {
    allowedDevOrigins: [origin],
  };
}
