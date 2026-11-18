const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const filterButtons = [...document.querySelectorAll('.filter-button')];
const projectCards = [...document.querySelectorAll('.project-card')];
const sectionHeadlines = {
  all: ['Des systèmes utiles.', 'Dans plusieurs dimensions.', 'Automatisation maîtrisée, électronique concrète et modélisation 3D appliquée.'],
  ia: ['Moins de tâches répétitives.', 'Plus de temps utile.', 'Des workflows n8n qui coordonnent les outils, qualifient les informations et facilitent le suivi.'],
  electronique: ['Du schéma.', 'Au circuit réel.', 'Des circuits conçus et simulés sous Proteus, puis montés et vérifiés.'],
  '3d': ['Des idées en 3D.', 'Des modèles concrets.', 'Des espaces et des modules détaillés sous Fusion 360.']
};
const headingFirst = document.querySelector('[data-heading-first]');
const headingSecond = document.querySelector('[data-heading-second]');
const sectionIntro = document.querySelector('[data-section-intro]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    const [first, second, intro] = sectionHeadlines[filter] || sectionHeadlines.all;
    if (headingFirst) headingFirst.textContent = first;
    if (headingSecond) headingSecond.textContent = second;
    if (sectionIntro) sectionIntro.textContent = intro;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const imageDialog = document.querySelector('.image-dialog');
const dialogImage = imageDialog?.querySelector('img');
const dialogCaption = imageDialog?.querySelector('p');

// Toutes les images des réalisations s’ouvrent dans la même visionneuse.
document.querySelectorAll('main img').forEach((img) => {
  if (img.closest('a')) return;
  const figure = img.closest('figure');
  const caption = figure?.querySelector('figcaption')?.textContent.trim() || img.alt || 'Image du projet';
  const link = document.createElement('a');
  link.className = 'image-expand';
  link.href = img.getAttribute('src');
  link.dataset.lightbox = '';
  link.dataset.caption = caption;
  link.setAttribute('aria-label', `Agrandir : ${caption}`);
  img.before(link);
  link.append(img);
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-lightbox]');
  if (!link || !imageDialog?.showModal || !dialogImage || !dialogCaption) return;
  event.preventDefault();
  const thumb = link.querySelector('img');
  dialogImage.src = link.href;
  dialogImage.alt = thumb?.alt || link.dataset.caption || '';
  dialogCaption.textContent = link.dataset.caption || '';
  imageDialog.showModal();
});

imageDialog?.addEventListener('click', (event) => {
  if (event.target === imageDialog) imageDialog.close();
});


// Apparition douce des contenus à l’écran, sans masquer le site si l’animation est désactivée.
const motionItems = document.querySelectorAll('.project-card, .manifesto-label, .manifesto p, .approach-heading, .principle, .provocation');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('motion-ready');
  motionItems.forEach((item, index) => {
    item.classList.add('motion-reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  motionItems.forEach((item) => revealObserver.observe(item));
}
