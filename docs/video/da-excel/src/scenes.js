film({ W: 1920, H: 1080, BPM: 120, BEATS: 23, holds: [[8.9, 2], [10.9, 3], [14.9, 4]] });

// Bozza di prova: un foglio di calcolo caotico diventa un gestionale su misura.
// Tutti i nomi, gli importi e i numeri d'ordine sono inventati.
const BRAND = { name: "Merkorn", line: "Il gestionale su misura per come lavori." };
const CLIENT = "Rossi Forniture";

// [n°, cliente, data, prodotto, q.tà, importo, stato nel foglio, stato pulito, nota, riempimento, inchiostro]
const ORD = [
  ["1041", "Bianchi Arredi", "02/09", "Pannelli rovere", "12", "1.840,00", "consegnato", 2, "", "", ""],
  ["1042", "Ferri & Figli", "03/09", "Viti inox M6", "400", "312,50", "DA FARE", 0, "CHIAMARE!!", "#FFF2A8", ""],
  ["1043", "Studio Gallo", "04/09", "Mensole noce", "6", "690,00", "in consegna", 1, "chiedi a Marco", "", ""],
  ["1044", "Pasticceria Moretti", "05/09", "Vassoi alluminio", "50", "425,00", "Consegnato", 2, "fattura??", "", "#C0392B"],
  ["1045", "Edil Conti", "05/09", "Staffe zincate", "120", "2.160,00", "da evadere??", 0, "", "#FFD6D6", "#B03A2E"],
  ["1046", "Ottica Sala", "08/09", "Espositori", "4", "1.120,00", "in consegna", 1, "già pagato? controllare", "", ""],
  ["1047", "Hotel Lago Blu", "09/09", "Carrelli piani", "8", "3.480,00", "CONSEGNATO", 2, "", "#D9F2D0", ""],
  ["1048", "Cantina Ruggeri", "10/09", "Scaffali", "10", "2.950,00", "da fare", 0, "URGENTE", "", ""],
  ["1049", "Farmacia Greco", "11/09", "Cassettiere", "3", "870,00", "in consegna", 1, "", "#FFF2A8", ""],
  ["1050", "Tipografia Riva", "12/09", "Pianali", "2", "1.460,00", "consegnato", 2, "vedi mail del 3/9", "", ""],
  ["1051", "Autofficina Neri", "15/09", "Banchi lavoro", "2", "1.980,00", "Da evadere", 0, "", "", ""],
  ["1052", "Bar Centrale", "15/09", "Sgabelli", "16", "1.344,00", "in consegna", 1, "sconto 10%?", "", ""],
  ["1053", "Fiori di Marta", "16/09", "Vasche zinco", "20", "560,00", "consegnato", 2, "", "", ""],
  ["1054", "Idraulica Costa", "17/09", "Raccordi ottone", "300", "1.290,00", "consegnato", 2, "", "", ""],
];
const NEW = ["1055", "Ristorante Da Pino", "18/09", "Teglie inox", "", "1.640,00", "", 0];
const STATI = [["Da evadere", "#B4540A", "#FDEBD3"], ["In consegna", "#1F5FBF", "#E2ECFB"], ["Consegnato", "#1E7A46", "#DDF3E5"]];

// Foglio di calcolo, in punti finestra
const SH = { top: 108, row: 30, rn: 40, cols: [40, 100, 300, 400, 580, 640, 760, 900, 1200] };
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const HEAD = ["N°", "Cliente", "Data", "Prodotto", "Q.tà", "Importo €", "Stato", "Note"];
const TABS = [["ORDINI_def_v3", 1], ["MAGAZZINO (2)", 2], ["copia di Fatture", 3], ["NON TOCCARE", 4]];
// Gestionale, in punti finestra
const SIDE_W = 220;
const MENU = ["Dashboard", "Ordini", "Magazzino", "Fatture", "Clienti", "Report"];
const GT = { x: 248, w: 928, top: 290, row: 52, head: 256 };
const KPI = [
  { label: "Ordini del mese", v: ["14", "15"] },
  { label: "Da evadere", v: ["4", "5"] },
  { label: "Fatturato del mese", v: ["€ 20.481,50", "€ 22.121,50"] },
];
const KPI_Y = 140, KPI_H = 92, KPI_W = 296;
const CHIPS = [["Tutti", "14"], ["Da evadere", "4"], ["In consegna", "4"], ["Consegnati", "6"]];
const BTN = { x: 1012, y: 22, w: 164, h: 42 };
const SHOWN = 8;

// Dove finisce ogni campo di una riga: nel foglio (relativo alla riga del foglio) e nel gestionale (relativo alla riga della tabella)
const F = {
  num: { a: [46, 7, 13, 400], b: [16, 30, 12.5, 500] },
  cli: { a: [106, 7, 13, 400], b: [16, 8, 16, 600] },
  dat: { a: [306, 7, 13, 400], b: [282, 16, 15, 400] },
  pro: { a: [406, 7, 13, 400], b: [382, 16, 15, 400] },
  imp: { a: [646, 7, 13, 400], b: [600, 16, 15, 600] },
};

const K = {};
function timeline() {
  Object.assign(K, {
    err: B(2), wide: B(3), morph: B(5), labels: B(7), values: B(7.5), point: B(9), click: B(10), newRow: B(10) + 0.15,
    pull: B(11), close: B(12), word: B(13), line: B(14),
  });
  POINTER.splice(0, POINTER.length,
    { t: 0, ...W(820, 640) },
    { t: K.point, ...W(BTN.x + 96, BTN.y + 24), d: 0.45 });
}
const POINTER = [];
const W = (x, y) => ({ x: WIN.x + x, y: WIN.y + y });

const esc = (s) => s.replace(/&/g, "&amp;");
const txt = (k, s, css = "") => `<span class="abs t" data-k="${k}" style="left:0;top:0;${css}">${esc(s)}</span>`;

function build(stage) {
  timeline();
  const grid = [];
  for (const x of SH.cols) grid.push(`<i class="abs" style="left:${x}px;top:84px;width:1px;height:${SH.top - 84 + SH.row * (ORD.length + 1)}px;background:#D6D6D6"></i>`);
  for (let r = 0; r <= ORD.length + 1; r++) grid.push(`<i class="abs" style="left:0;top:${SH.top + r * SH.row}px;width:1200px;height:1px;background:#D6D6D6"></i>`);
  const letters = LETTERS.map((l, i) => `<span class="abs t" style="left:${SH.cols[i]}px;width:${SH.cols[i + 1] - SH.cols[i]}px;top:88px;text-align:center;font-size:12px;color:#666">${l}</span>`).join("");

  const rowHtml = (r, i, key) => {
    const [num, cli, dat, pro, qty, imp, raw, , note, fill, ink] = r;
    const inkCss = ink ? `color:${ink};` : "";
    return `
    <div class="abs" data-k="${key}" style="left:0;top:0;width:1200px;height:30px">
      <div class="abs" data-k="${key}Bg" style="left:0;top:0;width:100%;height:100%"></div>
      <span class="abs t" data-k="${key}Rn" style="left:0;width:${SH.rn}px;top:7px;text-align:center;font-size:12px;color:#777">${i + 2}</span>
      ${txt(key + "num", num, inkCss)}${txt(key + "cli", cli, inkCss + (i === 1 ? "font-weight:700;" : ""))}${txt(key + "dat", dat, inkCss)}
      ${txt(key + "pro", pro, inkCss)}${txt(key + "imp", imp, inkCss)}
      <span class="abs t" data-k="${key}Qty" style="left:586px;top:7px;font-size:13px;${inkCss}">${qty}</span>
      <span class="abs t" data-k="${key}Note" style="left:906px;top:7px;font-size:13px;color:${note === "URGENTE" || note === "CHIAMARE!!" ? "#D0021B;font-weight:700" : "#333"}">${esc(note)}</span>
      <div class="abs" data-k="${key}Pill" style="left:0;top:0;border-radius:13px"></div>
      ${txt(key + "st", raw, inkCss + (raw === raw.toUpperCase() ? "font-weight:700;" : ""))}
      <i class="abs" data-k="${key}Hair" style="left:16px;right:16px;bottom:0;height:1px;background:var(--hair)"></i>
    </div>`;
  };

  const app = `
    <div class="full" style="background:#FFFFFF"></div>
    <div class="abs" data-k="sheetChrome" style="left:0;top:0;width:1200px;height:780px">
      <div class="abs" style="left:0;top:0;width:1200px;height:52px;background:#1D6F42"></div>
      <span class="abs t" style="left:0;width:1200px;top:15px;text-align:center;font-size:14px;font-weight:600;color:#fff">ORDINI_def_v3 (copia) (2).xlsx</span>
      <div class="abs row" style="left:0;top:52px;width:1200px;height:32px;background:#F7F7F7;box-shadow:inset 0 -1px 0 #D6D6D6;padding-left:12px;gap:14px;font-size:13px">
        <i style="font-style:italic;color:#888;font-weight:600">fx</i><span style="color:#333">=SOMMA(F2:F15)+F17-F3</span>
      </div>
      <div class="abs" style="left:0;top:84px;width:1200px;height:24px;background:#F2F2F2"></div>
      ${letters}${grid.join("")}
      <div class="abs" data-k="total" style="left:0;top:${SH.top + SH.row * ORD.length}px;width:1200px;height:30px;background:#FAFAFA">
        <span class="abs t" style="left:106px;top:7px;font-size:13px;font-weight:700">TOTALE</span>
        <span class="abs t" data-k="ref" style="left:646px;top:7px;font-size:13px;font-weight:700;color:#D0021B">#RIF!</span>
        <span class="abs t" style="left:766px;top:7px;font-size:13px;color:#333">da evadere: ???</span>
      </div>
      <div class="abs" style="left:0;top:744px;width:1200px;height:36px;background:#F2F2F2;box-shadow:inset 0 1px 0 #D6D6D6"></div>
    </div>
    <div class="abs" data-k="side" style="background:#F2F2F2"></div>
    <div class="abs row" data-k="brand" style="left:20px;top:52px;gap:10px">
      <i style="width:26px;height:26px;border-radius:7px;background:#C2410C"></i><span class="t" style="font-size:16px;font-weight:700">${CLIENT}</span>
    </div>
    ${MENU.map((m, k) => `<div class="abs" data-k="menu${k}" style="border-radius:8px">
      <div class="abs mask" style="left:12px;top:0;width:180px;height:34px"><span class="abs t" data-k="menuT${k}" style="left:0;top:7px;font-size:15px;font-weight:${k === 1 ? 600 : 500};color:${k === 1 ? "var(--accent)" : "var(--ink2)"}">${m}</span></div>
    </div>`).join("")}
    ${TABS.map(([label], k) => `<span class="abs t" data-k="tab${k}" style="left:0;top:0;font-size:12.5px;color:${k === 3 ? "#D0021B" : "#333"};font-weight:${k === 0 ? 700 : 400}">${label}</span>`).join("")}
    <div class="abs mask" style="left:${GT.x}px;top:20px;width:400px;height:48px"><span class="abs t" data-k="title" style="left:0;top:0;font-size:30px;font-weight:700;letter-spacing:-.5px;line-height:46px">Ordini</span></div>
    <div class="abs center" data-k="btn" style="left:${BTN.x}px;top:${BTN.y}px;width:${BTN.w}px;height:${BTN.h}px;border-radius:10px;background:var(--accent);color:#fff;font-size:15px;font-weight:600">+ Nuovo ordine</div>
    ${CHIPS.map(([l, n], k) => `<div class="abs row" data-k="chip${k}" style="left:0;top:84px;height:34px;padding:0 14px;gap:8px;border-radius:17px;font-size:14px;font-weight:500;${k ? "background:var(--side);color:var(--ink2)" : "background:var(--ink);color:#fff"}"><span>${l}</span><span data-k="chipN${k}" style="opacity:.6">${n}</span></div>`).join("")}
    ${KPI.map((c, k) => `<div class="abs" data-k="kpi${k}" style="overflow:hidden">
      <div class="abs mask" style="left:20px;top:16px;width:260px;height:22px"><span class="abs t" data-k="kpiL${k}" style="left:0;top:0;font-size:14px;color:var(--ink2);line-height:22px">${c.label}</span></div>
      <div class="abs mask" style="left:20px;top:40px;width:260px;height:42px"><div class="abs" data-k="kpiV${k}" style="left:0;top:0;width:260px;height:42px"></div></div>
    </div>`).join("")}
    <div class="abs" data-k="thead" style="left:${GT.x}px;top:${GT.head}px;width:${GT.w}px;height:30px">
      ${[["Cliente", 16], ["Data", 282], ["Prodotto", 382], ["Importo", 600], ["Stato", 762]].map(([l, x]) => `<div class="abs mask" style="left:${x}px;top:0;width:120px;height:22px"><span class="abs t" style="left:0;top:0;font-size:12.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--ink3);line-height:22px">${l}</span></div>`).join("")}
      <i class="abs" style="left:0;right:0;bottom:0;height:1px;background:var(--hair)"></i>
    </div>
    <div class="full" data-k="rows">${ORD.map((r, i) => rowHtml(r, i, "r" + i)).join("")}${rowHtml([...NEW.slice(0, 7), 0, "", "", ""], -2, "nw")}</div>
    <div class="full" data-k="seal" style="background:var(--accent)"></div>`;

  stage.innerHTML = `
    <div class="full" style="background:var(--bg)"></div>
    ${desktopMarkup(app, { name: CLIENT })}
    <div class="full" data-k="word">
      <div class="abs" data-k="mark" style="background:var(--accent)"></div>
      <div class="abs mask" data-k="wmClip"><div data-k="wm" class="t" style="font-size:150px;font-weight:800;letter-spacing:-.045em;line-height:1.25">${BRAND.name}</div></div>
      <div class="abs mask" data-k="lnClip" style="height:60px"><div data-k="ln" class="t" style="font-size:42px;font-weight:500;color:var(--ink2);line-height:58px;letter-spacing:-.01em">${BRAND.line}</div></div>
    </div>`;
  collect(stage);
  for (let k = 0; k < KPI.length; k++) $["kpiR" + k] = roller($["kpiV" + k], "font-size:30px;font-weight:700;letter-spacing:-.5px;line-height:42px");
  for (let k = 0; k < CHIPS.length; k++) $["chipW" + k] = measure(CHIPS[k][0] + "  " + CHIPS[k][1], 14, 500) + 36;

  const wmW = measure(BRAND.name, 150, 800, "letter-spacing:-.045em"), markS = 128, gap = 44;
  const total = markS + gap + wmW;
  WM.markX = Math.round((FILM.W - total) / 2);
  WM.markY = 372;
  WM.markS = markS;
  Object.assign($.wmClip.style, { left: WM.markX + markS + gap + "px", top: WM.markY - 26 + "px", width: Math.ceil(wmW + 10) + "px", height: "188px" });
  const lnW = measure(BRAND.line, 42, 500, "letter-spacing:-.01em");
  Object.assign($.lnClip.style, { left: Math.round((FILM.W - lnW) / 2) + "px", top: "584px", width: Math.ceil(lnW + 6) + "px" });
}
const WM = {};

function apply(t) {
  const v = camera(t);
  const closing = prog(t, K.close, 0.6, E.inOut);
  show($.world, closing < 1);
  if (closing < 1) {
    placeWorld(v, { rect: closing > 0 ? mixRect(FULL, markInWindow(v), closing) : FULL, chrome: 1 - prog(t, K.close, 0.2), desk: 0, hw: 0 });
    applySheet(t);
    applyApp(t);
    $.seal.style.opacity = prog(t, K.close + 0.1, 0.35, E.out).toFixed(3);
    show($.seal, t >= K.close);
    placePointer(t, POINTER, [K.click], K.point - 0.1, K.pull + 0.3);
    $.pointer.style.opacity = (prog(t, K.point - 0.1, 0.2, E.out) * (1 - prog(t, K.pull, 0.3))).toFixed(3);
  }
  applyWord(t);
}

function camera(t) {
  return cameraAt(t, [
    { t: 0, ...onWindow(600, 330, 1.55) },
    { t: K.err + 0.3, ...onWindow(600, 334, 1.58), d: K.wide - K.err - 0.3 },
    { t: K.wide, ...onWindow(600, 390, 1.24), d: 1.1 },
    { t: K.labels, ...onWindow(640, 392, 1.3), d: 1.0 },
    { t: K.values + 0.6, ...onWindow(640, 392, 1.31), d: K.point - K.values - 0.6 },
    { t: K.newRow + 0.4, ...onWindow(640, 392, 1.325), d: K.pull - K.newRow - 0.4 },
    { t: K.pull, ...onWindow(600, 390, 1.0), d: 0.9 },
  ]);
}

function markInWindow(v) {
  const s = WM.markS;
  const x = (WM.markX - FILM.W / 2) / v.z + v.cx - WIN.x, y = (WM.markY - FILM.H / 2) / v.z + v.cy - WIN.y;
  return { x, y, w: s / v.z, h: s / v.z, r: 28 / v.z };
}

// La trasformazione: ogni riga, colonna e scheda del foglio diventa un pezzo del gestionale.
const pc = (t) => prog(t, K.morph, 0.45, E.inOut);
const pm = (t) => prog(t, K.morph + 0.45, 0.85, E.inOut);

function applySheet(t) {
  const p = pm(t);
  $.sheetChrome.style.opacity = (1 - pc(t)).toFixed(3);
  show($.sheetChrome, pc(t) < 1);
  const err = pulse(t, K.err, 0.5);
  $.ref.style.background = err > 0 ? `rgba(208,2,27,${(0.18 * err).toFixed(3)})` : "";

  // numeri di riga → barra laterale
  const side = mixRect({ x: 0, y: 84, w: SH.rn, h: 696, r: 0 }, { x: 0, y: 0, w: SIDE_W, h: 780, r: 0 }, p);
  rectCss($.side, side);
  $.side.style.background = `color-mix(in srgb, var(--side) ${(p * 100).toFixed(1)}%, #F2F2F2)`;
  $.side.style.boxShadow = `inset -1px 0 0 ${p > 0.5 ? "var(--hair)" : "#D6D6D6"}`;
  const br = spring(t, K.labels, 0.5, 0.88);
  show($.brand, t >= K.labels);
  setT($.brand, `translateY(${((1 - clamp(br, 0, 1)) * 16).toFixed(2)}px)`);
  $.brand.style.opacity = clamp(br * 1.4, 0, 1).toFixed(3);

  // schede del foglio → voci di menu
  const tabX = [16, 156, 296, 456];
  TABS.forEach(([, to], k) => {
    const q = prog(t, K.morph + 0.1 + k * 0.05, 0.8, E.inOut);
    const a = { x: tabX[k], y: 753 }, b = { x: 24, y: 100 + to * 40 + 7 };
    setT($["tab" + k], `translate(${lerp(a.x, b.x, q).toFixed(2)}px,${lerp(a.y, b.y, q).toFixed(2)}px)`);
    $["tab" + k].style.opacity = (1 - prog(t, K.morph + 0.55 + k * 0.05, 0.3, E.in)).toFixed(3);
    show($["tab" + k], q < 1);
  });
  MENU.forEach((_, k) => {
    const el = $["menu" + k];
    rectCss(el, { x: 12, y: 100 + k * 40, w: 196, h: 34, r: 8 });
    el.style.background = k === 1 && t >= K.labels ? `rgba(36,87,214,${(0.1 * prog(t, K.labels, 0.3)).toFixed(3)})` : "";
    const at = K.morph + 0.75 + k * 0.05;
    show(el, t >= at);
    rise($["menuT" + k], clamp(spring(t, at, 0.45, 0.88), 0, 1));
  });
}

function applyApp(t) {
  const p = pm(t);
  rise($.title, clamp(spring(t, K.labels, 0.5, 0.88), 0, 1));
  const bt = clamp(spring(t, K.labels + 0.1, 0.45, 0.72), 0, 1.06);
  show($.btn, t >= K.labels + 0.1);
  setT($.btn, `scale(${(bt * press(t, K.click, 0.93)).toFixed(4)})`);

  let cx = GT.x;
  CHIPS.forEach((c, k) => {
    const el = $["chip" + k], at = K.labels + 0.12 + k * 0.06;
    el.style.left = cx + "px";
    cx += Math.round($["chipW" + k]) + 10;
    show(el, t >= at);
    setT(el, `scale(${clamp(spring(t, at, 0.42, 0.7), 0, 1.08).toFixed(4)})`);
    el.style.transformOrigin = "0 50%";
  });
  const chipN = (k) => (t >= K.newRow + 0.2 ? [15, 5, 4, 6][k] : [14, 4, 4, 6][k]);
  CHIPS.forEach((_, k) => { const n = String(chipN(k)); if ($["chipN" + k].textContent !== n) $["chipN" + k].textContent = n; });

  // riga dei totali → tre schede di riepilogo
  KPI.forEach((c, k) => {
    const from = { x: 40 + k * 380, y: SH.top + SH.row * ORD.length, w: 380, h: 30, r: 0 };
    const to = { x: GT.x + k * (KPI_W + 20), y: KPI_Y, w: KPI_W, h: KPI_H, r: 14 };
    const el = $["kpi" + k];
    rectCss(el, mixRect(from, to, prog(t, K.morph + 0.15 + k * 0.05, 0.85, E.inOut)));
    el.style.background = `color-mix(in srgb, var(--side) ${(p * 100).toFixed(1)}%, #FAFAFA)`;
    show(el, t >= K.morph);
    show($["kpiL" + k], t >= K.labels);
    rise($["kpiL" + k], clamp(spring(t, K.labels + k * 0.06, 0.5, 0.88), 0, 1));
    roll($["kpiR" + k], t, [{ t: K.values + k * 0.08, v: c.v[0] }, { t: K.newRow + 0.25 + k * 0.08, v: c.v[1] }]);
    const glow = t >= K.newRow + 0.25 ? 1 - prog(t, K.newRow + 1.2, 1.2) : 0;
    $["kpiR" + k].b.style.color = $["kpiR" + k].a.style.color = glow > 0 ? `color-mix(in srgb, var(--accent) ${(glow * 100).toFixed(1)}%, var(--ink))` : "";
  });
  show($.thead, t >= K.labels);
  [...$.thead.querySelectorAll(".mask > span")].forEach((el, k) => rise(el, clamp(spring(t, K.labels + 0.05 + k * 0.04, 0.5, 0.88), 0, 1)));

  const push = clamp(spring(t, K.newRow, 0.5, 0.9), 0, 1);
  ORD.forEach((r, i) => placeRow(t, "r" + i, r, i, pm(t, i), push));
  const nw = t >= K.newRow;
  show($.nw, nw);
  if (nw) placeRow(t, "nw", NEW, -1, 1, push);
  $.rows.style.clipPath = p >= 1 ? `inset(${GT.top - 2}px 0 ${780 - (GT.top + GT.row * SHOWN)}px 0)` : "";
}

function placeRow(t, key, r, i, p, push) {
  const isNew = i < 0, far = i >= SHOWN;
  const c = far ? 0 : isNew ? 1 : pc(t);
  const el = $[key];
  const src = { x: 0, y: SH.top + i * SH.row, w: 1200, h: SH.row, r: 0 };
  const dst = { x: GT.x, y: GT.top + (isNew ? -GT.row + push * GT.row : i * GT.row + push * GT.row), w: GT.w, h: GT.row, r: 10 };
  let rect;
  if (far) {
    // le righe che non entrano scivolano fuori dal fondo della tabella
    const q = prog(t, K.morph + (i - SHOWN) * 0.03, 0.5, E.in);
    rect = { ...src, y: src.y + q * 160 };
    el.style.opacity = (1 - q).toFixed(3);
    show(el, q < 1);
    p = 0;
  } else {
    rect = isNew ? dst : mixRect(src, dst, p);
    el.style.opacity = "";
  }
  rectCss(el, rect);
  const fill = r[9] || "#FFFFFF";
  const fresh = isNew ? 1 - prog(t, K.newRow + 1.4, 1.4) : 0;
  $[key + "Bg"].style.background = isNew ? `color-mix(in srgb, var(--accentSoft) ${(fresh * 100).toFixed(1)}%, #fff)` : `color-mix(in srgb, #FFFFFF ${(c * 100).toFixed(1)}%, ${fill})`;
  $[key + "Bg"].style.borderRadius = rect.r.toFixed(2) + "px";
  const gone = far ? 1 : 1 - prog(t, K.morph, 0.3, E.in);
  for (const k of ["Rn", "Qty", "Note"]) { $[key + k].style.opacity = gone.toFixed(3); show($[key + k], gone > 0 && !isNew); }
  $[key + "Hair"].style.opacity = p.toFixed(3);
  for (const [f, { a, b }] of Object.entries(F)) {
    const e = $[key + f];
    const x = lerp(a[0] - (isNew ? 0 : 0), b[0], p), y = lerp(a[1], b[1], p);
    const size = lerp(a[2], b[2], p), w = Math.round(lerp(a[3], b[3], p) / 100) * 100;
    e.style.left = (p >= 1 ? Math.round(x) : x.toFixed(2)) + "px";
    e.style.top = (p >= 1 ? Math.round(y) : y.toFixed(2)) + "px";
    e.style.fontSize = size.toFixed(2) + "px";
    e.style.fontWeight = String(w);
    const inkTo = f === "num" ? "var(--ink3)" : "var(--ink)";
    e.style.color = `color-mix(in srgb, ${inkTo} ${(c * 100).toFixed(1)}%, ${r[10] || "#222"})`;
    if (f === "num") e.textContent = p > 0.5 ? "Ordine #" + r[0] : r[0];
    if (f === "imp") e.textContent = p > 0.5 ? "€ " + r[5] : r[5];
  }
  // lo stato scritto a mano diventa un'etichetta colorata
  const [label, ink, bg] = STATI[r[7]];
  const st = $[key + "st"], pill = $[key + "Pill"];
  const sp = isNew ? 1 : far ? 0 : prog(t, K.morph + 0.15 + i * 0.03, 0.5, E.inOut);
  if ((sp > 0.5 || isNew) && st.textContent !== label) st.textContent = label;
  if (sp <= 0.5 && !isNew && st.textContent !== r[6]) st.textContent = r[6];
  const sx = lerp(766 + 12 * sp, 762 + 12, p), sy = lerp(7, 17, p);
  st.style.left = (p >= 1 ? Math.round(sx) : sx.toFixed(2)) + "px";
  st.style.top = (p >= 1 ? Math.round(sy) : sy.toFixed(2)) + "px";
  st.style.fontSize = lerp(13, 13, p).toFixed(2) + "px";
  st.style.fontWeight = sp > 0.5 ? "600" : (r[6] === r[6].toUpperCase() ? "700" : "400");
  st.style.color = sp > 0.5 ? ink : `color-mix(in srgb, var(--ink) ${(c * 100).toFixed(1)}%, ${r[10] || "#222"})`;
  const pw = measure(label, 13, 600) + 24;
  rectCss(pill, { x: lerp(760, 762, p), y: lerp(2, 13, p), w: pw * sp, h: 26, r: 13 });
  pill.style.background = bg;
  show(pill, sp > 0);
}

function applyWord(t) {
  const on = t >= K.close + 0.3;
  show($.word, on);
  if (!on) return;
  rectCss($.mark, { x: WM.markX, y: WM.markY, w: WM.markS, h: WM.markS, r: 28 });
  show($.mark, t >= K.close + 0.6);
  rise($.wm, clamp(spring(t, K.word, 0.55, 0.88), 0, 1));
  rise($.ln, clamp(spring(t, K.line, 0.55, 0.88), 0, 1));
}
