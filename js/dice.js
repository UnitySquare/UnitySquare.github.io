// The dice: each face switches the hero to a different style. Face 1 is the default.
import { CALM } from './env.js';
import { T, state, onLangChange } from './i18n.js';

const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

export function paint(die, f) {
  die.dataset.face = f;
  if (!die.children.length) for (let i = 0; i < 9; i++) die.appendChild(document.createElement('i'));
  [...die.children].forEach((p, i) => p.classList.toggle('on', PIPS[f].includes(i)));
}

export function initDice(setScene) {
  const heroEl = document.getElementById('hero');
  const big = document.getElementById('bigDie'), rollOut = document.getElementById('result');
  let face = 1, rolledOnce = false;
  paint(big, 1);

  function renderRoll() {
    const t = T[state.lang];
    big.setAttribute('aria-label', t.dieLabel);
    rollOut.textContent = rolledOnce ? t.styleLine(face, t.styles[face - 1]) : t.rollIntro;
  }
  function applyStyle(f) {
    if (CALM) { heroEl.dataset.v = f; setScene(f); return; }
    heroEl.classList.add('swap');
    setTimeout(() => { heroEl.dataset.v = f; setScene(f); heroEl.classList.remove('swap'); }, 350);
  }
  big.addEventListener('click', () => {
    let f;
    do { f = 1 + Math.floor(Math.random() * 6); } while (f === face);
    const done = () => { face = f; rolledOnce = true; paint(big, f); renderRoll(); applyStyle(f); };
    if (CALM) return done();
    big.classList.remove('rolling'); void big.offsetWidth; big.classList.add('rolling');
    let n = 0; const t = setInterval(() => { paint(big, 1 + Math.floor(Math.random() * 6)); if (++n > 6) { clearInterval(t); done(); } }, 95);
  });
  onLangChange(renderRoll);
}
