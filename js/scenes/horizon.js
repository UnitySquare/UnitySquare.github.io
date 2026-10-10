// Hero style 3: horizon: click the floor for a light pillar and rings, click the sky for a starburst
import { RED, WHITE, rnd } from './util.js';

export default {
  init(E) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; st.off = 0; st.rip = []; st.shoots = []; st.sparks = []; st.beams = []; },
  click(E, x, y) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; const hz = H * .6;
    if (y > hz) { // floor: ring, embers and a light pillar rising from the spot
      st.rip.push({ x, y, r: 0, a: 1 });
      st.beams.push({ x, top: Math.max(hz - 120, y - 300), bottom: y, a: 1 });
    } else { // sky: stardust burst and new stars
      for (let i = 0; i < 22; i++) { const a = rnd(0, 6.3), v = rnd(2, 7);
        st.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, red: Math.random() < .35, g: 0, star: Math.random() < .55 }); }
    } },
  draw(E, t) { const { ctx, W, H, mouse, st, t0, dieCenter } = E; ctx.clearRect(0, 0, W, H); const hz = H * .6, vx = W / 2 + (mouse.x > -999 ? (mouse.x - W / 2) * .15 : 0);
    ctx.strokeStyle = `rgba(${RED},.75)`; ctx.lineWidth = 1; ctx.shadowColor = 'rgba(240,56,75,.8)'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(0, hz); ctx.lineTo(W, hz); ctx.stroke(); ctx.shadowBlur = 0;
    st.off = (t * .00018) % 1;
    for (let i = 0; i < 18; i++) { const p = (i + st.off) / 18, y = hz + (H - hz) * p * p;
      let lift = 0; for (const r of st.rip) { const k = .18 + (r.y - hz) / (H - hz) * .2, band = Math.abs(Math.abs(y - r.y) - r.r * k); if (band < 14) lift = Math.max(lift, (1 - band / 14) * r.a); }
      ctx.strokeStyle = `rgba(${lift > .05 ? '255,150,160' : WHITE},${.05 + p * .24 + lift * .6})`; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let k = -20; k <= 20; k++) { const bx = W / 2 + k * (W / 12);
      ctx.strokeStyle = `rgba(${WHITE},.1)`; ctx.beginPath(); ctx.moveTo(vx, hz); ctx.lineTo(bx + (bx - vx) * 1.5, H * 1.4); ctx.stroke(); }
    st.beams = st.beams.filter(b => b.a > .02);
    for (const b of st.beams) { const bg = ctx.createLinearGradient(0, b.top, 0, b.bottom);
      bg.addColorStop(0, 'rgba(240,56,75,0)'); bg.addColorStop(.6, `rgba(240,56,75,${b.a * .45})`); bg.addColorStop(1, `rgba(255,150,160,${b.a * .9})`);
      const w = 2 + b.a * 5; ctx.fillStyle = bg; ctx.fillRect(b.x - w / 2, b.top, w, b.bottom - b.top);
      ctx.fillStyle = `rgba(255,255,255,${b.a})`; ctx.beginPath(); ctx.arc(b.x, b.bottom, 2 + b.a * 4, 0, 7); ctx.fill(); b.a *= .965; }
    ctx.save(); ctx.beginPath(); ctx.rect(0, hz, W, H - hz); ctx.clip();
    st.rip = st.rip.filter(r => r.a > .02);
    for (const r of st.rip) { r.r += 6; r.a *= .972; const k = .18 + (r.y - hz) / (H - hz) * .2;
      ctx.strokeStyle = `rgba(255,150,160,${r.a})`; ctx.lineWidth = 2.5; ctx.shadowColor = 'rgba(240,56,75,.9)'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * k, 0, 0, 7); ctx.stroke(); }
    ctx.restore(); ctx.lineWidth = 1;
    if (!st.stars) st.stars = Array.from({ length: 140 }, () => ({ x: rnd(0, W), y: rnd(0, hz - 20), r: rnd(.5, 1.8), ph: rnd(0, 6.3), sp: rnd(.001, .004), red: Math.random() < .15 }));
    for (const s of st.stars) {
      let tw = (Math.sin(t * s.sp + s.ph) + 1) / 2; if (s.born) { tw = Math.max(tw, s.born); s.born *= .985; if (s.born < .05) s.born = 0; }
      const a = .08 + Math.pow(tw, 3) * .92, r = s.r * (.6 + tw * .7);
      ctx.fillStyle = `rgba(${s.red ? RED : WHITE},${a})`; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 7); ctx.fill();
    }
    if (Math.random() < .005) st.shoots.push({ x: rnd(W * .3, W), y: rnd(0, hz * .4), vx: -9, vy: 3.6, life: 1 });
    st.shoots = st.shoots.filter(m => m.life > 0);
    for (const m of st.shoots) { ctx.strokeStyle = `rgba(${WHITE},${m.life * .85})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 8, m.y - m.vy * 8); ctx.stroke(); ctx.lineWidth = 1;
      m.x += m.vx; m.y += m.vy; m.life -= .02; }
    st.sparks = st.sparks.filter(p => p.life > 0);
    for (const p of st.sparks) {
      if (p.star) { // drifts out, slows down, then stays in the sky as a new star
        p.x += p.vx; p.y += p.vy; p.vx *= .955; p.vy *= .955;
        if (Math.hypot(p.vx, p.vy) < .08 && st.stars) {
          p.life = 0; st.stars.push({ x: p.x, y: Math.min(p.y, hz - 12), r: rnd(1, 1.8), ph: rnd(0, 6.3), sp: rnd(.002, .005), red: p.red, born: 1 });
          if (st.stars.length > 260) st.stars.splice(140, 1);
          continue; }
        ctx.fillStyle = `rgba(${p.red ? '255,110,125' : WHITE},.95)`; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill(); continue; }
      p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy = p.vy * .97 + p.g; p.life -= .016;
      ctx.fillStyle = `rgba(${p.red ? '255,110,125' : WHITE},${p.life})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1 + p.life * 1.6, 0, 7); ctx.fill(); } }
};
