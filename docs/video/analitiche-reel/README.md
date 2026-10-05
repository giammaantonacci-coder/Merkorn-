# Merkorn · Analitiche (reel 9:16)

Versione verticale per i reel Instagram, 1080 × 1920, 60 fps, della stessa durata del video orizzontale in `../analitiche`. Gira in loop.

È lo stesso video: la pagina `src/index.html` carica il codice di `../analitiche/src` e `src/reel.js` cambia solo il formato. In `scenes.js` la costante `VERT`:

- allarga l'inquadratura (lo zoom della camera per 0,65), così la finestra sta tutta in larghezza e lo sfondo viola si estende sopra e sotto;
- porta i titoli dei tre principi sopra la finestra, più grandi, e riduce "Ogni numero / al suo posto.";
- usa la chiusura "powered by Merkorn" nelle misure delle storie verticali.

Una modifica al video orizzontale vale anche per il reel: basta rigenerarlo.

```bash
SK=.claude/skills/motion-designer/scripts
node $SK/check.mjs docs/video/analitiche-reel/src/index.html
node $SK/render.mjs video docs/video/analitiche-reel/src/index.html docs/video/analitiche-reel/out/merkorn-analitiche-reel.mp4 --audio docs/video/analitiche/audio/mix.m4a --deband
python3 $SK/build_single.py docs/video/analitiche-reel/src/index.html docs/video/analitiche-reel/dist/merkorn-analitiche-reel.html
```
