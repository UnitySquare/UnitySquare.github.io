// Hero style 5: flow field: click opens a whirlpool that pulls the lines in
import { RED, WHITE, BG, rnd } from './util.js';

export default {
  init(E) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; const n = Math.round(Math.min(900, (W * H) / 1600)); st.vort = [];
    st.ps = Array.from({ length: n }, () => ({ x: rnd(0, W), y: rnd(0, H), l: rnd(50, 250), c: Math.random() < .12, hot: 0 })); ctx.clearRect(0, 0, W, H); },
  click(E, x, y) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; st.vort.push({ x, y, t0: performance.now() - t0 }); if (st.vort.length > 3) st.vort.shift(); },
  draw(E, t) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; ctx.fillStyle = `rgba(${BG},.07)`; ctx.fillRect(0, 0, W, H); ctx.lineWidth = 1;
    st.vort = st.vort.filter(v => t - v.t0 < 2600);
    for (const p of st.ps) {
      let a = (Math.sin(p.x * .0035 + t * .00012) + Math.cos(p.y * .004 - t * .0001)) * Math.PI, spd = 1.4;
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y); if (dm < 160) a += Math.atan2(p.y - mouse.y, p.x - mouse.x) * (1 - dm / 160);
      for (const v of st.vort) { const dx = p.x - v.x, dy = p.y - v.y, d = Math.hypot(dx, dy), age = (t - v.t0) / 2600;
        if (d < 300) { const w = (1 - d / 300) * (1 - age); a = a * (1 - w) + (Math.atan2(dy, dx) + Math.PI * .62) * w; spd += w * 3; p.hot = Math.max(p.hot, w); } }
      const nx = p.x + Math.cos(a) * spd, ny = p.y + Math.sin(a) * spd;
      ctx.strokeStyle = p.c || p.hot > .3 ? `rgba(${RED},${.5 + p.hot * .5})` : `rgba(${WHITE},.22)`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
      p.x = nx; p.y = ny; p.hot *= .98;
      if (--p.l < 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) { p.x = rnd(0, W); p.y = rnd(0, H); p.l = rnd(50, 250); p.hot = 0; } } }
};
