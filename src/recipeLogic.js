export function roundTo(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

export function scaleIngredients(ingredients = [], currentServings = 1, targetServings = 1) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  const ratio = currentServings > 0 ? targetServings / currentServings : 1;

  return ingredients.map((ingredient) => {
    const quantity = Number(ingredient.quantity || 0);
    return {
      ...ingredient,
      quantity: roundTo(quantity * ratio),
    };
  });
}

export function findRecipes(recipes = [], query = '') {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  if (!normalizedQuery) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    const name = String(recipe.name || '').toLowerCase();
    const prepTime = String(recipe.prepTime || '').toLowerCase();
    const ingredientText = (recipe.ingredients || [])
      .map((ingredient) => `${ingredient.name || ''} ${ingredient.unit || ''}`.trim())
      .join(' ')
      .toLowerCase();

    return name.includes(normalizedQuery) || prepTime.includes(normalizedQuery) || ingredientText.includes(normalizedQuery);
  });
}

export function getIngredientsForDisplay(ingredients = []) {
  return ingredients.map((ingredient) => {
    const quantity = Number(ingredient.quantity || 0);
    const unit = ingredient.unit ? ingredient.unit.trim() : '';
    const name = ingredient.name ? ingredient.name.trim() : '';

    if (!unit) {
      return `${quantity} ${name}`.trim();
    }

    return `${quantity} ${unit} ${name}`.trim();
  });
}
