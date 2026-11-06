const defaultRecipes = [
  {
    id: 'r1',
    name: 'Risoto de Cogumelos',
    description: 'Creme suave com cogumelos, alho e parmesão para um almoço especial.',
    prepTime: 30,
    servings: 4,
    emoji: '🍄',
    ingredients: [
      { quantity: 2, unit: 'xícara', name: 'arroz arbóreo' },
      { quantity: 300, unit: 'g', name: 'cogumelos' },
      { quantity: 1, unit: 'litro', name: 'caldo de legumes' },
      { quantity: 1, unit: 'colher', name: 'manteiga' },
      { quantity: 2, unit: 'colher', name: 'parmesão' },
    ],
    steps: ['Refogue o alho e os cogumelos.', 'Adicione o arroz e mexa por 1 minuto.', 'Vá acrescentando o caldo aos poucos.', 'Finalize com manteiga e parmesão.'],
  },
  {
    id: 'r2',
    name: 'Salada Tropical',
    description: 'Fresca e cheia de cor para acompanhar pratos leves e rápidos.',
    prepTime: 15,
    servings: 2,
    emoji: '🥭',
    ingredients: [
      { quantity: 1, unit: 'unidade', name: 'manga' },
      { quantity: 200, unit: 'g', name: 'morango' },
      { quantity: 1, unit: 'xícara', name: 'rúcula' },
      { quantity: 2, unit: 'colher', name: 'azeite' },
      { quantity: 1, unit: 'colher', name: 'limão' },
    ],
    steps: ['Lave as folhas e os frutos.', 'Corte a manga e os morangos.', 'Misture tudo em uma tigela.', 'Tempere com azeite e limão.'],
  },
  {
    id: 'r3',
    name: 'Pão de Alho',
    description: 'Uma opção irresistível para servir com sopas, massas ou entradas.',
    prepTime: 20,
    servings: 4,
    emoji: '🍞',
    ingredients: [
      { quantity: 1, unit: 'unidade', name: 'pão francês' },
      { quantity: 3, unit: 'dente', name: 'alho' },
      { quantity: 2, unit: 'colher', name: 'manteiga' },
      { quantity: 1, unit: 'colher', name: 'salsinha' },
      { quantity: 1, unit: 'pitada', name: 'sal' },
    ],
    steps: ['Misture a manteiga com alho e salsinha.', 'Corte o pão e espalhe a mistura.', 'Asse em forno quente até dourar.'],
  },
];

export async function onRequestGet({ env }) {
  try {
    const db = env.DB;
    if (db) {
      const { results } = await db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all();
      if (Array.isArray(results) && results.length > 0) {
        return Response.json({ recipes: results.map((recipe) => ({
          ...recipe,
          ingredients: JSON.parse(recipe.ingredients || '[]'),
          steps: JSON.parse(recipe.steps || '[]'),
        })) });
      }
    }
  } catch (error) {
    console.error('Erro ao consultar receitas do D1', error);
  }

  return Response.json({ recipes: defaultRecipes });
}
