// Canvas engine for the hero background. Each scene lives in js/scenes/ and has init / draw / click.
import { CALM } from './env.js';
import neural from './scenes/neural.js';
import terminal from './scenes/terminal.js';
import horizon from './scenes/horizon.js';
import waves from './scenes/waves.js';
import flow from './scenes/flow.js';
import orbit from './scenes/orbit.js';

const S = { 1: neural, 2: terminal, 3: horizon, 4: waves, 5: flow, 6: orbit };

export function initHeroCanvas() {
  const cv = document.getElementById('net'), ctx = cv.getContext('2d'), hero = cv.parentElement;
  let dpr = 1, running = false, raf, scene = 1;
  // E is what every scene receives: drawing context, size, mouse, its own state object and helpers
  const E = {
    ctx, W: 0, H: 0, mouse: { x: -9999, y: -9999 }, st: {}, t0: performance.now(),
    dieCenter() {
      const d = document.getElementById('bigDie').getBoundingClientRect(), r = cv.getBoundingClientRect();
      return d.width ? [d.left - r.left + d.width / 2, d.top - r.top + d.height / 2] : [E.W * 0.72, E.H * 0.45];
    }
  };
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2); E.W = hero.clientWidth; E.H = hero.clientHeight;
    cv.width = E.W * dpr; cv.height = E.H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    E.st = {}; S[scene].init(E); if (CALM) still();
  }
  function still() { // reduced motion: render one settled frame
    ctx.clearRect(0, 0, E.W, E.H); const steps = scene === 5 ? 160 : 1;
    for (let i = 0; i < steps; i++) S[scene].draw(E, 4000 + i * 16);
  }
  function loop(now) { S[scene].draw(E, now - E.t0); raf = requestAnimationFrame(loop); }
  function setRun(on) {
    if (CALM) return;
    if (on && !running) { running = true; raf = requestAnimationFrame(loop); }
    else if (!on && running) { running = false; cancelAnimationFrame(raf); }
  }
  function setScene(n) { scene = n; ctx.clearRect(0, 0, E.W, E.H); E.st = {}; S[scene].init(E); if (CALM) still(); }

  size(); addEventListener('resize', size);
  new ResizeObserver(() => { if (Math.abs(hero.clientWidth - E.W) > 1 || Math.abs(hero.clientHeight - E.H) > 1) size(); }).observe(hero);
  hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); E.mouse.x = e.clientX - r.left; E.mouse.y = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { E.mouse.x = E.mouse.y = -9999; });
  hero.addEventListener('pointerdown', e => {
    if (CALM || e.target.closest('a, button')) return;
    const r = cv.getBoundingClientRect(); S[scene].click && S[scene].click(E, e.clientX - r.left, e.clientY - r.top);
  });
  new IntersectionObserver(es => setRun(es[0].isIntersecting && !document.hidden)).observe(hero);
  document.addEventListener('visibilitychange', () => setRun(!document.hidden && hero.getBoundingClientRect().bottom > 0));
  return { setScene };
}
