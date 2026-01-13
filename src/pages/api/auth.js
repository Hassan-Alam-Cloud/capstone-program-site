export async function GET({ request }) {
  const url = new URL(request.url);

  const clientId = import.meta.env.GITHUB_CLIENT_ID;

  const redirectUri = `${url.origin}/api/auth/callback`;

  const githubAuthUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("repo")}`;

  return Response.redirect(githubAuthUrl, 302);
}