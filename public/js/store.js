// "Banco" do template: tudo fica no navegador de quem está vendo a demo.
// Cada visitante tem os próprios dados; nada é enviado para servidor.
import { MENU, SAMPLE_REVIEWS, SAMPLE_MESSAGES, SAMPLE_VISITS, SAMPLE_CLICKS } from './data.js';

const KEY = 'nera-demo-v1';
const DAY = 86400000;
const dayKey = (t = Date.now()) => new Date(t).toLocaleDateString('sv-SE'); // AAAA-MM-DD local
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

function fresh() {
  const now = Date.now();
  const visits = {};
  SAMPLE_VISITS.forEach((n, i) => { visits[dayKey(now - (SAMPLE_VISITS.length - 1 - i) * DAY)] = n; });
  return {
    menu: MENU.map((d, i) => ({ ...d, sort: i })),
    reviews: SAMPLE_REVIEWS.map(({ daysAgo, ...r }) => ({ ...r, id: uid(), created_at: new Date(now - daysAgo * DAY).toISOString() })),
    messages: SAMPLE_MESSAGES.map(({ hoursAgo, ...m }) => ({ ...m, id: uid(), created_at: new Date(now - hoursAgo * 3600000).toISOString() })),
    visits,
    clicks: { ...SAMPLE_CLICKS },
  };
}

let state;
try { state = JSON.parse(localStorage.getItem(KEY)); } catch { state = null; }
if (!state || !Array.isArray(state.menu)) state = fresh();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sem storage: fica só em memória */ }
}
save();

const byDate = (a, b) => new Date(b.created_at) - new Date(a.created_at);
const clone = (x) => structuredClone(x);

export const store = {
  // ----- site público -----
  menu: ({ onlyActive = true } = {}) => clone(state.menu.filter((d) => !onlyActive || d.active).sort((a, b) => a.sort - b.sort)),
  approvedReviews: () => clone(state.reviews.filter((r) => r.approved).sort(byDate)),

  track(type, ref) {
    if (type === 'visit') {
      const k = dayKey();
      state.visits[k] = (state.visits[k] || 0) + 1;
    } else if (ref) {
      const k = `${type}:${ref}`;
      state.clicks[k] = (state.clicks[k] || 0) + 1;
    }
    save();
  },

  addMessage(msg) {
    state.messages.push({ ...msg, id: uid(), read: false, created_at: new Date().toISOString() });
    save();
  },

  addReview(review) {
    state.reviews.push({ ...review, id: uid(), approved: false, created_at: new Date().toISOString() });
    save();
  },

  // ----- painel -----
  dashboard() {
    const days = [...Array(14)].map((_, i) => {
      const date = dayKey(Date.now() - (13 - i) * DAY);
      return { date, visits: state.visits[date] || 0 };
    });
    const approved = state.reviews.filter((r) => r.approved);
    return {
      visits_today: state.visits[dayKey()] || 0,
      visits_total: Object.values(state.visits).reduce((a, b) => a + b, 0),
      visits_by_day: days,
      clicks: clone(state.clicks),
      unread_messages: state.messages.filter((m) => !m.read).length,
      pending_reviews: state.reviews.filter((r) => !r.approved).length,
      rating: approved.length ? approved.reduce((a, r) => a + r.rating, 0) / approved.length : null,
    };
  },

  messages: () => clone([...state.messages].sort(byDate)),
  updateMessage(id, patch) { Object.assign(state.messages.find((m) => m.id === id) || {}, patch); save(); },
  deleteMessage(id) { state.messages = state.messages.filter((m) => m.id !== id); save(); },

  reviews: () => clone([...state.reviews].sort(byDate)),
  updateReview(id, patch) { Object.assign(state.reviews.find((r) => r.id === id) || {}, patch); save(); },
  deleteReview(id) { state.reviews = state.reviews.filter((r) => r.id !== id); save(); },

  updateMenuItem(id, patch) { Object.assign(state.menu.find((d) => d.id === id) || {}, patch); save(); },

  resetStats() { state.visits = {}; state.clicks = {}; save(); },
  resetAll() { state = fresh(); save(); },
};
