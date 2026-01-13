export async function onRequestGet(context) {
  const url = new URL(context.request.url);

  const clientId = context.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing env var GITHUB_CLIENT_ID", { status: 500 });
  }

  const redirectUri = `${url.origin}/api/auth/callback`;

  const scope = "repo";
  const state = crypto.randomUUID();

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  return Response.redirect(githubAuthUrl, 302);
}