// English / Korean copy that JavaScript writes at runtime.
// All other page text lives directly in index.html (English) and ko/index.html (Korean).
export const T = {
  en: {
    words: ['games.', 'AI games.', 'AI services.', 'business tools.'],
    dieLabel: 'Roll the die to change the style', rollIntro: 'Roll the die',
    styles: ['Neural', 'Terminal', 'Horizon', 'Waves', 'Flow', 'Orbit'],
    styleLine: (n, name) => `Style ${n}: ${name}. Roll again`,
    copied: a => `Email address copied: ${a}`, copyFail: a => `Our email address: ${a}`
  },
  ko: {
    words: ['게임을', 'AI 게임을', 'AI 서비스를', '업무 도구를'],
    dieLabel: '주사위를 굴려 스타일 바꾸기', rollIntro: '주사위를 굴려 보세요',
    styles: ['뉴럴', '터미널', '호라이즌', '웨이브', '플로우', '오빗'],
    styleLine: (n, name) => `${n}번 스타일: ${name}. 다시 굴려 보세요`,
    copied: a => `메일 주소를 복사했어요: ${a}`, copyFail: a => `메일 주소: ${a}`
  }
};

export const state = { lang: 'en' };
const listeners = [];
export function onLangChange(fn) { listeners.push(fn); }

export function setLang(next) {
  state.lang = T[next] ? next : 'en';
  listeners.forEach(fn => fn(state.lang));
}

// Each language has its own page (/ and /ko/), so the page itself decides the language.
export function initI18n() {
  document.querySelectorAll('.lang a').forEach(a => a.addEventListener('click', () => { a.href = a.getAttribute('href').split('#')[0] + location.hash; }));
  setLang(document.documentElement.lang === 'ko' ? 'ko' : 'en');
}
