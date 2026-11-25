// Sizzle Rush Kitchen — keyboard and mouse input.
// One clear job: turn clicks and keys into world actions. No rules live here.

import { INGREDIENTS } from './config.js';
import { addIngredient, chopOnce, collectCooked, serveOrder, trashPlate, startShift } from './world.js';
import { layout } from './render.js';
import { playSound, unlockAudio } from './audio.js';

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function canvasPoint(canvas, event) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - r.left) / r.width) * canvas.width,
    y: ((event.clientY - r.top) / r.height) * canvas.height,
  };
}

export function attachInput(canvas, world) {
  const sfx = (name) => playSound(name, world.muted);

  canvas.addEventListener('pointerdown', (event) => {
    unlockAudio();
    const p = canvasPoint(canvas, event);
    const lay = layout(world);

    if (world.screen === 'title') {
      if (inside(lay.start, p.x, p.y)) { startShift(world); sfx('start'); }
      return;
    }
    if (world.screen === 'over') {
      if (inside(lay.restart, p.x, p.y)) { startShift(world); sfx('start'); }
      return;
    }
    if (inside(lay.pause, p.x, p.y)) { world.paused = !world.paused; return; }
    if (inside(lay.mute, p.x, p.y)) { world.muted = !world.muted; return; }
    if (world.paused) return;

    for (const bin of lay.bins) {
      if (inside(bin.rect, p.x, p.y)) { addIngredient(world, bin.id, sfx); return; }
    }
    if (inside(lay.board, p.x, p.y)) { chopOnce(world, sfx); return; }
    for (let i = 0; i < lay.grill.length; i++) {
      if (inside(lay.grill[i], p.x, p.y)) { collectCooked(world, 'grill', i, sfx); return; }
    }
    for (let i = 0; i < lay.fry.length; i++) {
      if (inside(lay.fry[i], p.x, p.y)) { collectCooked(world, 'fry', i, sfx); return; }
    }
    if (inside(lay.bell, p.x, p.y)) { serveOrder(world, sfx); return; }
    if (inside(lay.trash, p.x, p.y)) { trashPlate(world, sfx); return; }
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (world.screen === 'title' && (key === 'enter' || key === ' ')) {
      unlockAudio(); startShift(world); sfx('start'); return;
    }
    if (world.screen === 'over' && (key === 'r' || key === 'enter')) {
      unlockAudio(); startShift(world); sfx('start'); return;
    }
    if (world.screen !== 'playing') return;
    if (key === 'p') { world.paused = !world.paused; return; }
    if (key === 'm') { world.muted = !world.muted; return; }
    if (world.paused) return;
    if (key === ' ') { event.preventDefault(); serveOrder(world, sfx); return; }
    if (key === 't') { trashPlate(world, sfx); return; }
    if (key === 'r') { startShift(world); sfx('start'); return; }
    const ing = INGREDIENTS.find((i) => i.key === key);
    if (ing) { unlockAudio(); addIngredient(world, ing.id, sfx); }
  });
}
