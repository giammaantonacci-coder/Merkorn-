# Merkorn · Da Excel al gestionale

Video orizzontale 1920 × 1080, 60 fps, 20 s, senza audio. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

Un foglio di calcolo caotico si ripulisce e diventa un gestionale su misura. L'ordine appena inserito scala il magazzino e diventa una fattura elettronica. Chiude con la firma "powered by Merkorn".

## Scaletta

| Tempo | Battuta | Cosa succede |
|---|---|---|
| 0,0 s | 1 | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,5 s | 2 | Il blocco si apre nella finestra: un foglio `ORDINI_def_v3 (copia) (2).xlsx` |
| 1,25 s | 3,5 | `#RIF!` nel totale lampeggia; note "CHIAMARE!!", "URGENTE", righe colorate a mano |
| 1,5 s | 4 | La camera si allarga su tutta la finestra |
| 2,5 s | 6 | Il foglio si ripulisce e diventa scuro; le righe diventano la tabella degli ordini, gli stati scritti a mano etichette, le schede in basso il menu, il totale tre riquadri |
| 3,5 s | 8 | Compaiono titolo "Ordini", filtri, riepiloghi e intestazioni |
| 5,5 s | 12 | Clic su "+ Nuovo ordine": entra l'ordine #1055 di Ristorante Da Pino, i contatori salgono |
| 7,5 s | 16 | Clic su "Magazzino": cambia la schermata |
| 9,0 s | 19 | Le teglie inox scendono da 30 a 18, sotto la scorta minima: l'etichetta diventa "Sotto scorta" |
| 11,0 s | 23 | Clic su "Fatture" |
| 12,5 s | 26 | Clic su "Emetti fattura": diventa "Inviata allo SdI" |
| 13,5 s | 28 | La fattura risulta "Consegnata"; i riepiloghi si aggiornano |
| 14,25 s | 29,5 | La camera si allontana |
| 14,75 s | 30,5 | La finestra si chiude nel blocco viola, il fondo diventa nero |
| 15,35 s | 31,7 | Gli altri quattro blocchi scendono e formano il marchio; sotto "powered by Merkorn" |
| 18,5 s | 38 | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

## Stile

Dal sito merkorn.com (`assets/style.css`): fondo `#08070B` con nebulosa viola, accento `#9747FF`, testo `#F2EFEA`, DM Sans per i titoli e Inter per il resto. Le schermate del gestionale riprendono le schermate d'esempio del sito (barra laterale con la voce attiva segnata in viola, filtri, riquadri, tabella, livello di scorta). Il marchio è la griglia a cinque blocchi; la chiusura riprende le storie "powered by Merkorn".

## Anteprima, verifica, rendering

```bash
SK=.claude/skills/motion-designer/scripts
export CHROME=/percorso/di/chrome          # facoltativo se Chrome è già installato
open docs/video/da-excel/src/index.html    # anteprima con cursore
node $SK/check.mjs docs/video/da-excel/src/index.html
node $SK/render.mjs video docs/video/da-excel/src/index.html docs/video/da-excel/out/merkorn-da-excel.mp4 --deband
node $SK/render.mjs stills docs/video/da-excel/src/index.html docs/video/da-excel/out/poster 6.6 --scale 2
python3 $SK/build_single.py docs/video/da-excel/src/index.html docs/video/da-excel/dist/merkorn-da-excel.html
```

La scena è in `src/scenes.js`; il marchio, la nebulosa e la chiusura in `src/brand.js`. Ogni fotogramma è calcolato dal tempo, quindi il video si rigenera sempre identico.

## Fonti e diritti

- Caratteri: DM Sans e Inter, dagli asset del sito Merkorn (entrambi SIL Open Font License).
- Logo: fornito da Merkorn, in `assets/brand/`.
- Dati: tutti i nomi, gli importi, i codici articolo e i numeri d'ordine e di fattura sono inventati. "Rossi Forniture" è un cliente di fantasia.
- Le schermate sono illustrative: mostrano il tipo di gestionale che Merkorn sviluppa, non il software di un cliente reale.
- Musica: nessuna per ora.
