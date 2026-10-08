"""Merkorn · Presentazione: la colonna sonora del video, sintetizzata qui (niente di campionato o scaricato).

La minore, 120 BPM, 17 battute = 34 s, esattamente la durata del video, e gira in loop: l'ultima battuta è lo
stesso pad di La minore con cui si apre la prima, e la coda del riverbero oltre la fine viene ripiegata sull'inizio.

Le sezioni seguono le immagini:
  battuta 1     (0-2 s)    blocco viola e nastri di parole: pad, sub, cassa dimezzata da 1 s
  battute 2-3   (2-6 s)    nastri: groove leggero, basso, hi-hat
  battute 4-7   (6-14 s)   drop sull'urto "un unico sistema": groove pieno con arpeggio
  battuta 8     (14-16 s)  salita su "su misura": riser, clap che accelerano, la cassa tace sull'ultimo tempo
  battute 9-13  (16-26 s)  secondo drop su "Perché Merkorn?" e i quattro motivi: pieno, più brillante
  battuta 14    (26-28 s)  il primo incontro: pausa a metà tempo
  battuta 15    (28-30 s)  risucchio verso il marchio
  battute 16-17 (30-34 s)  firma: il pad di La minore da solo, come all'inizio

Uso: uv run --with numpy python3 audio/score.py   (scrive audio/bed.wav)
"""
from pathlib import Path
import wave

import numpy as np

SR, BPM, BARS = 44100, 120, 17
BEAT = 60 / BPM
BAR = 4 * BEAT
L = BARS * BAR
N = int(round(L * SR))
rng = np.random.default_rng(7)

PROG = [  # (bass root midi, pad notes) per bar, cycling Am F C G; the last three bars stay on Am
    (45, [57, 60, 64, 67, 71]),  # Am9
    (41, [53, 57, 60, 64, 69]),  # Fmaj7
    (48, [55, 60, 64, 67, 72]),  # C
    (43, [55, 59, 62, 67, 71]),  # G
]


def chord(bar):
    return PROG[0] if bar >= 14 else PROG[bar % 4]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def brightness(bar):
    if bar < 1: return 0.12
    if bar < 3: return 0.22
    if bar < 7: return 0.36
    if bar < 8: return 0.4 + 0.3 * (bar - 6)
    if bar < 13: return 0.66
    if bar < 14: return 0.3
    return 0.12


out = np.zeros((2, N + 4 * SR))


def add(sig, start, pan=0.0, gain=1.0):
    i = int(round(start * SR))
    if i < 0:
        sig, i = sig[-i:], 0
    n = len(sig)
    out[0, i:i + n] += sig * gain * np.sqrt(0.5 * (1 - pan))
    out[1, i:i + n] += sig * gain * np.sqrt(0.5 * (1 + pan))


def env_adsr(n, a, r, sustain_end):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    rel = np.clip((t - sustain_end) / r, 0, 1)
    return e * (1 - rel)


# ---- pad: detuned additive saws, brightness per bar ----
for bar in range(BARS):
    _, notes = chord(bar)
    b = brightness(bar)
    dur = BAR + 0.6
    n = int(dur * SR)
    t = np.arange(n) / SR
    first, last = bar == 0, bar == BARS - 1
    # the first bar is already sounding (no attack) and the last one runs through the loop point
    e = env_adsr(n, 0.0001 if first else 0.35, 0.6, BAR)
    if last:
        e = np.minimum(1, t / 0.35)
    for side, det in ((-1, -0.07), (1, 0.07)):
        sig = np.zeros(n)
        for m in notes:
            f = hz(m) * 2 ** (det / 12)
            for k in range(1, 18):
                if f * k > 9000: break
                amp = (1 / k) * np.exp(-k / (1.5 + 10 * b))
                sig += amp * np.sin(2 * np.pi * f * k * t + (k * 1.3 + m) % 6.28)
        sig *= e * 0.022 * (1 + 0.04 * np.sin(2 * np.pi * 0.25 * t))
        add(sig, bar * BAR, pan=0.55 * side)

# ---- sub drone in the opening and the ending, bass line in the groove ----
def sub(m, start, dur, gain):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(m - 12) * t) * env_adsr(n, 0.2, 0.4, dur - 0.4) * gain
    add(s, start)

for bar in [0] + list(range(13, 17)):
    sub(chord(bar)[0], bar * BAR, BAR + 0.4, 0.10)

kicks = []
def kick(at, gain=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / 0.028)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.2)
    s[: int(0.003 * SR)] += rng.uniform(-1, 1, int(0.003 * SR)) * 0.4
    add(np.tanh(1.6 * s) * 0.42 * gain, at)
    kicks.append(at)

def hat(at, open_=False, gain=1.0, pan=0.2):
    n = int((0.16 if open_ else 0.05) * SR); t = np.arange(n) / SR
    x = rng.uniform(-1, 1, n + 2)
    x = np.diff(np.diff(x))
    s = x * np.exp(-t / (0.06 if open_ else 0.012))
    add(s * 0.05 * gain, at, pan=pan)

def clap(at, gain=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR
    x = rng.uniform(-1, 1, n)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    X[(fr < 900) | (fr > 4200)] = 0
    x = np.fft.irfft(X, n)
    e = np.exp(-t / 0.09) * 0.6
    for d in (0, 0.011, 0.022):
        e += np.where(t >= d, np.exp(-(t - d) / 0.006), 0)
    add(x * e * 0.16 * gain, at, pan=-0.1)

def bass_note(m, at, dur, gain=1.0):
    n = int((dur + 0.05) * SR); t = np.arange(n) / SR
    f = hz(m - 12)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    e = env_adsr(n, 0.004, 0.04, dur) * (0.65 + 0.35 * np.exp(-t / 0.12))
    add(np.tanh(1.4 * s * e) * 0.15 * gain, at)

def pluck(m, at, gain=1.0, pan=0.0):
    n = int(0.5 * SR); t = np.arange(n) / SR
    f = hz(m)
    s = sum((1 / k) * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (7 + 5 * k)) for k in range(1, 5))
    add(s * 0.05 * gain, at, pan=pan)

for bar in range(BARS):
    t0 = bar * BAR
    root, notes = chord(bar)
    if bar == 0:  # cassa dimezzata dal blocco che esplode
        for b in (1, 2, 3): kick(t0 + b * BEAT, 0.6)
    if 1 <= bar <= 2:  # nastri: groove leggero
        for b in range(4):
            kick(t0 + b * BEAT, 0.8)
            hat(t0 + b * BEAT + BEAT / 2, gain=0.7, pan=0.25)
        for e8 in range(8):
            bass_note(root + [0, 0, 12, 0, 0, 7, 12, 0][e8], t0 + e8 * BEAT / 2, BEAT / 2 * 0.9, 0.8)
    if 3 <= bar <= 12:
        drop = bar >= 8
        for b in range(4):
            if bar == 7 and b == 3: continue  # il respiro prima di "Perché Merkorn?"
            kick(t0 + b * BEAT, 1.1 if drop else 1.0)
            hat(t0 + b * BEAT + BEAT / 2, open_=drop, gain=0.9 if drop else 0.8, pan=0.25)
            if drop or bar >= 5: hat(t0 + b * BEAT + BEAT / 4 * 3, gain=0.35, pan=-0.25)
        for b in (1, 3):
            if not (bar == 7 and b == 3): clap(t0 + b * BEAT)
        pattern = [0, 0, 12, 0, 0, 7, 12, 0]
        for e8 in range(8):
            bass_note(root + pattern[e8], t0 + e8 * BEAT / 2, BEAT / 2 * 0.9, 1.15 if drop else 1.0)
        arp = sorted(set(notes)) + [n + 12 for n in sorted(set(notes))]
        for s16 in range(16):
            m = arp[(s16 * 3) % len(arp)] + 12
            pluck(m, t0 + s16 * BEAT / 4, gain=(1.0 if drop else 0.6) * (1.2 if s16 % 4 == 0 else 0.8), pan=0.4 * (1 if s16 % 2 else -1))
    if bar == 7:  # salita: i clap accelerano
        for i, d in enumerate(np.linspace(0, BAR - BEAT / 4, 16)):
            if d > BEAT * 2: clap(t0 + d, gain=0.35 + 0.6 * i / 15)
    if bar == 13:  # il primo incontro: metà tempo
        for b in (0, 2): kick(t0 + b * BEAT, 0.7)
        for b in range(4): hat(t0 + b * BEAT + BEAT / 2, gain=0.5)
        for i, m in enumerate([69, 72, 76, 79]): pluck(m, t0 + i * BEAT, gain=0.7, pan=0.3 * (1 if i % 2 else -1))

# riser verso l'urto (4.5-6 s)
n = int(1.5 * SR); t = np.arange(n) / SR
f = 200 * (1200 / 200) ** (t / 1.5)
ris = (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.2 + rng.uniform(-1, 1, n) * 0.3 * (t / 1.5)) * (t / 1.5) ** 2
add(np.diff(np.concatenate([[0], ris])) * 6 * 0.1, 4.5)

# riser verso il secondo drop (13-16 s)
n = int(3.0 * SR); t = np.arange(n) / SR
f = 120 * (1500 / 120) ** (t / 3.0)
ph = 2 * np.pi * np.cumsum(f) / SR
ris = (np.sin(ph) * 0.25 + rng.uniform(-1, 1, n) * 0.35 * (t / 3.0)) * (t / 3.0) ** 2
ris = np.diff(np.concatenate([[0], ris]))  * 6
add(ris * 0.12, 13.0)

# risucchio verso il marchio (27.6-29.6 s)
n = int(2.0 * SR); t = np.arange(n) / SR
sw = np.zeros(n)
for m in [57, 64, 69, 72, 76]:
    sw += np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(4 * np.pi * hz(m) * t)
sw *= (t / 2.0) ** 3
add(sw * 0.03, 27.6, pan=0.0)

# un motivo leggero sulla firma
for i, m in enumerate([69, 76, 81, 84]):
    pluck(m, 29.6 + i * BEAT / 2, gain=0.7, pan=0.3 * (1 if i % 2 else -1))

# ---- sidechain: everything ducks a little on each kick, the bass most ----
duck = np.ones(out.shape[1])
for k in kicks:
    i = int(k * SR); n = int(0.4 * SR)
    seg = 1 - 0.35 * np.exp(-np.arange(n) / (0.09 * SR))
    duck[i:i + n] = np.minimum(duck[i:i + n], seg)
out *= duck

# ---- reverb: a 2.4 s stereo tail, convolved by FFT ----
ir_n = int(2.4 * SR); tt = np.arange(ir_n) / SR
wet = np.zeros_like(out)
size = 1 << int(np.ceil(np.log2(out.shape[1] + ir_n)))
for ch in range(2):
    ir = rng.uniform(-1, 1, ir_n) * np.exp(-tt / 0.55)
    ir = np.convolve(ir, np.ones(6) / 6, mode="same")
    ir[0] = 0
    y = np.fft.irfft(np.fft.rfft(out[ch], size) * np.fft.rfft(ir, size), size)[: out.shape[1]]
    wet[ch] = y
mix = out + 0.18 * wet / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(out))

# fold everything past the end back onto the start: the loop has no seam
final = mix[:, :N].copy()
tail = mix[:, N:]
final[:, : tail.shape[1]] += tail[:, : N]
final /= np.max(np.abs(final)) / 0.8
pcm = (np.clip(final.T, -1, 1) * 32767).astype("<i2")
path = Path(__file__).with_name("bed.wav")
with wave.open(str(path), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"{path}: {N / SR:.3f} s")
