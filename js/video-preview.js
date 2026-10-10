// Game clips: follow the cursor on desktop, play inline on touch screens
import { CALM, FINE } from './env.js';

export function initVideoPreview() {
  const card = document.getElementById('cursorCard');
  const vids = [...card.querySelectorAll('video')];
  const links = [...document.querySelectorAll('.reel-list a')];
  const broken = new Set();
  function load(v) {
    if (!v.src && v.dataset.src) {
      v.src = v.dataset.src;
      v.addEventListener('error', () => { broken.add(v.dataset.src); v.classList.add('broken'); if (v.closest('.cursor-card')) hide(); }, { once: true });
    }
  }
  if (!FINE) {
    const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { load(v); if (!CALM) v.play().catch(() => {}); } else v.pause(); }), { threshold: 0.4 });
    document.querySelectorAll('.inline-vid').forEach(v => io.observe(v));
    return;
  }
  let tx = -9999, ty = 0, x = -9999, y = 0, raf = null, current = -1;
  function place() {
    const w = card.offsetWidth, h = card.offsetHeight;
    let nx = tx + 32, ny = ty - h / 2;
    if (nx + w > innerWidth - 16) nx = tx - w - 32;
    ny = Math.max(16, Math.min(innerHeight - h - 16, ny));
    return [nx, ny];
  }
  function tick() {
    const [nx, ny] = place();
    x += (nx - x) * (CALM ? 1 : 0.16); y += (ny - y) * (CALM ? 1 : 0.16);
    card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = (Math.abs(nx - x) > 0.5 || Math.abs(ny - y) > 0.5) ? requestAnimationFrame(tick) : null;
  }
  function follow(px, py, jump) { tx = px; ty = py; if (jump) [x, y] = place(); if (!raf) raf = requestAnimationFrame(tick); }
  function show(i) {
    const v = vids[i];
    if (broken.has(v.dataset.src)) return;
    load(v);
    vids.forEach((o, j) => { o.classList.toggle('on', j === i); if (j !== i) o.pause(); });
    current = i; v.play().catch(() => {});
    card.classList.add('show');
    links.forEach(a => a.classList.toggle('active', +a.dataset.video === i));
  }
  function hide() { card.classList.remove('show'); vids.forEach(v => v.pause()); links.forEach(a => a.classList.remove('active')); current = -1; }
  links.forEach(a => {
    const i = +a.dataset.video;
    a.addEventListener('mouseenter', e => { follow(e.clientX, e.clientY, !card.classList.contains('show')); show(i); });
    a.addEventListener('mousemove', e => follow(e.clientX, e.clientY));
    a.addEventListener('mouseleave', hide);
    a.addEventListener('focus', () => { const r = a.getBoundingClientRect(); follow(r.left + Math.min(r.width, 560), r.top + r.height / 2, true); show(i); });
    a.addEventListener('blur', hide);
  });
  addEventListener('scroll', () => { if (current >= 0 && !document.querySelector('.reel-list a:hover')) hide(); }, { passive: true });
}
