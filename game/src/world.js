// Sizzle Rush Kitchen — game state and rules.
// One clear job: what the kitchen is, and what happens when the player acts.
// Rendering lives in render.js, input in input.js, sound in audio.js.

import { INGREDIENTS, RECIPES, SHIFT_SECONDS, RUSH_AT, ingredientById } from './config.js';
import { mulberry32, pickRandom } from './random.js';

export const MAX_ORDERS = 3;
export const ORDER_PATIENCE = 45;

export function createWorld(seed) {
  const rng = mulberry32(seed || 20261125);
  return {
    rng,
    screen: 'title', // title | playing | over
    timeLeft: SHIFT_SECONDS,
    elapsed: 0,
    score: 0,
    coins: 0,
    served: 0,
    missed: 0,
    combo: 0,
    bestCombo: 0,
    orders: [],
    plate: [], // ingredient ids, in the order added
    board: null, // { ingredient, clicksLeft, total } chopping in progress
    grill: [null, null], // { ingredient, progress, total } each slot
    fry: [null, null],
    spawnIn: 1.2,
    message: '',
    messageUntil: 0,
    muted: false,
    paused: false,
    rush: false,
    flash: 0, // bell glow timer after a serve
  };
}

export function startShift(world) {
  const fresh = createWorld(20261125 + Math.floor(Math.random() * 100000));
  Object.assign(world, fresh);
  world.screen = 'playing';
  spawnOrder(world);
  spawnOrder(world);
}

function orderPatience(world) {
  return world.rush ? 32 : ORDER_PATIENCE;
}

export function spawnOrder(world) {
  if (world.orders.length >= MAX_ORDERS) return;
  const recipe = pickRandom(world.rng, RECIPES);
  world.orders.push({
    recipe,
    patience: orderPatience(world),
    maxPatience: orderPatience(world),
    id: world.elapsed + '-' + world.orders.length + '-' + Math.floor(world.rng() * 1e6),
  });
}

export function plateMatchesOrder(plate, recipe) {
  if (plate.length !== recipe.ingredients.length) return false;
  const sortedPlate = [...plate].sort();
  const sortedNeed = [...recipe.ingredients].sort();
  return sortedPlate.every((id, i) => id === sortedNeed[i]);
}

export function matchingOrder(world) {
  return world.orders.find((o) => plateMatchesOrder(world.plate, o.recipe));
}

export function addIngredient(world, id, sfx) {
  if (world.screen !== 'playing' || world.paused) return;
  const ing = ingredientById(id);
  if (!ing) return;
  if (ing.prep === 'chop') {
    if (world.board) { setMessage(world, 'Chopping board is busy!'); sfx && sfx('bad'); return; }
    world.board = { ingredient: id, clicksLeft: ing.prepTime, total: ing.prepTime };
    sfx && sfx('chop');
    return;
  }
  if (ing.prep === 'grill' || ing.prep === 'fry') {
    const slots = ing.prep === 'grill' ? world.grill : world.fry;
    const free = slots.findIndex((s) => s === null);
    if (free < 0) { setMessage(world, (ing.prep === 'grill' ? 'Grill' : 'Pan') + ' is full!'); sfx && sfx('bad'); return; }
    slots[free] = { ingredient: id, progress: 0, total: ing.prepTime };
    sfx && sfx('sizzle');
    return;
  }
  world.plate.push(id);
  sfx && sfx('place');
}

export function chopOnce(world, sfx) {
  if (!world.board) return;
  world.board.clicksLeft -= 1;
  sfx && sfx('chop');
  if (world.board.clicksLeft <= 0) {
    world.plate.push(world.board.ingredient);
    world.board = null;
    sfx && sfx('place');
  }
}

export function collectCooked(world, kind, slot, sfx) {
  const slots = kind === 'grill' ? world.grill : world.fry;
  const item = slots[slot];
  if (!item || item.progress < item.total) return;
  world.plate.push(item.ingredient);
  slots[slot] = null;
  sfx && sfx('place');
}

export function serveOrder(world, sfx) {
  if (world.screen !== 'playing' || world.paused) return;
  const order = matchingOrder(world);
  if (!order) {
    if (world.plate.length === 0) { setMessage(world, 'Plate is empty — build a dish first!'); }
    else { setMessage(world, 'No order matches this plate yet.'); }
    world.combo = 0;
    sfx && sfx('bad');
    return;
  }
  const tip = Math.round((order.patience / order.maxPatience) * 5);
  const mult = world.rush ? 2 : 1;
  const earned = (order.recipe.price + tip) * mult;
  world.coins += earned;
  world.score += earned * 10;
  world.served += 1;
  world.combo += 1;
  world.bestCombo = Math.max(world.bestCombo, world.combo);
  world.orders = world.orders.filter((o) => o !== order);
  world.plate = [];
  world.flash = 0.6;
  setMessage(world, 'Served ' + order.recipe.name + '! +' + earned + ' coins' + (world.rush ? ' (RUSH x2!)' : ''));
  sfx && sfx('serve');
}

export function trashPlate(world, sfx) {
  if (world.plate.length === 0) return;
  world.plate = [];
  world.combo = 0;
  setMessage(world, 'Plate cleared.');
  sfx && sfx('trash');
}

export function setMessage(world, text) {
  world.message = text;
  world.messageUntil = world.elapsed + 2.5;
}

export function updateWorld(world, dt, sfx) {
  if (world.screen !== 'playing' || world.paused) return;
  world.elapsed += dt;
  world.timeLeft = Math.max(0, SHIFT_SECONDS - world.elapsed);
  world.rush = world.timeLeft <= RUSH_AT;
  if (world.flash > 0) world.flash -= dt;
  for (const slot of [...world.grill, ...world.fry]) {
    if (slot) slot.progress = Math.min(slot.total, slot.progress + dt);
  }
  for (const order of world.orders) order.patience -= dt;
  const expired = world.orders.filter((o) => o.patience <= 0);
  if (expired.length > 0) {
    world.orders = world.orders.filter((o) => o.patience > 0);
    world.missed += expired.length;
    world.combo = 0;
    setMessage(world, 'An order walked out! (' + expired.length + ' missed)');
    sfx && sfx('miss');
  }
  world.spawnIn -= dt;
  if (world.spawnIn <= 0) {
    spawnOrder(world);
    world.spawnIn = world.rush ? 4 : 7;
  }
  if (world.timeLeft <= 0) {
    world.screen = 'over';
    sfx && sfx('end');
  }
}

export function ingredientName(id) {
  const ing = INGREDIENTS.find((i) => i.id === id);
  return ing ? ing.name : id;
}
