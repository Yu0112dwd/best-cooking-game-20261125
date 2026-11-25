// Sizzle Rush Kitchen — canvas rendering.
// One clear job: draw the kitchen. No rules live here; world.js owns those.
// layout() also returns every clickable rectangle, so input.js can hit-test.

import { INGREDIENTS, SHIFT_SECONDS, RUSH_AT, ingredientById } from './config.js';
import { matchingOrder } from './world.js';

const W = 1280;
const H = 800;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, align, weight) {
  ctx.fillStyle = color || '#2b2118';
  ctx.font = (weight || '700') + ' ' + size + 'px system-ui, sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

export function drawIngredient(ctx, id, x, y, r, done) {
  const ing = ingredientById(id);
  const c = ing.color;
  const d = ing.dark;
  ctx.save();
  ctx.translate(x, y);
  if (id === 'bun') {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(0, -r * 0.15, r, Math.PI, 0); ctx.fill();
    ctx.fillStyle = d;
    rr(ctx, -r, r * 0.35, r * 2, r * 0.45, r * 0.2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(-r * 0.5, -r * 0.55, r * 0.18, r * 0.12);
    ctx.fillRect(r * 0.1, -r * 0.7, r * 0.18, r * 0.12);
  } else if (id === 'patty') {
    ctx.fillStyle = done ? '#5f3a22' : c;
    rr(ctx, -r, -r * 0.55, r * 2, r * 1.1, r * 0.4); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.4); ctx.lineTo(-r * 0.5, r * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -r * 0.4); ctx.lineTo(0, r * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.5, -r * 0.4); ctx.lineTo(r * 0.5, r * 0.4); ctx.stroke();
  } else if (id === 'lettuce') {
    ctx.fillStyle = c;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const rad = r * (0.85 + 0.25 * (i % 2));
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = d; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-r * 0.6, 0); ctx.lineTo(r * 0.6, 0); ctx.stroke();
  } else if (id === 'tomato') {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4d9a41';
    ctx.beginPath(); ctx.moveTo(0, -r * 0.9); ctx.lineTo(-r * 0.35, -r * 0.4); ctx.lineTo(r * 0.35, -r * 0.4); ctx.closePath(); ctx.fill();
  } else if (id === 'cheese') {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.moveTo(-r, r * 0.7); ctx.lineTo(0, -r * 0.8); ctx.lineTo(r, r * 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = d;
    ctx.beginPath(); ctx.arc(-r * 0.25, r * 0.2, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, r * 0.35, r * 0.11, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'egg') {
    ctx.fillStyle = '#fffdf5';
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.75, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = done ? '#e8a13a' : '#f7c948';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawProgressRing(ctx, x, y, r, frac, color) {
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke();
}

export function layout(world) {
  const bins = INGREDIENTS.map((ing, i) => ({
    id: ing.id,
    rect: { x: 30 + i * 205, y: 238, w: 185, h: 96 },
  }));
  return {
    bins,
    board: { x: 30, y: 380, w: 300, h: 190 },
    grill: [{ x: 370, y: 380, w: 140, h: 190 }, { x: 520, y: 380, w: 140, h: 190 }],
    fry: [{ x: 700, y: 380, w: 140, h: 190 }, { x: 850, y: 380, w: 140, h: 190 }],
    plate: { x: 1030, y: 380, w: 220, h: 190 },
    bell: { x: 1030, y: 600, w: 220, h: 84 },
    trash: { x: 30, y: 600, w: 150, h: 60 },
    start: { x: 490, y: 560, w: 300, h: 72 },
    restart: { x: 490, y: 600, w: 300, h: 72 },
    pause: { x: 1150, y: 14, w: 54, h: 44 },
    mute: { x: 1088, y: 14, w: 54, h: 44 },
  };
}

function drawOrderTicket(ctx, order, x, y, w, h) {
  const urgent = order.patience < 12;
  ctx.fillStyle = urgent ? '#fff0e0' : '#fffdf5';
  ctx.strokeStyle = urgent ? '#e4572e' : '#d9c7a7';
  ctx.lineWidth = 2;
  rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.stroke();
  text(ctx, order.recipe.name, x + 14, y + 22, 19, '#2b2118', 'left', '800');
  text(ctx, '$' + order.recipe.price, x + w - 14, y + 22, 19, '#b97e33', 'right', '800');
  order.recipe.ingredients.forEach((id, i) => {
    drawIngredient(ctx, id, x + 30 + i * 62, y + 62, 24, id === 'patty' || id === 'egg');
  });
  const frac = Math.max(0, order.patience / order.maxPatience);
  ctx.fillStyle = '#e8dcc8';
  rr(ctx, x + 14, y + h - 18, w - 28, 10, 5); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#7bc96f' : frac > 0.25 ? '#f7c948' : '#e4572e';
  rr(ctx, x + 14, y + h - 18, (w - 28) * frac, 10, 5); ctx.fill();
}

export function drawGame(ctx, world) {
  // Kitchen wall and floor.
  ctx.fillStyle = '#f7ead7';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#e8d3ae';
  ctx.fillRect(0, 0, W, 70);
  ctx.fillStyle = '#d9c7a7';
  ctx.fillRect(0, 70, W, 4);

  // Top bar: title, timer, score.
  text(ctx, 'SIZZLE RUSH KITCHEN', 24, 38, 26, '#5f3a22', 'left', '900');
  const timeFrac = world.timeLeft / SHIFT_SECONDS;
  ctx.fillStyle = '#fffdf5';
  rr(ctx, 400, 22, 420, 28, 14); ctx.fill();
  ctx.fillStyle = world.rush ? '#e4572e' : '#7bc96f';
  rr(ctx, 400, 22, 420 * timeFrac, 28, 14); ctx.fill();
  text(ctx, Math.ceil(world.timeLeft) + 's', 610, 37, 20, '#2b2118', 'center', '800');
  if (world.rush) text(ctx, 'RUSH! x2', 850, 37, 20, '#e4572e', 'left', '900');
  text(ctx, 'Coins ' + world.coins, 960, 30, 18, '#5f3a22', 'left', '800');
  text(ctx, 'Score ' + world.score, 960, 52, 18, '#5f3a22', 'left', '800');
  text(ctx, world.muted ? 'MUTE' : 'SOUND', 1115, 37, 13, '#5f3a22', 'center', '700');
  text(ctx, world.paused ? 'PLAY' : 'PAUSE', 1177, 37, 13, '#5f3a22', 'center', '700');
  if (world.combo >= 2) text(ctx, 'COMBO x' + world.combo, 400, 62, 16, '#e4572e', 'left', '900');

  // Order board.
  text(ctx, 'ORDER BOARD', 30, 100, 18, '#8a6d4b', 'left', '800');
  for (let i = 0; i < 3; i++) {
    const order = world.orders[i];
    const x = 30 + i * 415;
    if (order) drawOrderTicket(ctx, order, x, 112, 395, 108);
    else {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.strokeStyle = '#d9c7a7'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
      rr(ctx, x, 112, 395, 108, 12); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'Waiting for the next order…', x + 197, 166, 16, '#8a6d4b', 'center', '600');
    }
  }

  // Ingredient counter.
  text(ctx, 'INGREDIENTS — click a bin, or press 1–6', 30, 232, 16, '#8a6d4b', 'left', '800');
  const lay = layout(world);
  lay.bins.forEach((bin) => {
    const ing = ingredientById(bin.id);
    const r = bin.rect;
    ctx.fillStyle = '#fffdf5';
    ctx.strokeStyle = '#d9c7a7'; ctx.lineWidth = 2;
    rr(ctx, r.x, r.y, r.w, r.h, 12); ctx.fill(); ctx.stroke();
    drawIngredient(ctx, ing.id, r.x + 44, r.y + 48, 30, ing.prep === 'grill' || ing.prep === 'fry');
    text(ctx, ing.name, r.x + 84, r.y + 34, 17, '#2b2118', 'left', '800');
    const hint = ing.prep === 'none' ? 'ready' : ing.prep === 'chop' ? 'chop x' + ing.prepTime : ing.prep === 'grill' ? 'grill ' + ing.prepTime + 's' : 'fry ' + ing.prepTime + 's';
    text(ctx, hint, r.x + 84, r.y + 60, 14, '#8a6d4b', 'left', '600');
    text(ctx, '[' + ing.key + ']', r.x + r.w - 12, r.y + 20, 13, '#b97e33', 'right', '700');
  });

  // Prep row: chopping board, grill, fry pan, plate.
  text(ctx, 'PREP — chop, grill, fry, then build the plate', 30, 366, 16, '#8a6d4b', 'left', '800');
  // Chopping board.
  ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = '#d9c7a7'; ctx.lineWidth = 2;
  rr(ctx, lay.board.x, lay.board.y, lay.board.w, lay.board.h, 12); ctx.fill(); ctx.stroke();
  text(ctx, 'CHOPPING BOARD', lay.board.x + 16, lay.board.y + 24, 15, '#8a6d4b', 'left', '800');
  if (world.board) {
    drawIngredient(ctx, world.board.ingredient, lay.board.x + 150, lay.board.y + 95, 44, false);
    text(ctx, 'click ' + world.board.clicksLeft + ' more', lay.board.x + 150, lay.board.y + 158, 16, '#e4572e', 'center', '800');
  } else {
    text(ctx, 'empty — click lettuce or tomato', lay.board.x + 150, lay.board.y + 95, 15, '#b9a488', 'center', '600');
  }
  // Grill slots.
  lay.grill.forEach((slotRect, i) => {
    ctx.fillStyle = '#3a3a3a'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2;
    rr(ctx, slotRect.x, slotRect.y, slotRect.w, slotRect.h, 12); ctx.fill(); ctx.stroke();
    text(ctx, 'GRILL', slotRect.x + 70, slotRect.y + 24, 15, '#f7c948', 'center', '800');
    const item = world.grill[i];
    if (item) {
      drawIngredient(ctx, item.ingredient, slotRect.x + 70, slotRect.y + 90, 34, item.progress >= item.total);
      if (item.progress < item.total) drawProgressRing(ctx, slotRect.x + 70, slotRect.y + 90, 46, item.progress / item.total, '#f7c948');
      else text(ctx, 'READY — click!', slotRect.x + 70, slotRect.y + 158, 14, '#7bc96f', 'center', '800');
    } else {
      text(ctx, 'click a patty', slotRect.x + 70, slotRect.y + 95, 14, '#8a8a8a', 'center', '600');
    }
  });
  // Fry slots.
  lay.fry.forEach((slotRect, i) => {
    ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = '#d9c7a7'; ctx.lineWidth = 2;
    rr(ctx, slotRect.x, slotRect.y, slotRect.w, slotRect.h, 12); ctx.fill(); ctx.stroke();
    text(ctx, 'FRY PAN', slotRect.x + 70, slotRect.y + 24, 15, '#8a6d4b', 'center', '800');
    const item = world.fry[i];
    if (item) {
      drawIngredient(ctx, item.ingredient, slotRect.x + 70, slotRect.y + 90, 34, item.progress >= item.total);
      if (item.progress < item.total) drawProgressRing(ctx, slotRect.x + 70, slotRect.y + 90, 46, item.progress / item.total, '#e8a13a');
      else text(ctx, 'READY — click!', slotRect.x + 70, slotRect.y + 158, 14, '#7bc96f', 'center', '800');
    } else {
      text(ctx, 'click an egg', slotRect.x + 70, slotRect.y + 95, 14, '#b9a488', 'center', '600');
    }
  });
  // Plate.
  ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = world.plate.length ? '#7bc96f' : '#d9c7a7'; ctx.lineWidth = 3;
  rr(ctx, lay.plate.x, lay.plate.y, lay.plate.w, lay.plate.h, 12); ctx.fill(); ctx.stroke();
  text(ctx, 'PLATE', lay.plate.x + 110, lay.plate.y + 24, 15, '#8a6d4b', 'center', '800');
  ctx.fillStyle = '#e8dcc8';
  ctx.beginPath(); ctx.ellipse(lay.plate.x + 110, lay.plate.y + 105, 88, 52, 0, 0, Math.PI * 2); ctx.fill();
  world.plate.forEach((id, i) => {
    drawIngredient(ctx, id, lay.plate.x + 42 + i * 44, lay.plate.y + 105, 20, id === 'patty' || id === 'egg');
  });
  if (world.plate.length === 0) text(ctx, 'build a dish here', lay.plate.x + 110, lay.plate.y + 105, 14, '#b9a488', 'center', '600');

  // Serve bell + trash.
  const match = matchingOrder(world);
  ctx.fillStyle = match ? '#e4572e' : '#c9b898';
  rr(ctx, lay.bell.x, lay.bell.y, lay.bell.w, lay.bell.h, 14); ctx.fill();
  text(ctx, match ? 'SERVE!  (Space)' : 'SERVE BELL', lay.bell.x + 110, lay.bell.y + 30, 20, '#fffdf5', 'center', '900');
  text(ctx, match ? match.recipe.name + ' is ready' : 'match an order first', lay.bell.x + 110, lay.bell.y + 58, 14, '#fffdf5', 'center', '600');
  ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = '#d9c7a7'; ctx.lineWidth = 2;
  rr(ctx, lay.trash.x, lay.trash.y, lay.trash.w, lay.trash.h, 12); ctx.fill(); ctx.stroke();
  text(ctx, 'TRASH (T)', lay.trash.x + 75, lay.trash.y + 30, 16, '#8a6d4b', 'center', '800');

  // Message toast.
  if (world.message && world.elapsed < world.messageUntil) {
    text(ctx, world.message, 640, 716, 18, '#5f3a22', 'center', '800');
  }
  text(ctx, '1–6 ingredients · Space serve · T trash · P pause · M sound · R restart', 640, 752, 15, '#8a6d4b', 'center', '600');
  text(ctx, 'Sizzle Rush Kitchen — an original game, drawn in code. No network, no downloads.', 640, 778, 13, '#b9a488', 'center', '600');

  if (world.paused && world.screen === 'playing') {
    ctx.fillStyle = 'rgba(43,33,24,0.55)';
    ctx.fillRect(0, 0, W, H);
    text(ctx, 'PAUSED — press P to keep cooking', 640, 400, 34, '#fffdf5', 'center', '900');
  }
}

function drawTitleScreen(ctx, world) {
  ctx.fillStyle = 'rgba(43,33,24,0.55)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fffdf5';
  rr(ctx, 240, 120, 800, 560, 20); ctx.fill();
  ctx.strokeStyle = '#d9c7a7'; ctx.lineWidth = 3;
  rr(ctx, 240, 120, 800, 560, 20); ctx.stroke();
  text(ctx, 'SIZZLE RUSH', 640, 200, 64, '#e4572e', 'center', '900');
  text(ctx, 'KITCHEN', 640, 262, 44, '#5f3a22', 'center', '900');
  text(ctx, 'The lunch rush is on. Read the order board, chop, grill and fry,', 640, 330, 19, '#2b2118', 'center', '600');
  text(ctx, 'build each dish on the plate and ring the bell before the ticket expires.', 640, 358, 19, '#2b2118', 'center', '600');
  text(ctx, '120 seconds. Serve fast for tips. The last 30 seconds pay double.', 640, 398, 19, '#b97e33', 'center', '800');
  // Mini ingredient parade.
  ['bun', 'patty', 'lettuce', 'tomato', 'cheese', 'egg'].forEach((id, i) => {
    drawIngredient(ctx, id, 400 + i * 96, 460, 30, id === 'patty' || id === 'egg');
  });
  ctx.fillStyle = '#e4572e';
  rr(ctx, 490, 530, 300, 72, 16); ctx.fill();
  text(ctx, 'START COOKING', 640, 567, 24, '#fffdf5', 'center', '900');
  text(ctx, 'Click the bins or press 1–6 · Space serves · T trashes the plate', 640, 640, 15, '#8a6d4b', 'center', '600');
}

function drawEndScreen(ctx, world) {
  ctx.fillStyle = 'rgba(43,33,24,0.6)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fffdf5';
  rr(ctx, 240, 120, 800, 560, 20); ctx.fill();
  ctx.strokeStyle = '#d9c7a7'; ctx.lineWidth = 3;
  rr(ctx, 240, 120, 800, 560, 20); ctx.stroke();
  text(ctx, 'SHIFT OVER!', 640, 200, 56, '#e4572e', 'center', '900');
  text(ctx, 'The kitchen is closed. Here is how you did:', 640, 258, 19, '#2b2118', 'center', '600');
  text(ctx, 'Score  ' + world.score, 640, 330, 30, '#5f3a22', 'center', '900');
  text(ctx, 'Coins earned  ' + world.coins, 640, 380, 22, '#2b2118', 'center', '700');
  text(ctx, 'Dishes served  ' + world.served + '   ·   Orders missed  ' + world.missed, 640, 420, 22, '#2b2118', 'center', '700');
  text(ctx, 'Best combo  x' + world.bestCombo, 640, 460, 22, '#2b2118', 'center', '700');
  const verdict = world.served >= 12 ? 'Head chef material!' : world.served >= 7 ? 'A solid shift — the regulars are happy.' : 'The rush got away from you. One more shift?';
  text(ctx, verdict, 640, 510, 19, '#b97e33', 'center', '800');
  ctx.fillStyle = '#e4572e';
  rr(ctx, 490, 560, 300, 72, 16); ctx.fill();
  text(ctx, 'COOK AGAIN  (R)', 640, 597, 24, '#fffdf5', 'center', '900');
}

export function draw(ctx, world) {
  drawGame(ctx, world);
  if (world.screen === 'title') drawTitleScreen(ctx, world);
  else if (world.screen === 'over') drawEndScreen(ctx, world);
}
