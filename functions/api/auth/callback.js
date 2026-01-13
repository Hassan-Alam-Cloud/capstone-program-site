export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return new Response("Missing ?code from GitHub callback", { status: 400 });
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "the-capstone-program"
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
      "GitHub token exchange failed:\n" + JSON.stringify(tokenData, null, 2),
      { status: 400 }
    );
  }

  const token = tokenData.access_token;

  /**
   * ✅ IMPORTANT:
   * Decap expects the token to be returned in the URL fragment.
   * That means we redirect back to /admin/ with:
   * #access_token=...&token_type=bearer
   */
  const redirectToAdmin =
    `${requestUrl.origin}/admin/#access_token=${encodeURIComponent(token)}&token_type=bearer`;

  return Response.redirect(redirectToAdmin, 302);
}