import type { Status } from './i18n';

export type Kind = 'workstation' | 'gaming';
export type Run = 'web' | 'desktop' | 'server';

export interface App {
  order: number;
  id: string;
  name: string;
  kind: Kind;
  status: Status;
  run: Run;
  icon: string;
  summary: { hu: string; en: string };
  license: string;
  url: string | null;
  /** SHA-256 hex of the invite code, for apps with status "invite" */
  inviteHash: string | null;
}
export interface Catalog {
  updated: string;
  frame: { id: string; name: string; status: Status };
  apps: App[];
}

const STATUSES: Status[] = ['open', 'invite', 'dev', 'soon'];

export async function loadCatalog(url = 'katalogus.json'): Promise<Catalog> {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as Catalog;
  if (!Array.isArray(data.apps)) throw new Error('apps missing');
  data.apps = data.apps
    .filter(a => STATUSES.includes(a.status))
    .sort((x, y) => x.order - y.order);
  return data;
}

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text.trim()));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const UNLOCK_KEY = 'woga-unlocked';
export function isUnlocked(id: string): boolean {
  try { return (JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]') as string[]).includes(id); }
  catch { return false; }
}
export function unlock(id: string): void {
  try {
    const list = JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]') as string[];
    if (!list.includes(id)) list.push(id);
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}
