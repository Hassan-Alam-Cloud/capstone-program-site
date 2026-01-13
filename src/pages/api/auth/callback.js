export async function GET({ request }) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response("OAuth failed: " + JSON.stringify(tokenData), {
      status: 401,
    });
  }

  // Redirect back to Decap CMS with token
  return Response.redirect(
    `${url.origin}/admin/#access_token=${tokenData.access_token}&token_type=bearer`,
    302
  );
}