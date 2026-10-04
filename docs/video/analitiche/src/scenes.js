film({ W: 1920, H: 1080, BPM: 120, BEATS: 76 });

// Merkorn, "Analitiche": la schermata delle analitiche di un gestionale Merkorn, raccontata come una vetrina.
// I cinque blocchi del marchio cadono e diventano le colonne del fatturato; le colonne diventano una linea;
// la camera arretra e la schermata si compone. Poi i tre principi di progettazione del sito, uno per volta,
// un ordine nuovo che entra nei conti, e alla fine le schede si richiudono nei cinque blocchi.
// Dati di esempio: quelli delle schermate del sito merkorn.com. Il cliente e le persone sono inventati.
const CLIENT = "Rossi Forniture";

// ---- dati (dalle schermate di esempio del sito) ----
const MONTHS = ["Ott", "Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set"];
const MONTHS_FULL = ["ottobre", "novembre", "dicembre", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre"];
const REV = [142, 151, 168, 129, 138, 156, 161, 170, 175, 163, 118, 184];
const REV_PREV = [131, 139, 152, 121, 127, 140, 149, 155, 160, 150, 109, 167];
const ORDERS = [248, 262, 290, 221, 236, 270, 281, 296, 305, 284, 205, 312];
const LATE = [14, 12, 16, 11, 10, 9, 9, 8, 8, 10, 6, 7];
const LEAD = [3.4, 3.3, 3.5, 3.1, 3.0, 2.9, 2.8, 2.7, 2.6, 2.6, 2.5, 2.4];
const CATS = [["Ferramenta", 0.31, 6], ["Idraulica", 0.24, 12], ["Elettrico", 0.19, 18], ["Utensili", 0.15, 4], ["Giardino", 0.11, 22]];
const NEW_ORDER = { n: 3211, cat: 0, euro: 2480 };
const MAX = 200;

const sum = (a) => a.reduce((x, y) => x + y, 0);
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const dec = (n) => n.toFixed(1).replace(".", ",");
const rev = (r, e) => sum(REV.slice(12 - r)) * 1000 + e * NEW_ORDER.euro;
const prev = (r) => sum(REV_PREV.slice(12 - r)) * 1000;
const orders = (r, e) => sum(ORDERS.slice(12 - r)) + e;
const late = (r) => sum(LATE.slice(12 - r));

// ---- la schermata, in punti finestra ----
const SIDE_W = 210, BODY = { x: 234, w: 942 };
const TILE = { y: 130, h: 108, w: 228, gap: 10 };
const LINE = { x: 234, y: 252, w: 562, h: 500, r: 18 };
const CAT = { x: 806, y: 252, w: 370, h: 500, r: 18 };
const PL = { x: LINE.x + 58, y: LINE.y + 104, w: LINE.w - 58 - 64, h: LINE.h - 104 - 46 };
const CHIP_Y = 80, CHIPS = [["Ultimi 3 mesi", 3], ["Ultimi 6 mesi", 6], ["Ultimi 12 mesi", 12]];
const NAV = ["Home", "Analitiche", "Magazzino", "Produzione"];
const ROW = { y: CAT.y + 118, h: 72, x: CAT.x + 24, w: CAT.w - 48 };
const SEG = { x: CAT.x + CAT.w - 24 - 164, y: CAT.y + 58, w: 164, h: 34 };
const TOAST = { x: 880, y: 74, w: 296, h: 68 };

// ---- tempi ----
const K = {};
function timeline() {
  Object.assign(K, {
    open: 0.5, drop: 1.5, rise: 1.85, grow: 2.05,
    type1: 3.0, type2: 3.5, typeOut: 4.55,
    dots: 5.0, line: 5.45, prevLine: 5.9,
    pull: 6.5, clip: 6.6, side: 7.0, title: 7.15, chips: 7.3, tiles: 7.45, chrome: 7.5, cats: 7.85,
    p1: 10.0, cap1: 10.55, c3: 11.5, c6: 12.5, c12: 13.5, cap1Out: 14.0,
    p2: 14.2, cap2: 14.7, cap2Out: 15.9, dive: 16.05, scrub: 17.0, scrubEnd: 18.7, back: 19.5,
    toast: 20.6, event: 22.0,
    p3: 24.0, cap3: 24.55, cap3Out: 25.9, dive3: 26.05, regrow: 26.95, toggle: 28.0, back2: 29.5,
    fold: 30.6, blocks: 30.82, lock: 32.0, out: 36.4,
  });
  // il periodo scelto: 12 mesi, poi 3, 6 e di nuovo 12
  K.range = [{ t: K.c3 + 0.08, to: 3 }, { t: K.c6 + 0.08, to: 6 }, { t: K.c12 + 0.08, to: 12 }];
  POINTER.splice(0, POINTER.length,
    { t: 0, ...W(1060, 300) },
    { t: K.c3 - 0.55, ...W(CHIPX[0].cx, CHIP_Y + 18), d: 0.5 },
    { t: K.c6 - 0.5, ...W(CHIPX[1].cx, CHIP_Y + 18), d: 0.45 },
    { t: K.c12 - 0.5, ...W(CHIPX[2].cx, CHIP_Y + 18), d: 0.45 },
    { t: K.c12 + 0.45, ...W(CHIPX[2].cx + 120, CHIP_Y + 80), d: 0.5 },
    { t: K.toggle - 0.6, ...W(SEG.x + SEG.w * 0.75, SEG.y + SEG.h / 2), d: 0.55 },
    { t: K.toggle + 0.45, ...W(SEG.x + SEG.w * 0.75 + 60, SEG.y + 70), d: 0.5 });
}
const POINTER = [], CHIPX = [];
const W = (x, y) => ({ x: WIN.x + x, y: WIN.y + y });

// periodo e ordine nuovo nel tempo: numeri interi alle scelte, valori intermedi durante i passaggi
const rangeAt = (t) => track(t, 12, K.range.map((k) => ({ ...k, d: 0.75, e: E.inOut })));
const rangeStep = (t) => { let r = 12; for (const k of K.range) if (t >= k.t) r = k.to; return r; };
const eventAt = (t) => (t >= K.event + 0.3 ? 1 : 0);
// un numero che cambia scorre dal valore vecchio al nuovo
function tween(t, f) {
  const keys = [...K.range.map((k) => k.t), K.event + 0.3].sort((a, b) => a - b);
  let v = f(12, 0);
  const steps = keys.map((kt) => ({ t: kt, to: f(rangeStep(kt + 1e-6), eventAt(kt + 1e-6)), d: 0.6, e: E.snappy }));
  return track(t, v, steps);
}

// ---- geometria del grafico ----
const X = (i, r) => PL.x + (i - (12 - r)) * PL.w / Math.max(1, r - 1);
const Y = (v) => PL.y + PL.h * (1 - v / MAX);
const BAR_W = 26, slotX = (i) => PL.x + (i + 0.5) * PL.w / 12;
const lastRev = (t) => track(t, 184, [{ t: K.event + 0.3, to: 184 + NEW_ORDER.euro / 1000, spring: [0.5, 0.7] }]);
function pathD(vals, r) {
  return vals.map((v, i) => `${i ? "L" : "M"}${X(i, r).toFixed(2)},${Y(v).toFixed(2)}`).join("");
}

// ---- costruzione ----
const esc = (s) => s.replace(/&/g, "&amp;");
const ICONS = [
  '<path d="M3 9.5 10 4l7 5.5V17H3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  '<path d="M3 17h14M5 14V9M10 14V5M15 14v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  '<path d="M3 6.5 10 3l7 3.5v7L10 17l-7-3.5Z M3 6.5 10 10l7-3.5M10 10v7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  '<circle cx="10" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 2.5v2.3M10 15.2v2.3M2.5 10h2.3M15.2 10h2.3M4.7 4.7l1.6 1.6M13.7 13.7l1.6 1.6M4.7 15.3l1.6-1.6M13.7 6.3l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
];
const CAPTIONS = [
  { key: "c1", eyebrow: "Principio 1", a: "Un periodo", b: "per tutta la schermata.", x: 110, y: 360, at: "cap1", out: "cap1Out" },
  { key: "c2", eyebrow: "Principio 2", a: "Il dato che conta", b: "in primo piano.", x: 1110, y: 360, at: "cap2", out: "cap2Out" },
  { key: "c3", eyebrow: "Principio 3", a: "Barre orizzontali", b: "per i nomi lunghi.", x: 110, y: 360, at: "cap3", out: "cap3Out" },
];
const CAP = { size: 60, lh: 74 };

function build(stage) {
  const tiles = [0, 1, 2, 3].map((k) => `
    <div class="abs" data-k="tile${k}" style="border-radius:16px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair);overflow:hidden">
      <div data-k="tileIn${k}">
        <span class="abs t" data-k="tl${k}" style="left:18px;top:16px;font-size:13.5px;color:var(--ink2)"></span>
        <span class="abs t" data-k="tv${k}" style="left:18px;top:38px;font-family:var(--display);font-size:30px;font-weight:700;letter-spacing:-.02em"></span>
        <span class="abs t" data-k="td${k}" style="left:18px;top:78px;font-size:12.5px;color:var(--ink2)"></span>
      </div>
    </div>`).join("");
  const months = MONTHS.map((m, i) => `<span class="abs t" data-k="mo${i}" style="left:0;top:${PL.y + PL.h + 14}px;font-size:12.5px;color:var(--ink3);width:40px;margin-left:-20px;text-align:center">${m}</span>`).join("");
  const grid = [0, 50, 100, 150, 200].map((v) => `
    <i class="abs" style="left:${PL.x}px;top:${Y(v)}px;width:${PL.w}px;height:1px;background:${v ? "#2A2630" : "#3A3540"}"></i>
    <span class="abs t" style="left:${PL.x - 48}px;width:38px;text-align:right;top:${Y(v) - 9}px;font-size:12px;color:var(--ink3)">${v}</span>`).join("");
  const bars = REV.map((_, i) => `<i class="abs" data-k="bar${i}" style="background:var(--accent)"></i>`).join("");
  const rows = CATS.map(([name], c) => `
    <div class="abs" data-k="row${c}" style="left:${ROW.x}px;width:${ROW.w}px;height:${ROW.h}px">
      <span class="abs t" style="left:0;top:4px;font-size:16px;font-weight:600">${name}</span>
      <span class="abs t" data-k="rv${c}" style="right:0;top:4px;font-size:16px;font-weight:600;color:var(--ink2)"></span>
      <i class="abs" style="left:0;top:36px;width:${ROW.w}px;height:14px;border-radius:7px;background:rgba(242,239,234,.06)"></i>
      <i class="abs" data-k="rb${c}" style="left:0;top:36px;height:14px;border-radius:7px;background:var(--accent)"></i>
    </div>`).join("");
  const app = `
    <div class="full" data-k="appBg" style="background:var(--winBg)"></div>
    <div class="abs" data-k="side" style="left:0;top:0;width:${SIDE_W}px;height:780px;background:#0D0B10;box-shadow:inset -1px 0 0 var(--hair)">
      <div class="abs row" style="left:22px;top:58px;gap:10px"><i style="width:26px;height:26px;border-radius:8px;background:#C2410C"></i><span class="t" style="font-family:var(--display);font-size:15px;font-weight:700">${CLIENT}</span></div>
      ${NAV.map((n, k) => `<div class="abs row" style="left:12px;top:${112 + k * 46}px;width:186px;height:42px;padding-left:14px;gap:12px;border-radius:12px;font-size:14.5px;font-weight:500;${k === 1 ? "color:var(--ink);background:var(--lift2);box-shadow:inset 3px 0 0 var(--accent)" : "color:var(--ink2)"}"><svg width="20" height="20" viewBox="0 0 20 20">${ICONS[k]}</svg>${n}</div>`).join("")}
      <div class="abs row" style="left:20px;top:716px;gap:10px"><span class="center" style="width:34px;height:34px;border-radius:10px;background:var(--field);font-family:var(--display);font-size:12px;font-weight:700">AM</span><span style="font-size:13px;line-height:1.25">Anna Martini<br><small style="color:var(--ink2);font-size:11px">Amministrazione</small></span></div>
    </div>
    <div class="abs" data-k="top" style="left:${SIDE_W}px;top:0;width:${1200 - SIDE_W}px;height:64px;box-shadow:inset 0 -1px 0 var(--hair)">
      <div class="abs mask" style="left:24px;top:14px;width:300px;height:38px"><span class="abs t" data-k="title" style="left:0;top:0;font-family:var(--display);font-size:24px;font-weight:700;letter-spacing:-.02em;line-height:38px">Analitiche</span></div>
      <span class="abs t" data-k="date" style="right:24px;top:23px;font-size:13.5px;color:var(--ink2)">Lunedì 28 settembre</span>
    </div>
    <div class="abs" data-k="chipSel" style="top:${CHIP_Y}px;height:36px;border-radius:10px;background:var(--ink)"></div>
    ${CHIPS.map(([l], k) => `<div class="abs center" data-k="chip${k}" style="top:${CHIP_Y}px;height:36px;padding:0 14px;border-radius:10px;font-size:13.5px;font-weight:600;box-shadow:inset 0 0 0 1px var(--hair)">${l}</div>`).join("")}
    ${tiles}
    <div class="abs" data-k="lineCard" style="border-radius:${LINE.r}px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair)"></div>
    <div class="abs" data-k="lineHead" style="left:${LINE.x + 22}px;top:${LINE.y + 20}px">
      <span class="abs t" style="left:0;top:0;font-family:var(--display);font-size:18px;font-weight:700">Fatturato mensile</span>
      <span class="abs t" style="left:0;top:26px;font-size:12.5px;color:var(--ink2)">Migliaia di euro</span>
      <span class="abs row" style="left:0;top:52px;gap:16px;font-size:12.5px;color:var(--ink2);white-space:nowrap"><span class="row" style="gap:6px"><i style="width:16px;height:3px;border-radius:2px;background:var(--accent)"></i>Anno in corso</span><span class="row" style="gap:6px"><i style="width:16px;height:3px;border-radius:2px;background:#7A7482"></i>Anno precedente</span></span>
    </div>
    <div class="abs" data-k="axes" style="left:0;top:0;width:1200px;height:780px">${grid}</div>
    <div class="abs" data-k="monthsBox" style="left:0;top:0;width:1200px;height:780px;clip-path:inset(0 ${1200 - PL.x - PL.w - 24}px 0 ${PL.x - 24}px)">${months}</div>
    <svg class="abs" data-k="chart" style="left:0;top:0;overflow:visible" width="1200" height="780">
      <defs>
        <clipPath id="plot"><rect x="${PL.x - 2}" y="${PL.y - 40}" width="${PL.w + 4}" height="${PL.h + 42}"/></clipPath>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9747FF" stop-opacity=".32"/><stop offset="1" stop-color="#9747FF" stop-opacity="0"/></linearGradient>
      </defs>
      <g clip-path="url(#plot)">
        <path data-k="area" fill="url(#area)"/>
        <path data-k="prevPath" fill="none" stroke="#7A7482" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <path data-k="curPath" fill="none" stroke="#9747FF" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 6px rgba(151,71,255,.55))"/>
      </g>
    </svg>
    <div class="abs" data-k="bars" style="left:0;top:0;width:1200px;height:780px">${bars}</div>
    <i class="abs" data-k="endDot" style="width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#9747FF;box-shadow:0 0 0 4px var(--surface)"></i>
    <i class="abs" data-k="ring" style="border-radius:50%;box-shadow:inset 0 0 0 2px #B57BFF"></i>
    <span class="abs t" data-k="endLab" style="font-family:var(--display);font-size:15px;font-weight:700"></span>
    <i class="abs" data-k="cursor" style="top:${PL.y}px;width:2px;height:${PL.h}px;margin-left:-1px;background:rgba(242,239,234,.35)"></i>
    <i class="abs" data-k="cursorDot" style="width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#F2EFEA;box-shadow:0 0 0 4px #9747FF"></i>
    <div class="abs" data-k="tip" style="width:208px;height:96px;border-radius:14px;background:#0B0A0E;box-shadow:inset 0 0 0 1px var(--hair),0 16px 30px -12px rgba(0,0,0,.8)">
      <span class="abs t" data-k="tipM" style="left:14px;top:12px;font-size:12.5px;color:var(--ink2)"></span>
      <span class="abs row" style="left:14px;top:38px;gap:8px;font-size:13px;color:var(--ink2)"><i style="width:12px;height:3px;border-radius:2px;background:#9747FF"></i><b data-k="tipA" style="color:var(--ink);font-weight:600"></b></span>
      <span class="abs row" style="left:14px;top:64px;gap:8px;font-size:13px;color:var(--ink2)"><i style="width:12px;height:3px;border-radius:2px;background:#7A7482"></i><b data-k="tipB" style="color:var(--ink);font-weight:600"></b></span>
    </div>
    <div class="abs" data-k="peak" style="height:64px">
      <span class="abs t" data-k="peakV" style="right:0;top:0;font-family:var(--display);font-size:30px;font-weight:700;letter-spacing:-.02em">184.000 €</span>
      <span class="abs t" style="right:0;top:40px;font-size:13px;font-weight:600;color:#4CC94C">+10,2% sull'anno prima</span>
    </div>
    <div class="abs" data-k="catCard" style="border-radius:${CAT.r}px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair)"></div>
    <div class="abs" data-k="catHead" style="left:${CAT.x + 24}px;top:${CAT.y + 20}px">
      <span class="abs t" style="left:0;top:0;font-family:var(--display);font-size:18px;font-weight:700">Ordini per categoria</span>
      <span class="abs t" data-k="catSub" style="left:0;top:26px;font-size:12.5px;color:var(--ink2)"></span>
    </div>
    <div class="abs" data-k="seg" style="left:${SEG.x}px;top:${SEG.y}px;width:${SEG.w}px;height:${SEG.h}px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--hair)">
      <i class="abs" data-k="segSel" style="top:3px;height:${SEG.h - 6}px;border-radius:8px;background:var(--lift2);box-shadow:inset 0 0 0 1px rgba(151,71,255,.6)"></i>
      <span class="abs t" data-k="seg0" style="left:0;width:${SEG.w / 2}px;top:8px;text-align:center;font-size:13px;font-weight:600">Ordini</span>
      <span class="abs t" data-k="seg1" style="left:${SEG.w / 2}px;width:${SEG.w / 2}px;top:8px;text-align:center;font-size:13px;font-weight:600">Crescita</span>
    </div>
    <i class="abs" data-k="baseline" style="left:${ROW.x - 1}px;top:${ROW.y + 30}px;width:2px;height:${ROW.h * 5 - 24}px;border-radius:1px;background:#B57BFF"></i>
    ${rows}
    <div class="abs" data-k="toast" style="border-radius:16px;background:var(--lift2);box-shadow:inset 0 0 0 1px rgba(151,71,255,.55),0 18px 40px -14px rgba(0,0,0,.9);overflow:hidden">
      <div data-k="toastIn">
        <span class="abs center" style="left:14px;top:16px;width:36px;height:36px;border-radius:11px;background:var(--accent);font-family:var(--display);font-size:22px;font-weight:700">+</span>
        <span class="abs t" style="left:62px;top:14px;font-size:15px;font-weight:600">Nuovo ordine #${NEW_ORDER.n}</span>
        <span class="abs t" style="left:62px;top:38px;font-size:13px;color:var(--ink2)">Ferramenta · ${fmt(NEW_ORDER.euro)} €</span>
      </div>
    </div>
    <div class="full" data-k="dimL" style="pointer-events:none"></div>`;

  stage.innerHTML = `
    ${nebulaHtml()}
    ${lockupBackHtml()}
    ${desktopMarkup(app, { name: CLIENT })}
    <div class="full" data-k="type">
      <div class="abs mask" style="left:142px;top:300px;width:1700px;height:190px"><span class="abs t" data-k="typeA" style="left:8px;top:0;font-family:var(--display);font-size:156px;font-weight:700;letter-spacing:-.045em;line-height:190px">Ogni numero</span></div>
      <div class="abs mask" style="left:142px;top:470px;width:1700px;height:200px"><span class="abs t" data-k="typeB" style="left:8px;top:0;font-family:var(--display);font-size:156px;font-weight:700;letter-spacing:-.045em;line-height:190px;color:#B57BFF">al suo posto.</span></div>
    </div>
    ${CAPTIONS.map((c) => `
      <div class="abs mask" style="left:${c.x}px;top:${c.y}px;width:780px;height:30px"><span class="abs t" data-k="${c.key}E" style="left:0;top:0;font-size:18px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);line-height:30px">${c.eyebrow}</span></div>
      <div class="abs mask" style="left:${c.x - 6}px;top:${c.y + 40}px;width:800px;height:${CAP.lh + 8}px"><span class="abs t" data-k="${c.key}A" style="left:6px;top:0;font-family:var(--display);font-size:${CAP.size}px;font-weight:700;letter-spacing:-.035em;line-height:${CAP.lh}px">${c.a}</span></div>
      <div class="abs mask" style="left:${c.x - 6}px;top:${c.y + 40 + CAP.lh}px;width:800px;height:${CAP.lh + 8}px"><span class="abs t" data-k="${c.key}B" style="left:6px;top:0;font-family:var(--display);font-size:${CAP.size}px;font-weight:700;letter-spacing:-.035em;line-height:${CAP.lh}px;color:#B57BFF">${c.b}</span></div>`).join("")}
    <div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);
  let x = BODY.x;
  CHIPS.forEach(([l], k) => {
    const w = Math.ceil(measure(l, 13.5, 600) + 28);
    CHIPX.push({ x, w, cx: x + w / 2 });
    $["chip" + k].style.left = x + "px";
    $["chip" + k].style.width = w + "px";
    x += w + 8;
  });
  timeline();
  layoutLockup(FILM.W / 2, FILM.H / 2, 1.2);
}

// ---- un fotogramma ----
function apply(t) {
  placeNebula(t, $.neb);
  const v = camera(t);
  const on = t >= K.drop && t < K.lock;
  show($.world, on);
  if (on) {
    const q = prog(t, K.clip, 1.0, E.inOut);
    placeWorld(v, { rect: q < 1 ? mixRect({ ...LINE }, FULL, q) : FULL, chrome: Math.min(prog(t, K.chrome, 0.4), 1 - prog(t, K.blocks, 0.3)), desk: 0, hw: 0 });
    $.winClip.style.background = "transparent";
    $.appBg.style.opacity = (prog(t, K.clip + 0.2, 0.6) * (1 - prog(t, K.blocks, 0.7, E.inOut))).toFixed(3);
    applyIntro(t);
    applyShell(t);
    applyTiles(t);
    applyChart(t);
    applyCats(t);
    applyToast(t);
    applyFocus(t);
    applyFold(t, v);
    const vis = (t >= K.c3 - 0.7 && t < K.c12 + 1.0) || (t >= K.toggle - 0.75 && t < K.toggle + 1.0);
    placePointer(t, POINTER, [K.c3, K.c6, K.c12, K.toggle], vis ? -1 : 1e9, vis ? 1e9 : -1);
    const fade = t < K.toggle - 1 ? Math.min(prog(t, K.c3 - 0.7, 0.2), 1 - prog(t, K.c12 + 0.8, 0.2)) : Math.min(prog(t, K.toggle - 0.75, 0.2), 1 - prog(t, K.toggle + 0.8, 0.2));
    $.pointer.style.opacity = fade.toFixed(3);
  }
  applyType(t);
  applyCaptions(t);
  applyBrand(t, v);
}

function camera(t) {
  const whole = onWindow(600, 392, 1.2), plot = onWindow(PL.x + PL.w / 2 - 6, PL.y + PL.h / 2 - 8, 2.45);
  return cameraAt(t, [
    { t: 0, ...plot },
    { t: K.drop, ...onWindow(PL.x + PL.w / 2 - 4, PL.y + PL.h / 2 - 6, 2.52), d: K.pull - K.drop },
    { t: K.pull, ...whole, d: 2.0 },
    { t: K.pull + 2.0, ...onWindow(600, 392, 1.225), d: K.p1 - K.pull - 2.0 },
    { t: K.p1, ...onWindow(112, 392, 0.82), d: 1.0 },
    { t: K.p1 + 1.0, ...onWindow(116, 392, 0.835), d: K.p2 - K.p1 - 1.0 },
    { t: K.p2, ...onWindow(1088, 392, 0.82), d: 1.0 },
    { t: K.dive, ...onWindow(LINE.x + LINE.w / 2, LINE.y + LINE.h / 2 - 4, 1.9), d: 1.0 },
    { t: K.dive + 1.0, ...onWindow(LINE.x + LINE.w / 2 + 6, LINE.y + LINE.h / 2 - 4, 1.96), d: K.back - K.dive - 1.0 },
    { t: K.back, ...whole, d: 0.95 },
    { t: K.back + 0.95, ...onWindow(600, 392, 1.23), d: K.p3 - K.back - 0.95 },
    { t: K.p3, ...onWindow(112, 392, 0.82), d: 1.0 },
    { t: K.dive3, ...onWindow(CAT.x + CAT.w / 2, CAT.y + CAT.h / 2 - 4, 1.9), d: 1.0 },
    { t: K.dive3 + 1.0, ...onWindow(CAT.x + CAT.w / 2 - 6, CAT.y + CAT.h / 2 - 4, 1.95), d: K.back2 - K.dive3 - 1.0 },
    { t: K.back2, ...whole, d: 0.95 },
  ]);
}

const toWin = (v, r) => ({ x: (r.x - FILM.W / 2) / v.z + v.cx - WIN.x, y: (r.y - FILM.H / 2) / v.z + v.cy - WIN.y, w: r.w / v.z, h: r.h / v.z, r: r.r / v.z });
const markRect = (i) => ({ x: LOCK.x + MARK[i][0] * LOCK.s, y: LOCK.y + MARK[i][1] * LOCK.s, w: LOCK.s, h: LOCK.s, r: LOCK.s * 0.12 });

// ---- 1. i blocchi diventano colonne, le colonne una linea ----
function applyIntro(t) {
  const dotP = (i) => prog(t, K.dots + i * 0.03, 0.4, E.inOut);
  const v = camera(t);
  const dim = 1 - 0.78 * Math.min(prog(t, K.type1 - 0.1, 0.35), 1 - prog(t, K.typeOut, 0.4));
  $.bars.style.opacity = dim.toFixed(3);
  REV.forEach((val, i) => {
    const el = $["bar" + i], base = PL.y + PL.h;
    const col = i - 3; // i blocchi del marchio cadono nelle colonne da 3 a 7
    const fromBlock = col >= 0 && col <= 4;
    const sq = { x: slotX(i) - BAR_W / 2, y: base - BAR_W, w: BAR_W, h: BAR_W, r: 5 };
    let r;
    if (fromBlock && t < K.drop + 0.35) {
      const b = MARK.findIndex(([c]) => c === col);
      r = mixRect(toWin(v, markRect(b)), sq, prog(t, K.drop, 0.35, E.in));
    } else {
      const pop = fromBlock ? 1 : clamp(spring(t, K.rise + Math.abs(i - 5) * 0.045, 0.42, 0.62), 0, 1.15);
      if (!fromBlock && t < K.rise + Math.abs(i - 5) * 0.045) { show(el, false); return; }
      const h = lerp(BAR_W, PL.h * val / MAX, clamp(spring(t, K.grow + i * 0.055, 0.6, 0.72), 0, 1.08));
      r = { x: slotX(i) - (BAR_W * pop) / 2, y: base - h * (fromBlock ? 1 : pop), w: BAR_W * pop, h: h * (fromBlock ? 1 : pop), r: 5 };
    }
    // le colonne si riducono alla loro cima e diventano i punti della linea
    const d = dotP(i);
    if (d > 0) r = mixRect(r, { x: X(i, 12) - 7, y: Y(val) - 7, w: 14, h: 14, r: 7 }, d);
    const gone = prog(t, K.line + i * 0.05, 0.25, E.in);
    show(el, gone < 1);
    rectCss(el, r);
    el.style.opacity = (1 - gone).toFixed(3);
  });
  show($.bars, t < K.line + 1.0);
}

// ---- 2. la schermata si compone ----
function applyShell(t) {
  const s = clamp(spring(t, K.side, 0.6, 0.86), 0, 1);
  const out = prog(t, K.fold, 0.35, E.in);
  show($.side, t >= K.side);
  setT($.side, `translateX(${((1 - s) * -230 - out * 230).toFixed(2)}px)`);
  show($.top, t >= K.side);
  $.top.style.opacity = (prog(t, K.side, 0.4) * (1 - out)).toFixed(3);
  if (out > 0) sink($.title, out); else rise($.title, clamp(spring(t, K.title, 0.5, 0.88), 0, 1));
  const r = rangeStep(t);
  const sel = CHIPX[[3, 6, 12].indexOf(12)];
  const at = (k) => CHIPX[k];
  const x = track(t, at(2).x, K.range.map((k) => ({ t: k.t - 0.06, to: at([3, 6, 12].indexOf(k.to)).x, spring: [0.42, 0.82] })));
  const w = track(t, at(2).w, K.range.map((k) => ({ t: k.t - 0.06, to: at([3, 6, 12].indexOf(k.to)).w, spring: [0.42, 0.82] })));
  rectCss($.chipSel, { x, y: CHIP_Y, w, h: 36, r: 10 });
  const cs = clamp(spring(t, K.chips + 0.2, 0.45, 0.8), 0, 1.05);
  show($.chipSel, t >= K.chips + 0.2 && out < 1);
  setT($.chipSel, `scale(${(cs * (1 - out)).toFixed(4)})`);
  CHIPS.forEach(([, n], k) => {
    const el = $["chip" + k], a = K.chips + k * 0.06;
    const e = clamp(spring(t, a, 0.42, 0.7), 0, 1.08);
    show(el, t >= a && out < 1);
    setT(el, `scale(${(e * (1 - out) * press(t, [K.c3, K.c6, K.c12][k], 0.93)).toFixed(4)})`);
    el.style.color = n === r ? "var(--winBg)" : "var(--ink2)";
  });
  void sel;
}

function tileRect(k) { return { x: BODY.x + k * (TILE.w + TILE.gap), y: TILE.y, w: TILE.w, h: TILE.h, r: 16 }; }

function applyTiles(t) {
  const up = (k) => prog(t, K.tiles + 0.1 + k * 0.08, 0.9, E.out);
  const vals = [
    tween(t, (r, e) => rev(r, e)), tween(t, (r, e) => orders(r, e)), tween(t, (r) => late(r)),
  ];
  const r = rangeStep(t), e = eventAt(t);
  const pct = (rev(r, e) - prev(r)) / prev(r) * 100;
  const text = [
    [fmt(vals[0] * up(0)) + " €", `<b style="color:#4CC94C;font-weight:600">+${dec(pct)}%</b> sull'anno prima`],
    [fmt(vals[1] * up(1)), `nel periodo scelto`],
    [fmt(vals[2] * up(2)), `<b style="color:var(--ink);font-weight:600">${dec(late(r) / orders(r, e) * 100)}%</b> degli ordini`],
    [dec(2.4 * up(3) + 3.4 * (1 - up(3))) + " gg", `<b style="color:#4CC94C;font-weight:600">−${dec(LEAD[12 - r] - 2.4)} gg</b> nel periodo`],
  ];
  const labels = ["Fatturato", "Ordini", "In ritardo", "Consegna media"];
  [0, 1, 2, 3].forEach((k) => {
    const el = $["tile" + k], a = K.tiles + k * 0.08;
    if ($["tl" + k].textContent !== labels[k]) $["tl" + k].textContent = labels[k];
    if ($["tv" + k].textContent !== text[k][0]) $["tv" + k].textContent = text[k][0];
    if ($["td" + k].innerHTML !== text[k][1]) $["td" + k].innerHTML = text[k][1];
    if (t >= K.fold) return; // dopo, la scheda diventa un blocco (applyFold)
    const s = clamp(spring(t, a, 0.5, 0.78), 0, 1.04);
    show(el, t >= a);
    rectCss(el, tileRect(k));
    el.style.background = "var(--surface)";
    setT(el, `translateY(${((1 - Math.min(s, 1)) * 40).toFixed(2)}px) scale(${(0.92 + 0.08 * s).toFixed(4)})`);
    el.style.opacity = Math.min(1, s * 1.4).toFixed(3);
    if ($["tl" + k].textContent !== labels[k]) $["tl" + k].textContent = labels[k];
    if ($["tv" + k].textContent !== text[k][0]) $["tv" + k].textContent = text[k][0];
    if ($["td" + k].innerHTML !== text[k][1]) $["td" + k].innerHTML = text[k][1];
    // l'ordine nuovo accende la scheda Ordini e quella del fatturato
    const hit = k < 2 ? pulse(t, K.event + 0.25 + k * 0.05, 0.6) : 0;
    el.style.boxShadow = `inset 0 0 0 ${(1 + 2 * hit).toFixed(2)}px ${hit > 0.02 ? `rgba(151,71,255,${(0.4 + 0.6 * hit).toFixed(3)})` : "var(--hair)"}`;
    $["tv" + k].style.color = hit > 0.02 ? `color-mix(in srgb, #C29BFF ${(hit * 100).toFixed(1)}%, var(--ink))` : "";
    $["tileIn" + k].style.opacity = "";
  });
}

// ---- 3. il grafico: linea, periodo, cursore, ordine nuovo ----
function applyChart(t) {
  const rr = rangeAt(t);
  const cur = REV.map((v, i) => (i === 11 ? lastRev(t) : v));
  const dCur = pathD(cur, rr), dPrev = pathD(REV_PREV, rr);
  $.curPath.setAttribute("d", dCur);
  $.prevPath.setAttribute("d", dPrev);
  $.area.setAttribute("d", `${dCur}L${X(11, rr).toFixed(2)},${PL.y + PL.h}L${X(0, rr).toFixed(2)},${PL.y + PL.h}Z`);
  // la linea si disegna lungo la sua lunghezza
  const len = 1400;
  const draw = prog(t, K.line, 0.85, E.inOut), drawPrev = prog(t, K.prevLine, 0.8, E.inOut);
  for (const [el, p] of [[$.curPath, draw], [$.prevPath, drawPrev]]) {
    el.setAttribute("stroke-dasharray", p < 1 ? `${len} ${len}` : "none");
    el.setAttribute("stroke-dashoffset", p < 1 ? ((1 - p) * len).toFixed(1) : "0");
  }
  show($.curPath, t >= K.line); show($.prevPath, t >= K.prevLine);
  $.area.style.opacity = prog(t, K.line + 0.5, 0.6).toFixed(3);
  show($.area, t >= K.line + 0.5);

  const reveal = prog(t, K.pull + 0.6, 0.6);
  const fold = 1 - prog(t, K.blocks + 0.25, 0.3, E.in);
  for (const key of ["axes", "monthsBox", "lineHead"]) { show($[key], reveal > 0 && fold > 0); $[key].style.opacity = (reveal * fold).toFixed(3); }
  $.monthsBox.style.opacity = (reveal * (1 - prog(t, K.blocks, 0.2, E.in))).toFixed(3);
  $.chart.style.opacity = fold.toFixed(3);
  MONTHS.forEach((_, i) => {
    const el = $["mo" + i], x = X(i, rr);
    el.style.left = x.toFixed(2) + "px";
    el.style.opacity = clamp((x - PL.x + 26) / 26).toFixed(3);
  });
  show($.lineCard, t >= K.drop && t < K.blocks + 0.01);
  if (t < K.fold) { rectCss($.lineCard, LINE); $.lineCard.style.background = "var(--surface)"; $.lineCard.style.opacity = prog(t, K.pull + 0.1, 0.7).toFixed(3); }

  // il punto finale e il suo valore
  const ex = X(11, rr), ey = Y(cur[11]);
  const endOn = t >= K.line + 0.8 && t < K.blocks + 0.55;
  show($.endDot, endOn); show($.endLab, endOn);
  $.endDot.style.left = ex.toFixed(2) + "px"; $.endDot.style.top = ey.toFixed(2) + "px";
  setT($.endDot, `scale(${(clamp(spring(t, K.line + 0.8, 0.4, 0.6), 0, 1.2) * (1 + 0.5 * pulse(t, K.event + 0.3, 0.5))).toFixed(4)})`);
  const lab = String(Math.round(cur[11]));
  if ($.endLab.textContent !== lab) $.endLab.textContent = lab;
  $.endLab.style.left = (ex + 12).toFixed(2) + "px"; $.endLab.style.top = (ey - 11).toFixed(2) + "px";
  $.endLab.style.opacity = prog(t, K.line + 0.9, 0.3).toFixed(3);
  const ring = prog(t, K.event + 0.3, 0.9, E.out);
  show($.ring, ring > 0 && ring < 1);
  rectCss($.ring, { x: ex - 8 - ring * 30, y: ey - 8 - ring * 30, w: 16 + ring * 60, h: 16 + ring * 60, r: 8 + ring * 30 });
  $.ring.style.opacity = (1 - ring).toFixed(3);

  // il cursore scorre i mesi: la scheda segue i valori
  const sOn = t >= K.scrub - 0.2 && t < K.scrubEnd + 0.2;
  const sv = Math.min(prog(t, K.scrub - 0.2, 0.2), 1 - prog(t, K.scrubEnd, 0.2));
  for (const key of ["cursor", "cursorDot", "tip"]) { show($[key], sOn); $[key].style.opacity = sv.toFixed(3); }
  if (sOn) {
    const j = 11 * prog(t, K.scrub, K.scrubEnd - K.scrub, E.inOut);
    const i0 = Math.floor(j), f = j - i0, i1 = Math.min(11, i0 + 1);
    const a = lerp(cur[i0], cur[i1], f), b = lerp(REV_PREV[i0], REV_PREV[i1], f);
    const x = lerp(X(i0, 12), X(i1, 12), f), y = Y(a);
    $.cursor.style.left = x.toFixed(2) + "px";
    $.cursorDot.style.left = x.toFixed(2) + "px"; $.cursorDot.style.top = y.toFixed(2) + "px";
    rectCss($.tip, { x: Math.min(x + 16, PL.x + PL.w - 150), y: Math.max(PL.y - 30, y - 120), w: 208, h: 96, r: 14 });
    const m = MONTHS_FULL[Math.round(j)];
    const M = m[0].toUpperCase() + m.slice(1) + (Math.round(j) >= 3 ? " 2026" : " 2025");
    if ($.tipM.textContent !== M) $.tipM.textContent = M;
    const A = fmt(a * 1000) + " €", Bv = fmt(b * 1000) + " €";
    if ($.tipA.textContent !== A) $.tipA.textContent = A;
    if ($.tipB.textContent !== Bv) $.tipB.textContent = Bv;
  }
  // a fine corsa, il valore che conta in grande
  const pk = clamp(spring(t, K.scrubEnd + 0.05, 0.5, 0.8), 0, 1.04), pkOut = prog(t, K.back - 0.1, 0.3, E.in);
  show($.peak, t >= K.scrubEnd + 0.05 && pkOut < 1);
  rectCss($.peak, { x: ex - 240, y: ey - 112, w: 230, h: 64, r: 0 });
  setT($.peak, `translateY(${((1 - Math.min(pk, 1)) * 20).toFixed(2)}px)`);
  $.peak.style.opacity = (Math.min(1, pk * 1.4) * (1 - pkOut)).toFixed(3);
  $.curPath.style.strokeWidth = (3.5 + 1.5 * Math.min(prog(t, K.dive, 0.6), 1 - prog(t, K.back, 0.4))).toFixed(2);
}

// ---- 4. ordini per categoria: si ricrescono dalla stessa linea, poi si riordinano per crescita ----
function applyCats(t) {
  const reveal = clamp(spring(t, K.cats, 0.55, 0.84), 0, 1.03);
  if (t < K.fold) {
    show($.catCard, t >= K.cats);
    rectCss($.catCard, CAT);
    $.catCard.style.background = "var(--surface)";
    setT($.catCard, `translateY(${((1 - Math.min(reveal, 1)) * 40).toFixed(2)}px)`);
    $.catCard.style.opacity = Math.min(1, reveal * 1.4).toFixed(3);
  }
  const fold = 1 - prog(t, K.fold - 0.1, 0.25, E.in);
  const on = t >= K.cats && fold > 0;
  for (const key of ["catHead", "seg"]) { show($[key], on); $[key].style.opacity = (Math.min(1, reveal * 1.4) * fold).toFixed(3); }
  const sub = `Ultimi ${rangeStep(t)} mesi`;
  if ($.catSub.textContent !== sub) $.catSub.textContent = sub;
  const growth = prog(t, K.toggle + 0.08, 0.35, E.snappy);
  rectCss($.segSel, { x: 3 + growth * (SEG.w / 2 - 3), y: 3, w: SEG.w / 2 - 3, h: SEG.h - 6, r: 8 });
  setT($.seg, `scale(${press(t, K.toggle, 0.95).toFixed(4)})`);
  $.seg0.style.color = growth < 0.5 ? "var(--ink)" : "var(--ink2)";
  $.seg1.style.color = growth >= 0.5 ? "var(--ink)" : "var(--ink2)";
  // la linea di partenza comune si accende quando le barre ricrescono
  const bl = Math.min(prog(t, K.regrow, 0.3), 1 - prog(t, K.regrow + 1.4, 0.5));
  show($.baseline, bl > 0 && on);
  $.baseline.style.opacity = bl.toFixed(3);
  const order = [3, 2, 1, 4, 0]; // posizione in classifica per crescita (Giardino in cima)
  const maxG = 22;
  CATS.forEach(([, share, g], c) => {
    const el = $["row" + c];
    const a = K.cats + 0.25 + c * 0.07;
    const e = clamp(spring(t, a, 0.5, 0.86), 0, 1);
    show(el, t >= a && on);
    const y = track(t, ROW.y + c * ROW.h, [{ t: K.toggle + 0.15 + order[c] * 0.04, to: ROW.y + order[c] * ROW.h, spring: [0.55, 0.78] }]);
    el.style.top = y.toFixed(2) + "px";
    el.style.opacity = (Math.min(1, e * 1.5) * fold).toFixed(3);
    setT(el, `translateY(${((1 - e) * 24).toFixed(2)}px)`);
    // larghezza: quota degli ordini, poi crescita; scende a zero e ricresce dalla linea comune
    const grow0 = prog(t, a + 0.15, 0.7, E.out);
    const collapse = 1 - prog(t, K.regrow, 0.25, E.in) + clamp(spring(t, K.regrow + 0.35 + c * 0.08, 0.55, 0.72), 0, 1.06);
    const k = t >= K.regrow ? Math.min(collapse, 1.06) : grow0;
    const frac = lerp(share / 0.31, g / maxG, prog(t, K.toggle + 0.15 + c * 0.03, 0.55, E.inOut));
    $["rb" + c].style.width = Math.max(0, ROW.w * frac * k).toFixed(2) + "px";
    $["rb" + c].style.background = growth > 0.5 ? (c === 4 ? "#B57BFF" : "var(--accent)") : "var(--accent)";
    const count = tween(t, (r, ev) => Math.round(share * orders(r, 0)) + (c === NEW_ORDER.cat ? ev : 0));
    const label = growth >= 0.5 ? `+${g}%` : fmt(count * (t >= K.regrow ? 1 : grow0));
    if ($["rv" + c].textContent !== label) $["rv" + c].textContent = label;
    $["rv" + c].style.color = c === NEW_ORDER.cat && pulse(t, K.event + 0.3, 0.6) > 0.02 ? "#C29BFF" : "";
  });
}

// ---- 5. l'ordine nuovo: arriva in alto a destra e vola nella scheda Ordini ----
function applyToast(t) {
  const on = t >= K.toast && t < K.event + 0.45;
  show($.toast, on);
  if (!on) return;
  const s = clamp(spring(t, K.toast, 0.5, 0.78), 0, 1.03);
  const fly = prog(t, K.event, 0.42, E.inOut);
  const start = { ...TOAST, x: TOAST.x + (1 - s) * 320, r: 16 };
  const tile = tileRect(1);
  rectCss($.toast, fly > 0 ? mixRect(start, { ...tile, x: tile.x + 20, y: tile.y + 30, w: 60, h: 40, r: 12 }, fly) : start);
  $.toastIn.style.opacity = (1 - prog(t, K.event, 0.15)).toFixed(3);
  $.toast.style.opacity = (1 - prog(t, K.event + 0.3, 0.15)).toFixed(3);
}

// ---- messa a fuoco: durante gli affondi il resto della schermata si abbassa ----
function applyFocus(t) {
  const lineF = Math.min(prog(t, K.dive, 0.6), 1 - prog(t, K.back, 0.5));
  const catF = Math.min(prog(t, K.dive3, 0.6), 1 - prog(t, K.back2, 0.5));
  const dimOthers = (keys, f) => keys.forEach((k) => { if ($[k].style.visibility !== "hidden") $[k].style.filter = f > 0.01 ? `brightness(${(1 - 0.55 * f).toFixed(3)})` : ""; });
  dimOthers(["tile0", "tile1", "tile2", "tile3", "side", "top", "chip0", "chip1", "chip2", "chipSel"], Math.max(lineF, catF));
  dimOthers(["catCard", "catHead", "seg", "row0", "row1", "row2", "row3", "row4"], lineF);
  dimOthers(["lineCard", "lineHead", "axes", "monthsBox", "chart", "endDot", "endLab"], catF);
}

// ---- 6. le schede si richiudono nei cinque blocchi del marchio ----
function applyFold(t, v) {
  if (t < K.blocks) { for (const k of ["chart", "axes", "endDot", "endLab", "lineHead"]) $[k].style.clipPath = ""; }
  if (t < K.fold) return;
  const merge = prog(t, K.fold, 0.4, E.inOut);
  // la scheda delle categorie entra in quella del fatturato
  show($.catCard, merge < 1);
  rectCss($.catCard, mixRect(CAT, LINE, merge));
  $.catCard.style.opacity = (1 - merge).toFixed(3);
  setT($.catCard, "none");
  const target = (i) => toWin(v, markRect(i));
  const cards = [["lineCard", LINE, 0], ["tile0", tileRect(0), 3], ["tile1", tileRect(1), 1], ["tile2", tileRect(2), 2], ["tile3", tileRect(3), 4]];
  cards.forEach(([key, from, mi], n) => {
    const el = $[key];
    const p = prog(t, K.blocks + n * 0.07, 0.7, E.inOut);
    show(el, true);
    rectCss(el, mixRect(from, target(mi), p));
    setT(el, "none");
    el.style.opacity = "1";
    el.style.filter = "";
    el.style.boxShadow = p > 0.3 ? "none" : "inset 0 0 0 1px var(--hair)";
    el.style.background = `color-mix(in srgb, var(--accent) ${(prog(t, K.blocks + n * 0.07 + 0.05, 0.35) * 100).toFixed(1)}%, var(--surface))`;
    if (key !== "lineCard") $["tileIn" + key.slice(4)].style.opacity = (1 - prog(t, K.blocks + 0.15, 0.25)).toFixed(3);
    // il contenuto del grafico resta dentro la scheda mentre si chiude
    if (key === "lineCard") {
      const r = mixRect(from, target(mi), p);
      const ins = `inset(${r.y.toFixed(1)}px ${(1200 - r.x - r.w).toFixed(1)}px ${(780 - r.y - r.h).toFixed(1)}px ${r.x.toFixed(1)}px round ${r.r.toFixed(1)}px)`;
      for (const k of ["chart", "axes", "endDot", "endLab", "lineHead"]) $[k].style.clipPath = ins;
    }
  });
}

// ---- grande tipografia ----
function applyType(t) {
  const lines = [["typeA", K.type1], ["typeB", K.type2]];
  show($.type, t >= K.type1 && t < K.typeOut + 0.6);
  lines.forEach(([key, at], l) => {
    const out = prog(t, K.typeOut + (1 - l) * 0.06, 0.3, E.in);
    if (out > 0) sink($[key], out); else rise($[key], clamp(spring(t, at, 0.5, 0.86), 0, 1));
  });
}

function applyCaptions(t) {
  CAPTIONS.forEach((c) => {
    const at = K[c.at], out = K[c.out];
    [["E", 0], ["A", 0.08], ["B", 0.16]].forEach(([s, d], n) => {
      const el = $[c.key + s];
      const o = prog(t, out + (2 - n) * 0.05, 0.3, E.in);
      show(el, t >= at + d && o < 1);
      if (o > 0) sink(el, o); else rise(el, clamp(spring(t, at + d, 0.5, 0.86), 0, 1));
    });
  });
}

// ---- marchio: primo fotogramma, apertura, firma finale ----
function applyBrand(t, v) {
  const glow = (g) => {
    const R = 330 * LOCK.k * (0.8 + 0.2 * g), gy = LOCK.y + 1.5 * LOCK.s + 20 * LOCK.k;
    $.lkGlow.style.background = `radial-gradient(${R.toFixed(0)}px ${(R * 0.92).toFixed(0)}px at ${LOCK.cx}px ${gy.toFixed(0)}px, rgba(110,40,200,${(0.55 * g).toFixed(3)}), rgba(70,20,140,${(0.22 * g).toFixed(3)}) 45%, rgba(0,0,0,0) 100%)`;
  };
  const intro = t < K.drop + 0.45, outro = t >= K.blocks;
  show($.lkBlack, intro || outro); show($.lkGlow, intro || outro);
  show($.lkClip, t >= K.lock);
  MARK.forEach((_, i) => show($["mk" + i], false));
  if (intro) {
    const q = prog(t, K.drop, 0.45, E.inOut);
    $.lkBlack.style.opacity = (1 - q).toFixed(3);
    glow(1 - q);
    // gli altri quattro blocchi escono da quello in cima; poi cadono nel grafico
    if (t < K.drop) placeMark("mk", LOCK.x, LOCK.y, LOCK.s, (i) => (i === 0 ? 1 : spring(t, K.open + i * 0.08, 0.5, 0.78)));
    return;
  }
  if (!outro) return;
  $.lkBlack.style.opacity = prog(t, K.blocks + 0.1, 0.7, E.inOut).toFixed(3);
  glow(prog(t, K.blocks + 0.5, 1.0, E.out));
  if (t < K.lock) return;
  const back = (i) => 1 - prog(t, K.out + 0.3 + (4 - i) * 0.05, 0.35, E.in);
  placeMark("mk", LOCK.x, LOCK.y, LOCK.s, (i) => (i === 0 ? 1 : back(i)));
  if (t < K.out) rise($.lkRow, clamp(spring(t, K.lock + 0.3, 0.55, 0.88), 0, 1));
  else sink($.lkRow, prog(t, K.out, 0.3, E.in));
}

// ---- suoni delle azioni ----
function cues() {
  const c = [];
  c.push(["pop", K.open + 0.08, { note: 0 }], ["pop", K.open + 0.16, { note: 2 }], ["pop", K.open + 0.24, { note: 4 }], ["pop", K.open + 0.32, { note: 5 }]);
  c.push(["thud", K.drop + 0.33]);
  REV.forEach((_, i) => c.push(["blip", K.grow + i * 0.055, { note: i % 8, gain: 0.7 }]));
  c.push(["thud", K.type1, { gain: 0.8 }], ["thud", K.type2, { gain: 0.9 }], ["whoosh", K.typeOut, { pan: -0.3 }]);
  c.push(["swish", K.line], ["swish", K.prevLine, { gain: 0.6 }]);
  c.push(["whoosh", K.pull, { gain: 1.1 }]);
  [0, 1, 2, 3].forEach((k) => c.push(["pop", K.tiles + k * 0.08, { note: 3 + k }]));
  c.push(["whoosh", K.p1, { pan: 0.4 }], ["thud", K.cap1 + 0.08, { gain: 0.6 }]);
  for (const k of [K.c3, K.c6, K.c12]) c.push(["click", k], ["swish", k + 0.1, { gain: 0.5 }]);
  c.push(["whoosh", K.p2, { pan: -0.4 }], ["thud", K.cap2 + 0.08, { gain: 0.6 }], ["whoosh", K.dive, { gain: 0.8 }]);
  c.push(["swish", K.scrub, { gain: 0.7 }], ["pop", K.scrubEnd + 0.05, { note: 7 }]);
  c.push(["whoosh", K.back, { gain: 0.8 }], ["pop", K.toast, { note: 5 }], ["whoosh", K.event, { gain: 0.7, pan: -0.3 }], ["chime", K.event + 0.3, { gain: 0.8 }]);
  c.push(["whoosh", K.p3, { pan: 0.4 }], ["thud", K.cap3 + 0.08, { gain: 0.6 }], ["whoosh", K.dive3, { gain: 0.8 }]);
  CATS.forEach((_, i) => c.push(["blip", K.regrow + 0.35 + i * 0.08, { note: 2 + i }]));
  c.push(["click", K.toggle], ["swish", K.toggle + 0.15, { gain: 0.6 }]);
  c.push(["whoosh", K.back2, { gain: 0.8 }], ["whoosh", K.blocks, { gain: 1.0 }]);
  [0, 1, 2, 3, 4].forEach((n) => c.push(["pop", K.blocks + 0.6 + n * 0.07, { note: n }]));
  c.push(["chime", K.lock, { gain: 1.0 }], ["swish", K.out + 0.3, { gain: 0.5 }]);
  return c;
}
