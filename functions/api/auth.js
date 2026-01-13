export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);

  const clientId = context.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing env GITHUB_CLIENT_ID", { status: 500 });
  }

  const redirectUri = `${requestUrl.origin}/api/auth/callback`;

  const githubAuthUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("repo")}`;

  return Response.redirect(githubAuthUrl, 302);
}