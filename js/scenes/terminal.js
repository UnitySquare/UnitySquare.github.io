// Hero style 2: terminal rain: each stream has a bright head and a long white tail; slow by default, fast near the mouse
import { RED, WHITE, rnd } from './util.js';

export default {
  init(E) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; st.fs = 15; st.cols = Math.ceil(W / st.fs); st.rows = Math.ceil(H / st.fs) + 1;
    st.set = '0123456789ABCDEF<>{}[]/=+*#$';
    const pick = () => st.set[(Math.random() * st.set.length) | 0];
    st.grid = Array.from({ length: st.cols }, () => Array.from({ length: st.rows }, pick));
    const mk = (i, y) => ({ i, y, sp: rnd(.05, .16), len: (rnd(14, 34)) | 0, red: Math.random() < .18, seed: (Math.random() * 1000) | 0 });
    st.mk = mk; st.pick = pick;
    st.streams = Array.from({ length: st.cols }, (_, i) => mk(i, rnd(-30, st.rows)));
    st.extra = []; },
  click(E, x, y) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; const c0 = Math.round(x / st.fs);
    for (let i = c0 - 2; i <= c0 + 2; i++) if (i >= 0 && i < st.cols) { const y0 = y / st.fs - rnd(0, 1); st.extra.push({ i, y: y0, y0, sp: rnd(.3, .5), len: (rnd(8, 14)) | 0, hot: true }); } },
  draw(E, t) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; ctx.clearRect(0, 0, W, H); const fs = st.fs; ctx.font = `500 ${fs}px "JetBrains Mono", monospace`;
    for (let n = 0; n < 6; n++) { const c = (Math.random() * st.cols) | 0, r = (Math.random() * st.rows) | 0; st.grid[c][r] = st.pick(); }
    const drawStream = (s, near) => {
      const head = Math.floor(s.y), col = st.grid[s.i], x = s.i * fs;
      const tail = s.y0 === undefined ? s.len : Math.min(s.len, Math.floor(s.y - s.y0));
      for (let k = 0; k <= tail; k++) { const row = head - k; if (row < 0) break; if (row >= st.rows) continue;
        const y = (row + 1) * fs;
        if (k === 0) ctx.fillStyle = s.hot || s.red || near > .25 ? `rgba(255,95,110,1)` : `rgba(255,255,255,.95)`;
        else { const a = Math.pow(1 - k / s.len, 1.6) * (s.hot ? .9 : .5 + near * .3);
          const redGlyph = s.hot || s.red || near > .4 || ((row * 7 + s.i * 13 + s.seed) % 17 === 0);
          ctx.fillStyle = `rgba(${redGlyph ? RED : WHITE},${redGlyph ? Math.min(1, a * 1.25) : a})`; }
        ctx.fillText(col[row], x, y); }
    };
    for (const s of st.streams) {
      const near = Math.max(0, 1 - Math.abs(s.i * fs - mouse.x) / 140);
      drawStream(s, near);
      s.y += s.sp * (1 + near * 6);
      if (s.y - s.len > st.rows) Object.assign(s, st.mk(s.i, -rnd(0, 25)));
    }
    st.extra = st.extra.filter(s => s.y - s.len <= st.rows);
    for (const s of st.extra) { drawStream(s, 0); s.y += s.sp; } }
};
