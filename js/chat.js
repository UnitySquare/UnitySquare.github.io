// Floating n8n chat (bottom-right). Loaded as its own module so a CDN failure never breaks the rest of the page.
import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat@1.46.5/dist/chat.bundle.es.js';

const CHAT_URL = 'https://n8n.unitdice.com/webhook/de03c3be-08f9-4410-8feb-b155688a3580/chat';
const MAIL = 'contact@unitdice.com';

const TEXT = {
  ko: {
    welcome: ['안녕하세요! Unitdice입니다.', '서비스 소개나 협업 문의를 도와드릴게요.'],
    title: 'Unitdice 문의',
    subtitle: '궁금한 점을 남겨 주세요.',
    getStarted: '대화 시작',
    inputPlaceholder: '메시지를 입력하세요',
    closeButtonTooltip: '닫기',
    limited: '요청이 너무 많아 잠시 제한되었어요. 1분 뒤에 다시 시도해 주세요.',
    error: `지금은 답변이 어려워요. 잠시 후 다시 시도하시거나 ${MAIL}으로 문의해 주세요.`,
    offline: `연결이 원활하지 않아요. 잠시 후 다시 시도하시거나 ${MAIL}으로 문의해 주세요.`,
  },
  en: {
    welcome: ['Hi! This is Unitdice.', 'Ask us about our products or collaborations.'],
    title: 'Chat with Unitdice',
    subtitle: 'Leave us a question.',
    getStarted: 'Start chat',
    inputPlaceholder: 'Type a message',
    closeButtonTooltip: 'Close',
    limited: 'Too many requests. Please try again in a minute.',
    error: `We can't answer right now. Please try again later or email ${MAIL}.`,
    offline: `Connection problem. Please try again later or email ${MAIL}.`,
  },
};
const t = TEXT[document.documentElement.lang === 'ko' ? 'ko' : 'en'];

// Show a friendly bot message instead of a broken chat when the webhook is rate-limited (429) or fails.
const realFetch = window.fetch.bind(window);
const botSay = (text) => new Response(JSON.stringify({ output: text }), { status: 200, headers: { 'Content-Type': 'application/json' } });
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : (input && input.url) || String(input);
  const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
  if (!url.startsWith(CHAT_URL) || method !== 'POST') return realFetch(input, init);
  try {
    const res = await realFetch(input, init);
    if (res.status === 429) return botSay(t.limited);
    if (!res.ok) return botSay(t.error);
    return res;
  } catch {
    return botSay(t.offline);
  }
};

createChat({
  webhookUrl: CHAT_URL,
  mode: 'window',
  showWelcomeScreen: false,
  loadPreviousSession: false,
  initialMessages: t.welcome,
  defaultLanguage: 'en',
  i18n: {
    en: {
      title: t.title,
      subtitle: t.subtitle,
      footer: '',
      getStarted: t.getStarted,
      inputPlaceholder: t.inputPlaceholder,
      closeButtonTooltip: t.closeButtonTooltip,
    },
  },
});

// Close controls: an X in the header, tapping outside the window, and Esc.
// The library only opens/closes through its toggle button, so every close path clicks it.
const root = () => document.getElementById('n8n-chat');
const isOpen = () => {
  const win = root()?.querySelector('.chat-window');
  // While the close animation runs the window is still displayed; treat it as closed so a second tap doesn't reopen it.
  return !!win && getComputedStyle(win).display !== 'none' && !win.classList.contains('chat-window-transition-leave-active');
};
const close = () => { if (isOpen()) root()?.querySelector('.chat-window-toggle')?.click(); };

function addCloseButton() {
  const heading = root()?.querySelector('.chat-heading');
  if (!heading || heading.querySelector('.ud-chat-close')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ud-chat-close';
  btn.setAttribute('aria-label', t.closeButtonTooltip);
  btn.title = t.closeButtonTooltip;
  btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
  btn.addEventListener('click', close);
  heading.appendChild(btn);
}
// The header is rendered by the library (and may re-render), so keep the X in place.
new MutationObserver(addCloseButton).observe(document.body, { childList: true, subtree: true });
addCloseButton();

document.addEventListener('pointerdown', (e) => {
  if (!isOpen()) return;
  const r = root();
  const inside = r && (r.querySelector('.chat-window')?.contains(e.target) || r.querySelector('.chat-window-toggle')?.contains(e.target));
  if (!inside) close();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
