// Clicking a game title plays the full clip in an on-page player
export function initLightbox() {
  const box = document.getElementById('lightbox'), vid = document.getElementById('lbVideo');
  const title = document.getElementById('lbTitle'), fail = document.getElementById('lbFail'), drive = document.getElementById('lbDrive');
  const closeBtn = document.getElementById('lbClose');
  const SRC = ['/videos/survivors.mp4', '/videos/dungeon.mp4'];
  let lastFocus = null;
  function open(i, link) {
    lastFocus = link;
    title.textContent = (link.querySelector('.t') || link).textContent;
    drive.href = link.href; fail.hidden = true; vid.hidden = false;
    document.getElementById('cursorCard').classList.remove('show');
    box.hidden = false; requestAnimationFrame(() => box.classList.add('open'));
    document.documentElement.style.overflow = 'hidden';
    vid.src = SRC[i]; vid.currentTime = 0;
    vid.play().catch(() => {});
    closeBtn.focus();
  }
  function close() {
    box.classList.remove('open'); vid.pause();
    setTimeout(() => { box.hidden = true; vid.removeAttribute('src'); vid.load(); }, 250);
    document.documentElement.style.overflow = '';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  vid.addEventListener('error', () => { if (!box.hidden) { vid.hidden = true; fail.hidden = false; } });
  document.querySelectorAll('.reel-list a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); open(+a.dataset.video, a); }));
  document.querySelectorAll('[data-play-video]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); open(+a.dataset.playVideo, a); }));
  document.querySelectorAll('.inline-vid').forEach((v, i) => v.addEventListener('click', () => open(i, document.querySelectorAll('.reel-list a')[i])));
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box) close(); });
  addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = [closeBtn, vid, drive].filter(el => !el.hidden && !el.closest('[hidden]'));
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
}
