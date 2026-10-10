// Email links: copy the address and show a short notice, then let the mail app open as usual.
// Many visitors have no default mail app, so a mailto: click alone can look like it did nothing.
import { T, state } from './i18n.js';

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  const ta = document.createElement('textarea');           // fallback for older browsers / non-HTTPS
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch {}
  ta.remove(); return ok;
}

export function initMail() {
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  let timer;
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.addEventListener('click', async () => {
    const addr = a.getAttribute('href').slice(7).split('?')[0];
    const t = T[state.lang];
    toast.textContent = (await copy(addr)) ? t.copied(addr) : t.copyFail(addr);
    toast.classList.add('show');
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('show'), 3500);
  }));
}
