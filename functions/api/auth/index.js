export async function onRequestGet(context) {
  const url = new URL(context.request.url);

  const clientId = context.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID in Cloudflare env vars", {
      status: 500,
    });
  }

  // Redirect back to this site callback
  const redirectUri = `${url.origin}/api/auth/callback`;

  const githubAuthUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("repo")}`;

  return Response.redirect(githubAuthUrl, 302);
}