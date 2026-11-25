// Sizzle Rush Kitchen — deterministic screenshot shots.
// One clear job: put the game into a fixed, readable state for each screenshot.
// The game reads ?shot=start|play|end (&seed=) and freezes there; real play is
// untouched when no shot is given.

import { createWorld } from './world.js';
import { recipeByName } from './config.js';

function makeOrder(world, name, patience) {
  const recipe = recipeByName(name);
  world.orders.push({ recipe, patience, maxPatience: 45, id: 'shot-' + name });
}

export function applyShot(world, shot) {
  if (shot === 'start') {
    // Title screen over a kitchen that already has orders waiting.
    Object.assign(world, createWorld(7));
    world.screen = 'title';
    makeOrder(world, 'Classic Burger', 40);
    makeOrder(world, 'Garden Salad', 28);
    world.plate = ['bun', 'patty', 'lettuce'];
    world.timeLeft = 120;
    return true;
  }
  if (shot === 'play') {
    // Mid-shift: a full order board, a burger mid-assembly on the plate,
    // a patty on the grill half-cooked, an egg frying, timer running.
    Object.assign(world, createWorld(11));
    world.screen = 'playing';
    world.elapsed = 55;
    world.timeLeft = 65;
    world.score = 320;
    world.coins = 32;
    world.served = 4;
    world.combo = 3;
    world.bestCombo = 3;
    makeOrder(world, 'Classic Burger', 30);
    makeOrder(world, 'Cheese Burger', 18);
    makeOrder(world, 'Sunny Omelette', 8);
    world.plate = ['bun', 'patty', 'lettuce'];
    world.board = { ingredient: 'tomato', clicksLeft: 1, total: 3 };
    world.grill = [{ ingredient: 'patty', progress: 2, total: 4 }, null];
    world.fry = [{ ingredient: 'egg', progress: 3, total: 4 }, null];
    world.message = 'Served Garden Salad! +15 coins';
    world.messageUntil = 999;
    return true;
  }
  if (shot === 'end') {
    // Shift over: the final scoreboard.
    Object.assign(world, createWorld(13));
    world.screen = 'over';
    world.elapsed = 120;
    world.timeLeft = 0;
    world.score = 1240;
    world.coins = 124;
    world.served = 14;
    world.missed = 2;
    world.combo = 0;
    world.bestCombo = 5;
    world.orders = [];
    world.plate = [];
    return true;
  }
  return false;
}

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const seed = Number(params.get('seed') || '1');
  return { shot, seed };
}
