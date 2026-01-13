export async function onRequestGet(context) {
  const url = new URL(context.request.url);

  const clientId = context.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  // GitHub must redirect here
  const redirectUri = `${url.origin}/api/auth/callback`;

  // IMPORTANT: use public_repo to avoid rate limits
  const scope = "public_repo";
  const state = crypto.randomUUID();

  const githubAuthUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  return Response.redirect(githubAuthUrl, 302);
}