# Merkorn · Presentazione (reel 9:16)

Reel verticale 1080 × 1920, 60 fps, 70 s, con musica ed effetti sonori, per il profilo Instagram (in evidenza). Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

I testi vengono dalla presentazione aziendale "Merkorn · Presentazione". Fondi pieni nero, bianco e viola, senza sfumature; il viola gioca su parole, forme e transizioni.

## Scaletta

| Tempo | Fondo | Cosa succede |
|---|---|---|
| 0,0 s | nero | Il blocco in cima al marchio |
| 0,5 s | viola | Il blocco esplode a tutto schermo, poi il viola si ritira verso l'alto |
| 0,8 s | nero | Marchio e MERKORN; "Gestionali / su misura / per le PMI." entrano da lati alterni. "Software costruito attorno al vostro modo di lavorare, non il contrario." "Software house · Puglia" |
| 5,5 s | bianco | Transizione a blocchi viola. CHI SIAMO: "Software house pugliese." (le lettere cadono). "Portiamo il digitale nelle imprese del territorio." Tre schede nere si spingono via: la missione, il focus, la visione |
| 13,5 s | nero | Cerchio viola. COSA FA MERKORN: "Progettiamo e sviluppiamo il gestionale della vostra azienda." Poi "Su misura. Modulare. Guidato dai dati.", ognuno con la sua riga e una barra viola |
| 21,0 s | bianco | Pannello viola orizzontale. I MODULI: "Un gestionale, componibile." Sei tessere arrivano ruotando e si incastrano: Operatività, Magazzino, Vendite e clienti, Documenti, Integrazioni, Analytics (viola) |
| 27,5 s | nero | Pannello viola in diagonale. A COSA SERVE: "Meno tempo sui dati, più tempo sulle decisioni." Quattro strisce viola da lati alterni: un dato inserito una volta, meno errori, flusso più rapido, numeri in tempo reale |
| 36,0 s | viola | Il viola sale dal basso (drop della musica): "Lo strumento si piega al processo, non il contrario." "si piega" si curva ad arco, "non il contrario." si ribalta. "Partiamo da come lavorate. Capiamo dove nasce il problema." |
| 41,5 s | bianco | Il viola sale e scopre il bianco. PERCHÉ MERKORN: "Quattro ragioni." Quattro carte nere che si impilano: tutto in casa, facile da usare, cresce con voi, vicini |
| 51,0 s | nero | Blocchi viola. COME LAVORIAMO: "Il nostro processo diviso in sei fasi." Una linea viola scende e accende le fasi: analisi, definizione, prototipo, sviluppo, rilascio, adozione |
| 58,0 s | bianco | Pannello viola. Il marchio si compone; "Parliamone." "Il primo passo è un'analisi gratuita." "merkorn.com" con la riga viola, merkornsh@gmail.com |
| 65,0 s | nero | La riga viola diventa il blocco; il marchio si forma, sotto "powered by Merkorn" |
| 68,8 s | nero | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

I tempi esatti sono in `timeline()` dentro `src/scenes.js`; i testi in `textsHtml()` e nelle costanti FACTS, TILES, STRIPS, CARDS e PHASES.

## Audio

- `audio/score.py`: la colonna sonora, sintetizzata in Python (numpy), originale, niente di scaricato. La minore, 120 BPM, 35 battute. Groove dal titolo, drop su "lo strumento si piega", metà tempo su "parliamone", il pad da solo sulla firma.
- Gli effetti sonori (`cues()` in `src/scenes.js`) sono sintetizzati da `sfx.py` della skill e mixati sopra.

## Rigenerare

```bash
SK=.claude/skills/motion-designer/scripts P=docs/video/presentazione
uv run --with numpy python3 $P/audio/score.py
node $SK/render.mjs cues $P/src/index.html $P/audio/cues.json
python3 $SK/sfx.py $P/audio/cues.json --key "A minor" --music $P/audio/bed.wav --music-gain 0.7 --out $P/audio/mix
cp $P/audio/mix.m4a $P/audio/edit.m4a
node $SK/check.mjs $P/src/index.html
node $SK/render.mjs video $P/src/index.html $P/out/merkorn-presentazione.mp4 --audio $P/audio/mix.m4a --deband
python3 $SK/build_single.py $P/src/index.html $P/dist/merkorn-presentazione.html
```
