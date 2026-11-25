// Sizzle Rush Kitchen — recipes and ingredients.
// One clear job: the data the kitchen runs on. No logic lives here.

export const SHIFT_SECONDS = 120;
export const RUSH_AT = 30; // last 30 seconds: double coins, faster orders

export const INGREDIENTS = [
  { id: 'bun',     name: 'Bun',     key: '1', color: '#e8a95c', dark: '#b97e33', prep: 'none',  label: 'BUN' },
  { id: 'patty',   name: 'Patty',   key: '2', color: '#8a5a3b', dark: '#5f3a22', prep: 'grill', prepTime: 4, label: 'PATTY' },
  { id: 'lettuce', name: 'Lettuce', key: '3', color: '#7bc96f', dark: '#4d9a41', prep: 'chop',  prepTime: 3, label: 'LETTUCE' },
  { id: 'tomato',  name: 'Tomato',  key: '4', color: '#e4572e', dark: '#b23a1a', prep: 'chop',  prepTime: 3, label: 'TOMATO' },
  { id: 'cheese',  name: 'Cheese',  key: '5', color: '#f7c948', dark: '#d9a41f', prep: 'none',  label: 'CHEESE' },
  { id: 'egg',     name: 'Egg',     key: '6', color: '#fff3c4', dark: '#e8c96a', prep: 'fry',   prepTime: 4, label: 'EGG' },
];

export const RECIPES = [
  { name: 'Classic Burger', price: 12, ingredients: ['bun', 'patty', 'lettuce', 'tomato'] },
  { name: 'Cheese Burger',  price: 14, ingredients: ['bun', 'patty', 'cheese', 'tomato'] },
  { name: 'Garden Salad',   price: 10, ingredients: ['lettuce', 'tomato', 'cheese'] },
  { name: 'Sunny Omelette', price: 11, ingredients: ['egg', 'cheese', 'tomato'] },
  { name: 'Double Stack',   price: 18, ingredients: ['bun', 'patty', 'patty', 'cheese'] },
  { name: 'Breakfast Bun',  price: 13, ingredients: ['bun', 'egg', 'cheese', 'lettuce'] },
];

export function ingredientById(id) {
  return INGREDIENTS.find((i) => i.id === id);
}

export function recipeByName(name) {
  return RECIPES.find((r) => r.name === name);
}
