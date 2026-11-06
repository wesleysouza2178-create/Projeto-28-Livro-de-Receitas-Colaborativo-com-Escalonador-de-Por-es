export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');

  if (!userId) {
    return Response.json({ favorites: [] });
  }

  try {
    const db = env.DB;
    if (!db) {
      return Response.json({ favorites: [] });
    }

    const { results } = await db.prepare('SELECT recipe_id FROM favorites WHERE user_id = ?').bind(userId).all();
    return Response.json({ favorites: results.map((item) => item.recipe_id) });
  } catch (error) {
    console.error('Erro ao consultar favoritos', error);
    return Response.json({ favorites: [] });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const payload = await request.json();
    const { userId, recipeId } = payload || {};

    if (!userId || !recipeId) {
      return Response.json({ ok: false, message: 'Dados incompletos.' }, { status: 400 });
    }

    const db = env.DB;
    if (!db) {
      return Response.json({ ok: true, message: 'Modo local sem D1 habilitado.' });
    }

    await db.prepare('INSERT OR REPLACE INTO favorites (id, user_id, recipe_id) VALUES (?, ?, ?)')
      .bind(`${userId}:${recipeId}`, userId, recipeId)
      .run();

    return Response.json({ ok: true, recipeId, userId });
  } catch (error) {
    console.error('Erro ao salvar favorito', error);
    return Response.json({ ok: false, message: 'Falha ao salvar favorito.' }, { status: 500 });
  }
}
