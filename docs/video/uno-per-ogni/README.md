# Merkorn · Uno per ogni azienda

Video verticale 1080 × 1920 per storie e reel, 60 fps, 19 s, senza audio. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

La stessa finestra cambia forma per tre aziende: moduli, dati e colore del fondo diversi. Chiude con "E la vostra azienda?" e la firma "powered by Merkorn".

## Scaletta

| Tempo | Cosa succede |
|---|---|
| 0,0 s | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,25 s | Il blocco si apre nella finestra; nebulosa viola |
| 0,7 s | "Un'officina meccanica.": Officina Neri, Interventi, Veicoli, Ricambi, Clienti; didascalia "Interventi, targhe, ricambi." |
| 2,5 s | Il tagliando della Fiat Panda passa da "In lavorazione" a "Pronta"; i contatori cambiano |
| 5,0 s | La nebulosa diventa blu dalla finestra: "Un'azienda di trasporti.", Trasporti Valli, Spedizioni, Mezzi, Autisti |
| 7,25 s | La consegna Milano → Bologna diventa "Consegnata" |
| 9,5 s | Nebulosa ambra: "Un laboratorio di produzione.", Laboratorio Gatti, Commesse, Produzione, Macchine, Magazzino |
| 11,75 s | La commessa C-214 avanza dal 60 al 75 % |
| 14,0 s | Nebulosa viola: "E la vostra azienda?"; la finestra si chiude nel blocco, il fondo diventa nero |
| 14,95 s | Il marchio si forma; sotto "powered by Merkorn" |
| 16,1 s | La domanda esce, resta solo la firma |
| 17,5 s | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

## Stile

Come "Da Excel al gestionale": colori, caratteri, marchio e chiusura dal sito merkorn.com. Ogni settore prende uno dei colori dei grafici del sito (viola `#9747FF`, blu `#3A8FD0`, ambra `#B8862A`) per la nebulosa e per la seconda riga del titolo.

## Anteprima, verifica, rendering

```bash
SK=.claude/skills/motion-designer/scripts
node $SK/check.mjs docs/video/uno-per-ogni/src/index.html
node $SK/render.mjs video docs/video/uno-per-ogni/src/index.html docs/video/uno-per-ogni/out/merkorn-uno-per-ogni.mp4 --deband
node $SK/render.mjs stills docs/video/uno-per-ogni/src/index.html docs/video/uno-per-ogni/out/poster 3.5 --scale 2
python3 $SK/build_single.py docs/video/uno-per-ogni/src/index.html docs/video/uno-per-ogni/dist/merkorn-uno-per-ogni.html
```

## Fonti e diritti

- Caratteri: DM Sans e Inter, dagli asset del sito Merkorn (SIL Open Font License). Logo fornito da Merkorn.
- Aziende, targhe, persone, commesse e numeri sono inventati; le targhe seguono solo il formato italiano.
- Le schermate sono illustrative. Musica: nessuna per ora.
