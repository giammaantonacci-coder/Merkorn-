# Merkorn · Prima l'analisi

Video orizzontale 1920 × 1080, 60 fps, 28 s, senza audio. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

Il metodo Merkorn in quattro fasi, con i titoli del sito: si segue un ordine dall'ufficio al magazzino e si segnano i punti dove i dati si ricopiano a mano; poi le fondamenta, i componenti su misura e una schermata per ogni attività.

## Scaletta

| Tempo | Cosa succede |
|---|---|
| 0,0 s | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,5 s | Il blocco si apre nella finestra "Mappa del processo · Rossi Forniture" |
| 1,3 s | Fase 1 · Analisi, "Studiamo come lavorate": entrano i reparti (Cliente, Ufficio, Magazzino, Spedizione, Amministrazione) con lo strumento di oggi; i collegamenti si disegnano |
| 3,6 s | Un ordine parte dal cliente e si ferma in ogni reparto; tra Ufficio e Magazzino, Magazzino e Spedizione, Spedizione e Amministrazione compare "ricopiato a mano" e il collegamento diventa rosso |
| 8,6 s | Fase 2 · Fondamenta, "Partiamo da moduli collaudati": Anagrafiche, Permessi, Stampe, Contabilità, ognuna con la sua spunta |
| 11,6 s | Fase 3 · Su misura, "Sviluppiamo le parti specifiche": le etichette rosse diventano Commesse, Documenti di trasporto, Consegne; i collegamenti diventano viola |
| 13,0 s | L'ordine attraversa tutti i reparti in un solo passaggio; gli strumenti cambiano (Ordini in ufficio, Tablet in reparto, App per le consegne, Fatturazione collegata) |
| 15,8 s | Fase 4 · Interfaccia, "Una schermata per ogni attività": ogni reparto si apre nella sua schermata (tabella degli ordini, pulsante grande "Prelievo fatto", telefono con "Firma cliente", fattura consegnata) |
| 20,9 s | La camera arretra lentamente, in un unico movimento |
| 23,0 s | La finestra si chiude nel blocco viola, il fondo diventa nero |
| 23,6 s | Il marchio si forma; sotto "powered by Merkorn" |
| 27,0 s | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

## Stile

Come gli altri due video: fondo `#08070B` con nebulosa viola, accento `#9747FF`, DM Sans e Inter dal sito merkorn.com, marchio a cinque blocchi e chiusura "powered by Merkorn". Le etichette di fase riprendono lo stile delle sezioni del sito (maiuscolo spaziato, in viola).

## Anteprima, verifica, rendering

```bash
SK=.claude/skills/motion-designer/scripts
node $SK/check.mjs docs/video/analisi/src/index.html
node $SK/render.mjs video docs/video/analisi/src/index.html docs/video/analisi/out/merkorn-analisi.mp4 --deband
node $SK/render.mjs stills docs/video/analisi/src/index.html docs/video/analisi/out/poster 14.6 --scale 2
python3 $SK/build_single.py docs/video/analisi/src/index.html docs/video/analisi/dist/merkorn-analisi.html
```

## Fonti e diritti

- Testi delle fasi e dei moduli: dal sito merkorn.com ("Quattro fasi, sempre nello stesso ordine", "Seguiamo un ordine dall'ufficio al magazzino e annotiamo dove i dati si ricopiano a mano").
- Caratteri: DM Sans e Inter dagli asset del sito (SIL Open Font License). Logo fornito da Merkorn.
- Il cliente, il processo, gli ordini e gli importi sono inventati; le schermate sono illustrative.
- Musica: nessuna per ora.
