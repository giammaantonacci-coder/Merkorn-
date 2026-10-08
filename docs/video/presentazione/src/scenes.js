film({ W: 1080, H: 1920, BPM: 120, BEATS: 68 });

// Merkorn, video di presentazione per il profilo Instagram (in evidenza): solo parole, in nero, bianco e viola.
// Le parole si incrociano, si scontrano, si uniscono e raccontano che cosa fa Merkorn e perché sceglierla.
// Tutti i testi vengono dal sito merkorn.com. Parte e finisce sullo stesso blocco viola, così gira in loop.

const INK = "#F2EFEA", INK2 = "#A7A2AE", VIO = "#9747FF", VIO2 = "#B57BFF", BLK = "#050407";
const MID = { x: FILM.W / 2, y: FILM.H / 2 };

const K = {};
function timeline() {
  Object.assign(K, { open: B(2) });
  // 1. le parole del lavoro di ogni giorno si incrociano su due nastri
  K.s1 = 0.85; K.lines = [1.6, 2.3, 3.0]; K.bandsOut = 4.55;
  // 2. ordini, magazzino, produzione e fatture si scontrano: un unico sistema (sul drop della musica)
  K.s2 = 5.0; K.hit = 6.0; K.s2out = 7.7;
  // 3. molti gestionali vi chiedono di adattarvi; noi facciamo il contrario
  K.s3 = 8.0; K.squeeze = 8.95; K.wipe = 10.0; K.swap = 10.24; K.flip = 10.45; K.s3bOut = 11.3; K.s3c = 11.55; K.grow = 11.85; K.s3out = 12.65;
  // 4. su misura: la parola si allarga fino alla misura del righello
  K.s4 = 13.0; K.ruler = 13.45; K.fit = 14.0; K.pmi = 14.55; K.s4out = 15.7;
  // 5. perché Merkorn, poi quattro motivi (sul secondo drop)
  K.s5 = 16.0; K.dive = 17.45; K.r = [18.0, 20.0, 22.0, 24.0];
  // 6. il primo incontro, il sito, poi la firma
  K.cta = 26.0; K.site = 27.6; K.close = 29.0;
  K.out = K.close + 0.6 + 3.2;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const WORDS = {};
const ALL = [];

// una parola (o una riga) centrata nel punto che le si dà; con letters le lettere si muovono una per una
function word(k, text, size, { color = INK, weight = 800, track = -0.045, letters = false, maxW = 960 } = {}) {
  const css = `font-family:var(--display);letter-spacing:${track}em`;
  const w0 = measure(text, size, weight, css);
  const fs = w0 > maxW ? Math.floor(size * maxW / w0) : size;
  const w = measure(text, fs, weight, css);
  const chars = [...text];
  const off = letters ? chars.map((c, i) => measure(chars.slice(0, i).join(""), fs, weight, css) + measure(c, fs, weight, css) / 2 - w / 2) : [];
  WORDS[k] = { text, size: fs, w, off, n: chars.length };
  ALL.push(k);
  const inner = letters ? chars.map((c, i) => `<span data-k="${k}_${i}" style="display:inline-block;white-space:pre">${esc(c)}</span>`).join("") : esc(text);
  return `<div class="abs" data-k="${k}" style="left:0;top:0;white-space:nowrap;font-family:var(--display);font-size:${fs}px;font-weight:${weight};letter-spacing:${track}em;line-height:1.15;color:${color}">${inner}</div>`;
}

function put(k, x, y, { s = 1, sx = 1, sy = 1, r = 0, o = 1, rx = 0 } = {}) {
  const el = $[k], on = o > 0.002 && Math.abs(s * sx * sy) > 1e-4;
  show(el, on);
  if (!on) return;
  el.style.opacity = o >= 1 ? "" : o.toFixed(3);
  const flip = rx ? ` perspective(1400px) rotateX(${rx.toFixed(2)}deg)` : "";
  setT(el, `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) translate(-50%,-50%)${flip} rotate(${r.toFixed(2)}deg) scale(${(s * sx).toFixed(4)},${(s * sy).toFixed(4)})`);
}

// f(i, off) → { x, y, r, s, o } in punti relativi al posto della lettera
function letters(k, f) {
  const w = WORDS[k];
  for (let i = 0; i < w.n; i++) {
    const v = f(i, w.off[i]), el = $[`${k}_${i}`];
    setT(el, `translate(${(v.x || 0).toFixed(2)}px,${(v.y || 0).toFixed(2)}px) rotate(${(v.r || 0).toFixed(2)}deg) scale(${(v.s ?? 1).toFixed(4)})`);
    el.style.opacity = (v.o ?? 1).toFixed(3);
  }
}

const sp = (t, t0, r = 0.5, d = 0.86, max = 1.08) => clamp(spring(t, t0, r, d), 0, max);
// uscita veloce verso l'alto
const away = (t, t0, d = 0.28) => prog(t, t0, d, E.in);
const div = (k, css) => { ALL.push(k); return `<div class="abs" data-k="${k}" style="left:0;top:0;${css}"></div>`; };

const BAND_A = "ORDINI · MAGAZZINO · PRODUZIONE · FATTURE · CLIENTI · ";
const BAND_B = "EXCEL · EMAIL · FOGLI · CARTA · TELEFONATE · ";
const BAND = { w: 2800, h: 172, size: 106 };
const REASONS = [
  ["01", "Partiamo da", "come lavorate.", "Prima l'analisi, poi il codice."],
  ["02", "Moduli", "collaudati.", "Meno tempi, meno costi."],
  ["03", "Dati inseriti", "una volta sola.", "Collegato alla fatturazione elettronica."],
  ["04", "Lo stesso team,", "anche dopo.", "Assistenza ed evoluzione del software."],
];
const RULER = { y: 1072, h: 46, ticks: 20 };

function build(stage) {
  timeline();
  stage.innerHTML = `${nebulaHtml()}${lockupBackHtml()}<div class="full" data-k="cam"></div><div class="full" data-k="top"></div><div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);
  const bandCss = (bg) => `width:${BAND.w}px;height:${BAND.h}px;left:${MID.x - BAND.w / 2}px;top:${MID.y - BAND.h / 2}px;background:${bg};overflow:hidden;transform-origin:50% 50%`;
  const track = (k, text, color) => `<div class="abs" data-k="${k}" style="left:0;top:0;height:${BAND.h}px;white-space:nowrap;font-family:var(--display);font-size:${BAND.size}px;font-weight:800;letter-spacing:-.03em;line-height:${BAND.h}px;color:${color}">${esc(text.repeat(6))}</div>`;
  const s5 = [word("why1", "Perché", 150), word("why2", "Merkorn?", 210, { color: VIO, letters: true })].join("");
  const html = [
    // 1
    `<div class="abs" data-k="bandA" style="${bandCss(INK)}">${track("trA", BAND_A, BLK)}</div>`,
    `<div class="abs" data-k="bandB" style="${bandCss(VIO)}">${track("trB", BAND_B, INK)}</div>`,
    word("l0", "Fogli Excel.", 100), word("l1", "Programmi diversi.", 100), word("l2", "Passaggi a mano.", 100, { color: VIO2 }),
    // 2
    word("w0", "ORDINI", 120), word("w1", "MAGAZZINO", 120, { color: VIO2 }), word("w2", "PRODUZIONE", 120, { color: VIO2 }), word("w3", "FATTURE", 120),
    div("ring", `border-radius:50%;border:8px solid ${VIO}`),
    word("u0", "tutto in", 70, { color: INK2, weight: 600, track: -0.02 }),
    word("u1", "UN UNICO", 170, { letters: true }), word("u2", "SISTEMA.", 200, { color: VIO, letters: true }),
    // 3
    word("a0", "Molti gestionali", 100), word("a1", "vi chiedono di", 80, { color: INK2, weight: 600, track: -0.02 }),
    div("box", `border:7px solid ${INK}`), word("a2", "ADATTARVI.", 140),
    div("slab", `width:1500px;height:2900px;background:${VIO}`),
    word("b0", "Noi facciamo", 112), word("b1", "il contrario.", 160, { color: VIO }),
    word("c0", "Il software", 108), word("c1", "si adatta", 108),
    div("box2", `border:7px solid ${VIO}`), word("c2", "a voi.", 180, { color: VIO }),
    // 4
    word("m0", "Software gestionale", 72, { color: INK2, weight: 600, track: -0.02, letters: true }),
    word("m1", "SU MISURA", 190, { maxW: 920 }),
    `<div class="abs" data-k="ruler" style="left:0;top:0;width:${FILM.W}px;height:${FILM.H}px">${Array.from({ length: RULER.ticks + 1 }, (_, i) => `<i class="abs" data-k="tick${i}" style="width:4px;background:${INK}"></i>`).join("")}<i class="abs" data-k="rulerBase" style="height:4px;background:${INK}"></i></div>`,
    div("endL", `width:8px;height:120px;border-radius:4px;background:${VIO}`), div("endR", `width:8px;height:120px;border-radius:4px;background:${VIO}`),
    word("m2", "per le PMI.", 124, { color: VIO }),
    // 5
    `<div class="full" data-k="s5g">${s5}</div>`,
    ...REASONS.flatMap(([n, a, b, c], i) => [
      word(`ri${i}`, n, 140, { color: VIO, track: -0.02 }),
      word(`ra${i}`, a, 130, { letters: i === 1 }),
      word(`rb${i}`, b, 150, { color: VIO2, letters: i === 1 }),
      word(`rc${i}`, c, 50, { color: INK2, weight: 500, track: -0.01 }),
    ]),
    div("scan", `width:8px;height:400px;border-radius:4px;background:${VIO};box-shadow:0 0 30px 6px rgba(151,71,255,.7)`),
    word("g0", "una volta sola.", 150, { color: VIO }), word("g1", "una volta sola.", 150, { color: INK }),
    // 6
    `<div class="full" data-k="ctaBg" style="background:${VIO}">${[
      word("k0", "Il primo incontro", 100, { color: BLK }),
      word("k1", "è una chiacchierata.", 104, { color: INK }),
      word("k2", "Senza impegno, in azienda o online.", 44, { color: BLK, weight: 600, track: -0.01 }),
    ].join("")}</div>`,
    word("site0", "Prenota un appuntamento", 50, { color: INK2, weight: 600, track: -0.01 }),
    word("site1", "merkorn.com", 140, { letters: true }),
  ].join("");
  $.cam.innerHTML = html;
  $.top.innerHTML = div("flash", `width:${FILM.W}px;height:${FILM.H}px;background:${INK}`) + div("burst", `background:${VIO}`) + div("uline", `background:${VIO}`);
  collect(stage);
  ALL.push("s5g", "ctaBg", "ruler", "bandA", "bandB");
  layoutLockup(MID.x, MID.y, 1);
  BAND.pA = measure(BAND_A, BAND.size, 800, "font-family:var(--display);letter-spacing:-.03em");
  BAND.pB = measure(BAND_B, BAND.size, 800, "font-family:var(--display);letter-spacing:-.03em");
}

// ---- camera: una lenta spinta in avanti dentro ogni scena, e una scossa sugli urti ----
const SECTIONS = () => [K.s1, K.s2, K.s3, K.s4, K.s5, ...K.r, K.cta];
function shakeAt(t, t0, amp) {
  const d = t - t0;
  if (d < 0 || d > 0.6) return [0, 0];
  const s = amp * Math.exp(-d / 0.12);
  return [s * Math.sin(2 * Math.PI * 23 * d), 0.6 * s * Math.sin(2 * Math.PI * 31 * d + 1.1)];
}
function placeCam(t) {
  const st = SECTIONS();
  let z = 1;
  for (let i = 0; i < st.length - 1; i++) if (t >= st[i] && t < st[i + 1]) z = 1 + 0.035 * (t - st[i]) / (st[i + 1] - st[i]);
  const shakes = [shakeAt(t, K.hit, 26), shakeAt(t, K.squeeze + 0.05, 8), shakeAt(t, K.fit + 0.02, 12), shakeAt(t, K.r[1] + 0.45, 14)];
  const dx = shakes.reduce((a, s) => a + s[0], 0), dy = shakes.reduce((a, s) => a + s[1], 0);
  $.cam.style.transformOrigin = "50% 50%";
  setT($.cam, `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) scale(${z.toFixed(5)})`);
}

// ---- 0: il blocco viola esplode a tutto schermo ----
function applyBurst(t) {
  const full = { x: 0, y: 0, w: FILM.W, h: FILM.H, r: 0 };
  if (t < K.open || t >= K.s1 + 0.6) return;
  const p = prog(t, K.open, 0.38, E.inOut);
  const b = $.burst;
  show(b, true);
  rectCss(b, mixRect(LOCK.top, full, p));
  b.style.opacity = (1 - prog(t, K.s1, 0.5, E.out)).toFixed(3);
}

// ---- 1: due nastri di parole si incrociano ----
function applyBands(t) {
  if (t < K.s1 || t >= K.s2) return;
  const c = prog(t, K.bandsOut, 0.42, E.inOut);
  const run = 280 * (t - K.s1) + 520 * Math.max(0, t - 3.4) ** 2;
  [["bandA", "trA", -13, -1, BAND.pA, 0], ["bandB", "trB", 13, 1, BAND.pB, 0.12]].forEach(([k, tr, rot, side, period, d]) => {
    const e = sp(t, K.s1 + d, 0.6, 0.84, 1.02);
    show($[k], true);
    $[k].style.opacity = (1 - prog(t, K.s2 - 0.1, 0.1)).toFixed(3);
    setT($[k], `translate(${(side * (1 - e) * 1900).toFixed(2)}px,0px) rotate(${(rot * (1 - c)).toFixed(3)}deg) scale(1,${lerp(1, 0.035, c).toFixed(4)})`);
    const x = side < 0 ? -(run % period) : -period + (run % period);
    setT($[tr], `translateX(${x.toFixed(2)}px)`);
  });
  K.lines.forEach((at, i) => {
    const e = sp(t, at, 0.42, 0.62, 1.12), o = away(t, K.bandsOut - 0.1 + i * 0.05);
    put("l" + i, MID.x, 1460 + i * 128 - o * 120, { s: lerp(0.55, 1, e), r: (1 - clamp(e)) * (i % 2 ? 7 : -7), o: clamp(e * 2) * (1 - o) });
  });
}

// ---- 2: quattro parole si scontrano e diventano un unico sistema ----
function applyMerge(t) {
  if (t < K.s2 || t >= K.s3) return;
  const from = [[MID.x, -160], [-700, 900], [1780, 1020], [MID.x, 2080]];
  const to = [[MID.x, 870], [MID.x - 60, 950], [MID.x + 60, 975], [MID.x, 1050]];
  for (let i = 0; i < 4; i++) {
    const p = prog(t, K.s2 + i * 0.07, K.hit - K.s2 - i * 0.07, E.in);
    if (t >= K.hit) continue;
    put("w" + i, lerp(from[i][0], to[i][0], p), lerp(from[i][1], to[i][1], p), { s: lerp(1.1, 0.5, p), r: (i % 2 ? 1 : -1) * 18 * (1 - p) + (i - 1.5) * 6 * p });
  }
  // urto: lampo bianco e onda viola
  const f = 1 - prog(t, K.hit, 0.18, E.out);
  if (t >= K.hit && f > 0) { show($.flash, true); $.flash.style.opacity = (0.85 * f).toFixed(3); }
  const rp = prog(t, K.hit, 0.75, E.out);
  if (t >= K.hit && rp < 1) {
    const R = lerp(30, 980, rp);
    show($.ring, true);
    rectCss($.ring, { x: MID.x - R, y: MID.y - R, w: 2 * R, h: 2 * R, r: R });
    $.ring.style.opacity = (1 - rp).toFixed(3);
    $.ring.style.borderWidth = lerp(30, 4, rp).toFixed(2) + "px";
  }
  if (t < K.hit) return;
  const o = away(t, K.s2out);
  const Y = [1048 - o * 260, 1222 - o * 230];
  ["u1", "u2"].forEach((k, j) => {
    put(k, MID.x, Y[j], { o: 1 - o });
    letters(k, (i, off) => {
      const e = sp(t, K.hit + 0.02 + (j * 8 + i) * 0.022, 0.55, 0.72, 1.1);
      const r0 = (((i + j * 3) * 53) % 70) - 35;
      return { x: lerp(-off, 0, e), y: lerp(MID.y - Y[j], 0, e), r: r0 * (1 - clamp(e)), s: lerp(0.15, 1, e), o: clamp(e * 3) };
    });
  });
  const e = sp(t, K.hit + 0.35, 0.5, 0.8);
  put("u0", MID.x, 880 - o * 280 + (1 - e) * 40, { o: clamp(e * 2) * (1 - o) });
}

// ---- 3: adattarvi (schiacciato), il contrario (si ribalta), il software si adatta a voi (la cornice cresce) ----
function applyAdapt(t) {
  if (t < K.s3 || t >= K.s4) return;
  if (t < K.swap) {
    const e0 = sp(t, K.s3, 0.55, 0.84), e1 = sp(t, K.s3 + 0.12, 0.55, 0.84), e2 = sp(t, K.s3 + 0.5, 0.45, 0.66, 1.12);
    put("a0", lerp(1700, MID.x, e0), 700, { r: (1 - clamp(e0)) * -6 });
    put("a1", lerp(1700, MID.x, e1), 818);
    const w = WORDS.a2.w, W0 = w + 90, q = sp(t, K.squeeze, 0.55, 0.5, 1.2);
    const bw = lerp(W0, W0 * 0.58, q), sx = (bw - 90) / w;
    put("a2", MID.x, 1000, { s: e2, sx, sy: 1 + 0.4 * (1 - sx) });
    if (e2 > 0.01) { show($.box, true); rectCss($.box, { x: MID.x - (bw * e2) / 2, y: 1000 - (196 * e2) / 2, w: bw * e2, h: 196 * e2, r: 20 }); }
  }
  // la lastra viola attraversa lo schermo e cambia la scena
  const wp = prog(t, K.wipe, 0.5, E.inOut);
  if (wp > 0 && wp < 1) { show($.slab, true); setT($.slab, `translate(${lerp(-1700, 1300, wp).toFixed(2)}px,${(MID.y - 1450).toFixed(2)}px) rotate(14deg)`); }
  if (t >= K.swap && t < K.s3c) {
    const o = away(t, K.s3bOut);
    const e0 = sp(t, K.swap, 0.45, 0.7, 1.12), f = sp(t, K.flip, 0.7, 0.42, 1.3);
    put("b0", MID.x, 800 - o * 260, { s: lerp(0.7, 1, e0), o: clamp(e0 * 2) * (1 - o) });
    put("b1", MID.x, 975 - o * 240, { rx: 180 * (1 - f), o: (t >= K.flip ? 1 : 0) * (1 - o) });
  }
  if (t >= K.s3c) {
    const z = 1 + 4 * prog(t, K.s3out, 0.32, E.in), fade = 1 - prog(t, K.s3out + 0.1, 0.22);
    const at = (y) => MID.y + (y - MID.y) * z;
    const e0 = sp(t, K.s3c, 0.5, 0.8), e1 = sp(t, K.s3c + 0.1, 0.5, 0.8);
    put("c0", MID.x, at(780 + (1 - e0) * 60), { s: z, o: clamp(e0 * 2) * fade });
    put("c1", MID.x, at(900 + (1 - e1) * 60), { s: z, o: clamp(e1 * 2) * fade });
    const g = sp(t, K.grow, 0.6, 0.5, 1.25), w = WORDS.c2.w;
    const bw = lerp(60, w + 90, g), bh = lerp(60, 236, g);
    put("c2", MID.x, at(1095), { s: z * lerp(0.2, 1, sp(t, K.grow + 0.08, 0.5, 0.7)), o: fade * clamp(g * 3) });
    if (t >= K.grow - 0.1) {
      show($.box2, true);
      rectCss($.box2, { x: MID.x - (bw * z) / 2, y: at(1095) - (bh * z) / 2, w: bw * z, h: bh * z, r: 24 * z });
      $.box2.style.opacity = (fade * clamp((t - K.grow + 0.1) * 8)).toFixed(3);
    }
  }
}

// ---- 4: su misura, sul righello ----
function applyMeasure(t) {
  if (t < K.s4 || t >= K.s5) return;
  const o = prog(t, K.s4out, 0.3, E.in), dx = -1400 * o;
  put("m0", MID.x + dx, 760);
  letters("m0", (i) => { const e = sp(t, K.s4 + i * 0.022, 0.4, 0.7, 1.1); return { y: (1 - e) * 50, o: clamp(e * 2) }; });
  const W = WORDS.m1.w, x0 = MID.x - W / 2;
  const e = sp(t, K.s4 + 0.35, 0.45, 0.7, 1.1), fit = sp(t, K.fit, 0.5, 0.42, 1.35);
  put("m1", MID.x + dx, 950, { s: e, sx: lerp(0.52, 1, fit), sy: lerp(1.18, 1, fit) });
  const rp = prog(t, K.ruler, 0.55, E.inOut);
  if (rp > 0) {
    show($.ruler, true);
    setT($.ruler, `translateX(${dx.toFixed(2)}px)`);
    $.ruler.style.clipPath = `inset(0px ${(FILM.W - x0 - rp * W - 6).toFixed(2)}px 0px 0px)`;
    for (let i = 0; i <= RULER.ticks; i++) {
      const h = i % 5 === 0 ? RULER.h : RULER.h * 0.5;
      rectCss($["tick" + i], { x: x0 + (i * W) / RULER.ticks - 2, y: RULER.y, w: 4, h, r: 0 });
    }
    rectCss($.rulerBase, { x: x0, y: RULER.y, w: W, h: 4, r: 0 });
  }
  const m = sp(t, K.fit + 0.05, 0.4, 0.55, 1.2);
  if (t >= K.fit) [["endL", x0 - 22], ["endR", x0 + W + 14]].forEach(([k, x]) => {
    show($[k], true);
    rectCss($[k], { x: x + dx, y: 948 - 60 * m, w: 8, h: 120 * m, r: 4 });
  });
  const p = sp(t, K.pmi, 0.5, 0.75);
  put("m2", MID.x + dx, 1235 + (1 - p) * 70, { o: clamp(p * 2) });
}

// ---- 5: perché Merkorn, poi i quattro motivi ----
function applyWhy(t) {
  if (t < K.s5 || t >= K.cta) return;
  if (t < K.r[0]) {
    const e = sp(t, K.s5, 0.5, 0.78);
    put("why1", lerp(1700, MID.x, e), 860, { r: (1 - clamp(e)) * 8 });
    put("why2", MID.x, 1050);
    letters("why2", (i) => { const d = sp(t, K.s5 + 0.3 + i * 0.045, 0.5, 0.5, 1.2); return { y: (1 - d) * -900, r: (1 - clamp(d)) * (i % 2 ? 20 : -20) }; });
    // tuffo dentro la "o" di Merkorn
    const w = WORDS.why2, ox = MID.x + w.off[4], oy = 1050 + 0.1 * w.size;
    const z = Math.pow(16, prog(t, K.dive, 0.5, E.in));
    show($.s5g, true);
    $.s5g.style.transformOrigin = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
    setT($.s5g, `scale(${z.toFixed(4)})`);
    $.s5g.style.opacity = (1 - prog(t, K.dive + 0.3, 0.2)).toFixed(3);
    return;
  }
  REASONS.forEach((_, i) => {
    const at = K.r[i], end = at + 2.0;
    if (t < at || t >= end) return;
    const o = away(t, end - 0.28, 0.26), lift = -o * 240, fade = 1 - o;
    const n = sp(t, at, 0.45, 0.6, 1.15);
    put(`ri${i}`, MID.x, 600 + lift, { s: n, o: clamp(n * 2) * fade, r: (1 - clamp(n)) * -20 });
    const c = sp(t, at + 0.7, 0.5, 0.8);
    put(`rc${i}`, MID.x, 1175 + (1 - c) * 40 + lift, { o: clamp(c * 2) * fade });
    if (i === 0) {
      // il viola passa e scrive le due righe
      const pa = prog(t, at + 0.1, 0.45, E.inOut), pb = prog(t, at + 0.3, 0.5, E.inOut);
      put("ra0", MID.x, 850 + lift, { o: fade }); put("rb0", MID.x, 1015 + lift, { o: fade });
      $.ra0.style.clipPath = `inset(-30% ${((1 - pa) * 100).toFixed(2)}% -30% 0)`;
      $.rb0.style.clipPath = `inset(-30% ${((1 - pb) * 100).toFixed(2)}% -30% 0)`;
      const wmax = Math.max(WORDS.ra0.w, WORDS.rb0.w), sx = MID.x - wmax / 2 + prog(t, at + 0.1, 0.7, E.inOut) * wmax;
      if (t < at + 0.85) { show($.scan, true); setT($.scan, `translate(${(sx - 4).toFixed(2)}px,${(740 + lift).toFixed(2)}px)`); $.scan.style.opacity = (1 - prog(t, at + 0.65, 0.2)).toFixed(3); }
    } else if (i === 1) {
      // le lettere cadono e rimbalzano
      put("ra1", MID.x, 850 + lift, { o: fade }); put("rb1", MID.x, 1015 + lift, { o: fade });
      ["ra1", "rb1"].forEach((k, j) => letters(k, (q) => { const d = sp(t, at + 0.05 + (j * 6 + q) * 0.03, 0.5, 0.45, 1.25); return { y: (1 - d) * -1100, r: (1 - clamp(d)) * ((q * 37) % 30 - 15) }; }));
    } else if (i === 2) {
      // tre copie della stessa riga si sovrappongono e diventano una
      const a = sp(t, at + 0.05, 0.5, 0.8);
      put("ra2", MID.x, 850 + (1 - a) * 60 + lift, { o: clamp(a * 2) * fade });
      const m = prog(t, at + 0.2, 0.6, E.inOut);
      put("g0", MID.x - 230 * (1 - m), 1015 - 70 * (1 - m) + lift, { o: 0.55 * clamp(m * 4) * (1 - prog(t, at + 0.75, 0.15)), r: -4 * (1 - m) });
      put("g1", MID.x + 230 * (1 - m), 1015 + 70 * (1 - m) + lift, { o: 0.35 * clamp(m * 4) * (1 - prog(t, at + 0.75, 0.15)), r: 4 * (1 - m) });
      const k = pulse(t, at + 0.78, 0.3);
      put("rb2", MID.x, 1015 + lift, { s: 1 + 0.08 * k, o: prog(t, at + 0.65, 0.15) * fade });
    } else {
      // le due righe arrivano da lati opposti e si incrociano
      const a = sp(t, at + 0.05, 0.55, 0.72, 1.06), b = sp(t, at + 0.15, 0.55, 0.72, 1.06);
      put("ra3", lerp(-800, MID.x, a), 850 + lift, { r: (1 - clamp(a)) * 6, o: fade });
      put("rb3", lerp(1880, MID.x, b), 1015 + lift, { r: (1 - clamp(b)) * -6, o: fade });
    }
  });
}

// ---- 6: il primo incontro, il sito, poi la riga viola si chiude nel blocco ----
function applyCta(t) {
  if (t < K.cta || t >= K.close + 0.6) return;
  const open = prog(t, K.cta, 0.5, E.inOut), shut = prog(t, K.site, 0.45, E.inOut);
  const R = 1150 * open * (1 - shut);
  if (R > 0.5) {
    show($.ctaBg, true);
    $.ctaBg.style.clipPath = `circle(${R.toFixed(2)}px at ${MID.x}px ${MID.y}px)`;
    [["k0", 830, 0.2], ["k1", 965, 0.32], ["k2", 1095, 0.6]].forEach(([k, y, d]) => {
      const e = sp(t, K.cta + d, 0.5, 0.78);
      put(k, MID.x, y + (1 - e) * 70, { o: clamp(e * 2) });
    });
  }
  const closing = prog(t, K.close, 0.6, E.inOut), gone = 1 - prog(t, K.close - 0.05, 0.25, E.in);
  const e = sp(t, K.site + 0.35, 0.5, 0.8);
  put("site0", MID.x, 820 + (1 - e) * 40, { o: clamp(e * 2) * gone });
  put("site1", MID.x, 950, { o: gone, s: lerp(0.9, 1, gone) });
  letters("site1", (i) => { const d = sp(t, K.site + 0.2 + i * 0.035, 0.45, 0.62, 1.15); return { y: (1 - d) * 120, s: lerp(0.3, 1, d), o: clamp(d * 3) }; });
  const w = WORDS.site1.w, u = prog(t, K.site + 0.75, 0.5, E.inOut);
  if (u > 0) {
    const line = { x: MID.x - w / 2, y: 1040, w: w * u, h: 14, r: 7 };
    show($.uline, true);
    rectCss($.uline, closing > 0 ? mixRect(line, LOCK.top, closing) : line);
  }
}

function apply(t) {
  for (const k of ALL) show($[k], false);
  placeNebula(t, $.neb, [151, 71, 255], [109, 40, 217], 0.45);
  placeCam(t);
  applyBurst(t);
  applyBands(t);
  applyMerge(t);
  applyAdapt(t);
  applyMeasure(t);
  applyWhy(t);
  applyCta(t);
  placeLockup(t, K.close + 0.6, { open: K.open, out: K.out });
}

function cues() {
  const c = [["whoosh", K.open, { gain: 0.9 }], ["swish", K.s1, { pan: -0.4 }], ["swish", K.s1 + 0.12, { pan: 0.4 }]];
  K.lines.forEach((at, i) => c.push(["pop", at, { note: 2 + i * 2 }]));
  c.push(["whoosh", K.bandsOut, { gain: 0.8 }]);
  [0, 1, 2, 3].forEach((i) => c.push(["swish", K.s2 + i * 0.07, { gain: 0.5, pan: [0, -0.5, 0.5, 0][i] }]));
  c.push(["thud", K.hit, { gain: 1.2 }]);
  for (let i = 0; i < 16; i += 2) c.push(["blip", K.hit + 0.04 + i * 0.022, { note: i % 8, gain: 0.5 }]);
  c.push(["whoosh", K.s3, { pan: 0.4, gain: 0.7 }], ["pop", K.s3 + 0.5, { note: 3 }], ["thud", K.squeeze + 0.05, { gain: 0.7 }]);
  c.push(["whoosh", K.wipe, { gain: 0.9 }], ["swish", K.flip, { gain: 0.8 }], ["whoosh", K.s3bOut, { gain: 0.5 }], ["pop", K.grow, { note: 5 }], ["whoosh", K.s3out, { gain: 0.9 }]);
  for (let i = 0; i < 19; i += 3) c.push(["click", K.s4 + i * 0.022, { gain: 0.5 }]);
  c.push(["swish", K.ruler, { gain: 0.6 }], ["thud", K.fit + 0.02, { gain: 0.9 }], ["chime", K.fit + 0.05, { gain: 0.6 }], ["pop", K.pmi, { note: 4 }], ["whoosh", K.s4out, { pan: -0.5 }]);
  c.push(["whoosh", K.s5, { pan: 0.5 }]);
  for (let i = 0; i < 8; i++) c.push(["blip", K.s5 + 0.45 + i * 0.045, { note: i, gain: 0.5 }]);
  c.push(["whoosh", K.dive, { gain: 1.1 }]);
  K.r.forEach((at, i) => {
    c.push(["pop", at, { note: i * 2 }]);
    if (i === 0) c.push(["swish", at + 0.1, { gain: 0.7 }]);
    if (i === 1) c.push(["thud", at + 0.45, { gain: 0.9 }]);
    if (i === 2) c.push(["chime", at + 0.78, { gain: 0.6 }]);
    if (i === 3) c.push(["swish", at + 0.05, { pan: -0.5 }], ["swish", at + 0.15, { pan: 0.5 }]);
    c.push(["whoosh", at + 1.72, { gain: 0.5 }]);
  });
  c.push(["whoosh", K.cta, { gain: 0.9 }], ["whoosh", K.site, { gain: 0.6 }]);
  for (let i = 0; i < 11; i += 2) c.push(["blip", K.site + 0.2 + i * 0.035, { note: i % 8, gain: 0.5 }]);
  c.push(["swish", K.close, { gain: 0.7 }], ["chime", K.close + 0.6, { gain: 1.0 }], ["swish", K.out + 0.3, { gain: 0.5 }]);
  return c;
}
