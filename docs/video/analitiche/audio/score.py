"""Merkorn · Analitiche: the film's original bed, synthesized here (nothing sampled or downloaded).

A minor, 120 BPM, 19 bars = 38 s, exactly the film's length, and it loops: the last bar is the same
dark Am pad the first bar opens with, and the reverb tail past the end is folded back onto the start.

Sections follow the picture:
  bar 1-3   (0-6 s)    logo and bars: pad, sub, a half-time kick from 2 s, hats from 4 s
  bar 4-9   (6-18 s)   the dashboard: full groove, bass with sidechain, arpeggio from 10 s
  bar 10-11 (18-22 s)  build: riser, accelerating claps, brightness rising, kick out for the last beat
  bar 12-15 (22-30 s)  drop on the new order: full, brighter, open hats
  bar 16    (30-32 s)  the fold: breakdown and a reverse swell into the logo
  bar 17-19 (32-38 s)  end card: the Am pad alone, as at the start

Run: uv run --with numpy python3 audio/score.py   (writes audio/bed.wav)
"""
from pathlib import Path
import wave

import numpy as np

SR, BPM, BARS = 44100, 120, 19
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
    return PROG[0] if bar >= 16 else PROG[bar % 4]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def brightness(bar):
    if bar < 3: return 0.12
    if bar < 9: return 0.32
    if bar < 11: return 0.32 + 0.45 * (bar - 8) / 2
    if bar < 15: return 0.62
    if bar < 16: return 0.25
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

for bar in list(range(0, 3)) + list(range(16, 19)):
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
    if 1 <= bar <= 2:  # half-time kick under the bars and the type
        for b in (0, 2): kick(t0 + b * BEAT, 0.7)
    if bar == 2:
        for b in range(4): hat(t0 + b * BEAT + BEAT / 2, gain=0.7)
    if 3 <= bar <= 14:
        drop = bar >= 11
        for b in range(4):
            if bar == 10 and b == 3: continue  # the breath before the drop
            kick(t0 + b * BEAT, 1.1 if drop else 1.0)
            hat(t0 + b * BEAT + BEAT / 2, open_=drop, gain=0.9 if drop else 0.8, pan=0.25)
            if drop: hat(t0 + b * BEAT + BEAT / 4 * 3, gain=0.35, pan=-0.25)
        for b in (1, 3):
            if not (bar == 10 and b == 3): clap(t0 + b * BEAT)
        pattern = [0, 0, 12, 0, 0, 7, 12, 0]
        for e8 in range(8):
            bass_note(root + pattern[e8], t0 + e8 * BEAT / 2, BEAT / 2 * 0.9, 1.15 if drop else 1.0)
        if bar >= 5:  # arpeggio, two octaves up through the chord
            arp = sorted(set(notes)) + [n + 12 for n in sorted(set(notes))]
            for s16 in range(16):
                m = arp[(s16 * 3) % len(arp)] + 12
                pluck(m, t0 + s16 * BEAT / 4, gain=(1.0 if drop else 0.6) * (1.2 if s16 % 4 == 0 else 0.8), pan=0.4 * (1 if s16 % 2 else -1))
    if bar == 10:  # build: claps accelerate into the drop
        for i, d in enumerate(np.linspace(0, BAR - BEAT / 4, 16)):
            if d > BEAT * 2: clap(t0 + d, gain=0.35 + 0.6 * i / 15)

# riser into the drop (19-22 s)
n = int(3.0 * SR); t = np.arange(n) / SR
f = 120 * (1500 / 120) ** (t / 3.0)
ph = 2 * np.pi * np.cumsum(f) / SR
ris = (np.sin(ph) * 0.25 + rng.uniform(-1, 1, n) * 0.35 * (t / 3.0)) * (t / 3.0) ** 2
ris = np.diff(np.concatenate([[0], ris]))  * 6
add(ris * 0.12, 19.0)

# reverse swell into the logo (30-32 s)
n = int(2.0 * SR); t = np.arange(n) / SR
sw = np.zeros(n)
for m in [57, 64, 69, 72, 76]:
    sw += np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(4 * np.pi * hz(m) * t)
sw *= (t / 2.0) ** 3
add(sw * 0.03, 30.0, pan=0.0)

# a soft pluck motif on the end card
for i, m in enumerate([69, 76, 81, 84]):
    pluck(m, 32.0 + i * BEAT / 2, gain=0.7, pan=0.3 * (1 if i % 2 else -1))

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
