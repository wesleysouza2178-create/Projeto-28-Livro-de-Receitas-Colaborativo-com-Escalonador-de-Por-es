export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const origin = url.origin;

  if (!code) {
    return new Response('Código OAuth ausente.', { status: 400 });
  }

  const clientId = env.DISCORD_CLIENT_ID;
  const clientSecret = env.DISCORD_CLIENT_SECRET;
  const redirectUri = env.DISCORD_REDIRECT_URI || `${origin}/api/auth/callback`;

  if (!clientId || !clientSecret) {
    return Response.redirect(`${origin}/?auth=missing-env`, 302);
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      return new Response('Falha na troca de token do Discord.', { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return new Response('Falha ao buscar usuário do Discord.', { status: 400 });
    }

    const user = await userResponse.json();
    const payload = {
      id: user.id,
      username: user.username,
      avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png',
    };

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Login do Discord</title>
      </head>
      <body>
        <script>
          localStorage.setItem('discordUser', JSON.stringify(${JSON.stringify(payload)}));
          window.location.href = '/';
        </script>
      </body>
      </html>
    `;

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (error) {
    console.error('Erro no callback do OAuth do Discord', error);
    return new Response('Erro na autenticação do Discord.', { status: 500 });
  }
}
