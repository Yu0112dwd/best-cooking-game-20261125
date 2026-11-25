# Sizzle Rush Kitchen — make.fun bounty best-cooking-game-20261125-0137

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Yu0112dwd/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Yu0112dwd/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

**Bounty:** "Make the best cooking game" (`best-cooking-game-20261125-0137`) — $250 total
(1st $60, 2nd $40, 3rd $30, 4th $25, 5th $20, 6th–10th $15 each).
**Deadline:** 2026-11-25 22:37 JST. **Opened:** 2026-11-25 10:37 JST.
**Entrant:** GitHub [Yu0112dwd](https://github.com/Yu0112dwd),
make.fun [@golden-puffin-42-1121](https://make.fun/u/golden-puffin-42-1121).

## What it is

A complete, original 2D cooking game that plays offline in a desktop browser.
The lunch rush is on: read the order board, chop lettuce and tomato on the
board, grill patties, fry eggs, build each dish on the plate and ring the
serve bell before the ticket expires. 120-second shifts, tips for fast
service, combos for streaks, and a final 30-second RUSH that pays double.

- **Orders:** up to 3 tickets at once, each with a patience bar. Six dishes
  (Classic Burger, Cheese Burger, Garden Salad, Sunny Omelette, Double Stack,
  Breakfast Bun) combine 6 ingredients in different ways.
- **Prep with pressure:** chopping takes 3 clicks, grill and fry take 4
  seconds each with 2 slots — so you plan a route through the kitchen instead
  of clicking one station at a time.
- **Controls:** mouse click, or keys 1–6 for ingredients, Space to serve,
  T to trash the plate, P to pause, M to mute, R to restart.
- **Feel:** chopping, sizzling and serving answer at once (WebAudio bleeps,
  no audio files), the timer bar turns red in the rush, and the serve bell
  glows when a plate matches an order.

## Files

| File | What it is |
|---|---|
| `main.ts` | Node 22 program (stdlib only). Copies `game/` + `screenshots/` to `/output` and writes `dossier.json` via `vendor/makefun-game.ts` |
| `game/index.html` | The game page (canvas 1280×800, no network) |
| `game/src/config.js` | Ingredients, recipes, shift length |
| `game/src/world.js` | Game state and rules (orders, plate, prep, scoring) |
| `game/src/render.js` | Canvas drawing (kitchen, order board, plate, screens) |
| `game/src/input.js` | Mouse + keyboard input |
| `game/src/audio.js` | WebAudio sound effects, no files |
| `game/src/shots.js` | Deterministic `?shot=start|play|end` states for screenshots |
| `game/src/random.js` | Seeded random numbers |
| `game/src/main.js` | Game loop and boot |
| `screenshots/` | 3 real renders of the game's own code in a browser |
| `LICENSE` | MIT (OSI-approved, as the bounty requires) |

## How to run / verify

```sh
python3 -m http.server 8080 --directory game   # then open http://127.0.0.1:8080/
# screenshots: open index.html?shot=start / ?shot=play / ?shot=end
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

## Screenshots

The three screenshots are real renders of this game's own code, taken in a
desktop browser at 1280×800:

1. `1-start.jpg` — title screen over the kitchen, orders waiting.
2. `2-play.jpg` — mid-shift: order board, burger mid-assembly on the plate,
   patty on the grill, egg frying, timer running.
3. `3-end.jpg` — shift over: final scoreboard.
