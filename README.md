# WoGA (Wo&Ga) – Workstation & Gaming app center

Teljesen ingyenes, nyílt forrású app center, amely bárhol fut. Ebből települnek és indulnak a WoGA appjai, sorrendben: ENRO, DiAsGe, AERO, AdGe.

## Állapotszínek
- zöld (`open`): elkészült és nyílt
- kék (`invite`): elkészült, csak meghívóval
- sárga (`dev`): fejlesztés alatt
- piros (`soon`): ezek jönnek

## Futtatás
```
npm install
npm run dev      # fejlesztői szerver
npm run build    # kész webes változat a dist/ mappába
```
A `dist/` bármilyen statikus tárhelyre feltölthető (pl. moisend.eu alá egy mappába).

## Katalógus
`public/katalogus.json`: az appok listája. Új app vagy állapotváltás = csak ezt a fájlt kell átírni.
Meghívós app: `"status": "invite"` és `"inviteHash"` = a meghívókód SHA-256 kivonata (hex), pl. `echo -n "KOD" | sha256sum`.

## Nyelvek
Magyar és angol (US), a gép nyelve alapján választ, a gombbal váltható.

## Következő lépések
- Asztali csomag Tauri 2-vel (Linux, Windows, macOS), GitHub Actions buildeli.
- Offline működés (service worker).

Licenc: GPL-3.0-or-later.
