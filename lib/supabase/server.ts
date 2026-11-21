import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig, sessionCookieOptions } from "./config";

export async function createSupabaseClient(writeCookies = false) {
  const config = getSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookieOptions: sessionCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (updates) => {
        // The proxy refreshes cookies for server-rendered pages.
        if (!writeCookies) return;
        for (const { name, value, options } of updates) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
