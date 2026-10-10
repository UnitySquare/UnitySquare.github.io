// Hero style 4: dot waves: click drops a stone, a ring wave travels through the dots
import { RED, WHITE } from './util.js';

export default {
  init(E) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; st.drops = []; },
  click(E, x, y) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; st.drops.push({ x, y, t0: performance.now() - t0 }); if (st.drops.length > 5) st.drops.shift(); },
  draw(E, t) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; ctx.clearRect(0, 0, W, H); const g = 24;
    st.drops = st.drops.filter(d => t - d.t0 < 2600);
    for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) {
      const dm = Math.hypot(x - mouse.x, y - mouse.y);
      const zb = Math.sin(x * .012 + t * .0016) * Math.cos(y * .016 - t * .0012);
      let z = zb, zd = 0, heat = 0;
      if (dm < 220) z += Math.cos(dm * .05 - t * .006) * (1 - dm / 220) * 1.2;
      for (const d of st.drops) { const age = t - d.t0, R = age * .45, dd = Math.hypot(x - d.x, y - d.y), off = dd - R;
        if (Math.abs(off) < 70) { const c = Math.cos(off * .09) * (1 - Math.abs(off) / 70) * (1 - age / 2600) * 1.8; zd += c; heat = Math.max(heat, Math.max(0, c) * Math.max(0, 1 - age / 1700)); } }
      z += zd;
      const r = 0.6 + Math.max(0, z) * 1.9, a = Math.min(1, .12 + Math.max(0, z) * .55);
      const hm = Math.min(1, heat * 1.3);
      if (hm > .05) ctx.fillStyle = `rgba(${Math.round(225 + 15 * hm)},${Math.round(228 - 172 * hm)},${Math.round(242 - 167 * hm)},${Math.min(1, a + .1)})`;
      else ctx.fillStyle = zb > .8 && zd < .15 ? `rgba(${RED},${Math.min(1, a + .15)})` : `rgba(${WHITE},${a})`;
      ctx.beginPath(); ctx.arc(x, y + z * 5, r, 0, 7); ctx.fill(); } }
};
