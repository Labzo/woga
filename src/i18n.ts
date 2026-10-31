export type Lang = 'hu' | 'en';
export type Status = 'open' | 'invite' | 'dev' | 'soon';

const hu = {
  tagline: 'Workstation & Gaming · app center',
  preview: 'Előzetes bemutató: a WoGA készülőben van, az appok még nem indíthatók.',
  frame: 'Keret',
  all: 'Mind',
  workstation: 'Workstation',
  gaming: 'Gaming',
  footer: 'Teljesen ingyenes, nyílt forrású, a világnak készül.',
  empty: 'Ebben a csoportban még nincs app.',
  loadError: 'A katalógust nem sikerült betölteni.',
  status: { open: 'Elkészült, nyílt', invite: 'Elkészült, meghívóval', dev: 'Fejlesztés alatt', soon: 'Hamarosan' },
  legend: { open: 'Zöld: elkészült és nyílt', invite: 'Kék: elkészült, csak meghívóval', dev: 'Sárga: fejlesztés alatt', soon: 'Piros: ezek jönnek' },
  action: { open: 'Indítás', invite: 'Meghívókód megadása', dev: 'Fejlesztés alatt', soon: 'Hamarosan' },
  run: { web: 'Böngészőben fut', desktop: 'Asztali app', server: 'Saját szerveren fut, böngészőből érhető el' },
  details: 'Részletek',
  license: 'Licenc',
  howRuns: 'Hogyan fut',
  close: 'Bezárás',
  inviteLabel: 'Meghívókód',
  inviteSubmit: 'Megnyitás',
  inviteWrong: 'Ez a kód nem jó.',
  noUrl: 'Az indítási cím még nincs megadva.',
  langButton: 'EN',
};
type Dict = typeof hu;
const en: Dict = {
  tagline: 'Workstation & Gaming · app center',
  preview: 'Preview: WoGA is in development, the apps cannot be launched yet.',
  frame: 'Frame',
  all: 'All',
  workstation: 'Workstation',
  gaming: 'Gaming',
  footer: 'Completely free, open source, made for the world.',
  empty: 'No apps in this group yet.',
  loadError: 'The catalogue could not be loaded.',
  status: { open: 'Ready, open', invite: 'Ready, invite only', dev: 'In development', soon: 'Coming soon' },
  legend: { open: 'Green: ready and open', invite: 'Blue: ready, invite only', dev: 'Yellow: in development', soon: 'Red: coming next' },
  action: { open: 'Launch', invite: 'Enter invite code', dev: 'In development', soon: 'Coming soon' },
  run: { web: 'Runs in the browser', desktop: 'Desktop app', server: 'Runs on your own server, used from the browser' },
  details: 'Details',
  license: 'Licence',
  howRuns: 'How it runs',
  close: 'Close',
  inviteLabel: 'Invite code',
  inviteSubmit: 'Open',
  inviteWrong: 'This code is not valid.',
  noUrl: 'The launch address is not set yet.',
  langButton: 'HU',
};
export const dict: Record<Lang, Dict> = { hu, en };

const KEY = 'woga-lang';
export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'hu' || saved === 'en') return saved;
  } catch { /* storage unavailable */ }
  return (navigator.language || '').toLowerCase().startsWith('hu') ? 'hu' : 'en';
}
export function saveLang(l: Lang): void {
  try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
}
