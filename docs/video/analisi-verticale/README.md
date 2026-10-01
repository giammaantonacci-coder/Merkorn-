# Merkorn · Prima l'analisi (verticale)

Video verticale 9:16, 1080 × 1920, 60 fps, 28 s, senza audio, per storie e reel. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

Stessa storia e stessi tempi della versione orizzontale (`../analisi`), impaginata per il telefono:

- il titolo della fase sta sopra la finestra, grande, su due righe, con la seconda in viola;
- i reparti sono in colonna e l'ordine scende dall'alto; le etichette "ricopiato a mano" e poi i componenti su misura compaiono a destra dei collegamenti;
- i moduli collaudati (Magazzino, Fornitura, Anagrafiche, Ordini) sono una griglia 2 × 2 sotto i reparti;
- nella fase 4 ogni reparto si allarga e mostra la sua schermata a destra.

La scaletta con i tempi è nel README della versione orizzontale.

## Anteprima, verifica, rendering

```bash
SK=.claude/skills/motion-designer/scripts
node $SK/check.mjs docs/video/analisi-verticale/src/index.html
node $SK/render.mjs video docs/video/analisi-verticale/src/index.html docs/video/analisi-verticale/out/merkorn-analisi-verticale.mp4 --deband
node $SK/render.mjs stills docs/video/analisi-verticale/src/index.html docs/video/analisi-verticale/out/poster 19.5 --scale 2
python3 $SK/build_single.py docs/video/analisi-verticale/src/index.html docs/video/analisi-verticale/dist/merkorn-analisi-verticale.html
```

La finestra è più stretta e alta di quella standard (`WIN` in `src/device.js`).

## Fonti e diritti

Come la versione orizzontale: testi delle fasi dal sito merkorn.com, moduli indicati da Merkorn, caratteri DM Sans e Inter (SIL Open Font License), logo fornito da Merkorn. Il cliente, il processo e i dati sono inventati. Musica: nessuna per ora.
