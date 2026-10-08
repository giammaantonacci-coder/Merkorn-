# Merkorn · Presentazione (reel 9:16)

Reel verticale 1080 × 1920, 60 fps, 34 s, con musica ed effetti sonori. È fatto per stare in evidenza sul profilo Instagram. Gira in loop: il primo e l'ultimo fotogramma sono lo stesso blocco viola.

Solo parole, in nero, bianco e viola. Racconta perché scegliere Merkorn attraverso i suoi punti di forza: il gestionale si adatta ai processi dell'azienda, la UX è curata, l'interfaccia è intuitiva e serve poca formazione.

## Scaletta

| Tempo | Cosa succede |
|---|---|
| 0,0 s | Fondo nero, alone viola, il blocco in cima al marchio |
| 0,5 s | Il blocco esplode a tutto schermo |
| 0,9 s | Due nastri di parole si incrociano a X: ORDINI · MAGAZZINO · PRODUZIONE · FATTURE · CLIENTI (bianco) e EXCEL · EMAIL · FOGLI · PROGRAMMI · PASSAGGI A MANO (viola). Sotto: "Fogli Excel. Programmi diversi. Passaggi a mano." |
| 4,6 s | I nastri si raddrizzano e si chiudono in una riga |
| 5,0 s | ORDINI, MAGAZZINO, PRODUZIONE e FATTURE arrivano dai quattro lati |
| 6,0 s | Si scontrano (drop della musica): lampo, onda viola, scossa. Le lettere esplodono e formano "tutto in UN UNICO SISTEMA." |
| 8,0 s | "Non siete voi a dovervi ADATTARE.": la cornice si stringe e schiaccia la parola |
| 10,0 s | Una lastra viola attraversa lo schermo: "Noi facciamo il contrario.", con "il contrario." che si ribalta |
| 11,6 s | "Il gestionale segue i vostri processi.": la cornice cresce fino a stare intorno a "processi.", poi tuffo in avanti |
| 13,0 s | "Software gestionale SU MISURA": la parola è stretta, il righello si disegna, la parola si allarga fino alla misura giusta. "per le PMI." |
| 16,0 s | "Perché Merkorn?" (secondo drop): le lettere cadono, poi la camera si tuffa nella "o" |
| 18,0 s | 01 "Su misura dei processi.": una riga viola scrive il testo. "Partiamo da come lavorate." |
| 20,0 s | 02 "UX curata.": le lettere cadono e rimbalzano. "Prima l'esperienza, poi il codice." |
| 22,0 s | 03 "Interfaccia intuitiva.": tre copie della riga si sovrappongono e ne resta una. "Una schermata, un compito." |
| 24,0 s | 04 "Poca formazione.": le due righe arrivano da lati opposti. "Chi lo usa sa subito cosa fare." |
| 26,0 s | Un cerchio viola si apre: "Il primo incontro è una chiacchierata. Senza impegno, in azienda o online." |
| 27,6 s | Il cerchio si chiude: "Prenota un appuntamento / merkorn.com", con la riga viola sotto |
| 29,0 s | La riga viola diventa il blocco; il marchio si forma, sotto "powered by Merkorn" |
| 32,8 s | La firma esce, il marchio si richiude nel blocco del primo fotogramma |

I tempi esatti sono in `timeline()` dentro `src/scenes.js`.

## Audio

- `audio/score.py`: la colonna sonora, sintetizzata in Python (numpy), originale, niente di scaricato. La minore, 120 BPM, 17 battute. Il drop sull'urto delle parole (6 s), una salita su "su misura", il secondo drop su "Perché Merkorn?" (16 s), una pausa sul primo incontro, il pad da solo sulla firma.
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
