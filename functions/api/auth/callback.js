export async function onRequestGet(context) {
  const url = new URL(context.request.url);

  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing ?code from GitHub callback", { status: 400 });
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response(
      "Failed to get access_token from GitHub:\n" + JSON.stringify(tokenData),
      { status: 500 }
    );
  }

  const token = tokenData.access_token;

  const redirectToAdmin = `${url.origin}/admin/#access_token=${token}&token_type=bearer`;

  return Response.redirect(redirectToAdmin, 302);
}