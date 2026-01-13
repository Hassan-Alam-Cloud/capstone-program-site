export async function GET({ request }) {
  const url = new URL(request.url);

  // 1) if GitHub already returned us a code, exchange it
  const code = url.searchParams.get("code");
  if (code) {
    const client_id = import.meta.env.GITHUB_CLIENT_ID;
    const client_secret = import.meta.env.GITHUB_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return new Response(
        "Missing env vars: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET",
        { status: 500 }
      );
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return new Response(
        "Failed to get access_token: " + JSON.stringify(tokenData),
        { status: 500 }
      );
    }

    // Send token back to Decap
    return new Response(
      `<script>
         window.opener && window.opener.postMessage(
           'authorization:github:success:${tokenData.access_token}',
           window.location.origin
         );
         window.close();
       </script>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // 2) otherwise start the GitHub login redirect
  const client_id = import.meta.env.GITHUB_CLIENT_ID;

  if (!client_id) {
    return new Response("Missing env var: GITHUB_CLIENT_ID", { status: 500 });
  }

  const redirect_uri = `${url.origin}/api/auth`;

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", client_id);
  githubAuthUrl.searchParams.set("redirect_uri", redirect_uri);
  githubAuthUrl.searchParams.set("scope", "repo");

  return Response.redirect(githubAuthUrl.toString(), 302);
}