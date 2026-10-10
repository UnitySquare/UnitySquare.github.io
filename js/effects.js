// Marquee loop, scroll reveal, header state, cursor glow, card spotlight and tilt
import { CALM, FINE } from './env.js';

export function initEffects() {
  /* Marquee: duplicate items for a seamless loop */
  const track = document.getElementById('track'); track.innerHTML += track.innerHTML;

  /* Scroll reveal */
  const revealIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => {
    revealIO.observe(el);
    el.addEventListener('transitionend', e => { if (e.target === el && e.propertyName === 'opacity') el.classList.add('settled'); });
  });

  /* Header state */
  const bar = document.getElementById('bar');
  let lastY = scrollY, navLock = 0;
  // menu clicks scroll the page down: keep the bar visible for that jump
  document.querySelectorAll('.links a, .brand').forEach(a => a.addEventListener('click', () => { navLock = Date.now() + 1200; bar.classList.remove('hide'); }));
  bar.addEventListener('focusin', () => bar.classList.remove('hide'));
  const onScroll = () => {
    const y = scrollY;
    bar.classList.toggle('scrolled', y > 10);
    if (Date.now() > navLock) {
      if (y < 80 || y < lastY - 6) bar.classList.remove('hide');       // scrolling up or near the top: slide down
      else if (y > lastY + 6) bar.classList.add('hide');              // scrolling down: slide up out of view
    }
    if (Math.abs(y - lastY) > 6) lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Cursor glow + card spotlight + tilt */
  if (FINE && !CALM) {
    const glow = document.getElementById('glow');
    let gx = -999, gy = -999, cx = -999, cy = -999, gRaf = null;
    const gTick = () => { cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12; glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      gRaf = (Math.abs(gx - cx) + Math.abs(gy - cy) > 0.5) ? requestAnimationFrame(gTick) : null; };
    addEventListener('pointermove', e => { gx = e.clientX; gy = e.clientY; if (cx < -900) { cx = gx; cy = gy; } if (!gRaf) gRaf = requestAnimationFrame(gTick); }, { passive: true });
  }
  if (FINE) {
    document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      if (!CALM && c.classList.contains('tilt') && c.classList.contains('settled')) {
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
      }
    }));
    document.querySelectorAll('.tilt').forEach(c => c.addEventListener('pointerleave', () => { c.style.transform = ''; }));
  }
}
