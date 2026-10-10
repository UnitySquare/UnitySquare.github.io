// Rotating word in the hero headline
import { CALM } from './env.js';
import { T, state, onLangChange } from './i18n.js';

export function initHeadline() {
  const rot = document.getElementById('rot');
  let wi = 0, rotTimer;
  function setWord(word, animate) {
    const old = rot.querySelector('span.in');
    const n = document.createElement('span'); n.textContent = word;
    if (animate && old && !CALM) { old.className = 'out'; setTimeout(() => old.remove(), 500); } else rot.textContent = '';
    n.className = 'in'; rot.appendChild(n);
  }
  function startRot() {
    const words = T[state.lang].words;
    clearInterval(rotTimer); wi = 0; setWord(words[0], false);
    if (CALM) return;
    rotTimer = setInterval(() => { wi = (wi + 1) % words.length; setWord(words[wi], true); }, 2600);
  }
  onLangChange(startRot);
}
