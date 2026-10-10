// Entry point: wires every module together
import { initHeroCanvas } from './hero-canvas.js';
import { initHeadline } from './headline.js';
import { initDice } from './dice.js';
import { initI18n } from './i18n.js';
import { initEffects } from './effects.js';
import { initVideoPreview } from './video-preview.js';
import { initLightbox } from './lightbox.js';
import { initNav } from './nav.js';
import { initMail } from './mail.js';

const hero = initHeroCanvas();
initHeadline();               // listens for language changes
initDice(hero.setScene);      // listens for language changes
initI18n();                   // sets the language, which fills in headline and dice text
initEffects();
initVideoPreview();
initLightbox();
initNav();
initMail();
document.getElementById('year').textContent = new Date().getFullYear();
