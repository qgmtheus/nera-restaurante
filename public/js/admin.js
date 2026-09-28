import { store } from './store.js';
import { SITE } from './config.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fmtDate = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const CTA_LABELS = {
  'hero-cardapio': 'Ver cardápio (topo)',
  'pedido-whatsapp': 'Pedir no WhatsApp (prato)',
  'whatsapp-flutuante': 'WhatsApp flutuante',
  rota: 'Traçar rota',
  ligar: 'Ligar',
  'social-instagram': 'Instagram',
  'social-facebook': 'Facebook',
  'social-x': 'X / Twitter',
  'social-whatsapp': 'WhatsApp (ícone)',
};

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Navegação ----------
let currentView = 'dashboard';
$('#sideNav').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) showView(b.dataset.view);
});
function showView(v) {
  currentView = v;
  $$('#sideNav button').forEach((b) => b.classList.toggle('is-active', b.dataset.view === v));
  $$('.view').forEach((s) => s.classList.toggle('is-active', s.dataset.view === v));
  ({ dashboard: loadDashboard, messages: loadMessages, reviews: loadReviews, menu: loadMenu })[v]();
}

// Atualiza o painel quando o site (aberto em outra aba) registra algo novo.
window.addEventListener('storage', () => showView(currentView));
window.addEventListener('focus', () => showView(currentView));

// ---------- Dashboard ----------
function loadDashboard() {
  const d = store.dashboard();
  const menu = store.menu({ onlyActive: false });
  const clicks = (type, id) => d.clicks[`${type}:${id}`] || 0;
  const dishRanking = menu.map((x) => ({ ...x, clicks: clicks('dish', x.id) })).sort((a, b) => b.clicks - a.clicks);
  const galleryRanking = SITE.gallery.map((g) => ({ ...g, clicks: clicks('gallery', g.id) })).sort((a, b) => b.clicks - a.clicks);
  const dishTotal = dishRanking.reduce((a, x) => a + x.clicks, 0);

  setBadge('#badgeMsgs', d.unread_messages);
  setBadge('#badgeReviews', d.pending_reviews);

  const kpis = [
    ['Visitas hoje', d.visits_today, `${d.visits_total} no total`],
    ['Cliques em pratos', dishTotal, 'desde o início'],
    ['Mensagens não lidas', d.unread_messages, 'formulário de contato', d.unread_messages > 0],
    ['Avaliações pendentes', d.pending_reviews, 'aguardando aprovação', d.pending_reviews > 0],
    ['Nota média', d.rating ? Number(d.rating).toFixed(1).replace('.', ',') : '–', 'avaliações publicadas'],
  ];
  $('#kpis').innerHTML = kpis.map(([label, val, sub, alert]) => `
    <div class="kpi ${alert ? 'alert' : ''}"><span>${label}</span><strong>${val}</strong><small>${sub}</small></div>`).join('');

  const maxDish = Math.max(1, ...dishRanking.map((x) => x.clicks));
  $('#dishRank').innerHTML = dishRanking.map((x) => `
    <li>
      <img src="${esc(x.image.replace('w=900', 'w=120'))}" alt="">
      <div class="name">${esc(x.name)}<small>${esc(x.category)}</small>
        <div class="track"><div class="fill" style="width:${(x.clicks / maxDish) * 100}%"></div></div>
      </div>
      <span class="count">${x.clicks}</span>
    </li>`).join('');

  const maxVisits = Math.max(1, ...d.visits_by_day.map((x) => x.visits));
  $('#visitsChart').innerHTML = d.visits_by_day.map((x, i) => {
    const [, m, day] = x.date.split('-');
    const label = i % 2 === 1 || i === 13 ? `${day}/${m}` : '';
    return `<div class="bar"><em>${day}/${m}: ${x.visits}</em><i style="height:${(x.visits / maxVisits) * 100}%"></i><span>${label}</span></div>`;
  }).join('');
  $('#visitsChart').parentElement.classList.add('bars-wrap');

  const maxG = Math.max(1, ...galleryRanking.map((x) => x.clicks));
  $('#galleryRank').innerHTML = galleryRanking.slice(0, 5).map((x) => `
    <li>
      <img src="${esc(x.image.replace('w=1400', 'w=100'))}" alt="">
      <div class="name">${esc(x.caption)}<div class="track"><div class="fill" style="width:${(x.clicks / maxG) * 100}%"></div></div></div>
      <span class="count">${x.clicks}</span>
    </li>`).join('');

  const ctas = Object.entries(d.clicks)
    .filter(([k]) => k.startsWith('cta:'))
    .map(([k, n]) => [k.slice(4), n])
    .sort((a, b) => b[1] - a[1]);
  $('#ctaList').innerHTML = ctas.length
    ? ctas.map(([key, n]) => `<li><span>${esc(CTA_LABELS[key] || key)}</span><strong>${n}</strong></li>`).join('')
    : '<li class="muted">Nenhum clique ainda.</li>';
}

function setBadge(sel, n) {
  const el = $(sel);
  el.hidden = !n;
  el.textContent = n;
}

$('#resetStats').addEventListener('click', () => {
  if (!confirm('Zerar todas as estatísticas de visitas e cliques? Mensagens e avaliações não são apagadas.')) return;
  store.resetStats();
  toast('Estatísticas zeradas');
  loadDashboard();
});

// ---------- Mensagens ----------
let msgFilter = 'all';
$('#msgFilter').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  msgFilter = b.dataset.f;
  $$('#msgFilter button').forEach((x) => x.classList.toggle('is-active', x === b));
  loadMessages();
});

function loadMessages() {
  const all = store.messages();
  setBadge('#badgeMsgs', all.filter((m) => !m.read).length);
  const list = msgFilter === 'unread' ? all.filter((m) => !m.read) : all;
  $('#msgList').innerHTML = list.map((m) => {
    const reply = m.email
      ? `<a href="mailto:${esc(m.email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}">Responder por e-mail</a>`
      : '';
    const wa = m.phone ? `<a href="https://wa.me/${esc(m.phone.replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp</a>` : '';
    return `
    <article class="item ${m.read ? '' : 'unread'}" data-id="${esc(m.id)}" data-read="${m.read}">
      <div class="item__head">
        <span class="item__who">${esc(m.name)}<small>${esc([m.email, m.phone].filter(Boolean).join(' · '))}</small></span>
        <span><span class="tag">${esc(m.subject)}</span> <span class="item__meta">${fmtDate(m.created_at)}</span></span>
      </div>
      <p class="item__text">${esc(m.text)}</p>
      <div class="item__actions">
        ${reply}${wa}
        <button data-act="toggle">${m.read ? 'Marcar como não lida' : 'Marcar como lida'}</button>
        <button data-act="delete" class="danger">Excluir</button>
      </div>
    </article>`;
  }).join('') || '<p class="empty">Nenhuma mensagem por aqui.</p>';
}

$('#msgList').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const item = b.closest('.item');
  const id = item.dataset.id;
  if (b.dataset.act === 'toggle') {
    store.updateMessage(id, { read: item.dataset.read !== 'true' });
  } else if (confirm('Excluir esta mensagem?')) {
    store.deleteMessage(id);
    toast('Mensagem excluída');
  }
  loadMessages();
});

// ---------- Avaliações ----------
let revFilter = 'pending';
$('#revFilter').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  revFilter = b.dataset.f;
  $$('#revFilter button').forEach((x) => x.classList.toggle('is-active', x === b));
  loadReviews();
});

function loadReviews() {
  const all = store.reviews();
  setBadge('#badgeReviews', all.filter((r) => !r.approved).length);
  const list = all.filter((r) => revFilter === 'all' || (revFilter === 'approved' ? r.approved : !r.approved));
  $('#revList').innerHTML = list.map((r) => `
    <article class="item" data-id="${esc(r.id)}" data-approved="${r.approved}">
      <div class="item__head">
        <span class="item__who">${esc(r.name)} <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></span>
        <span><span class="tag ${r.approved ? 'ok' : 'wait'}">${r.approved ? 'Publicada' : 'Pendente'}</span> <span class="item__meta">${fmtDate(r.created_at)}</span></span>
      </div>
      <p class="item__text">${esc(r.text)}</p>
      <div class="item__actions">
        <button data-act="toggle">${r.approved ? 'Ocultar do site' : 'Aprovar e publicar'}</button>
        <button data-act="delete" class="danger">Excluir</button>
      </div>
    </article>`).join('') || `<p class="empty">Nenhuma avaliação ${revFilter === 'pending' ? 'pendente' : ''}.</p>`;
}

$('#revList').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const item = b.closest('.item');
  const id = item.dataset.id;
  if (b.dataset.act === 'toggle') {
    const approve = item.dataset.approved !== 'true';
    store.updateReview(id, { approved: approve });
    toast(approve ? 'Avaliação publicada' : 'Avaliação ocultada');
  } else if (confirm('Excluir esta avaliação?')) {
    store.deleteReview(id);
    toast('Avaliação excluída');
  }
  loadReviews();
});

// ---------- Cardápio ----------
function loadMenu() {
  const menu = store.menu({ onlyActive: false });
  $('#menuTable tbody').innerHTML = menu.map((d) => `
    <tr data-id="${esc(d.id)}">
      <td><div class="dish-cell"><img src="${esc(d.image.replace('w=900', 'w=100'))}" alt="">${esc(d.name)}</div></td>
      <td>${esc(d.category)}</td>
      <td><input type="number" min="0" step="0.5" value="${Number(d.price)}" data-field="price" aria-label="Preço de ${esc(d.name)}"></td>
      <td><label class="switch"><input type="checkbox" data-field="featured" ${d.featured ? 'checked' : ''}><span></span></label></td>
      <td><label class="switch"><input type="checkbox" data-field="active" ${d.active ? 'checked' : ''}><span></span></label></td>
    </tr>`).join('');
}

$('#menuTable').addEventListener('change', (e) => {
  const input = e.target.closest('[data-field]');
  if (!input) return;
  const id = input.closest('tr').dataset.id;
  const value = input.type === 'checkbox' ? input.checked : Number(input.value);
  store.updateMenuItem(id, { [input.dataset.field]: value });
  toast('Cardápio atualizado');
});

$('#resetAll').addEventListener('click', () => {
  if (!confirm('Voltar todos os dados do painel para o exemplo inicial?')) return;
  store.resetAll();
  toast('Dados de exemplo restaurados');
  showView(currentView);
});

// ---------- Boot ----------
showView('dashboard');
