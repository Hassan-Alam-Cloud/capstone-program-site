export async function onRequest(context) {
  const { env, request } = context;

  const url = new URL(request.url);

  const client_id = env.GITHUB_CLIENT_ID;
  const redirect_uri = `${url.origin}/api/auth/callback`;

  // ✅ this is where GitHub sends user back after login
  const scope = "repo";
  const state = crypto.randomUUID();

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?` +
    `client_id=${encodeURIComponent(client_id)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  // ✅ IMPORTANT: must redirect (NOT return plain text)
  return Response.redirect(githubAuthUrl, 302);
}