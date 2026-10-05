# Merkorn · Da Excel al gestionale (reel 9:16)

Versione verticale per i reel Instagram, 1080 × 1920, 60 fps, della stessa durata del video orizzontale in `../da-excel`. Gira in loop.

È lo stesso video: la pagina `src/index.html` carica il codice di `../da-excel/src` e `src/reel.js` cambia solo il formato. In `scenes.js` la costante `VERT`:

- allarga l'inquadratura (lo zoom della camera per 0,65), così la finestra sta tutta in larghezza e lo sfondo viola si estende sopra e sotto;
- mette "Riduci gli errori." su due righe, centrate;
- usa la chiusura "powered by Merkorn" nelle misure delle storie verticali.

Una modifica al video orizzontale vale anche per il reel: basta rigenerarlo.

```bash
SK=.claude/skills/motion-designer/scripts
node $SK/check.mjs docs/video/da-excel-reel/src/index.html
node $SK/render.mjs video docs/video/da-excel-reel/src/index.html docs/video/da-excel-reel/out/merkorn-da-excel-reel.mp4 --deband
python3 $SK/build_single.py docs/video/da-excel-reel/src/index.html docs/video/da-excel-reel/dist/merkorn-da-excel-reel.html
```
