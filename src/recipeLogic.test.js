import test from 'node:test';
import assert from 'node:assert/strict';

import { scaleIngredients, findRecipes, getIngredientsForDisplay } from './recipeLogic.js';

test('escala ingredientes proporcionalmente', () => {
  const ingredients = [
    { quantity: 2, unit: 'cup', name: 'farinha' },
    { quantity: 1, unit: 'unidade', name: 'ovo' },
  ];

  const scaled = scaleIngredients(ingredients, 2, 5);

  assert.equal(scaled[0].quantity, 5);
  assert.equal(scaled[1].quantity, 2.5);
});

test('busca receitas por nome, tempo e ingrediente', () => {
  const recipes = [
    { id: '1', name: 'Pão de Alho', prepTime: 20, ingredients: [{ name: 'alho' }] },
    { id: '2', name: 'Salada de Frutas', prepTime: 15, ingredients: [{ name: 'morango' }] },
  ];

  assert.equal(findRecipes(recipes, 'alho').length, 1);
  assert.equal(findRecipes(recipes, '15').length, 1);
  assert.equal(findRecipes(recipes, 'morango').length, 1);
});

test('formata ingredientes para exibição com quantidade e unidade separadas', () => {
  const ingredients = [{ quantity: 2, unit: 'xícara', name: 'farinha' }];
  const formatted = getIngredientsForDisplay(ingredients);

  assert.deepEqual(formatted, ['2 xícara farinha']);
});
