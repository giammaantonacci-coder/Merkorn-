# Merkorn · Analitiche

Video orizzontale 1920 × 1080, 60 fps, 38 s, con colonna sonora originale ed effetti. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola, e la musica chiude il giro senza stacco.

La schermata delle analitiche di un gestionale Merkorn, raccontata come una vetrina di motion design. Un'unica idea la attraversa: i cinque blocchi del marchio diventano i dati, e i dati tornano blocchi.

## Scaletta

| Tempo | Cosa succede |
|---|---|
| 0,0 s | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,5 s | Gli altri quattro blocchi escono da quello in cima: il marchio intero |
| 1,5 s | I blocchi cadono su una linea di base e diventano cinque colonne; le altre sette spuntano ai lati |
| 2,1 s | Le dodici colonne crescono fino al fatturato di ogni mese |
| 3,0 s | Grande tipografia: "Ogni numero / al suo posto." |
| 5,0 s | Le colonne si riducono alla loro cima e diventano punti; una linea li attraversa, con l'area sotto; poi la linea dell'anno precedente |
| 6,5 s | La camera arretra: era il grafico "Fatturato mensile" della schermata Analitiche, che si compone intorno (barra laterale, titolo, periodi, quattro indicatori che contano, ordini per categoria) |
| 10,0 s | Principio 1, "Un periodo per tutta la schermata": 3 mesi, 6 mesi, 12 mesi; linea, indicatori e categorie cambiano insieme |
| 14,2 s | Principio 2, "Il dato che conta in primo piano": affondo sul grafico, un cursore scorre i mesi con i valori, a fine corsa 184.000 € (+10,2% sull'anno prima) |
| 20,6 s | Arriva un ordine nuovo (#3211, Ferramenta, 2.480 €) |
| 22,0 s | Sul drop della musica l'ordine vola nella scheda Ordini: 3.210 → 3.211, il fatturato sale, l'ultimo punto della linea si alza, Ferramenta +1 |
| 24,0 s | Principio 3, "Barre orizzontali per i nomi lunghi": affondo sulle categorie, le barre ricrescono dalla stessa linea, poi "Crescita" le riordina |
| 30,6 s | Le schede si richiudono nei cinque blocchi del marchio |
| 32,0 s | "powered by Merkorn" |
| 36,4 s | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

## Suono

- `audio/score.py`: la colonna sonora, sintetizzata in Python (numpy), originale, nulla di scaricato. La minore, 120 BPM, 19 battute. Pad all'inizio e alla fine, groove sotto la schermata, salita prima dell'ordine nuovo e drop sull'ordine che entra, pausa e risucchio sul ritorno al marchio.
- Effetti delle azioni (`cues()` in `src/scenes.js`) sintetizzati da `sfx.py` della skill e mixati sopra.

```bash
SK=.claude/skills/motion-designer/scripts
uv run --with numpy python3 docs/video/analitiche/audio/score.py
node $SK/render.mjs cues docs/video/analitiche/src/index.html docs/video/analitiche/audio/cues.json
python3 $SK/sfx.py docs/video/analitiche/audio/cues.json --key "A minor" --music docs/video/analitiche/audio/bed.wav --music-gain 0.7 --out docs/video/analitiche/audio/mix
cp docs/video/analitiche/audio/mix.m4a docs/video/analitiche/audio/edit.m4a
```

## Rendering

```bash
node $SK/check.mjs docs/video/analitiche/src/index.html
node $SK/render.mjs video docs/video/analitiche/src/index.html docs/video/analitiche/out/merkorn-analitiche.mp4 --audio docs/video/analitiche/audio/mix.m4a --deband
python3 $SK/build_single.py docs/video/analitiche/src/index.html docs/video/analitiche/dist/merkorn-analitiche.html
```

## Fonti e diritti

- Dati del grafico, delle categorie e degli indicatori: quelli delle schermate di esempio del sito merkorn.com (pagina Come lavoriamo, schermata Analitiche). Crescite per categoria e ordine nuovo inventati.
- I tre principi sono quelli scritti sul sito.
- Caratteri DM Sans e Inter dal sito (SIL Open Font License); logo fornito da Merkorn.
- Musica ed effetti: sintetizzati per il video, originali, nessun credito richiesto.
- Il cliente "Rossi Forniture" e "Anna Martini" sono inventati.
