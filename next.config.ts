import type { NextConfig } from "next";

const config: NextConfig =
  process.env.CAMP_AI_STATIC_EXPORT === "1"
    ? {
        output: "export",
        basePath: process.env.CAMP_AI_BASE_PATH || "",
        trailingSlash: true,
      }
    : {};

export default config;
