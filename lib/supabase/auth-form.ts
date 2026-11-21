export function isSameOriginForm(request: Request) {
  // Browsers set this using the visible URL, even behind a forwarding proxy.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite !== null) return fetchSite === "same-origin";

  // Older browsers can submit directly when the server sees the public origin.
  return request.headers.get("origin") === new URL(request.url).origin;
}

export function redirectAfterForm(location: string) {
  return new Response(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "private, no-store" },
  });
}
