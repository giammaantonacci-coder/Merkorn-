# Merkorn · Dove si perdono i dati (reel 9:16)

Reel verticale 1080 × 1920, 60 fps, 26 s, senza audio. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

Lo stesso ordine ricopiato tre volte: email, Excel, foglio stampato per il magazzino. A ogni copia si perde qualcosa. Poi lo stesso ordine scritto una volta sola nel gestionale.

## Scaletta

| Tempo | Cosa succede |
|---|---|
| 0,0 s | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,5 s | Il blocco si apre nell'email di Ristorante Da Pino. Didascalia: "Arriva un ordine." |
| 2,4 s | Si accendono i tre dati che contano: **12** teglie inox **60×40** per **venerdì** |
| 3,4 s | La camera scende sul foglio Excel. Didascalia: "Lo ricopi in Excel." |
| 4,5 s | La riga si compila cella per cella, la camera segue il cursore; nella quantità si scrive 21 |
| 7,2 s | Errore 1: l'inquadratura trema, il 21 si cerchia di rosso, "12 è diventato 21" |
| 7,7 s | "per venerdì" cerca una colonna, non la trova e cade. Errore 2: "la data non ha una colonna" |
| 9,8 s | La camera scende al foglio stampato. Didascalia: "Lo stampi per il magazzino." |
| 10,3 s | Il foglio esce e le righe si stampano una alla volta |
| 11,8 s | Errore 3: la colonna della misura esce dalla pagina, "la misura è fuori pagina" |
| 12,7 s | Zoom out su tutto il percorso. Didascalia: "Tre passaggi, tre errori." I tre errori si riaccendono uno dopo l'altro |
| 16,1 s | Le tre copie svaniscono ed entra l'ordine 1055 nel gestionale, con i dati giusti. Didascalia: "Con un gestionale, lo scrivi una volta." |
| 17,8 s | "Lo stesso dato, per": Ufficio, Magazzino, Consegne |
| 20,8 s | La scheda si chiude nel blocco viola, il fondo diventa nero |
| 21,4 s | Gli altri quattro blocchi scendono e formano il marchio; sotto "powered by Merkorn" |
| 24,6 s | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

I tempi esatti sono in `timeline()` dentro `src/scenes.js`. Tutti i nomi, i numeri e le date sono inventati.

## Anteprima, verifica, rendering

```bash
SK=.claude/skills/motion-designer/scripts
node $SK/check.mjs docs/video/dati-persi/src/index.html
node $SK/render.mjs video docs/video/dati-persi/src/index.html docs/video/dati-persi/out/merkorn-dati-persi.mp4 --deband
python3 $SK/build_single.py docs/video/dati-persi/src/index.html docs/video/dati-persi/dist/merkorn-dati-persi.html
```

`dist/merkorn-dati-persi.html` è un file unico che si apre nel browser, con il player.
