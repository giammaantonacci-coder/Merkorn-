film({ W: 1080, H: 1920, BPM: 120, BEATS: 52 });

// Merkorn, "Dove si perdono i dati": lo stesso ordine ricopiato tre volte (email, Excel, foglio stampato
// per il magazzino) e a ogni passaggio si perde qualcosa. Poi lo stesso ordine scritto una volta sola nel gestionale.
// Reel verticale 9:16. Il video parte e finisce sullo stesso blocco viola, così gira in loop.
// Tutti i nomi, i numeri e le date sono inventati.

const RED = "#FF5A5F", RED_INK = "#FF8A8D", RED_BG = "#2C1317";
const PURPLE_INK = "#B57BFF";
const GOOD = ["#4CC94C", "rgba(12,163,12,.18)"];

// Le tre copie, in punti mondo (la camera si muove su una colonna alta)
const CE = { x: 110, y: 600, w: 860, h: 420, r: 24 };
const CX = { x: 110, y: 1250, w: 860, h: 260, r: 14 };
const CP = { x: 150, y: 1730, w: 780, h: 520, r: 6 };
const XCOLS = [0, 340, 590, 700, 860];
const XROW = { letters: 40, head: 52, row: 56 };
const xRowY = (i) => XROW.letters + XROW.head + i * XROW.row;
// Riga che si scrive in Excel: il 12 dell'email diventa 21, la data non ha una colonna
const TYPE = [["Ristorante Da Pino", 0], ["Teglie inox", 1], ["21", 2], ["60×40", 3]];
const TYPE_SPEED = 0.045;
// Il gestionale, in punti scena
const SOL = { x: 90, y: 600, w: 900, h: 720, r: 28 };

const CAPS = [
  { k: "c1", at: () => K.open + 0.45, out: () => K.pan1 - 0.1, lines: [["Arriva un ordine.", "var(--ink)"]] },
  { k: "c2", at: () => K.pan1 + 0.35, out: () => K.pan2 - 0.1, lines: [["Lo ricopi", "var(--ink)"], ["in Excel.", PURPLE_INK]] },
  { k: "c3", at: () => K.pan2 + 0.3, out: () => K.over - 0.1, lines: [["Lo stampi per", "var(--ink)"], ["il magazzino.", PURPLE_INK]] },
  { k: "c4", at: () => K.over + 0.45, out: () => K.merge - 0.1, lines: [["Tre passaggi,", "var(--ink)"], ["tre errori.", RED_INK]] },
  { k: "c5", at: () => K.merge + 0.45, out: () => K.close - 0.5, lines: [["Con un gestionale,", "var(--ink)"], ["lo scrivi una volta.", PURPLE_INK]] },
];
const CAP = { size: 88, lh: 104, y: 210 };

const K = {};
function timeline() {
  Object.assign(K, { open: B(2) });
  // l'email: righe, poi i tre dati che contano si accendono
  K.lines = K.open + 0.6;
  K.hl = K.lines + 1.25;
  // primo passaggio: dall'email a Excel, cella per cella
  K.pan1 = K.hl + 1.05;
  let at = K.pan1 + 1.1;
  K.cells = TYPE.map(([text]) => { const c = { at, end: at + text.length * TYPE_SPEED }; at = c.end + 0.22; return c; });
  K.err1 = at + 0.15;
  K.shake = K.err1 + 0.02;
  K.date = K.err1 + 0.55; K.drop = K.date + 0.75; K.err2 = K.drop + 0.35;
  // secondo passaggio: il foglio stampato per il magazzino, la colonna della misura esce dalla pagina
  K.pan2 = K.err2 + 0.95;
  K.print = K.pan2 + 0.55;
  K.err3 = K.print + 1.45;
  // tutto il percorso insieme, poi lo stesso ordine scritto una volta sola
  K.over = K.err3 + 0.95;
  K.recap = K.over + 0.9;
  K.merge = K.over + 3.4;
  K.sol = K.merge + 0.25;
  K.chips = K.sol + 1.4;
  K.close = K.chips + 3.0;
  K.out = K.close + 0.6 + 3.2;
}

const esc = (s) => s.replace(/&/g, "&amp;");
const pill = (k, n, text) => `
  <div class="abs row" data-k="${k}" style="left:0;top:0;height:52px;padding:0 22px 0 8px;gap:12px;border-radius:26px;background:${RED_BG};box-shadow:inset 0 0 0 1.5px rgba(255,90,95,.45);white-space:nowrap">
    <i class="center" style="width:36px;height:36px;border-radius:50%;background:${RED};color:#fff;font-size:20px;font-weight:700">${n}</i>
    <span class="t" style="font-size:25px;font-weight:600;color:${RED_INK}">${esc(text)}</span>
  </div>`;
const ring = (k) => `<div class="abs" data-k="${k}" style="border:4px solid ${RED};box-shadow:0 0 24px rgba(255,90,95,.45)"></div>`;
const tag = (k, n, text, extra = "") => `
  <div class="abs row" data-k="${k}" style="gap:14px;white-space:nowrap">
    <i class="center" style="width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 2px var(--hair);font-size:19px;font-weight:700;color:var(--ink2)">${n}</i>
    <span class="t" style="font-size:26px;font-weight:600;color:var(--ink2)">${text}</span>${extra}
  </div>`;
const check = `<i style="width:28px;height:28px;border-radius:50%;background:var(--accent);position:relative"><i style="position:absolute;left:10px;top:6px;width:8px;height:14px;border:solid #fff;border-width:0 3px 3px 0;transform:rotate(45deg)"></i></i>`;

function build(stage) {
  timeline();
  const hl = (i, s) => `<span data-k="hl${i}" style="position:relative;display:inline-block;padding:0 6px;margin:0 -2px;border-radius:8px;background:linear-gradient(rgba(151,71,255,.34),rgba(151,71,255,.34)) 0 0/0% 100% no-repeat">${esc(s)}</span>`;
  const body = [
    "Buongiorno, ci servono",
    `${hl(0, "12")} teglie inox ${hl(1, "60×40")}`,
    `per ${hl(2, "venerdì")}. Grazie!`,
  ];
  const email = `
    <div class="abs" data-k="eCard" style="left:${CE.x}px;top:${CE.y}px;width:${CE.w}px;height:${CE.h}px;background:var(--surface);box-shadow:inset 0 0 0 1.5px var(--hair)">
      <div class="abs center" data-k="eAv" style="left:40px;top:40px;width:68px;height:68px;border-radius:50%;background:#2B2333;color:#C9A6FF;font-size:25px;font-weight:700">DP</div>
      <div class="abs mask" style="left:130px;top:38px;width:600px;height:40px"><span class="abs t" data-k="eName" style="left:0;top:0;font-size:29px;font-weight:600">Ristorante Da Pino</span></div>
      <div class="abs mask" style="left:130px;top:78px;width:600px;height:34px"><span class="abs t" data-k="eMeta" style="left:0;top:0;font-size:22px;color:var(--ink3)">oggi, 9:12 · a: ufficio ordini</span></div>
      <div class="abs mask" style="left:40px;top:146px;width:780px;height:56px"><span class="abs t" data-k="eSub" style="left:0;top:0;font-family:var(--display);font-size:40px;font-weight:700;letter-spacing:-.02em;line-height:54px">Ordine teglie</span></div>
      ${body.map((l, i) => `<div class="abs mask" style="left:40px;top:${222 + i * 54}px;width:780px;height:54px"><span class="abs t" data-k="eL${i}" style="left:0;top:0;font-size:33px;color:var(--ink2);line-height:50px">${l}</span></div>`).join("")}
      <div class="full" data-k="eSeal" style="background:var(--accent)"></div>
    </div>`;

  const cellCss = (x, w, y, h) => `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  const letters = ["A", "B", "C", "D"].map((l, i) => `<span class="abs t center" style="${cellCss(XCOLS[i], XCOLS[i + 1] - XCOLS[i], 0, XROW.letters)};font-size:18px;color:#7A7A7A;box-shadow:inset -1px -1px 0 #DADADA">${l}</span>`).join("");
  const heads = ["Cliente", "Articolo", "Q.tà", "Misura"].map((l, i) => `<span class="abs t" style="${cellCss(XCOLS[i], XCOLS[i + 1] - XCOLS[i], XROW.letters, XROW.head)};padding:0 16px;line-height:${XROW.head}px;font-size:23px;font-weight:700;color:#3A3A3A;box-shadow:inset -1px -1px 0 #DADADA">${l}</span>`).join("");
  const row0 = ["Bar Centrale", "Vassoi", "30", "40×30"].map((l, i) => `<span class="abs t" style="${cellCss(XCOLS[i], XCOLS[i + 1] - XCOLS[i], xRowY(0), XROW.row)};padding:0 16px;line-height:${XROW.row}px;font-size:26px;color:#222;box-shadow:inset -1px -1px 0 #E3E3E3">${l}</span>`).join("");
  const grid = [1, 2].map((r) => [0, 1, 2, 3].map((i) => `<span class="abs" style="${cellCss(XCOLS[i], XCOLS[i + 1] - XCOLS[i], xRowY(r), XROW.row)};box-shadow:inset -1px -1px 0 #E3E3E3"></span>`).join("")).join("");
  const typed = TYPE.map(([, c], i) => `<span class="abs t" data-k="xc${i}" style="${cellCss(XCOLS[c], XCOLS[c + 1] - XCOLS[c], xRowY(1), XROW.row)};padding:0 16px;line-height:${XROW.row}px;font-size:26px;color:#222;overflow:hidden"></span>`).join("");
  const excel = `
    <div class="abs" data-k="xCard" style="left:${CX.x}px;top:${CX.y}px;width:${CX.w}px;height:${CX.h}px">
      <div class="full" style="background:#FFFFFF;border-radius:${CX.r}px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.45)">
        <div class="abs" style="left:0;top:0;width:${CX.w}px;height:${XROW.letters}px;background:#F1F1F1"></div>
        <div class="abs" style="left:0;top:${XROW.letters}px;width:${CX.w}px;height:${XROW.head}px;background:#F8F8F8"></div>
        ${letters}${heads}${row0}${grid}${typed}
        <div class="abs" data-k="xCur" style="border:3px solid #107C41"></div>
        <i class="abs" data-k="xCaret" style="width:2px;height:30px;background:#222"></i>
      </div>
      ${ring("r1")}
    </div>
    <div class="abs row" data-k="ghost" style="left:0;top:0;height:56px;padding:0 22px;border-radius:28px;background:#2A2035;box-shadow:inset 0 0 0 1.5px rgba(151,71,255,.6),0 14px 30px rgba(0,0,0,.4);white-space:nowrap">
      <span class="t" style="font-size:26px;font-weight:600;color:#E7D6FF">per venerdì</span>
    </div>
    ${pill("p1", 1, "12 è diventato 21")}
    ${pill("p2", 2, "la data non ha una colonna")}`;

  const pcol = [44, 330, 586, 714];
  const prow = (cells, y, css) => cells.map((c, i) => `<span class="abs t" style="left:${pcol[i]}px;top:${y}px;${css}">${esc(c)}</span>`).join("");
  const paper = `
    <div class="abs" data-k="paper" style="left:${CP.x}px;top:${CP.y}px;width:${CP.w}px;height:${CP.h}px;transform-origin:50% 50%">
      <div class="full" data-k="sheet" style="background:#F4F1EA;border-radius:${CP.r}px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.55)">
        <div data-k="pr0"><span class="abs t" style="left:44px;top:44px;font-size:27px;font-weight:700;letter-spacing:.08em;color:#1C1A1F">ORDINI DA PREPARARE</span>
          <span class="abs t" style="left:44px;top:88px;font-size:21px;color:#6E6872">giovedì · stampato da Excel · pag. 1 di 1</span>
          <i class="abs" style="left:44px;top:134px;width:${CP.w}px;height:2px;background:#1C1A1F"></i></div>
        <div data-k="pr1">${prow(["CLIENTE", "ARTICOLO", "Q.TÀ", "MISURA"], 156, "font-size:21px;font-weight:700;letter-spacing:.06em;color:#6E6872")}</div>
        <div data-k="pr2">${prow(["Bar Centrale", "Vassoi", "30", "40×30"], 204, "font-size:29px;color:#1C1A1F")}<i class="abs" style="left:44px;top:254px;width:${CP.w}px;height:1px;background:#CFC9BF"></i></div>
        <div data-k="pr3">${prow(["Ristorante Da Pino", "Teglie inox", "21", "60×40"], 268, "font-size:29px;color:#1C1A1F")}<i class="abs" style="left:44px;top:318px;width:${CP.w}px;height:1px;background:#CFC9BF"></i></div>
      </div>
      ${ring("r3")}
      ${pill("p3", 3, "la misura è fuori pagina")}
    </div>`;

  const field = (k, label, value, x, y) => `
    <div class="abs" data-k="${k}" style="left:${x}px;top:${y}px;width:400px;height:140px;border-radius:18px;background:var(--lift2)">
      <span class="abs t" style="left:28px;top:24px;font-size:23px;color:var(--ink3)">${label}</span>
      <span class="abs t" style="left:28px;top:62px;font-family:var(--display);font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:56px">${value}</span>
    </div>`;
  const chip = (k, text) => `<div class="row" data-k="${k}" style="height:64px;padding:0 24px 0 18px;gap:14px;border-radius:32px;background:var(--accentSoft);box-shadow:inset 0 0 0 1.5px rgba(151,71,255,.45);white-space:nowrap">${check}<span class="t" style="font-size:26px;font-weight:600">${text}</span></div>`;
  const sol = `
    <div class="abs" data-k="sol" style="left:${SOL.x}px;top:${SOL.y}px;width:${SOL.w}px;height:${SOL.h}px;background:var(--winBg);box-shadow:inset 0 0 0 1.5px var(--hair)">
      <div class="full" data-k="solIn">
        <span class="abs t" data-k="sTitle" style="left:44px;top:44px;font-family:var(--display);font-size:46px;font-weight:700;letter-spacing:-.03em;line-height:60px">Ordine 1055</span>
        <span class="abs t" data-k="sOk" style="right:44px;top:54px;height:40px;padding:0 18px;border-radius:20px;font-size:21px;font-weight:600;line-height:40px;color:${GOOD[0]};background:${GOOD[1]}">Confermato</span>
        <span class="abs t" data-k="sCli" style="left:44px;top:110px;font-size:29px;color:var(--ink2)">Ristorante Da Pino</span>
        ${field("f0", "Articolo", "Teglie inox", 40, 180)}${field("f1", "Quantità", "12", 460, 180)}
        ${field("f2", "Misura", "60×40", 40, 340)}${field("f3", "Consegna", "venerdì", 460, 340)}
        <i class="abs" data-k="sLine" style="left:44px;top:518px;width:812px;height:1.5px;background:var(--hair)"></i>
        <span class="abs t" data-k="sWho" style="left:44px;top:544px;font-size:23px;color:var(--ink3)">Lo stesso dato, per</span>
        <div class="abs row" style="left:40px;top:600px;gap:16px">${chip("ch0", "Ufficio")}${chip("ch1", "Magazzino")}${chip("ch2", "Consegne")}</div>
      </div>
      <div class="full" data-k="solSeal" style="background:var(--accent)"></div>
    </div>`;

  const caps = CAPS.map(({ k, lines }) => lines.map(([s, c], j) => `
    <div class="abs mask" data-k="${k}m${j}" style="height:${CAP.lh + 10}px"><span class="abs t" data-k="${k}t${j}" style="left:0;top:0;font-family:var(--display);font-size:${CAP.size}px;font-weight:700;letter-spacing:-.035em;line-height:${CAP.lh}px;color:${c}">${s}</span></div>`).join("")).join("");

  stage.innerHTML = `
    ${nebulaHtml()}
    ${lockupBackHtml()}
    <div class="cam" data-k="world">
      ${tag("tE", 1, "Email")}${tag("tX", 2, "Excel", `<span class="t" style="font-size:22px;color:var(--ink3);margin-left:6px">ordini_2026_DEF.xlsx</span>`)}${tag("tP", 3, "Foglio in magazzino")}
      ${email}${excel}${paper}
    </div>
    <div class="full" data-k="scrim" style="background:linear-gradient(180deg,rgba(8,7,11,.97) 0px,rgba(8,7,11,.88) 380px,rgba(8,7,11,0) 500px)"></div>
    ${sol}
    <div class="full" data-k="caps">${caps}</div>
    <div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);

  // le didascalie: centrate, il carattere si riduce se una riga non entra
  for (const { k, lines } of CAPS) {
    const css = "font-family:var(--display);letter-spacing:-.035em";
    const ws = lines.map(([s]) => measure(s, CAP.size, 700, css));
    const f = Math.min(1, (FILM.W - 120) / Math.max(...ws));
    lines.forEach((_, j) => {
      const w = ws[j] * f;
      Object.assign($[k + "t" + j].style, { fontSize: CAP.size * f + "px" });
      Object.assign($[k + "m" + j].style, { left: Math.round((FILM.W - w) / 2) + "px", top: CAP.y + j * CAP.lh + "px", width: Math.ceil(w + 14) + "px" });
    });
  }
  for (const [k, c] of [["tE", CE], ["tX", CX], ["tP", CP]]) Object.assign($[k].style, { left: c.x + "px", top: c.y - 62 + "px" });
  layoutLockup(FILM.W / 2, FILM.H / 2, 1);
}

// ---- camera ----
// cy: il centro dell'inquadratura in punti mondo; la scheda attiva sta un po' sotto il centro, lasciando spazio alla didascalia
const frameOn = (c, z, below = 110) => view(540, c.y + c.h / 2 - below / z, z);
const OVER = view(540, 1100, 0.78);

function shake(t, v) {
  const d = t - K.shake;
  if (d < 0 || d > 0.6) return v;
  const s = Math.exp(-d / 0.14);
  const dx = 14 * s * Math.sin(2 * Math.PI * 21 * d), dy = 9 * s * Math.sin(2 * Math.PI * 29 * d + 1.1);
  return view(v.cx - dx / v.z, v.cy - dy / v.z, v.z);
}

function camera(t) {
  const xCell = (i) => { const c = TYPE[i][1]; return CX.x + clamp((XCOLS[c] + XCOLS[c + 1]) / 2, 320, 540); };
  const at = (v, t0, d) => ({ t: t0, cx: v.cx, cy: v.cy, z: v.z, d });
  const raw = cameraAt(t, [
    { t: 0, ...frameOn(CE, 1.0) },
    at(frameOn(CE, 1.04), K.open + 0.7, K.pan1 - K.open - 0.7),
    // giù fino al foglio Excel, poi vicino alla riga che si scrive
    at(frameOn(CX, 1.1, 60), K.pan1, 0.95),
    ...K.cells.map((c, i) => at(view(xCell(i), CX.y + xRowY(1) + 28 - 10, 1.36 + 0.02 * i), c.at - (i ? 0.2 : 0.4), i ? 0.45 : 0.6)),
    at(view(CX.x + 645, CX.y + xRowY(1) + 28, 1.5), K.err1 - 0.3, 0.45),
    at(frameOn(CX, 1.1, 20), K.date - 0.1, 0.8),
    // giù al foglio stampato
    at(frameOn(CP, 1.0, 90), K.pan2, 1.0),
    at(view(CP.x + 560, CP.y + 290, 1.32), K.err3 - 0.45, 0.6),
    // tutto il percorso
    at(OVER, K.over, 1.25),
    at(view(OVER.cx, OVER.cy, 0.76), K.over + 1.25, K.merge - K.over - 1.25),
    at(view(OVER.cx, OVER.cy + 40, 0.62), K.merge, 0.8),
    // il ritorno all'inizio, a scena coperta: la camera torna sull'email per il primo fotogramma
    at(frameOn(CE, 1.0), K.merge + 1.0, 0.5),
  ]);
  return shake(t, raw);
}

// ---- passi ----
function placeCard(el, c, rect, on = true) {
  // rect in punti locali della scheda; la scheda resta ferma e si ritaglia
  el.style.clipPath = `inset(${rect.y.toFixed(2)}px ${(c.w - rect.x - rect.w).toFixed(2)}px ${(c.h - rect.y - rect.h).toFixed(2)}px ${rect.x.toFixed(2)}px round ${rect.r.toFixed(2)}px)`;
  show(el, on);
}

// il blocco del lockup (punti scena) in punti locali di una scheda del mondo
function blockIn(v, c) {
  const m = LOCK.top;
  return { x: (m.x - FILM.W / 2) / v.z + v.cx - c.x, y: (m.y - FILM.H / 2) / v.z + v.cy - c.y, w: m.w / v.z, h: m.h / v.z, r: m.r / v.z };
}

function applyEmail(t, v) {
  const full = { x: 0, y: 0, w: CE.w, h: CE.h, r: CE.r };
  const o = prog(t, K.open, 0.7, E.inOut);
  placeCard($.eCard, CE, o < 1 ? mixRect(blockIn(v, CE), full, o) : full, t >= K.open);
  const seal = 1 - prog(t, K.open + 0.15, 0.45, E.inOut);
  $.eSeal.style.opacity = seal.toFixed(3); show($.eSeal, seal > 0);
  ["eName", "eMeta", "eSub", "eL0", "eL1", "eL2"].forEach((k, i) => rise($[k], clamp(spring(t, K.lines + i * 0.1, 0.5, 0.86), 0, 1)));
  const av = clamp(spring(t, K.lines, 0.45, 0.7), 0, 1.1);
  setT($.eAv, `scale(${av.toFixed(4)})`);
  for (let i = 0; i < 3; i++) {
    const p = prog(t, K.hl + i * 0.16, 0.35, E.out);
    $["hl" + i].style.backgroundSize = `${(p * 100).toFixed(1)}% 100%`;
    $["hl" + i].style.color = p > 0.3 ? "#F2E9FF" : "";
  }
  $.tE.style.opacity = prog(t, K.lines, 0.4).toFixed(3);
}

function applyExcel(t) {
  const enter = clamp(spring(t, K.pan1 + 0.15, 0.55, 0.86), 0, 1.02);
  $.xCard.style.opacity = clamp(enter * 1.5).toFixed(3);
  setT($.xCard, `translateY(${((1 - enter) * 90).toFixed(2)}px)`);
  $.tX.style.opacity = prog(t, K.pan1 + 0.3, 0.4).toFixed(3);
  let active = -1;
  TYPE.forEach(([text], i) => {
    const c = K.cells[i];
    const n = clamp(Math.floor((t - c.at) / TYPE_SPEED) + 1, 0, text.length);
    const s = t < c.at ? "" : text.slice(0, n);
    if ($["xc" + i].textContent !== s) $["xc" + i].textContent = s;
    if (t >= c.at - 0.22) active = i;
  });
  // cursore di cella: salta di colonna con una molla corta
  const col = (i) => TYPE[i][1];
  const moves = K.cells.slice(1).map((c, i) => ({ t: c.at - 0.2, i: i + 1 }));
  const along = (f) => track(t, f(0), moves.map((m) => ({ t: m.t, d: 0.14, e: E.snappy, to: f(m.i) })));
  const cx = along((i) => XCOLS[col(i)]), cw = along((i) => XCOLS[col(i) + 1] - XCOLS[col(i)]);
  const curOn = t >= K.pan1 + 0.6 && t < K.err1 + 0.2;
  show($.xCur, curOn);
  rectCss($.xCur, { x: cx - 1.5, y: xRowY(1) - 1.5, w: cw + 3, h: XROW.row + 3, r: 0 });
  const i = Math.max(active, 0), typing = t >= K.cells[i].at && t < K.cells[i].end + 0.05;
  const blink = typing || Math.floor((t - K.pan1) / 0.45) % 2 === 0;
  const caretX = XCOLS[col(i)] + 16 + (t >= K.cells[i].at ? measure($["xc" + i].textContent, 26, 400) : 0);
  show($.xCaret, curOn && blink && active >= 0);
  rectCss($.xCaret, { x: caretX + 1, y: xRowY(1) + 13, w: 2, h: 30, r: 0 });

  // errore 1: il 12 è diventato 21
  const qx = XCOLS[2], q = clamp(spring(t, K.err1, 0.45, 0.62), 0, 1.2);
  show($.r1, t >= K.err1);
  rectCss($.r1, { x: qx - 8, y: xRowY(1) - 8, w: XCOLS[3] - qx + 16, h: XROW.row + 16, r: 14 });
  setT($.r1, `scale(${lerp(1.4, 1, clamp(q, 0, 1)).toFixed(4)})`);
  $.r1.style.opacity = clamp(q * 2).toFixed(3);
  placePill($.p1, t, K.err1 + 0.15, CX.x, CX.y + CX.h + 26);
  placePill($.p2, t, K.err2, CX.x, CX.y + CX.h + 92);

  // la data dell'email cerca una colonna, non la trova e cade
  const g = $.ghost;
  const gIn = clamp(spring(t, K.date, 0.5, 0.8), 0, 1.05), fall = prog(t, K.drop, 0.75, E.in);
  show(g, t >= K.date && fall < 1);
  const gx = CX.x + 560 + 14 * Math.sin(Math.max(0, t - K.date - 0.3) * 7) * (1 - prog(t, K.drop - 0.15, 0.2)), gy = lerp(CX.y - 130, CX.y + xRowY(2) + 2, gIn) + fall * 420;
  setT(g, `translate(${gx.toFixed(2)}px,${gy.toFixed(2)}px) rotate(${(fall * 24).toFixed(2)}deg)`);
  g.style.opacity = (clamp(gIn * 2) * (1 - fall)).toFixed(3);
}

function placePill(el, t, t0, x, y) {
  const p = clamp(spring(t, t0, 0.5, 0.78), 0, 1.06);
  show(el, t >= t0);
  setT(el, `translate(${x}px,${(y + (1 - p) * 24).toFixed(2)}px) scale(${lerp(0.85, 1, p).toFixed(4)})`);
  el.style.transformOrigin = "0 50%";
  el.style.opacity = clamp(p * 1.6).toFixed(3);
}

function applyPaper(t) {
  // il foglio esce dalla stampante: sale dal basso, le righe compaiono una alla volta
  const p = clamp(spring(t, K.print - 0.2, 0.6, 0.86), 0, 1.02);
  const on = t >= K.print - 0.2;
  show($.paper, on); show($.tP, on);
  $.tP.style.opacity = prog(t, K.print, 0.4).toFixed(3);
  setT($.paper, `translateY(${((1 - p) * 260).toFixed(2)}px) rotate(${lerp(4, -1.6, clamp(p)).toFixed(3)}deg)`);
  $.paper.style.opacity = clamp(p * 2).toFixed(3);
  for (let i = 0; i < 4; i++) $["pr" + i].style.opacity = prog(t, K.print + 0.3 + i * 0.22, 0.18).toFixed(3);
  // errore 3: la colonna della misura esce dal foglio
  const q = clamp(spring(t, K.err3, 0.45, 0.62), 0, 1.2);
  show($.r3, t >= K.err3);
  rectCss($.r3, { x: 698, y: 258, w: 112, h: 68, r: 14 });
  setT($.r3, `scale(${lerp(1.4, 1, clamp(q, 0, 1)).toFixed(4)})`);
  $.r3.style.opacity = clamp(q * 2).toFixed(3);
  placePill($.p3, t, K.err3 + 0.15, 44, 380);
}

// riepilogo: i tre errori si accendono di nuovo, uno dopo l'altro
function recap(t) {
  [["p1", "r1"], ["p2", null], ["p3", "r3"]].forEach(([p, r], i) => {
    const k = pulse(t, K.recap + i * 0.3, 0.45);
    $[p].style.filter = k > 0 ? `brightness(${(1 + 0.5 * k).toFixed(3)})` : "";
    if (r) $[r].style.boxShadow = `0 0 ${(24 + 30 * k).toFixed(1)}px rgba(255,90,95,${(0.45 + 0.4 * k).toFixed(3)})`;
  });
}

function applySol(t) {
  const full = { x: 0, y: 0, w: SOL.w, h: SOL.h, r: SOL.r };
  const e = clamp(spring(t, K.sol, 0.6, 0.86), 0, 1.02);
  const closing = prog(t, K.close, 0.6, E.inOut);
  const block = { x: LOCK.top.x - SOL.x, y: LOCK.top.y - SOL.y, w: LOCK.top.w, h: LOCK.top.h, r: LOCK.top.r };
  const on = t >= K.sol && closing < 1;
  show($.sol, on);
  if (!on) return;
  // entra dal centro, cresce fino alla scheda intera
  const small = { x: SOL.w * 0.08, y: SOL.h * 0.1, w: SOL.w * 0.84, h: SOL.h * 0.8, r: SOL.r };
  const rect = closing > 0 ? mixRect(full, block, closing) : mixRect(small, full, e);
  placeCard($.sol, SOL, rect);
  $.sol.style.opacity = clamp(e * 2).toFixed(3);
  const content = 1 - prog(t, K.close, 0.22);
  $.solIn.style.opacity = content.toFixed(3);
  const seal = prog(t, K.close + 0.1, 0.35, E.out);
  $.solSeal.style.opacity = seal.toFixed(3); show($.solSeal, seal > 0);
  const up = (k, t0, d = 30) => {
    const q = clamp(spring(t, t0, 0.5, 0.84), 0, 1.03);
    setT($[k], `translateY(${((1 - q) * d).toFixed(2)}px)`);
    $[k].style.opacity = clamp(q * 1.6).toFixed(3);
  };
  up("sTitle", K.sol + 0.2); up("sCli", K.sol + 0.28); up("sOk", K.sol + 0.5, 0);
  setT($.sOk, `scale(${clamp(spring(t, K.sol + 0.5, 0.4, 0.6), 0, 1.15).toFixed(4)})`);
  for (let i = 0; i < 4; i++) up("f" + i, K.sol + 0.4 + i * 0.09, 40);
  up("sLine", K.chips - 0.2, 0); up("sWho", K.chips - 0.15);
  for (let i = 0; i < 3; i++) {
    const k = "ch" + i, q = clamp(spring(t, K.chips + i * 0.18, 0.45, 0.66), 0, 1.15);
    setT($[k], `scale(${q.toFixed(4)})`);
    $[k].style.opacity = clamp(q * 2).toFixed(3);
  }
}

function applyCaps(t) {
  for (const c of CAPS) {
    const at = c.at(), out = c.out();
    const on = t >= at && t < out + 0.5;
    c.lines.forEach((_, j) => {
      show($[c.k + "m" + j], on);
      if (!on) return;
      const k = $[c.k + "t" + j], o = prog(t, out + j * 0.05, 0.3, E.in);
      if (o > 0) sink(k, o); else rise(k, clamp(spring(t, at + j * 0.1, 0.5, 0.86), 0, 1));
    });
  }
}

function apply(t) {
  placeNebula(t, $.neb);
  const v = camera(t);
  const worldOn = t >= K.open && t < K.merge + 0.9;
  show($.world, worldOn);
  if (worldOn) {
    setT($.world, `translate(${(FILM.W / 2 - v.cx * v.z).toFixed(2)}px,${(FILM.H / 2 - v.cy * v.z).toFixed(2)}px) scale(${v.z.toFixed(5)})`);
    $.world.style.opacity = (1 - prog(t, K.merge, 0.5, E.inOut)).toFixed(3);
    applyEmail(t, v);
    applyExcel(t);
    applyPaper(t);
    recap(t);
  }
  // la fascia scura in alto tiene leggibili le didascalie quando le schede ci passano sotto
  const scrim = Math.min(prog(t, K.open + 0.4, 0.5), 1 - prog(t, K.merge, 0.5));
  show($.scrim, scrim > 0); $.scrim.style.opacity = scrim.toFixed(3);
  applySol(t);
  applyCaps(t);
  placeLockup(t, K.close + 0.6, { open: K.open, out: K.out });
}

function cues() {
  return [
    ["whoosh", K.open], ["pop", K.hl], ["whoosh", K.pan1],
    ...K.cells.map((c) => ["tick", c.at]),
    ["error", K.err1], ["drop", K.drop], ["error", K.err2], ["whoosh", K.pan2], ["print", K.print], ["error", K.err3],
    ["whoosh", K.over], ["rise", K.merge], ["pop", K.chips], ["whoosh", K.close],
  ];
}
