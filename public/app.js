import { findRecipes, getIngredientsForDisplay, scaleIngredients } from '../src/recipeLogic.js';

const recipeList = document.getElementById('recipeList');
const searchInput = document.getElementById('searchInput');
const loginButton = document.getElementById('loginButton');
const userBadge = document.getElementById('userBadge');
const categoryFilters = document.getElementById('categoryFilters');
const timeFilters = document.getElementById('timeFilters');

const categories = ['Todos', 'Entradas', 'Prato principal', 'Sobremesas', 'Bebidas', 'Veganas', 'Massas'];
const timeRanges = ['Todos', 'Até 20 min', 'Até 30 min', 'Até 45 min'];

const recipeDefinitions = [
  { name: 'Risoto de Cogumelos', category: 'Prato principal', emoji: '🍄', description: 'Creme suave com cogumelos, alho e parmesão para um almoço especial.', prepTime: 30, servings: 4, ingredients: [{ quantity: 2, unit: 'xícara', name: 'arroz arbóreo' }, { quantity: 300, unit: 'g', name: 'cogumelos' }, { quantity: 1, unit: 'litro', name: 'caldo de legumes' }, { quantity: 1, unit: 'colher', name: 'manteiga' }, { quantity: 2, unit: 'colher', name: 'parmesão' }], steps: ['Refogue o alho e os cogumelos.', 'Adicione o arroz e mexa por 1 minuto.', 'Vá acrescentando o caldo aos poucos.', 'Finalize com manteiga e parmesão.'] },
  { name: 'Salada Tropical', category: 'Entradas', emoji: '🥭', description: 'Fresca e cheia de cor para acompanhar pratos leves e rápidos.', prepTime: 15, servings: 2, ingredients: [{ quantity: 1, unit: 'unidade', name: 'manga' }, { quantity: 200, unit: 'g', name: 'morango' }, { quantity: 1, unit: 'xícara', name: 'rúcula' }, { quantity: 2, unit: 'colher', name: 'azeite' }, { quantity: 1, unit: 'colher', name: 'limão' }], steps: ['Lave as folhas e os frutos.', 'Corte a manga e os morangos.', 'Misture tudo em uma tigela.', 'Tempere com azeite e limão.'] },
  { name: 'Pão de Alho', category: 'Entradas', emoji: '🍞', description: 'Uma opção irresistível para servir com sopas, massas ou entradas.', prepTime: 20, servings: 4, ingredients: [{ quantity: 1, unit: 'unidade', name: 'pão francês' }, { quantity: 3, unit: 'dente', name: 'alho' }, { quantity: 2, unit: 'colher', name: 'manteiga' }, { quantity: 1, unit: 'colher', name: 'salsinha' }, { quantity: 1, unit: 'pitada', name: 'sal' }], steps: ['Misture a manteiga com alho e salsinha.', 'Corte o pão e espalhe a mistura.', 'Asse em forno quente até dourar.'] },
  { name: 'Lasanha de Berinjela', category: 'Prato principal', emoji: '🍆', description: 'Uma receita reconfortante e bem encorpada para reuniões em família.', prepTime: 45, servings: 6, ingredients: [{ quantity: 3, unit: 'unidade', name: 'berinjelas' }, { quantity: 500, unit: 'g', name: 'molho de tomate' }, { quantity: 200, unit: 'g', name: 'queijo mussarela' }, { quantity: 1, unit: 'xícara', name: 'bechamel' }, { quantity: 1, unit: 'colher', name: 'oregano' }], steps: ['Fatie as berinjelas e grelhe.', 'Monte camadas com molho e queijo.', 'Finalize com bechamel e leve ao forno.'] },
  { name: 'Ceviche de Manga', category: 'Entradas', emoji: '🥥', description: 'Leve, cítrico e fresco com textura vibrante.', prepTime: 25, servings: 3, ingredients: [{ quantity: 2, unit: 'unidade', name: 'manga' }, { quantity: 1, unit: 'colher', name: 'limão' }, { quantity: 1, unit: 'colher', name: 'cebola' }, { quantity: 1, unit: 'pitada', name: 'pimenta' }, { quantity: 2, unit: 'colher', name: 'coentro' }], steps: ['Misture a manga com limão e cebola.', 'Tempere com pimenta e coentro.', 'Sirva gelado e fresco.'] },
  { name: 'Tacos de Frango', category: 'Prato principal', emoji: '🌮', description: 'Recheio suculento com sabor defumado e acompanhamento crocante.', prepTime: 35, servings: 4, ingredients: [{ quantity: 500, unit: 'g', name: 'frango desfiado' }, { quantity: 8, unit: 'unidade', name: 'tortilhas' }, { quantity: 1, unit: 'xícara', name: 'alface' }, { quantity: 1, unit: 'xícara', name: 'tomate' }, { quantity: 2, unit: 'colher', name: 'molho de iogurte' }], steps: ['Tempere o frango e cozinhe até dourar.', 'Aqueça as tortilhas.', 'Montagem com alface, tomate e molho.'] },
  { name: 'Moqueca de Peixe', category: 'Prato principal', emoji: '🐟', description: 'Um clássico saboroso, aromático e bem temperado.', prepTime: 40, servings: 4, ingredients: [{ quantity: 600, unit: 'g', name: 'peixe' }, { quantity: 1, unit: 'xícara', name: 'leite de coco' }, { quantity: 2, unit: 'unidade', name: 'tomate' }, { quantity: 1, unit: 'colher', name: 'pimenta' }, { quantity: 2, unit: 'colher', name: 'coentro' }], steps: ['Refogue os temperos em panela.', 'Adicione peixe e leite de coco.', 'Cozinhe até o molho engrossar.'] },
  { name: 'Chá Gelado de Hibisco', category: 'Bebidas', emoji: '🍹', description: 'Bebida refrescante com acidez equilibrada e aroma floral.', prepTime: 15, servings: 4, ingredients: [{ quantity: 4, unit: 'colher', name: 'hibisco' }, { quantity: 1, unit: 'litro', name: 'água' }, { quantity: 2, unit: 'colher', name: 'açúcar' }, { quantity: 1, unit: 'fatia', name: 'limão' }, { quantity: 1, unit: 'copo', name: 'gelo' }], steps: ['Ferva a água com hibisco.', 'Adicione açúcar e deixe descansar.', 'Sirva com gelo e limão.'] },
  { name: 'Smoothie Verde', category: 'Bebidas', emoji: '🥤', description: 'Bebida nutritiva e vigorosa para começar o dia.', prepTime: 10, servings: 2, ingredients: [{ quantity: 2, unit: 'xícara', name: 'espinafre' }, { quantity: 1, unit: 'unidade', name: 'banana' }, { quantity: 1, unit: 'xícara', name: 'iogurte' }, { quantity: 1, unit: 'colher', name: 'mel' }, { quantity: 1, unit: 'copo', name: 'água' }], steps: ['Bata todos os ingredientes.', 'Ajuste a consistência com água.', 'Sirva imediatamente.'] },
  { name: 'Bolo de Banana', category: 'Sobremesas', emoji: '🍌', description: 'Macio, aromático e perfeito para qualquer ocasião.', prepTime: 40, servings: 8, ingredients: [{ quantity: 3, unit: 'unidade', name: 'banana' }, { quantity: 2, unit: 'xícara', name: 'farinha' }, { quantity: 1, unit: 'xícara', name: 'açúcar' }, { quantity: 2, unit: 'unidade', name: 'ovo' }, { quantity: 1, unit: 'colher', name: 'fermento' }], steps: ['Amasse as bananas e misture com os ovos.', 'Adicione os secos e mexa até homogêneo.', 'Asse até dourar.'] },
  { name: 'Pudim de Leite', category: 'Sobremesas', emoji: '🍮', description: 'Clássico e cremoso com cobertura de caramelo.', prepTime: 60, servings: 8, ingredients: [{ quantity: 1, unit: 'lata', name: 'leite condensado' }, { quantity: 1, unit: 'lata', name: 'leite' }, { quantity: 3, unit: 'unidade', name: 'ovo' }, { quantity: 1, unit: 'xícara', name: 'açúcar' }, { quantity: 1, unit: 'pitada', name: 'sal' }], steps: ['Caramelize a forma.', 'Misture os ingredientes até ficar cremoso.', 'Asse em banho-maria.'] },
  { name: 'Spaghetti ao Alho e Óleo', category: 'Massas', emoji: '🍝', description: 'Sabor intenso e preparação muito prática.', prepTime: 25, servings: 3, ingredients: [{ quantity: 250, unit: 'g', name: 'espaguete' }, { quantity: 4, unit: 'dente', name: 'alho' }, { quantity: 3, unit: 'colher', name: 'azeite' }, { quantity: 1, unit: 'colher', name: 'salsinha' }, { quantity: 1, unit: 'pitada', name: 'pimenta' }], steps: ['Cozinhe o espaguete.', 'Refogue alho e azeite.', 'Misture com salsinha e pimenta.'] },
  { name: 'Quinoa Temperada', category: 'Veganas', emoji: '🌾', description: 'Grão versátil com sabores frescos e muito nutritivo.', prepTime: 25, servings: 4, ingredients: [{ quantity: 1, unit: 'xícara', name: 'quinoa' }, { quantity: 2, unit: 'xícara', name: 'água' }, { quantity: 1, unit: 'colher', name: 'limão' }, { quantity: 1, unit: 'colher', name: 'cebola' }, { quantity: 1, unit: 'colher', name: 'salsinha' }], steps: ['Cozinhe a quinoa em água fervente.', 'Misture limão e cebola.', 'Sirva com salsinha.'] },
  { name: 'Hambúrguer Vegano', category: 'Veganas', emoji: '🍔', description: 'Opção saborosa e cheia de proteína vegetal.', prepTime: 30, servings: 4, ingredients: [{ quantity: 400, unit: 'g', name: 'feijão preto' }, { quantity: 1, unit: 'xícara', name: 'aveia' }, { quantity: 1, unit: 'colher', name: 'cebola' }, { quantity: 1, unit: 'colher', name: 'alho' }, { quantity: 2, unit: 'colher', name: 'azeite' }], steps: ['Misture os ingredientes até formar massa.', 'Modele os hambúrgueres.', 'Grelhe até dourar.'] },
  { name: 'Burrito de Feijão', category: 'Prato principal', emoji: '🌯', description: 'Envoltinho recheado com sabor e praticidade.', prepTime: 20, servings: 4, ingredients: [{ quantity: 8, unit: 'unidade', name: 'tortilhas' }, { quantity: 2, unit: 'xícara', name: 'feijão' }, { quantity: 1, unit: 'xícara', name: 'arroz' }, { quantity: 1, unit: 'xícara', name: 'queijo' }, { quantity: 1, unit: 'colher', name: 'molho' }], steps: ['Aqueça o feijão e o arroz.', 'Recheie as tortilhas.', 'Enrole e sirva.'] },
  { name: 'Sopa de Abóbora', category: 'Entradas', emoji: '🎃', description: 'Acre e cremosa, perfeita para noites frias.', prepTime: 35, servings: 4, ingredients: [{ quantity: 500, unit: 'g', name: 'abóbora' }, { quantity: 1, unit: 'litro', name: 'caldo' }, { quantity: 1, unit: 'colher', name: 'cebola' }, { quantity: 1, unit: 'colher', name: 'manteiga' }, { quantity: 1, unit: 'pitada', name: 'sal' }], steps: ['Cozinhe a abóbora no caldo.', 'Refogue a cebola com manteiga.', 'Bata tudo até ficar cremosa.'] },
  { name: 'Frango ao Curry', category: 'Prato principal', emoji: '🍛', description: 'Receita aromática e rica em sabor.', prepTime: 30, servings: 4, ingredients: [{ quantity: 500, unit: 'g', name: 'frango' }, { quantity: 1, unit: 'xícara', name: 'leite de coco' }, { quantity: 2, unit: 'colher', name: 'curry' }, { quantity: 1, unit: 'unidade', name: 'cebola' }, { quantity: 1, unit: 'colher', name: 'azeite' }], steps: ['Refogue a cebola e o frango.', 'Adicione curry e leite de coco.', 'Cozinhe até engrossar.'] },
  { name: 'Costela Assada', category: 'Prato principal', emoji: '🥩', description: 'Crocante por fora e macia por dentro.', prepTime: 90, servings: 6, ingredients: [{ quantity: 1, unit: 'kg', name: 'costela' }, { quantity: 2, unit: 'colher', name: 'alho' }, { quantity: 1, unit: 'colher', name: 'páprica' }, { quantity: 1, unit: 'colher', name: 'sal' }, { quantity: 2, unit: 'colher', name: 'azeite' }], steps: ['Tempere a costela com alho e especiarias.', 'Asse até dourar e cozinhar por dentro.', 'Deixe descansar antes de servir.'] },
  { name: 'Nhoque de Batata', category: 'Massas', emoji: '🥔', description: 'Macio e acolhedor, ideal com molhos cremados.', prepTime: 45, servings: 4, ingredients: [{ quantity: 500, unit: 'g', name: 'batata' }, { quantity: 1, unit: 'xícara', name: 'farinha' }, { quantity: 1, unit: 'unidade', name: 'ovo' }, { quantity: 1, unit: 'colher', name: 'sal' }, { quantity: 2, unit: 'colher', name: 'manteiga' }], steps: ['Cozinhe e amasse as batatas.', 'Misture com farinha e ovo.', 'Cozinhe em água fervente.'] },
  { name: 'Mousse de Maracujá', category: 'Sobremesas', emoji: '🍍', description: 'Leve, cremosa e perfumada.', prepTime: 20, servings: 4, ingredients: [{ quantity: 1, unit: 'xícara', name: 'polpa de maracujá' }, { quantity: 1, unit: 'caixa', name: 'creme de leite' }, { quantity: 1, unit: 'colher', name: 'açúcar' }, { quantity: 1, unit: 'colher', name: 'gelatina' }, { quantity: 1, unit: 'colher', name: 'suco de limão' }], steps: ['Misture a polpa com o açúcar.', 'Incorpore o creme de leite e a gelatina.', 'Leve à geladeira até firmar.'] },
  { name: 'Pasta Primavera', category: 'Massas', emoji: '🥦', description: 'Refogada com legumes frescos e toque de alho.', prepTime: 22, servings: 3, ingredients: [{ quantity: 250, unit: 'g', name: 'massa' }, { quantity: 1, unit: 'xícara', name: 'legumes' }, { quantity: 2, unit: 'colher', name: 'azeite' }, { quantity: 2, unit: 'dente', name: 'alho' }, { quantity: 1, unit: 'colher', name: 'parmesão' }], steps: ['Cozinhe a massa.', 'Refogue o alho e os legumes.', 'Misture tudo e finalize com parmesão.'] },
  { name: 'Pão Integral com Azeitona', category: 'Entradas', emoji: '🥖', description: 'Receita prática para servir com café ou entradas.', prepTime: 25, servings: 4, ingredients: [{ quantity: 4, unit: 'fatia', name: 'pão integral' }, { quantity: 1, unit: 'colher', name: 'azeitona' }, { quantity: 1, unit: 'colher', name: 'orégano' }, { quantity: 2, unit: 'colher', name: 'azeite' }, { quantity: 1, unit: 'pitada', name: 'sal' }], steps: ['Misture azeite, azeitona e orégano.', 'Passe na fatia de pão.', 'Leve ao forno até dourar.'] },
  { name: 'Sanduíche de Frango', category: 'Prato principal', emoji: '🥪', description: 'Rápido, suculento e ideal para o dia a dia.', prepTime: 18, servings: 2, ingredients: [{ quantity: 4, unit: 'fatia', name: 'pão' }, { quantity: 200, unit: 'g', name: 'frango' }, { quantity: 1, unit: 'folha', name: 'alface' }, { quantity: 2, unit: 'fatia', name: 'tomate' }, { quantity: 2, unit: 'colher', name: 'maionese' }], steps: ['Aqueça o frango e o pão.', 'Monte o sanduíche com vegetais.', 'Servir em seguida.'] },
  { name: 'Batata Rústica', category: 'Entradas', emoji: '🥔', description: 'Crosta dourada e interior macio.', prepTime: 35, servings: 4, ingredients: [{ quantity: 500, unit: 'g', name: 'batata' }, { quantity: 2, unit: 'colher', name: 'azeite' }, { quantity: 1, unit: 'colher', name: 'alecrim' }, { quantity: 1, unit: 'pitada', name: 'sal' }, { quantity: 1, unit: 'pitada', name: 'pimenta' }], steps: ['Corte as batatas em pedaços.', 'Tempere com azeite e ervas.', 'Asse até dourar.'] },
  { name: 'Churrasco de Legumes', category: 'Prato principal', emoji: '🍢', description: 'Fácil de preparar e cheio de sabor.', prepTime: 30, servings: 4, ingredients: [{ quantity: 2, unit: 'unidade', name: 'pimentão' }, { quantity: 1, unit: 'unidade', name: 'abobrinha' }, { quantity: 1, unit: 'unidade', name: 'cebola' }, { quantity: 2, unit: 'colher', name: 'azeite' }, { quantity: 1, unit: 'pitada', name: 'sal' }], steps: ['Corte os legumes em pedaços.', 'Tempere com azeite e sal.', 'Grelhe até ficar macio e saboroso.'] },
  { name: 'Torta de Maçã', category: 'Sobremesas', emoji: '🍏', description: 'Crosta dourada e recheio aromático.', prepTime: 60, servings: 8, ingredients: [{ quantity: 3, unit: 'unidade', name: 'maçã' }, { quantity: 1, unit: 'xícara', name: 'açúcar' }, { quantity: 2, unit: 'xícara', name: 'farinha' }, { quantity: 2, unit: 'colher', name: 'manteiga' }, { quantity: 1, unit: 'colher', name: 'canela' }], steps: ['Misture a massa e a maçã.', 'Monte a torta em forma.', 'Asse até dourar.'] },
  { name: 'Café Gelado', category: 'Bebidas', emoji: '☕', description: 'Revigorante e perfeito para os dias quentes.', prepTime: 10, servings: 2, ingredients: [{ quantity: 2, unit: 'colher', name: 'café' }, { quantity: 1, unit: 'copo', name: 'gelo' }, { quantity: 1, unit: 'colher', name: 'açúcar' }, { quantity: 1, unit: 'copo', name: 'leite' }, { quantity: 1, unit: 'colher', name: 'creme' }], steps: ['Prepare o café forte.', 'Misture com gelo e leite.', 'Ajuste o açúcar e sirva.'] },
  { name: 'Creme de Milho', category: 'Entradas', emoji: '🌽', description: 'Acompanhamento cremoso e saboroso.', prepTime: 20, servings: 4, ingredients: [{ quantity: 2, unit: 'xícara', name: 'milho' }, { quantity: 1, unit: 'xícara', name: 'leite' }, { quantity: 1, unit: 'colher', name: 'manteiga' }, { quantity: 1, unit: 'colher', name: 'farinha' }, { quantity: 1, unit: 'pitada', name: 'sal' }], steps: ['Refogue a farinha com manteiga.', 'Adicione leite e milho.', 'Cozinhe até engrossar.'] },
  { name: 'Bowl de Grão de Bico', category: 'Veganas', emoji: '🫘', description: 'Refeição nutritiva com frescor e crocância.', prepTime: 25, servings: 3, ingredients: [{ quantity: 2, unit: 'xícara', name: 'grão de bico' }, { quantity: 1, unit: 'xícara', name: 'alface' }, { quantity: 1, unit: 'colher', name: 'limão' }, { quantity: 1, unit: 'colher', name: 'azeite' }, { quantity: 1, unit: 'colher', name: 'cebola' }], steps: ['Aqueça o grão de bico.', 'Monte o bowl com legumes.', 'Regue com limão e azeite.'] },
  { name: 'Macarronada da Vó', category: 'Massas', emoji: '🍅', description: 'Molho encorpado e sabor familiar da casa.', prepTime: 35, servings: 4, ingredients: [{ quantity: 300, unit: 'g', name: 'macarrão' }, { quantity: 2, unit: 'xícara', name: 'molho de tomate' }, { quantity: 2, unit: 'dente', name: 'alho' }, { quantity: 1, unit: 'colher', name: 'oregano' }, { quantity: 1, unit: 'colher', name: 'manteiga' }], steps: ['Cozinhe o macarrão.', 'Refogue alho e molho.', 'Misture tudo e sirva quente.'] },
];

const fallbackRecipes = recipeDefinitions.flatMap((recipe, index) => [
  { ...recipe, id: `r${index + 1}` },
  { ...recipe, id: `r${index + 1}-2`, name: `${recipe.name} Família`, description: `${recipe.description} Versão intensa e acolhedora para reunir a mesa.` },
  { ...recipe, id: `r${index + 1}-3`, name: `${recipe.name} Light`, description: `${recipe.description} Uma versão mais leve e refrescante.` },
  { ...recipe, id: `r${index + 1}-4`, name: `${recipe.name} Gourmet`, description: `${recipe.description} Toque refinado para ocasiões especiais.` },
]);

const state = {
  recipes: [...fallbackRecipes],
  favorites: new Set(loadFavorites()),
  currentUser: loadUser(),
};

searchInput.addEventListener('input', renderRecipes);
loginButton.addEventListener('click', handleDiscordLogin);

async function loadRecipesFromApi() {
  try {
    const response = await fetch('/api/recipes');
    if (!response.ok) {
      return fallbackRecipes;
    }
    const data = await response.json();
    return Array.isArray(data.recipes) ? data.recipes : fallbackRecipes;
  } catch (error) {
    return fallbackRecipes;
  }
}

function loadUser() {
  try {
    const stored = localStorage.getItem('discordUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function loadFavorites() {
  try {
    const stored = localStorage.getItem('favoriteRecipes');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem('favoriteRecipes', JSON.stringify([...state.favorites]));
}

function renderUserBadge() {
  if (!state.currentUser) {
    userBadge.classList.add('hidden');
    loginButton.textContent = 'Entrar com Discord';
    return;
  }

  userBadge.innerHTML = `
    <img src="${state.currentUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="Avatar do usuário" />
    <span>${state.currentUser.username}</span>
  `;
  userBadge.classList.remove('hidden');
  loginButton.textContent = 'Conectado';
}

function renderCategoryFilters() {
  categoryFilters.innerHTML = categories
    .map((category) => `
      <button class="filter-chip ${state.activeCategory === category ? 'active' : ''}" type="button" data-category="${category}">${category}</button>
    `)
    .join('');

  categoryFilters.querySelectorAll('.filter-chip').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.category;
      state.activeCategory = selected;
      renderCategoryFilters();
      renderTimeFilters();
      renderRecipes();
    });
  });
}

function renderTimeFilters() {
  timeFilters.innerHTML = timeRanges
    .map((range) => `
      <button class="filter-chip ${state.activeTimeRange === range ? 'active' : ''}" type="button" data-time-range="${range}">${range}</button>
    `)
    .join('');

  timeFilters.querySelectorAll('.filter-chip').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.timeRange;
      state.activeTimeRange = selected;
      renderTimeFilters();
      renderRecipes();
    });
  });
}

function renderRecipes() {
  const query = searchInput.value.trim();
  const filtered = findRecipes(state.recipes, query).filter((recipe) => {
    if (state.activeCategory && state.activeCategory !== 'Todos' && recipe.category !== state.activeCategory) {
      return false;
    }

    if (state.activeTimeRange && state.activeTimeRange !== 'Todos') {
      const maxMinutes = Number(state.activeTimeRange.replace(/[^\d]/g, '')) || Number.MAX_SAFE_INTEGER;
      if (recipe.prepTime > maxMinutes) {
        return false;
      }
    }

    return true;
  });

  recipeList.innerHTML = filtered
    .map((recipe) => {
      const servings = Number(recipe.servings || 4);
      const scaledIngredients = scaleIngredients(recipe.ingredients, servings, servings);
      const isFavorite = state.favorites.has(recipe.id);
      const ingredientsMarkup = getIngredientsForDisplay(scaledIngredients)
        .map((item) => `<li>${item}</li>`)
        .join('');

      const stepsMarkup = (recipe.steps || [])
        .map((step) => `<li>${step}</li>`)
        .join('');

      return `
        <article class="recipe-card" data-id="${recipe.id}">
          <div class="recipe-visual">${recipe.emoji || '🍽️'}</div>
          <div class="recipe-body">
            <div class="recipe-header">
              <h3>${recipe.name}</h3>
              <button class="favorite-button ${isFavorite ? 'active' : ''}" data-action="favorite" data-id="${recipe.id}" aria-label="Favoritar receita">
                ${isFavorite ? '♥' : '♡'}
              </button>
            </div>

            <div class="meta">
              <span>⏱️ ${recipe.prepTime} min</span>
              <span>👥 ${servings} porções</span>
            </div>

            <p class="recipe-description">${recipe.description}</p>

            <ul class="ingredients">${ingredientsMarkup}</ul>

            <div class="portion-controls">
              <div class="portion-header">
                <strong>Porções</strong>
                <span>${servings} pessoas</span>
              </div>
              <input
                type="range"
                class="portion-input"
                min="1"
                max="12"
                step="1"
                value="${servings}"
                data-action="scale"
                data-id="${recipe.id}"
              />
            </div>

            <h3>Modo de preparo</h3>
            <ol class="steps">${stepsMarkup}</ol>
          </div>
        </article>
      `;
    })
    .join('');

  recipeList.querySelectorAll('[data-action="favorite"]').forEach((button) => {
    button.addEventListener('click', () => toggleFavorite(button.dataset.id));
  });

  recipeList.querySelectorAll('[data-action="scale"]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const recipeId = event.target.dataset.id;
      const recipe = state.recipes.find((item) => item.id === recipeId);
      if (!recipe) {
        return;
      }

      const nextServings = Number(event.target.value);
      const card = event.target.closest('.recipe-card');
      const ingredientList = card.querySelector('.ingredients');
      const servingLabel = card.querySelector('.portion-header span');
      const scaled = scaleIngredients(recipe.ingredients, recipe.servings, nextServings);
      ingredientList.innerHTML = getIngredientsForDisplay(scaled).map((item) => `<li>${item}</li>`).join('');
      servingLabel.textContent = `${nextServings} pessoas`;
      recipe.servings = nextServings;
    });
  });
}

function toggleFavorite(recipeId) {
  if (!state.currentUser) {
    alert('Faça login com Discord para salvar receitas no seu livro pessoal.');
    return;
  }

  if (state.favorites.has(recipeId)) {
    state.favorites.delete(recipeId);
  } else {
    state.favorites.add(recipeId);
  }

  saveFavorites();
  renderRecipes();

  fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId, userId: state.currentUser.id }),
  }).catch(() => {});
}

function handleDiscordLogin() {
  if (state.currentUser) {
    state.currentUser = null;
    localStorage.removeItem('discordUser');
    renderUserBadge();
    return;
  }

  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocal) {
    const demoUser = { id: 'demo-user', username: 'Chef Demo', avatar: 'https://cdn.discordapp.com/embed/avatars/0.png' };
    localStorage.setItem('discordUser', JSON.stringify(demoUser));
    state.currentUser = demoUser;
    renderUserBadge();
    renderRecipes();
    return;
  }

  window.location.href = '/api/auth/discord';
}

(async () => {
  state.recipes = await loadRecipesFromApi();
  state.activeCategory = 'Todos';
  state.activeTimeRange = 'Todos';
  renderCategoryFilters();
  renderTimeFilters();
  renderUserBadge();
  renderRecipes();
})();
