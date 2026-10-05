# Merkorn · Da Excel al gestionale

Video orizzontale 1920 × 1080, 60 fps, 31 s, senza audio. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

Un foglio di calcolo caotico si ripulisce e diventa un gestionale su misura. L'ordine appena inserito scala il magazzino e diventa una fattura elettronica. Chiude con la firma "powered by Merkorn".

## Scaletta

| Tempo | Cosa succede |
|---|---|
| 0,0 s | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,5 s | Il blocco si apre nella finestra: un foglio `ORDINI_def_v3 (copia) (2).xlsx`, con note "CHIAMARE!!", "URGENTE" e righe colorate a mano |
| 1,4 s | La camera si avvicina molto all'ultima riga |
| 2,1 s | Qualcuno la compila cella per cella: 1054, Idraulica Costa, 17/09, Raccordi ottone, 300, 1.290,00, consegnato. La camera segue il cursore di cella in cella |
| 6,4 s | Il cursore va sul totale e si scrive `=SOMMA(F2:F15)+F17-F3`; la camera si avvicina ancora |
| 8,1 s | Invio: compare `#RIF!`, l'inquadratura trema per mezzo secondo |
| 8,6 s | Zoom out: il foglio diventa piccolo al centro e si scurisce |
| 9,4 s | Grande scritta: "Riduci gli errori." |
| 11,4 s | Si apre il gestionale: la scritta esce, la camera torna avanti mentre il foglio si ripulisce e diventa la schermata Ordini |
| 12,4 s | Compaiono titolo "Ordini", filtri, riepiloghi e intestazioni |
| 14,4 s | Clic su "+ Nuovo ordine": entra l'ordine #1055 di Ristorante Da Pino, i contatori salgono |
| 16,4 s | Clic su "Magazzino" |
| 17,9 s | Le teglie inox scendono da 30 a 18, sotto la scorta minima: "Sotto scorta" |
| 19,9 s | Clic su "Fatture" |
| 21,4 s | Clic su "Emetti fattura": diventa "Inviata allo SdI" |
| 22,4 s | La fattura risulta "Consegnata"; i riepiloghi si aggiornano |
| 22,9 s | Il puntatore si allontana e svanisce; la camera arretra lentamente, in un unico movimento |
| 25,4 s | La finestra si chiude nel blocco viola, il fondo diventa nero |
| 26,0 s | Gli altri quattro blocchi scendono e formano il marchio; sotto "powered by Merkorn" |
| 29,2 s | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

I tempi esatti sono in `timeline()` dentro `src/scenes.js`.

## Stile

Dal sito merkorn.com (`assets/style.css`): fondo `#08070B` con nebulosa viola, accento `#9747FF`, testo `#F2EFEA`, DM Sans per i titoli e Inter per il resto. Le schermate del gestionale riprendono le schermate d'esempio del sito (barra laterale con la voce attiva segnata in viola, filtri, riquadri, tabella, livello di scorta). Il marchio è la griglia a cinque blocchi; la chiusura riprende le storie "powered by Merkorn".

## Anteprima, verifica, rendering

```bash
SK=.claude/skills/motion-designer/scripts
export CHROME=/percorso/di/chrome          # facoltativo se Chrome è già installato
open docs/video/da-excel/src/index.html    # anteprima con cursore
node $SK/check.mjs docs/video/da-excel/src/index.html
node $SK/render.mjs video docs/video/da-excel/src/index.html docs/video/da-excel/out/merkorn-da-excel.mp4 --deband
node $SK/render.mjs stills docs/video/da-excel/src/index.html docs/video/da-excel/out/poster 15.0 --scale 2
python3 $SK/build_single.py docs/video/da-excel/src/index.html docs/video/da-excel/dist/merkorn-da-excel.html
```

La scena è in `src/scenes.js`; il marchio, la nebulosa e la chiusura in `src/brand.js`. Ogni fotogramma è calcolato dal tempo, quindi il video si rigenera sempre identico.

## Fonti e diritti

- Caratteri: DM Sans e Inter, dagli asset del sito Merkorn (entrambi SIL Open Font License).
- Logo: fornito da Merkorn, in `assets/brand/`.
- Dati: tutti i nomi, gli importi, i codici articolo e i numeri d'ordine e di fattura sono inventati. "Rossi Forniture" è un cliente di fantasia.
- Le schermate sono illustrative: mostrano il tipo di gestionale che Merkorn sviluppa, non il software di un cliente reale.
- Musica: nessuna per ora.
