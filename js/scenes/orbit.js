// Hero style 6: orbit sphere: click spins it hard and makes it pulse outward
import { RED, WHITE, rnd } from './util.js';

export default {
  init(E) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; const n = 700, ga = Math.PI * (3 - Math.sqrt(5));
    st.sp = Array.from({ length: n }, (_, i) => { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i; return [Math.cos(th) * r, y, Math.sin(th) * r]; });
    st.rx = 0; st.ry = 0; st.kick = 0; st.spin = 0; st.pulse = 0; st.pv = 0; st.jit = st.sp.map(() => rnd(.4, 2.6)); },
  click(E, x, y) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; st.kick += 0.05; st.pv += 0.1; },
  draw(E, t) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; ctx.clearRect(0, 0, W, H); const [cx, cy] = dieCenter();
    st.spin += st.kick; st.kick *= .94;
    st.pv += -st.pulse * .0035; st.pv *= .93; st.pulse += st.pv;
    const R = Math.min(W, H) * (W < 760 ? .42 : .36) * (1 + Math.max(0, st.pulse) * .55);
    const ty = t * .00025 + st.spin + (mouse.x > -999 ? (mouse.x / W - .5) * 1.2 : 0), tx = .35 + (mouse.y > -999 ? (mouse.y / H - .5) * .6 : 0);
    st.ry += (ty - st.ry) * .08; st.rx += (tx - st.rx) * .05;
    const cyR = Math.cos(st.ry), syR = Math.sin(st.ry), cxR = Math.cos(st.rx), sxR = Math.sin(st.rx);
    for (let k = 0; k < st.sp.length; k++) { const [x, y, z] = st.sp[k];
      const x1 = x * cyR - z * syR, z1 = x * syR + z * cyR, y1 = y * cxR - z1 * sxR, z2 = y * sxR + z1 * cxR;
      const sc = 1 + Math.max(0, st.pulse) * (st.jit[k] - 1) * 1.2;
      const s = 1 / (1.9 - z2), px = cx + x1 * R * s * 1.4 * sc, py = cy + y1 * R * s * 1.4 * sc;
      const front = z2 > 0; ctx.fillStyle = front ? `rgba(${z2 > .82 - Math.max(0, st.pulse) * .9 ? RED : WHITE},${.25 + z2 * .6})` : `rgba(${WHITE},.07)`;
      ctx.beginPath(); ctx.arc(px, py, front ? 1.2 + z2 : .8, 0, 7); ctx.fill(); }
    ctx.strokeStyle = `rgba(${RED},${Math.min(1, .35 + Math.abs(st.pulse) * .8)})`; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.25, R * .3, -.25 + st.spin * .2, 0, 7); ctx.stroke(); }
};
