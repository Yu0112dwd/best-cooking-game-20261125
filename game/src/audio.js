// Sizzle Rush Kitchen — sound effects.
// One clear job: tiny WebAudio bleeps. No audio files, no network.

let ctx = null;

function audioContext() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, when) {
  const ac = audioContext();
  if (!ac) return;
  const t = ac.currentTime + (when || 0);
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol || 0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function playSound(name, muted) {
  if (muted) return;
  try {
    if (name === 'chop') { tone(180, 0.07, 'square', 0.08); }
    else if (name === 'sizzle') { tone(900, 0.12, 'sawtooth', 0.04); tone(1200, 0.1, 'sawtooth', 0.03, 0.05); }
    else if (name === 'place') { tone(520, 0.09, 'sine', 0.12); }
    else if (name === 'serve') { tone(660, 0.12, 'sine', 0.14); tone(880, 0.18, 'sine', 0.14, 0.1); tone(1320, 0.22, 'sine', 0.1, 0.2); }
    else if (name === 'bad') { tone(140, 0.2, 'square', 0.08); }
    else if (name === 'miss') { tone(220, 0.25, 'sawtooth', 0.08); tone(160, 0.3, 'sawtooth', 0.08, 0.15); }
    else if (name === 'trash') { tone(300, 0.08, 'square', 0.06); tone(200, 0.1, 'square', 0.06, 0.07); }
    else if (name === 'end') { tone(523, 0.15, 'sine', 0.12); tone(659, 0.15, 'sine', 0.12, 0.14); tone(784, 0.3, 'sine', 0.12, 0.28); }
    else if (name === 'start') { tone(440, 0.1, 'sine', 0.12); tone(660, 0.14, 'sine', 0.12, 0.09); }
  } catch (e) {
    // Sound is garnish: a game that cannot make noise still plays.
  }
}

export function unlockAudio() {
  audioContext();
}
