import './tokens.css';
import './style.css';
import { dict, initialLang, saveLang, type Lang, type Status } from './i18n';
import { loadCatalog, sha256Hex, isUnlocked, unlock, type App, type Catalog, type Kind } from './catalog';

const BADGE: Record<Status, string> = {
  open: 'ikonok/allapot/zold_nyilt.svg',
  invite: 'ikonok/allapot/kek_meghivoval.svg',
  dev: 'ikonok/allapot/sarga_fejlesztes.svg',
  soon: 'ikonok/allapot/piros_hamarosan.svg',
};
const STATUS_ORDER: Status[] = ['open', 'invite', 'dev', 'soon'];

let lang: Lang = initialLang();
let filter: 'all' | Kind = 'all';
let catalog: Catalog | null = null;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
const t = () => dict[lang];

function statusRow(s: Status): HTMLElement {
  const row = el('div', `status s-${s}`);
  const img = el('img'); img.src = BADGE[s]; img.alt = ''; img.width = 22; img.height = 22;
  row.append(img, el('span', '', t().status[s]));
  return row;
}

function effective(a: App): Status {
  return a.status === 'invite' && isUnlocked(a.id) ? 'open' : a.status;
}

function actionButton(a: App): HTMLButtonElement {
  const s = effective(a);
  const b = el('button', `btn s-${s}`, t().action[s]);
  b.type = 'button';
  if (s === 'dev' || s === 'soon') b.disabled = true;
  else b.addEventListener('click', ev => { ev.stopPropagation(); s === 'open' ? launch(a) : openDetail(a, true); });
  return b;
}

function launch(a: App): void {
  if (!a.url) { openDetail(a, false, t().noUrl); return; }
  window.open(a.url, '_blank', 'noopener');
}

function renderFrame(): void {
  const f = $('frame'); f.replaceChildren();
  if (!catalog) return;
  const s = catalog.frame.status;
  const dot = el('span', `dot s-${s}`);
  f.append(dot, el('span', '', `${t().frame}: ${t().status[s].toLowerCase()}`));
}

function renderFilters(): void {
  const bar = $('filters'); bar.replaceChildren();
  bar.setAttribute('aria-label', 'Filter');
  (['all', 'workstation', 'gaming'] as const).forEach(k => {
    const b = el('button', 'tab');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(filter === k));
    if (k !== 'all') { const i = el('img'); i.src = `ikonok/felulet/${k}.svg`; i.alt = ''; i.width = 18; i.height = 18; b.append(i); }
    b.append(document.createTextNode(t()[k]));
    b.addEventListener('click', () => { filter = k; renderFilters(); renderGrid(); });
    bar.append(b);
  });
}

function renderGrid(): void {
  const grid = $('grid'); grid.replaceChildren();
  const empty = $('empty');
  if (!catalog) return;
  const apps = catalog.apps.filter(a => filter === 'all' || a.kind === filter);
  empty.hidden = apps.length > 0; empty.textContent = t().empty;
  for (const a of apps) {
    const card = el('article', 'card');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${a.name}, ${t().status[effective(a)]}`);
    const top = el('div', 'top');
    const icon = el('img', 'icon'); icon.src = a.icon; icon.alt = ''; icon.width = 64; icon.height = 64;
    const names = el('div');
    names.append(el('h2', '', a.name), el('div', `kind ${a.kind}`, t()[a.kind]));
    top.append(icon, names, el('span', 'order', `${a.order}.`));
    card.append(top, statusRow(effective(a)), el('p', 'summary', a.summary[lang]), actionButton(a));
    card.addEventListener('click', () => openDetail(a));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openDetail(a); });
    grid.append(card);
  }
}

function renderLegend(): void {
  const ul = $('legend'); ul.replaceChildren();
  for (const s of STATUS_ORDER) {
    const li = el('li'); li.append(el('span', `dot s-${s}`), el('span', '', t().legend[s])); ul.append(li);
  }
}

function openDetail(a: App, focusInvite = false, note?: string): void {
  const d = $<HTMLDialogElement>('detail'); d.replaceChildren();
  const s = effective(a);
  const head = el('div', 'top');
  const icon = el('img', 'icon'); icon.src = a.icon; icon.alt = ''; icon.width = 72; icon.height = 72;
  const names = el('div'); names.append(el('h2', '', a.name), el('div', `kind ${a.kind}`, t()[a.kind]));
  head.append(icon, names);
  const dl = el('dl');
  dl.append(el('dt', '', t().howRuns), el('dd', '', t().run[a.run]), el('dt', '', t().license), el('dd', '', a.license));
  d.append(head, statusRow(s), el('p', 'summary', a.summary[lang]), dl);
  if (note) d.append(el('p', 'note', note));
  if (s === 'invite') {
    const form = el('form', 'invite');
    const label = el('label', '', t().inviteLabel);
    const input = el('input'); input.type = 'text'; input.autocomplete = 'off'; input.id = 'invite-code'; label.htmlFor = 'invite-code';
    const submit = el('button', 'btn s-invite', t().inviteSubmit); submit.type = 'submit';
    const msg = el('p', 'note'); msg.setAttribute('role', 'status');
    form.append(label, input, submit, msg);
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (a.inviteHash && (await sha256Hex(input.value)) === a.inviteHash) {
        unlock(a.id); d.close(); renderGrid(); launch(a);
      } else msg.textContent = t().inviteWrong;
    });
    d.append(form);
    if (focusInvite) queueMicrotask(() => input.focus());
  } else {
    d.append(actionButton(a));
  }
  const close = el('button', 'close', t().close); close.type = 'button';
  close.addEventListener('click', () => d.close());
  d.append(close);
  if (!d.open) d.showModal();
}

function applyLang(): void {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-t]').forEach(n => {
    const k = n.dataset.t as 'tagline' | 'footer' | 'preview';
    n.textContent = t()[k];
  });
  $('lang').textContent = t().langButton;
  renderFrame(); renderFilters(); renderGrid(); renderLegend();
}

$('lang').addEventListener('click', () => { lang = lang === 'hu' ? 'en' : 'hu'; saveLang(lang); applyLang(); });
$('detail').addEventListener('click', e => { if (e.target === e.currentTarget) ($('detail') as HTMLDialogElement).close(); });

applyLang();
loadCatalog()
  .then(c => { catalog = c; applyLang(); })
  .catch(() => { const e = $('empty'); e.hidden = false; e.textContent = t().loadError; });
