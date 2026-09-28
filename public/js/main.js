import { store } from './store.js';
import { SITE } from './config.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const ICONS = {
  instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.8 7l-4.2 1 1.1-4A8 8 0 1 1 20 12Z"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8Z"/></svg>',
};

// ---------- Analytics ----------
function track(type, id) {
  store.track(type, id);
}
function trackVisitOnce() {
  try {
    if (sessionStorage.getItem('visited')) return;
    sessionStorage.setItem('visited', '1');
  } catch { /* sem storage: conta mesmo assim */ }
  track('visit');
}

// Parte fixa vem de config.js; cardápio e avaliações vêm do store (dados da demo no navegador).
let site = {
  settings: SITE,
  gallery: SITE.gallery,
  menu: [],
  reviews: [],
  rating: { average: 0, count: 0 },
};

function loadData() {
  const approved = store.approvedReviews().map((r) => ({ ...r, createdAt: r.created_at }));
  const avg = approved.length ? approved.reduce((a, r) => a + r.rating, 0) / approved.length : 0;
  site.menu = store.menu();
  site.reviews = approved.slice(0, 12);
  site.rating = { average: Number(avg.toFixed(1)), count: approved.length };
}

async function init() {
  const { settings } = site;
  $$('[data-setting]').forEach((el) => { el.textContent = settings[el.dataset.setting] ?? el.textContent; });
  $('#year').textContent = new Date().getFullYear();

  renderSocial();
  initHero(settings.hero);
  initGallery();
  initReviewForm();
  initLocation();
  initContactForm();
  initNav();
  initSearch();
  initReveal();
  $$('[data-cta]').forEach((el) => el.addEventListener('click', () => track('cta', el.dataset.cta)));

  loadData();
  initMenu();
  renderReviews();
  trackVisitOnce();
}

// ---------- Redes sociais ----------
function renderSocial() {
  const html = Object.entries(site.settings.social)
    .map(([k, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${k}" data-cta="social-${k}">${ICONS[k] || ''}</a></li>`)
    .join('');
  $('#socialHero').innerHTML = html;
  $('#socialContact').innerHTML = html;
  const wa = $('#waFloat');
  wa.href = `https://wa.me/${site.settings.whatsapp}`;
  // botão flutuante só aparece depois do hero (não cobre os números dos slides)
  new IntersectionObserver(([en]) => wa.classList.toggle('is-hidden', en.isIntersecting), { threshold: .35 }).observe($('.hero'));
}

// ---------- Hero slider ----------
function initHero(slides) {
  const imgs = $('#heroImages');
  const dots = $('#heroDots');
  imgs.innerHTML = slides.map((s, i) => `<img src="${esc(s.image)}" alt="" ${i ? 'loading="lazy"' : ''}>`).join('');
  dots.innerHTML = slides.map((_, i) => `<li><button aria-label="Slide ${i + 1}"></button></li>`).join('');

  let current = -1;
  let timer;
  const content = $('#heroContent');

  function go(i) {
    if (i === current) return;
    current = (i + slides.length) % slides.length;
    const s = slides[current];
    $$('img', imgs).forEach((img, k) => img.classList.toggle('is-active', k === current));
    $$('button', dots).forEach((b, k) => b.classList.toggle('is-active', k === current));
    content.classList.add('is-changing');
    setTimeout(() => {
      $('#heroKicker').textContent = s.kicker;
      $('#heroTitle').innerHTML = esc(s.title).replace(/\n/g, '<br>');
      $('#heroText').textContent = s.text;
      content.classList.remove('is-changing');
      content.style.animation = 'none';
      void content.offsetWidth; // reinicia a animação
      content.style.animation = '';
    }, current === 0 && !timer ? 0 : 350);
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 7000);
  }
  $$('button', dots).forEach((b, i) => b.addEventListener('click', () => go(i)));
  go(0);
}

// ---------- Cardápio ----------
function initMenu() {
  const cats = ['Todos', ...new Set(site.menu.map((d) => d.category))];
  const filters = $('#menuFilters');
  filters.innerHTML = cats.map((c, i) => `<button role="tab" class="${i ? '' : 'is-active'}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('button', filters).forEach((b) => b.classList.toggle('is-active', b === btn));
    renderDishes(btn.dataset.cat);
  });
  renderDishes('Todos');

  $('#menuGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.dish');
    if (card) openDish(card.dataset.id);
  });
}

function renderDishes(cat) {
  const list = site.menu.filter((d) => cat === 'Todos' || d.category === cat);
  $('#menuGrid').innerHTML = list.map((d, i) => `
    <button class="dish" data-id="${esc(d.id)}" style="animation-delay:${i * 45}ms">
      ${d.featured ? '<span class="dish__badge">Destaque</span>' : ''}
      <div class="dish__img"><img src="${esc(d.image)}" alt="${esc(d.name)}" loading="lazy"></div>
      <div class="dish__body">
        <div class="dish__top"><h3 class="dish__name">${esc(d.name)}</h3><span class="dish__price">${brl(d.price)}</span></div>
        <p class="dish__desc">${esc(d.description)}</p>
      </div>
    </button>`).join('');
}

function openDish(id) {
  const d = site.menu.find((x) => x.id === id);
  if (!d) return;
  track('dish', id);
  const m = $('#dishModal');
  $('.modal__img', m).src = d.image.replace('w=900', 'w=1200');
  $('.modal__img', m).alt = d.name;
  $('.modal__cat', m).textContent = d.category;
  $('.modal__title', m).textContent = d.name;
  $('.modal__desc', m).textContent = d.description;
  $('.modal__tags', m).innerHTML = d.tags.map((t) => `<span>${esc(t)}</span>`).join('');
  $('.modal__price', m).textContent = brl(d.price);
  const msg = encodeURIComponent(`Olá! Gostaria de pedir: ${d.name}`);
  const order = $('.modal__order', m);
  order.href = `https://wa.me/${site.settings.whatsapp}?text=${msg}`;
  order.onclick = () => track('cta', 'pedido-whatsapp');
  m.showModal();
}

// ---------- Galeria + lightbox ----------
function initGallery() {
  const g = $('#gallery');
  g.innerHTML = site.gallery.map((p, i) => `
    <button class="gallery__item ${esc(p.size)}" data-i="${i}">
      <img src="${esc(p.image.replace('w=1400', 'w=800'))}" alt="${esc(p.caption)}" loading="lazy">
      <span>${esc(p.caption)}</span>
    </button>`).join('');

  const lb = $('#lightbox');
  let idx = 0;
  const show = (i) => {
    idx = (i + site.gallery.length) % site.gallery.length;
    const p = site.gallery[idx];
    $('img', lb).src = p.image;
    $('img', lb).alt = p.caption;
    $('figcaption', lb).textContent = `${p.caption} · ${idx + 1}/${site.gallery.length}`;
    track('gallery', p.id);
  };
  g.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (!item) return;
    show(Number(item.dataset.i));
    lb.showModal();
  });
  $('.lightbox__nav--prev', lb).addEventListener('click', () => show(idx - 1));
  $('.lightbox__nav--next', lb).addEventListener('click', () => show(idx + 1));
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  // swipe no celular
  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// Fecha qualquer dialog no botão "×" ou clicando fora
$$('dialog').forEach((d) => {
  d.addEventListener('click', (e) => {
    if (e.target === d || e.target.closest('[data-close]')) d.close();
  });
});

// ---------- Avaliações ----------
const starsHtml = (n) => [1, 2, 3, 4, 5].map((i) => `<span class="${i <= Math.round(n) ? '' : 'off'}">${ICONS.star}</span>`).join('');

function renderReviews() {
  const { rating, reviews } = site;
  $('#ratingAvg').textContent = rating.count ? rating.average.toFixed(1).replace('.', ',') : '–';
  $('#ratingStars').innerHTML = starsHtml(rating.average);
  $('#ratingCount').textContent = `${rating.count} avaliaç${rating.count === 1 ? 'ão' : 'ões'}`;
  $('#reviewsList').innerHTML = reviews.map((r) => `
    <article class="card review">
      <div class="stars">${starsHtml(r.rating)}</div>
      <p>“${esc(r.text)}”</p>
      <footer>
        <span class="avatar">${esc(r.name.charAt(0).toUpperCase())}</span>
        <span><strong>${esc(r.name)}</strong><time>${new Date(r.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</time></span>
      </footer>
    </article>`).join('') || '<p class="section__lead">Seja o primeiro a avaliar!</p>';
}

function initReviewForm() {
  const wrap = $('#starInput');
  wrap.innerHTML = [1, 2, 3, 4, 5].map((i) => `<button type="button" role="radio" aria-checked="false" aria-label="${i} estrela${i > 1 ? 's' : ''}" data-v="${i}">${ICONS.star}</button>`).join('');
  const paint = (v) => $$('button', wrap).forEach((b) => b.classList.toggle('on', Number(b.dataset.v) <= v));
  wrap.addEventListener('mouseover', (e) => { const b = e.target.closest('button'); if (b) paint(Number(b.dataset.v)); });
  wrap.addEventListener('mouseleave', () => paint(Number($('#ratingValue').value || 0)));
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $('#ratingValue').value = b.dataset.v;
    $$('button', wrap).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    paint(Number(b.dataset.v));
  });

  submitForm($('#reviewForm'), async (d) => {
    const rating = Number(d.rating);
    if (!d.name.trim() || !d.text.trim() || !(rating >= 1 && rating <= 5)) throw new Error('Informe nome, comentário e uma nota de 1 a 5.');
    store.addReview({ name: d.name.trim(), text: d.text.trim(), rating });
  }, 'Obrigado! Sua avaliação aparece após aprovação no painel.', () => {
    $('#ratingValue').value = '';
    paint(0);
  });
}

// ---------- Localização ----------
function initLocation() {
  const s = site.settings;
  const q = encodeURIComponent(s.mapQuery);
  $('#mapFrame').src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  $('#routeBtn').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  $('#callBtn').href = `tel:${s.phone.replace(/[^\d+]/g, '')}`;

  // destaca o dia de hoje (grupos simples por nome)
  const dayNames = ['Domingo', 'Segunda', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const todayName = dayNames[new Date().getDay()];
  const isToday = (label) => {
    if (label.includes(todayName)) return true;
    const m = label.match(/^(\S+) a (\S+)$/);
    if (!m) return false;
    const a = dayNames.indexOf(m[1]), b = dayNames.indexOf(m[2]), t = new Date().getDay();
    return a !== -1 && b !== -1 && t >= a && t <= b;
  };
  $('#hours').innerHTML = s.hours.map((h) => `<li class="${isToday(h.days) ? 'today' : ''}"><span>${esc(h.days)}${isToday(h.days) ? ' · hoje' : ''}</span><span>${esc(h.time)}</span></li>`).join('');
}

// ---------- Contato ----------
function initContactForm() {
  submitForm($('#contactForm'), async (d) => {
    const msg = {
      name: d.name.trim(), email: d.email.trim() || null, phone: d.phone.trim() || null,
      subject: d.subject, text: d.text.trim(),
    };
    if (!msg.name || !msg.text || (!msg.email && !msg.phone)) throw new Error('Preencha nome, mensagem e um contato (e-mail ou telefone).');
    store.addMessage(msg);
  }, 'Mensagem enviada! Ela já aparece no painel do restaurante.');
}

function submitForm(form, send, okMsg, onOk) {
  const status = $('.form__status', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const btn = $('button[type=submit]', form);
    btn.disabled = true;
    status.className = 'form__status';
    status.textContent = 'Enviando…';
    try {
      await send(data);
      form.reset();
      onOk?.();
      status.classList.add('ok');
      status.textContent = okMsg;
    } catch (err) {
      status.classList.add('err');
      status.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}

// ---------- Navegação ----------
function initNav() {
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  const anchors = $$('a', links);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      anchors.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  anchors.forEach((a) => { const sec = $(a.getAttribute('href')); if (sec) io.observe(sec); });
}

// ---------- Busca de pratos ----------
function initSearch() {
  const modal = $('#searchModal');
  const input = $('#searchInput');
  const results = $('#searchResults');
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const render = () => {
    const q = norm(input.value.trim());
    const list = site.menu.filter((d) => !q || norm(`${d.name} ${d.description} ${d.category} ${d.tags.join(' ')}`).includes(q));
    results.innerHTML = list.map((d) => `
      <li><button data-id="${esc(d.id)}"><img src="${esc(d.image.replace('w=900', 'w=120'))}" alt="">
        <span>${esc(d.name)}<small>${esc(d.category)} · ${brl(d.price)}</small></span></button></li>`).join('')
      || '<li class="empty">Nenhum prato encontrado.</li>';
  };
  $('#searchOpen').addEventListener('click', () => { input.value = ''; render(); modal.showModal(); input.focus(); });
  input.addEventListener('input', render);
  results.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    modal.close();
    openDish(b.dataset.id);
  });
}

// ---------- Animação ao rolar ----------
function initReveal() {
  const els = $$('.section__head, .reviews__summary, .location__info, .location__map, .contact > *, .gallery');
  els.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: .12 });
  els.forEach((el) => io.observe(el));
}

init().catch((err) => console.error('Falha ao carregar o site', err));
