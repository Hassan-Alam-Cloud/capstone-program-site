export async function onRequest(context) {
  const { env, request } = context;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing OAuth code", { status: 400 });
  }

  // ✅ exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenJson = await tokenRes.json();

  if (!tokenJson.access_token) {
    return new Response(
      "Failed to get access token: " + JSON.stringify(tokenJson),
      { status: 500 }
    );
  }

  // ✅ Decap expects token in URL hash like: #token=XXXX&provider=github
  const token = tokenJson.access_token;

  const adminRedirect =
    `${url.origin}/admin/` +
    `#access_token=${encodeURIComponent(token)}&token_type=bearer&provider=github`;

  return Response.redirect(adminRedirect, 302);
}