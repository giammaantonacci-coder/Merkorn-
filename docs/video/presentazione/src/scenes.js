film({ W: 1080, H: 1920, BPM: 120, BEATS: 96 });

// Merkorn, video di presentazione per il profilo Instagram (in evidenza). I testi vengono dalla presentazione
// "Merkorn · Presentazione": chi siamo, cosa fa, i moduli, a cosa serve, perché Merkorn, come lavoriamo, parliamone.
// Fondi pieni, senza sfumature: nero, bianco e una scena viola; il viola gioca su parole, forme e transizioni.
// Parte e finisce sullo stesso blocco viola, così gira in loop.

const BLACK = "#08070B", WHITE = "#F2EFEA", VIO = "#9747FF";
const GREY_B = "#A7A2AE", GREY_W = "#5E5966", CARD_B = "#17141B";
const MID = { x: FILM.W / 2, y: FILM.H / 2 };
const LX = 90;
// tutto il contenuto scende un poco, per stare al centro del verticale
const DROP = 110;

const K = {};
function timeline() {
  Object.assign(K, { open: B(2) });
  // inizio di ogni scena (le transizioni coprono lo schermo sul taglio)
  K.sec = [0.8, 4.0, 8.5, 13.0, 18.0, 24.0, 28.0, 33.5, 38.5];
  K.close = 43.4;
  K.out = K.close + 0.6 + 3.2;
  K.facts = [5.6, 6.5, 7.4];
  K.pillars = [10.4, 10.9, 11.4];
  K.tiles = 14.3;
  K.strips = [20.2, 20.9, 21.6, 22.3];
  K.bend = 24.85; K.flip = 25.15;
  K.cards = [29.0, 30.1, 31.2, 32.3];
  K.line = 34.4; K.rows = 34.55; K.sweep = 36.7;
  K.uline = 40.9;
}
const BGS = [BLACK, WHITE, BLACK, WHITE, BLACK, VIO, WHITE, BLACK, WHITE];
const WIPES = [null, "blocks", "circle", "h", "diag", "flood", "v", "blocks", "h"];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const WORDS = {};
const ALL = [];
const ITEMS = [];

function word(k, text, size, { color = WHITE, weight = 800, track = -0.045, letters = false, maxW = 900 } = {}) {
  const css = `font-family:var(--display);letter-spacing:${track}em`;
  const w0 = measure(text, size, weight, css);
  const fs = w0 > maxW ? Math.floor((size * maxW) / w0) : size;
  const w = measure(text, fs, weight, css);
  const chars = [...text];
  const off = letters ? chars.map((c, i) => measure(chars.slice(0, i).join(""), fs, weight, css) + measure(c, fs, weight, css) / 2 - w / 2) : [];
  WORDS[k] = { text, size: fs, w, off, n: chars.length };
  ALL.push(k);
  const inner = letters ? chars.map((c, i) => `<span data-k="${k}_${i}" style="display:inline-block;white-space:pre">${esc(c)}</span>`).join("") : esc(text);
  return `<div class="abs" data-k="${k}" style="left:0;top:0;white-space:nowrap;font-family:var(--display);font-size:${fs}px;font-weight:${weight};letter-spacing:${track}em;line-height:1.15;color:${color}">${inner}</div>`;
}

// ax: 0 = il punto è il bordo sinistro, 0.5 = il centro
function put(k, x, y, { s = 1, sx = 1, sy = 1, r = 0, o = 1, rx = 0, ax = 0.5 } = {}) {
  const el = $[k], on = o > 0.002 && Math.abs(s * sx * sy) > 1e-4;
  show(el, on);
  if (!on) return;
  el.style.opacity = o >= 1 ? "" : o.toFixed(3);
  el.style.transformOrigin = `${ax * 100}% 50%`;
  const flip = rx ? ` perspective(1400px) rotateX(${rx.toFixed(2)}deg)` : "";
  setT(el, `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) translate(${-ax * 100}%,-50%)${flip} rotate(${r.toFixed(2)}deg) scale(${(s * sx).toFixed(4)},${(s * sy).toFixed(4)})`);
}

function letters(k, f) {
  const w = WORDS[k];
  for (let i = 0; i < w.n; i++) {
    const v = f(i, w.off[i]), el = $[`${k}_${i}`];
    setT(el, `translate(${(v.x || 0).toFixed(2)}px,${(v.y || 0).toFixed(2)}px) rotate(${(v.r || 0).toFixed(2)}deg) scale(${(v.s ?? 1).toFixed(4)})`);
    el.style.opacity = (v.o ?? 1).toFixed(3);
  }
}

const sp = (t, t0, r = 0.5, d = 0.86, max = 1.08) => clamp(spring(t, t0, r, d), 0, max);
const away = (t, t0, d = 0.28) => prog(t, t0, d, E.in);
const div = (k, css, inner = "") => { ALL.push(k); return `<div class="abs" data-k="${k}" style="left:0;top:0;${css}">${inner}</div>`; };
const label = (k, text, color = VIO) => word(k, text, 30, { color, weight: 700, track: 0.18 });

// ---- i testi, scena per scena ----
// fx: L / R (entra di lato), up (sale), pop (cresce), drop (lettere che cadono), burst (lettere che esplodono), flip, bend
function line(sec, k, text, size, y, at, fx, opts = {}) {
  const { out = (K.sec[sec + 1] ?? K.close) - 0.32, x = LX, ax = 0, color, ...style } = opts;
  ITEMS.push({ sec, k, y, at, fx, out, x, ax });
  return word(k, text, size, { color, letters: ["drop", "burst", "bend"].includes(fx), ...style });
}

function textsHtml() {
  const ink = (s) => (BGS[s] === WHITE ? BLACK : WHITE), grey = (s) => (BGS[s] === WHITE ? GREY_W : GREY_B);
  const sub = (s) => ({ color: grey(s), weight: 500, track: -0.01 });
  return [
    // 1 · titolo
    word("brand", "MERKORN", 34, { color: WHITE, weight: 700, track: 0.2 }),
    line(0, "t1a", "Gestionali", 160, 760, 1.0, "L", { color: ink(0) }),
    line(0, "t1b", "su misura", 160, 935, 1.12, "R", { color: VIO }),
    line(0, "t1c", "per le PMI.", 160, 1110, 1.24, "L", { color: ink(0) }),
    line(0, "t1d", "Software costruito attorno al vostro", 44, 1290, 1.85, "up", sub(0)),
    line(0, "t1e", "modo di lavorare, non il contrario.", 44, 1350, 1.95, "up", sub(0)),
    line(0, "t1f", "SOFTWARE HOUSE · PUGLIA", 30, 1470, 2.3, "up", { color: VIO, weight: 700, track: 0.18 }),
    // 2 · chi siamo
    label("l2", "CHI SIAMO"), line(1, "t2a", "Software house", 132, 680, 4.3, "R", { color: ink(1) }),
    line(1, "t2b", "pugliese.", 168, 850, 4.5, "drop", { color: VIO }),
    line(1, "t2c", "Portiamo il digitale nelle", 48, 1000, 4.95, "up", sub(1)),
    line(1, "t2d", "imprese del territorio.", 48, 1062, 5.05, "up", sub(1)),
    // 3 · cosa fa Merkorn
    label("l3", "COSA FA MERKORN"),
    line(2, "t3a", "Progettiamo e", 130, 650, 8.75, "L", { color: ink(2), out: 10.05 }),
    line(2, "t3b", "sviluppiamo", 130, 795, 8.85, "R", { color: ink(2), out: 10.1 }),
    line(2, "t3c", "il gestionale", 130, 940, 8.95, "L", { color: ink(2), out: 10.15 }),
    line(2, "t3d", "della vostra azienda.", 100, 1075, 9.15, "pop", { color: VIO, out: 10.2 }),
    line(2, "p0", "Su misura.", 130, 700, K.pillars[0], "L", { color: ink(2) }),
    line(2, "p0s", "Attorno ai vostri processi e alle persone.", 38, 810, K.pillars[0] + 0.2, "up", sub(2)),
    line(2, "p1", "Modulare.", 130, 960, K.pillars[1], "L", { color: ink(2) }),
    line(2, "p1s", "Si parte da ciò che serve oggi.", 38, 1070, K.pillars[1] + 0.2, "up", sub(2)),
    line(2, "p2", "Guidato dai dati.", 130, 1220, K.pillars[2], "L", { color: VIO }),
    line(2, "p2s", "Ogni dato diventa un numero in dashboard.", 38, 1330, K.pillars[2] + 0.2, "up", sub(2)),
    // 4 · i moduli
    label("l4", "I MODULI"), line(3, "t4a", "Un gestionale,", 128, 590, 13.25, "L", { color: ink(3) }),
    line(3, "t4b", "componibile.", 150, 750, 13.4, "drop", { color: VIO }),
    // 5 · a cosa serve
    label("l5", "A COSA SERVE"),
    line(4, "t5a", "Meno tempo", 140, 650, 18.25, "L", { color: ink(4), out: 19.85 }),
    line(4, "t5b", "sui dati,", 140, 800, 18.35, "R", { color: ink(4), out: 19.9 }),
    line(4, "t5c", "più tempo", 140, 950, 18.6, "L", { color: VIO, out: 19.95 }),
    line(4, "t5d", "sulle decisioni.", 140, 1100, 18.7, "R", { color: VIO, out: 20.0 }),
    // 6 · lo strumento si piega
    line(5, "t6a", "Lo strumento", 132, 690, 24.15, "up", { color: BLACK }),
    line(5, "t6b", "si piega", 190, 865, 24.3, "bend", { color: WHITE, x: MID.x, ax: 0.5 }),
    line(5, "t6c", "al processo,", 132, 1040, 24.5, "up", { color: BLACK }),
    line(5, "t6d", "non il contrario.", 132, 1190, K.flip, "flip", { color: WHITE }),
    line(5, "t6e", "Partiamo da come lavorate.", 46, 1350, 25.7, "up", { color: BLACK, weight: 600, track: -0.01 }),
    line(5, "t6f", "Il software arriva dopo.", 46, 1412, 25.8, "up", { color: BLACK, weight: 600, track: -0.01 }),
    // 7 · perché Merkorn
    label("l7", "PERCHÉ MERKORN"), line(6, "t7a", "Quattro", 150, 600, 28.25, "L", { color: ink(6) }),
    line(6, "t7b", "ragioni.", 170, 765, 28.4, "drop", { color: VIO }),
    // 8 · come lavoriamo
    label("l8", "COME LAVORIAMO"), line(7, "t8a", "Sei fasi,", 140, 560, 33.75, "L", { color: ink(7) }),
    line(7, "t8b", "nessuna sorpresa.", 120, 710, 33.9, "R", { color: VIO }),
    // 9 · parliamone
    line(8, "t9a", "Parliamone.", 190, 760, 38.85, "burst", { color: BLACK, out: K.close - 0.1 }),
    line(8, "t9b", "Il primo passo è", 70, 930, 39.4, "up", { color: BLACK, weight: 700, out: K.close - 0.1 }),
    line(8, "t9c", "un'analisi gratuita.", 70, 1012, 39.5, "up", { color: VIO, weight: 700, out: K.close - 0.1 }),
    line(8, "t9d", "Veniamo a vedere come lavorate.", 42, 1115, 39.95, "up", { ...sub(8), out: K.close - 0.1 }),
    line(8, "t9e", "merkorn.com", 120, 1300, 40.35, "burst", { color: BLACK, out: K.close - 0.1 }),
    line(8, "t9f", "merkornsh@gmail.com", 42, 1445, 41.2, "up", { color: VIO, weight: 600, track: -0.01, out: K.close - 0.1 }),
  ].join("");
}
// le etichette in alto: scena, y, istante
const LABELS = [["l2", 1, 545, 4.25], ["l3", 2, 520, 8.7], ["l4", 3, 455, 13.2], ["l5", 4, 520, 18.2], ["l7", 6, 465, 28.2], ["l8", 7, 425, 33.7]];

// ---- forme ----
const FACTS = [["LA MISSIONE", "Una nuova cultura digitale", "per le imprese pugliesi."], ["IL FOCUS", "Gestionali con al centro", "esperienza d'uso e modularità."], ["LA VISIONE", "Un punto di riferimento", "digitale in Puglia."]];
const TILES = [["Operatività", "Le attività, dove accadono."], ["Magazzino", "Giacenze sempre aggiornate."], ["Vendite e clienti", "Ordini, documenti, incassi."], ["Documenti", "Dai dati, documenti pronti."], ["Integrazioni", "Con i programmi che usate."], ["Analytics", "Costi e margini in dashboard."]];
const TILE = { w: 430, h: 200, gx: 40, gy: 36, y0: 900 };
const STRIPS = [["Un dato, inserito una volta.", "Niente ricopiature tra fogli e programmi."], ["Meno errori.", "Controlli automatici dove serve attenzione."], ["Flusso più rapido.", "Ognuno vede solo quello che gli serve."], ["Numeri in tempo reale.", "Costi, margini e giacenze ogni mattina."]];
const STRIP = { h: 176, y0: 470, gap: 26, w: 990 };
const CARDS = [["Tutto in casa.", "Nessun subappalto. Chi vi ascolta", "è chi scrive il codice."], ["Facile da usare.", "Esperienza utente progettata con", "chi lo userà ogni giorno."], ["Cresce con voi.", "Moduli aggiunti solo quando", "servono davvero."], ["Vicini.", "Pugliesi, presenti in azienda", "anche dopo il rilascio."]];
const CARD = { y: 960, h: 290 };
const PHASES = [["Analisi", "Gratuita, in azienda."], ["Definizione", "Cosa entra, cosa resta fuori."], ["Prototipo", "Lo provate prima che sia scritto."], ["Sviluppo", "Tutto in casa, nessun subappalto."], ["Rilascio", "Migriamo i dati che avete già."], ["Adozione", "Affiancamento a chi lo userà."]];
const PH = { x: 120, y0: 870, step: 148 };

function shapesHtml() {
  const t = (s, size, color, weight = 700, extra = "") => `<span class="t" style="font-family:var(--display);font-size:${size}px;font-weight:${weight};color:${color};letter-spacing:-.02em;${extra}">${esc(s)}</span>`;
  const facts = FACTS.map(([l, a, b], i) => div(`fact${i}`, `width:900px;height:250px;border-radius:28px;background:${BLACK};padding:42px 44px;display:flex;flex-direction:column;gap:10px`,
    `${t(l, 28, VIO, 700, "letter-spacing:.18em")}${t(a, 50, WHITE, 700)}${t(b, 50, WHITE, 700)}`)).join("");
  const tiles = TILES.map(([a, b], i) => div(`tile${i}`, `width:${TILE.w}px;height:${TILE.h}px;border-radius:26px;background:${i === 5 ? VIO : BLACK};padding:36px 32px;display:flex;flex-direction:column;justify-content:space-between`,
    `<i style="width:26px;height:26px;border-radius:5px;background:${i === 5 ? WHITE : VIO}"></i><div style="display:flex;flex-direction:column;gap:6px">${t(a, 44, WHITE, 800)}${t(b, 25, i === 5 ? WHITE : GREY_B, 500, "letter-spacing:0")}</div>`)).join("");
  const strips = STRIPS.map(([a, b], i) => div(`strip${i}`, `width:${STRIP.w}px;height:${STRIP.h}px;background:${VIO};padding:0 ${LX}px;display:flex;flex-direction:column;justify-content:center;gap:6px;${i % 2 ? "border-radius:88px 0 0 88px" : "border-radius:0 88px 88px 0"}`,
    `${t(a, 58, BLACK, 800)}${t(b, 32, WHITE, 600, "letter-spacing:0")}`)).join("");
  const cards = CARDS.map(([a, b, c], i) => div(`card${i}`, `width:900px;height:${CARD.h}px;border-radius:32px;background:${BLACK};padding:44px;display:flex;gap:34px`,
    `<i class="center" style="flex:none;width:92px;height:92px;border-radius:50%;background:${VIO};color:${WHITE};font-family:var(--display);font-size:44px;font-weight:800">${i + 1}</i><div style="display:flex;flex-direction:column;gap:12px">${t(a, 64, WHITE, 800)}${t(b, 34, GREY_B, 500, "letter-spacing:0")}${t(c, 34, GREY_B, 500, "letter-spacing:0")}</div>`)).join("");
  const phases = PHASES.map(([a, b], i) => div(`ph${i}`, `width:900px;height:120px`,
    `<i class="abs" style="left:${-14}px;top:${-14}px;width:28px;height:28px;border-radius:50%;background:${VIO}" data-k="dot${i}"></i>
     <span class="abs t" style="left:46px;top:-24px;font-family:var(--display);font-size:30px;font-weight:700;color:${VIO}">0${i + 1}</span>
     <span class="abs t" style="left:110px;top:-36px;font-family:var(--display);font-size:56px;font-weight:800;letter-spacing:-.03em;color:${WHITE}">${esc(a)}</span>
     <span class="abs t" style="left:110px;top:30px;font-size:31px;color:${GREY_B}">${esc(b)}</span>`)).join("");
  return facts + tiles + strips + cards + div("line", `width:6px;border-radius:3px;background:${VIO}`) + phases + markHtml("hm") + div("pillarBars", "", [0, 1, 2].map((i) => `<i class="abs" data-k="bar${i}" style="height:10px;border-radius:5px;background:${VIO}"></i>`).join(""));
}

function build(stage) {
  timeline();
  stage.innerHTML = `<div class="full" data-k="bg"></div>${lockupBackHtml()}<div class="full" data-k="cam"></div><div class="full" data-k="top"></div><div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);
  $.cam.innerHTML = textsHtml() + shapesHtml();
  const blocks = Array.from({ length: 15 }, (_, i) => div(`bk${i}`, `width:360px;height:384px;background:${VIO}`)).join("");
  $.top.innerHTML = div("wp", `background:${VIO}`) + blocks + div("burst", `background:${VIO}`) + div("uline", `background:${VIO}`);
  collect(stage);
  ALL.push("pillarBars");
  layoutLockup(MID.x, MID.y, 1);
}

// ---- scena attiva e fondo ----
const secAt = (t) => { let s = -1; K.sec.forEach((t0, i) => { if (t >= t0) s = i; }); return s; };
function placeBg(t) {
  const s = secAt(t);
  $.bg.style.background = s < 0 ? BLACK : BGS[s];
  // lenta spinta in avanti dentro ogni scena (tranne l'ultima, che si chiude nel blocco)
  const z = s >= 0 && s < 8 ? 1 + 0.03 * (t - K.sec[s]) / (K.sec[s + 1] - K.sec[s]) : 1;
  $.cam.style.transformOrigin = "50% 50%";
  const sh = shakes(t);
  setT($.cam, `translate(${sh[0].toFixed(2)}px,${(sh[1] + DROP).toFixed(2)}px) scale(${z.toFixed(5)})`);
}
function shakes(t) {
  let dx = 0, dy = 0;
  for (const [t0, a] of [[K.sec[1] + 0.95, 10], [K.tiles + 0.85, 14], [K.bend, 10], [K.sec[8] + 0.35, 12]]) {
    const d = t - t0;
    if (d < 0 || d > 0.6) continue;
    const s = a * Math.exp(-d / 0.12);
    dx += s * Math.sin(2 * Math.PI * 23 * d); dy += 0.6 * s * Math.sin(2 * Math.PI * 31 * d + 1.1);
  }
  return [dx, dy];
}

// ---- transizioni viola sul taglio ----
function applyWipes(t) {
  for (let s = 1; s < K.sec.length; s++) {
    const T0 = K.sec[s], kind = WIPES[s];
    if (t < T0 - 0.32 || t >= T0 + 0.34) continue;
    const c = prog(t, T0 - 0.32, 0.32, E.in), u = prog(t, T0, 0.34, E.out);
    const wp = $.wp;
    if (kind === "blocks") {
      for (let i = 0; i < 15; i++) {
        const col = i % 3, row = Math.floor(i / 3), d = (col + row) * 0.025;
        const a = prog(t, T0 - 0.32 + d, 0.24, E.in), b = prog(t, T0 + d, 0.24, E.out);
        const q = a * (1 - b);
        show($["bk" + i], q > 0.001);
        rectCss($["bk" + i], { x: col * 360 + 180 * (1 - q), y: row * 384 + 192 * (1 - q), w: 360 * q + 1, h: 384 * q + 1, r: 40 * (1 - q) });
      }
      continue;
    }
    show(wp, true);
    if (kind === "circle" || kind === "flood") {
      const R = 1200 * (t < T0 ? c : kind === "flood" ? 1 : 1 - u);
      rectCss(wp, { x: 0, y: 0, w: FILM.W, h: FILM.H, r: 0 });
      wp.style.clipPath = `circle(${R.toFixed(1)}px at 50% ${kind === "flood" ? "100%" : "50%"})`;
      if (kind === "flood" && t >= T0) show(wp, false);
    } else if (kind === "h") {
      wp.style.clipPath = "";
      rectCss(wp, { x: t < T0 ? -FILM.W * (1 - c) : FILM.W * u, y: 0, w: FILM.W, h: FILM.H, r: 0 });
    } else if (kind === "v") {
      wp.style.clipPath = "";
      rectCss(wp, { x: 0, y: t < T0 ? FILM.H * (1 - c) : -FILM.H * u, w: FILM.W, h: FILM.H, r: 0 });
    } else if (kind === "diag") {
      const x = t < T0 ? lerp(-2400, -500, c) : lerp(-500, 1500, u);
      wp.style.clipPath = `polygon(${x}px 0px, ${x + 1900}px 0px, ${x + 1900 - 800}px ${FILM.H}px, ${x - 800}px ${FILM.H}px)`;
      rectCss(wp, { x: 0, y: 0, w: FILM.W, h: FILM.H, r: 0 });
      wp.style.clipPath = `polygon(${(x + 800).toFixed(1)}px 0px, ${(x + 2700).toFixed(1)}px 0px, ${(x + 1900).toFixed(1)}px ${FILM.H}px, ${x.toFixed(1)}px ${FILM.H}px)`;
    }
  }
}

// ---- 0: il blocco esplode ----
function applyBurst(t) {
  if (t < K.open || t >= K.sec[0] + 0.6) return;
  const full = { x: 0, y: 0, w: FILM.W, h: FILM.H, r: 0 };
  show($.burst, true);
  rectCss($.burst, mixRect(LOCK.top, full, prog(t, K.open, 0.36, E.inOut)));
  // il viola si ritira verso l'alto e scopre il nero
  const up = prog(t, K.sec[0] - 0.05, 0.45, E.inOut);
  $.burst.style.clipPath = `inset(0px 0px ${(up * FILM.H).toFixed(1)}px 0px)`;
}

// ---- testi ----
function applyTexts(t) {
  ITEMS.forEach((it, n) => {
    if (t < it.at || t >= it.out + 0.32) return;
    const o = away(t, it.out, 0.3), lift = -o * 220, fade = 1 - o;
    const k = it.k, w = WORDS[k];
    if (it.fx === "L" || it.fx === "R") {
      const e = sp(t, it.at, 0.55, 0.78, 1.04), side = it.fx === "L" ? -1 : 1;
      const from = side < 0 ? -w.w - 60 : FILM.W + 60;
      put(k, lerp(from, it.x, e), it.y + lift, { ax: it.ax, o: fade, r: (1 - clamp(e)) * side * 4 });
    } else if (it.fx === "up") {
      const e = sp(t, it.at, 0.5, 0.82);
      put(k, it.x, it.y + (1 - e) * 60 + lift, { ax: it.ax, o: clamp(e * 2) * fade });
    } else if (it.fx === "pop") {
      const e = sp(t, it.at, 0.42, 0.6, 1.15);
      put(k, it.x, it.y + lift, { ax: it.ax, s: lerp(0.4, 1, e), o: clamp(e * 3) * fade });
    } else if (it.fx === "drop") {
      put(k, it.x, it.y + lift, { ax: it.ax, o: fade });
      letters(k, (i) => { const d = sp(t, it.at + i * 0.035, 0.5, 0.5, 1.2); return { y: (1 - d) * -900, r: (1 - clamp(d)) * (i % 2 ? 22 : -22) }; });
    } else if (it.fx === "burst") {
      put(k, it.x, it.y + lift, { ax: it.ax, o: fade });
      letters(k, (i, off) => { const e = sp(t, it.at + i * 0.03, 0.5, 0.66, 1.12); return { x: (1 - clamp(e)) * -off * 0.6, y: (1 - e) * 140, s: lerp(0.2, 1, e), r: (1 - clamp(e)) * ((i * 47) % 50 - 25), o: clamp(e * 3) }; });
    } else if (it.fx === "flip") {
      const f = sp(t, it.at, 0.7, 0.42, 1.3);
      put(k, it.x, it.y + lift, { ax: it.ax, rx: 180 * (1 - f), o: fade });
    } else if (it.fx === "bend") {
      // "si piega": entra dritta, poi le lettere si curvano ad arco
      const e = sp(t, it.at, 0.45, 0.62, 1.12), b = sp(t, K.bend, 0.6, 0.45, 1.3);
      put(k, it.x, it.y + lift, { ax: it.ax, s: lerp(0.5, 1, e), o: clamp(e * 3) * fade });
      letters(k, (i, off) => { const u = off / (w.w / 2); return { y: b * u * u * 70, r: b * u * 16 }; });
    }
  });
  LABELS.forEach(([k, s, y, at]) => {
    const out = K.sec[s + 1] - 0.32;
    if (t < at || t >= out + 0.32) return;
    const e = sp(t, at, 0.5, 0.82), o = away(t, out, 0.3);
    put(k, LX, y + (1 - e) * 30 - o * 220, { ax: 0, o: clamp(e * 2) * (1 - o) });
  });
  // il marchio e "MERKORN" nel titolo
  if (t >= K.sec[0] + 0.1 && t < K.sec[1]) {
    const o = away(t, K.sec[1] - 0.32, 0.3), s = 16, y = 470 - o * 220;
    placeMark("hm", LX, y, s, (i) => sp(t, K.sec[0] + 0.15 + i * 0.06, 0.45, 0.7, 1.06));
    for (let i = 0; i < 5; i++) $["hm" + i].style.opacity = (1 - o).toFixed(3);
    const e = sp(t, K.sec[0] + 0.5, 0.5, 0.82);
    put("brand", LX + 5 * s + 28, y + 1.5 * s, { ax: 0, o: clamp(e * 2) * (1 - o) });
  } else if (t >= K.sec[8] + 0.1 && t < K.close) {
    const s = 26, y = 520, gone = 1 - prog(t, K.close - 0.1, 0.25, E.in);
    placeMark("hm", LX, y, s, (i) => sp(t, K.sec[8] + 0.2 + i * 0.07, 0.45, 0.62, 1.08));
    for (let i = 0; i < 5; i++) $["hm" + i].style.opacity = gone.toFixed(3);
  } else for (let i = 0; i < 5; i++) show($["hm" + i], false);
}

// ---- forme: schede, tessere, strisce, carte, fasi ----
function applyShapes(t) {
  const g = (k, x, y, { s = 1, r = 0, o = 1 } = {}) => {
    show($[k], o > 0.002);
    setT($[k], `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`);
    $[k].style.opacity = o >= 1 ? "" : o.toFixed(3);
  };
  // 2 · missione, focus, visione: una scheda spinge via l'altra
  if (t >= K.facts[0] && t < K.sec[2]) {
    const out = K.sec[2] - 0.32, o = away(t, out, 0.3);
    K.facts.forEach((at, i) => {
      const e = sp(t, at, 0.55, 0.8, 1.03), next = K.facts[i + 1], x = next ? sp(t, next, 0.55, 0.85, 1.02) : 0;
      if (t < at || x >= 1) return;
      g(`fact${i}`, lerp(FILM.W + 40, LX, e) - x * 1100, 1180 - o * 220, { r: (1 - clamp(e)) * 5, o: 1 - o });
    });
  }
  // 3 · le barre sotto i tre pilastri
  if (t >= K.pillars[0] && t < K.sec[3]) {
    const o = away(t, K.sec[3] - 0.32, 0.3);
    show($.pillarBars, true);
    $.pillarBars.style.opacity = (1 - o).toFixed(3);
    [700, 960, 1220].forEach((y, i) => {
      const p = prog(t, K.pillars[i] + 0.15, 0.45, E.out);
      rectCss($["bar" + i], { x: LX, y: y + 78 - o * 220, w: 120 * p, h: 10, r: 5 });
    });
  }
  // 4 · sei tessere che si incastrano
  if (t >= K.tiles && t < K.sec[4]) {
    TILES.forEach((_, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = LX + col * (TILE.w + TILE.gx), y = TILE.y0 + row * (TILE.h + TILE.gy);
      const e = sp(t, K.tiles + i * 0.12, 0.55, 0.62, 1.1);
      const fall = prog(t, K.sec[4] - 0.42 + i * 0.03, 0.35, E.in);
      const sx = (col ? 1 : -1) * 500 * (1 - clamp(e)), sy = 1100 * (1 - e);
      const k = pulse(t, K.tiles + 1.6 + i * 0.07, 0.3);
      g(`tile${i}`, x + sx, y + sy + fall * 1400, { r: (1 - clamp(e)) * (i % 2 ? 24 : -24) + fall * (i % 2 ? 12 : -12), s: 1 + 0.05 * k });
    });
  }
  // 5 · quattro strisce viola, alternate da sinistra e da destra
  if (t >= K.strips[0] && t < K.sec[5]) {
    const out = K.sec[5] - 0.42;
    K.strips.forEach((at, i) => {
      const side = i % 2 ? 1 : -1, e = sp(t, at, 0.55, 0.8, 1.03), o = prog(t, out + i * 0.04, 0.3, E.in);
      const x0 = side < 0 ? 0 : FILM.W - STRIP.w;
      const x = x0 + side * (1 - e) * (STRIP.w + 40) + side * o * (STRIP.w + 60);
      if (t >= at) g(`strip${i}`, x, STRIP.y0 + i * (STRIP.h + STRIP.gap));
    });
  }
  // 7 · le quattro ragioni: ogni carta entra dal basso e la precedente si impila dietro
  if (t >= K.cards[0] && t < K.sec[7]) {
    const o = away(t, K.sec[7] - 0.32, 0.3);
    K.cards.forEach((at, i) => {
      if (t < at) return;
      const e = sp(t, at, 0.55, 0.78, 1.03);
      const depth = K.cards.slice(i + 1).reduce((d, a) => d + sp(t, a, 0.5, 0.86, 1), 0);
      const y = lerp(FILM.H + 60, CARD.y, e) - depth * 34 - o * 240;
      g(`card${i}`, LX, y, { s: 1 - 0.06 * depth, o: (1 - 0.18 * depth) * (1 - o) });
      $[`card${i}`].style.transformOrigin = "50% 0%";
      $[`card${i}`].style.zIndex = String(i + 1);
    });
  }
  // 8 · le sei fasi su una linea viola
  if (t >= K.line && t < K.sec[8]) {
    const o = away(t, K.sec[8] - 0.32, 0.3), lift = -o * 220;
    const lp = prog(t, K.line, 1.3, E.inOut);
    show($.line, true);
    $.line.style.opacity = (1 - o).toFixed(3);
    rectCss($.line, { x: PH.x - 3, y: PH.y0 + lift, w: 6, h: lp * PH.step * 5, r: 3 });
    PHASES.forEach((_, i) => {
      const at = K.rows + i * 0.22, e = sp(t, at, 0.5, 0.72, 1.06);
      if (t < at) return;
      g(`ph${i}`, PH.x + (1 - e) * 120, PH.y0 + i * PH.step + lift, { o: clamp(e * 2) * (1 - o) });
      const k = pulse(t, K.sweep + i * 0.12, 0.35);
      setT($["dot" + i], `scale(${(clamp(sp(t, at, 0.4, 0.5, 1.3), 0, 1.3) * (1 + 0.6 * k)).toFixed(4)})`);
    });
  }
  // 9 · la riga sotto merkorn.com, che alla fine diventa il blocco del marchio
  const w = WORDS.t9e.w, u = prog(t, K.uline, 0.5, E.inOut), closing = prog(t, K.close, 0.6, E.inOut);
  if (u > 0 && t < K.close + 0.6) {
    const line = { x: LX, y: 1372 + DROP, w: w * u, h: 14, r: 7 };
    show($.uline, true);
    rectCss($.uline, closing > 0 ? mixRect(line, LOCK.top, closing) : line);
  }
}

function apply(t) {
  for (const k of ALL) show($[k], false);
  for (let i = 0; i < 15; i++) show($["bk" + i], false);
  placeBg(t);
  applyTexts(t);
  applyShapes(t);
  applyWipes(t);
  applyBurst(t);
  placeLockup(t, K.close + 0.6, { open: K.open, out: K.out });
}

function cues() {
  const c = [["whoosh", K.open, { gain: 0.9 }]];
  K.sec.slice(1).forEach((t0, i) => c.push(["whoosh", t0 - 0.3, { gain: 0.9, pan: i % 2 ? 0.4 : -0.4 }], ["thud", t0, { gain: 0.6 }]));
  ITEMS.forEach((it) => {
    if (it.fx === "L" || it.fx === "R") c.push(["swish", it.at, { gain: 0.45, pan: it.fx === "L" ? -0.5 : 0.5 }]);
    if (it.fx === "pop" || it.fx === "flip") c.push(["pop", it.at, { note: 4 }]);
    if (it.fx === "drop" || it.fx === "burst") for (let i = 0; i < Math.min(WORDS[it.k].n, 10); i += 2) c.push(["blip", it.at + 0.25 + i * 0.035, { note: i % 8, gain: 0.45 }]);
  });
  for (let i = 0; i < 5; i++) c.push(["pop", K.sec[0] + 0.15 + i * 0.06, { note: i }]);
  K.facts.forEach((at, i) => c.push(["swish", at, { gain: 0.6 }], ["click", at + 0.25, { gain: 0.5 }]));
  K.pillars.forEach((at, i) => c.push(["pop", at + 0.15, { note: 2 + i * 2 }]));
  TILES.forEach((_, i) => c.push(["thud", K.tiles + i * 0.12 + 0.28, { gain: 0.45 }]));
  c.push(["chime", K.tiles + 1.6, { gain: 0.5 }]);
  K.strips.forEach((at, i) => c.push(["swish", at, { gain: 0.7, pan: i % 2 ? 0.5 : -0.5 }], ["pop", at + 0.2, { note: 3 + i }]));
  c.push(["swish", K.bend, { gain: 0.8 }], ["thud", K.bend + 0.1, { gain: 0.8 }]);
  K.cards.forEach((at, i) => c.push(["whoosh", at, { gain: 0.5 }], ["click", at + 0.3, { gain: 0.6 }]));
  c.push(["swish", K.line, { gain: 0.6 }]);
  PHASES.forEach((_, i) => c.push(["blip", K.rows + i * 0.22, { note: i, gain: 0.6 }]));
  PHASES.forEach((_, i) => c.push(["pop", K.sweep + i * 0.12, { note: i + 1, gain: 0.5 }]));
  for (let i = 0; i < 5; i++) c.push(["pop", K.sec[8] + 0.2 + i * 0.07, { note: i }]);
  c.push(["swish", K.uline, { gain: 0.6 }], ["swish", K.close, { gain: 0.7 }], ["chime", K.close + 0.6, { gain: 1.0 }], ["swish", K.out + 0.3, { gain: 0.5 }]);
  return c;
}
