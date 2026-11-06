import { findRecipes, getIngredientsForDisplay, scaleIngredients } from '../src/recipeLogic.js';

const recipeList = document.getElementById('recipeList');
const searchInput = document.getElementById('searchInput');
const loginButton = document.getElementById('loginButton');
const userBadge = document.getElementById('userBadge');

const fallbackRecipes = [
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

function renderRecipes() {
  const query = searchInput.value.trim();
  const filtered = findRecipes(state.recipes, query);

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
  renderUserBadge();
  renderRecipes();
})();
