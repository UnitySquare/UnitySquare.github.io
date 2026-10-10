// Highlights the menu item for the section on screen
export function initNav() {
  const navLinks = [...document.querySelectorAll('.links a')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
  function setActive(c) { navLinks.forEach((a, i) => i === c ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')); }
  let locked = null, unlockTimer;
  navLinks.forEach((a, i) => a.addEventListener('click', () => { locked = i; setActive(i); clearTimeout(unlockTimer); unlockTimer = setTimeout(() => { locked = null; }, 1000); }));
  function markActive() {
    if (locked !== null) { clearTimeout(unlockTimer); unlockTimer = setTimeout(() => { locked = null; }, 150); return; }
    const yy = scrollY + innerHeight * 0.35; let c = null;
    sections.forEach((s, i) => { if (s.offsetTop <= yy) c = i; });
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) c = sections.length - 1;
    setActive(c);
  }
  addEventListener('scroll', markActive, { passive: true }); addEventListener('resize', markActive); markActive();
}
