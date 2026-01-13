export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing ?code from GitHub", { status: 400 });
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("Missing env vars GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET", { status: 500 });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "decap-cms-cloudflare-pages"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response(
      `Failed to get access_token from GitHub.\n\n${JSON.stringify(tokenData, null, 2)}`,
      { status: 500 }
    );
  }

  const token = tokenData.access_token;

  // ✅ IMPORTANT:
  // Decap expects token returned in URL hash fragment
  // so it can read it from window.location.hash
  const redirectUrl =
    `${url.origin}/admin/#access_token=${encodeURIComponent(token)}&token_type=bearer`;

  return Response.redirect(redirectUrl, 302);
}