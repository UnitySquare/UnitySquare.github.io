// Hero style 1: neural network: click sends a shockwave and spawns new nodes
import { RED, WHITE, rnd } from './util.js';

export default {
  init(E) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; const n = Math.round(Math.min(110, Math.max(35, (W * H) / 13000))); st.base = n; st.rings = [];
    st.pts = Array.from({ length: n }, () => ({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-.18, .18), vy: rnd(-.18, .18), r: rnd(.6, 2.2), c: Math.random() < .5 ? '255,90,105' : WHITE })); },
  click(E, x, y) { const { ctx, W, H, mouse, st, t0, dieCenter } = E;
    for (const p of st.pts) { const dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy) || 1; if (d < 240) { const f = (1 - d / 240) * 4; p.vx += dx / d * f; p.vy += dy / d * f; } }
    for (let i = 0; i < 6; i++) { const a = rnd(0, 6.3), v = rnd(.6, 1.6); st.pts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(1.4, 2.6), c: '255,90,105' }); }
    if (st.pts.length > st.base + 36) st.pts.splice(0, st.pts.length - st.base - 36);
    st.rings.push({ x, y, r: 0, a: .8 }); },
  draw(E, t) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; ctx.clearRect(0, 0, W, H); const P = st.pts, L = 130;
    for (let i = 0; i < P.length; i++) { const p = P[i];
      const sp = Math.hypot(p.vx, p.vy); if (sp > .25) { p.vx *= .96; p.vy *= .96; }
      p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, dm = Math.hypot(dx, dy);
      if (dm < 170) { ctx.strokeStyle = `rgba(255,110,125,${(1 - dm / 170) * .5})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      for (let j = i + 1; j < P.length; j++) { const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < L) { ctx.strokeStyle = `rgba(${p.c},${(1 - d / L) * .2})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } }
      ctx.fillStyle = `rgba(${p.c},.9)`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
    st.rings = st.rings.filter(r => r.a > .02);
    for (const r of st.rings) { r.r += (260 - r.r) * .07; r.a *= .93; ctx.strokeStyle = `rgba(${RED},${r.a})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.stroke(); ctx.lineWidth = 1; } }
};
