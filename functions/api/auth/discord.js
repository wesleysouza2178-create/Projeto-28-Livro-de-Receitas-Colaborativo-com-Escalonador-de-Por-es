export async function onRequestGet({ env, request }) {
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = env.DISCORD_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/callback`;

  if (!clientId) {
    return Response.redirect(`${new URL(request.url).origin}/?auth=missing-discord-config`, 302);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify email',
  });

  return Response.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`, 302);
}
