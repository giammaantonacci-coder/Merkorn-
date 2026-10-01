film({ W: 1080, H: 1920, BPM: 120, BEATS: 56 });

// Merkorn, "Prima l'analisi" in verticale 9:16: la stessa storia e gli stessi tempi della versione orizzontale,
// impaginata per il telefono. Il titolo della fase sta sopra la finestra; i reparti sono in colonna e l'ordine scende.
// Il cliente, i dati e i numeri sono inventati. Il video parte e finisce sullo stesso blocco viola.
const CLIENT = "Rossi Forniture";
const RED = ["#FF8A7A", "rgba(208,59,59,.18)"], VIOLET = ["#C29BFF", "rgba(151,71,255,.2)"];

const PHASES = [
  ["Fase 1 · Analisi", "Studiamo", "come lavorate"],
  ["Fase 2 · Fondamenta", "Partiamo da", "moduli collaudati"],
  ["Fase 3 · Su misura", "Sviluppiamo le", "parti specifiche"],
  ["Fase 4 · Interfaccia", "Una schermata", "per ogni attività"],
];
const NODES = [
  ["Ufficio", "Foglio Excel", "Ordini in ufficio"],
  ["Magazzino", "Fogli stampati", "Tablet in reparto"],
  ["Spedizione", "DDT scritto a mano", "App per le consegne"],
  ["Amministrazione", "Programma di fatture", "Fatture collegate"],
];
// in punti finestra: reparti in colonna, collegamenti verticali a sinistra, etichette a destra
const NODE = { x: 40, y: 92, w: 360, h: 116, gap: 60 };
const OPENED = { y: 80, w: 740, h: 196, gap: 22 };
const EDGE_X = NODE.x + 64;
const COPIES = [[0, "Commesse"], [1, "Documenti di trasporto"], [2, "Consegne"]];
const MODULES = ["Magazzino", "Fornitura", "Anagrafiche", "Ordini"];
const BASE = { y: 806, h: 64, w: 360, gap: 20, x0: 40 };
const TAG = { h: 42, x: 452 };
const Z = 1.2, VIEW = view(WIN.x + WIN.w / 2, WIN.y + 400, Z);
const HEAD = { x: 72, eyebrow: 150, y: 196, size: 76, lh: 92 };

const K = {};
function timeline() {
  K.open = B(2);
  K.ph = [K.open + 0.8, 8.6, 11.6, 15.8];
  K.node = NODES.map((_, k) => 1.7 + k * 0.35);
  K.hop = NODES.slice(0, -1).map((_, k) => 3.6 + k * 1.15);
  K.copy = COPIES.map(([e]) => K.hop[e] + 0.62);
  K.module = MODULES.map((_, k) => K.ph[1] + 0.35 + k * 0.14);
  K.check = MODULES.map((_, k) => K.ph[1] + 1.1 + k * 0.18);
  K.swap = COPIES.map((_, k) => K.ph[2] + 0.35 + k * 0.2);
  K.flow = K.ph[2] + 1.4;
  K.grow = K.ph[3] + 0.35;
  K.pull = 20.9; K.close = 23.0; K.out = K.close + 0.6 + 3.4;
}

// la scheda di un reparto: in colonna nelle fasi 1-3, larga e più alta nella fase 4
function nodeRect(k, g = 0) {
  const a = { x: NODE.x, y: NODE.y + k * (NODE.h + NODE.gap), w: NODE.w, h: NODE.h, r: 20 };
  const b = { x: NODE.x, y: OPENED.y + k * (OPENED.h + OPENED.gap), w: OPENED.w, h: OPENED.h, r: 20 };
  return mixRect(a, b, g);
}

function build(stage) {
  timeline();
  const node = ([name], k) => `
    <div class="abs" data-k="n${k}" style="border-radius:20px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair);overflow:hidden">
      <span class="abs t" style="left:24px;top:24px;font-family:var(--display);font-size:28px;font-weight:700;letter-spacing:-.02em">${name}</span>
      <div class="abs mask" style="left:24px;top:68px;width:320px;height:32px"><div class="abs" data-k="ns${k}" style="left:0;top:0;width:320px;height:32px"></div></div>
      <div class="abs" data-k="scr${k}" style="left:330px;top:14px;width:396px;height:${OPENED.h - 28}px">${screen(k)}</div>
    </div>`;
  const app = `
    <div class="full" style="background:var(--winBg)"></div>
    <div class="abs" style="left:0;top:0;width:${WIN.w}px;height:52px;box-shadow:inset 0 -1px 0 var(--hair)"></div>
    <span class="abs t" style="left:0;width:${WIN.w}px;top:16px;text-align:center;font-size:15px;font-weight:500;color:var(--ink2)">Mappa del processo · ${CLIENT}</span>
    ${NODES.slice(0, -1).map((_, k) => `<i class="abs" data-k="e${k}" style="width:4px;border-radius:2px"></i>`).join("")}
    <i class="abs" data-k="dot" style="border-radius:50%;background:var(--accent);box-shadow:0 0 0 7px rgba(151,71,255,.25)"></i>
    ${NODES.map(node).join("")}
    ${COPIES.map((_, k) => `<i class="abs" data-k="stem${k}"></i><div class="abs center" data-k="tag${k}" style="border-radius:21px;font-size:19px;font-weight:600;white-space:nowrap;overflow:hidden"><span data-k="tagT${k}"></span></div>`).join("")}
    <div class="abs mask" style="left:${BASE.x0}px;top:${BASE.y - 40}px;width:500px;height:28px"><span class="abs t" data-k="baseL" style="left:0;top:0;font-size:15px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--ink3);line-height:28px">Moduli collaudati</span></div>
    ${MODULES.map((m, k) => `<div class="abs row" data-k="mod${k}" style="left:${BASE.x0 + (k % 2) * (BASE.w + BASE.gap)}px;top:${BASE.y + Math.floor(k / 2) * (BASE.h + 14)}px;width:${BASE.w}px;height:${BASE.h}px;padding:0 20px;gap:16px;border-radius:18px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair);transform-origin:50% 100%">
      <i class="center" data-k="chk${k}" style="flex:none;width:36px;height:36px;border-radius:50%;box-shadow:inset 0 0 0 2px var(--ink3)"><svg width="18" height="18" viewBox="0 0 14 14"><path data-k="chkP${k}" d="M3 7.4 5.9 10.2 11 4.4" fill="none" stroke="#F2EFEA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1"/></svg></i>
      <span class="t" style="font-family:var(--display);font-size:25px;font-weight:700;letter-spacing:-.01em">${m}</span></div>`).join("")}
    <div class="full" data-k="seal" style="background:var(--accent)"></div>`;

  stage.innerHTML = `
    ${nebulaHtml()}
    ${lockupBackHtml()}
    <div class="abs mask" style="left:${HEAD.x}px;top:${HEAD.eyebrow}px;width:${FILM.W - HEAD.x}px;height:34px"><div class="abs" data-k="eyebrow" style="left:0;top:0;width:${FILM.W - HEAD.x}px;height:34px"></div></div>
    ${[0, 1].map((l) => `<div class="abs mask" style="left:${HEAD.x - 8}px;top:${HEAD.y + l * HEAD.lh}px;width:${FILM.W - HEAD.x}px;height:${HEAD.lh + 8}px"><div class="abs" data-k="head${l}" style="left:8px;top:0;width:${FILM.W - HEAD.x - 8}px;height:${HEAD.lh + 8}px"></div></div>`).join("")}
    ${desktopMarkup(app, { name: CLIENT })}
    <div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);
  $.eyebrowR = roller($.eyebrow, "font-size:20px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);line-height:34px");
  $.head0R = roller($.head0, `font-family:var(--display);font-size:${HEAD.size}px;font-weight:700;letter-spacing:-.035em;line-height:${HEAD.lh}px`);
  $.head1R = roller($.head1, `font-family:var(--display);font-size:${HEAD.size}px;font-weight:700;letter-spacing:-.035em;line-height:${HEAD.lh}px;color:#B57BFF`);
  NODES.forEach((_, k) => { $["nsR" + k] = roller($["ns" + k], "font-size:19px;color:var(--ink2);line-height:32px"); });
  COPIES.forEach(([, name]) => { TAGW.push([measure("ricopiato a mano", 19, 600) + 40, measure(name, 19, 600) + 40]); });
  layoutLockup(FILM.W / 2, FILM.H / 2, 1);
}
const TAGW = [];

// Le schermate della fase 4, distese in orizzontale accanto al nome del reparto
function screen(k) {
  const card = (inner, css = "") => `<div class="abs" style="left:0;top:0;width:100%;height:100%;border-radius:14px;background:var(--winBg);box-shadow:inset 0 0 0 1px var(--hair);overflow:hidden;${css}">${inner}</div>`;
  const row = (a, b, y) => `<span class="abs t" style="left:18px;top:${y}px;font-size:18px;font-weight:600">${a}</span><span class="abs t" style="right:18px;top:${y}px;font-size:18px;color:var(--ink2)">${b}</span><i class="abs" style="left:18px;right:18px;top:${y + 34}px;height:1px;background:var(--hair)"></i>`;
  const pill = (text, [ink, bg], x, y) => `<span class="abs t" style="left:${x}px;top:${y}px;padding:0 13px;border-radius:16px;font-size:15px;font-weight:600;line-height:32px;color:${ink};background:${bg}">${text}</span>`;
  const label = (text, x, y, size = 16, color = "var(--ink2)") => `<span class="abs t" style="left:${x}px;top:${y}px;font-size:${size}px;color:${color}">${text}</span>`;
  const cap = (text, x, y) => `<span class="abs t" style="left:${x}px;top:${y}px;font-size:13px;font-weight:600;letter-spacing:.12em;color:var(--ink3)">${text}</span>`;
  if (k === 0) return card(`${cap("ORDINI", 18, 14)}${row("#1055", "€ 1.640", 42)}${row("#1054", "€ 1.290", 84)}${row("#1053", "€ 560", 126)}`);
  if (k === 1) return card(`${cap("PRELIEVO #1055", 18, 18)}${label("Teglie inox", 18, 48, 24, "var(--ink)")}${label("12 pezzi", 18, 86)}${label("scaffale B3", 18, 112)}
      <div class="abs center" style="left:200px;right:14px;top:14px;bottom:14px;border-radius:16px;background:var(--accent);font-family:var(--display);font-size:24px;font-weight:700;text-align:center;line-height:1.15">Prelievo<br>fatto</div>`, "border-radius:20px");
  if (k === 2) return card(`${cap("CONSEGNA #1055", 18, 18)}${label("Da Pino", 18, 48, 24, "var(--ink)")}${label("Via Roma 12", 18, 86)}
      <div class="abs" style="left:226px;width:150px;top:6px;bottom:6px;border-radius:24px;background:#0B0A0E;box-shadow:inset 0 0 0 1px var(--hair)">
        <i class="abs" style="left:50%;top:9px;width:40px;height:6px;margin-left:-20px;border-radius:3px;background:#1E1A23"></i>
        <div class="abs center" style="left:10px;right:10px;bottom:14px;height:48px;border-radius:12px;background:var(--accent);font-family:var(--display);font-size:16px;font-weight:700;white-space:nowrap">Firma cliente</div></div>`, "background:transparent;box-shadow:none");
  return card(`${cap("FATTURA N. 418", 18, 14)}${label("Ristorante Da Pino", 18, 40, 18, "var(--ink)")}${label("€ 1.640,00", 18, 72, 30, "var(--ink)")}${pill("Consegnata", ["#4CC94C", "rgba(12,163,12,.18)"], 18, 122)}${label("Inviata allo SdI", 190, 128, 15)}`);
}

function apply(t) {
  placeNebula(t, $.neb, [151, 71, 255], [109, 40, 217], 1.25);
  const v = camera(t);
  const opening = prog(t, K.open, 0.7, E.inOut), closing = prog(t, K.close, 0.6, E.inOut);
  const on = t >= K.open && closing < 1;
  show($.world, on);
  if (on) {
    const rect = closing > 0 ? mixRect(FULL, markInWindow(v), closing) : opening < 1 ? mixRect(markInWindow(v), FULL, opening) : FULL;
    placeWorld(v, { rect, chrome: Math.min(prog(t, K.open + 0.5, 0.3), 1 - prog(t, K.close, 0.2)), desk: 0, hw: 0 });
    const seal = t < K.close ? 1 - prog(t, K.open + 0.15, 0.45, E.inOut) : prog(t, K.close + 0.1, 0.35, E.out);
    $.seal.style.opacity = seal.toFixed(3);
    show($.seal, seal > 0);
    show($.pointer, false);
    applyMap(t);
  }
  applyHead(t);
  placeLockup(t, K.close + 0.6, { open: K.open, out: K.out });
}

// il titolo della fase, sopra la finestra: entra con la finestra, cambia a ogni fase, esce prima della chiusura
function applyHead(t) {
  const out = prog(t, K.pull + 0.6, 0.35, E.in);
  const steps = (i) => PHASES.map((p, k) => ({ t: K.ph[k] + i * 0.06, v: p[i] }));
  roll($.eyebrowR, t, steps(0));
  roll($.head0R, t, steps(1));
  roll($.head1R, t, steps(2));
  for (const [key, d] of [["eyebrow", 0.1], ["head0", 0.05], ["head1", 0]]) {
    const o = prog(t, K.pull + 0.6 + d, 0.3, E.in);
    setT($[key], o > 0 ? `translateY(${(-o * 105).toFixed(2)}%)` : "none");
    show($[key], t < K.pull + 1.2);
  }
  return out;
}

function camera(t) {
  return cameraAt(t, [
    { t: 0, ...VIEW },
    { t: K.open + 0.7, ...view(VIEW.cx, VIEW.cy + 4, Z * 1.02), d: K.pull - K.open - 0.7 },
    { t: K.pull, ...view(VIEW.cx, VIEW.cy - 60, 0.95), d: K.close - K.pull + 0.3 },
  ]);
}

function markInWindow(v) {
  const m = LOCK.top;
  return { x: (m.x - FILM.W / 2) / v.z + v.cx - WIN.x, y: (m.y - FILM.H / 2) / v.z + v.cy - WIN.y, w: m.w / v.z, h: m.h / v.z, r: m.r / v.z };
}

// dove si trova l'ordine: scende dall'alto, si ferma in ogni reparto in fase 1, attraversa tutto in un solo passaggio in fase 3
function dotAt(t) {
  const top = (k) => nodeRect(k).y, bot = (k) => nodeRect(k).y + NODE.h;
  const last = NODES.length - 1;
  if (t < K.flow) {
    let k = -1;
    K.hop.forEach((h, i) => { if (t >= h) k = i; });
    if (k < 0) {
      const a = K.hop[0] - 1.3;
      const y = t < a + 0.5 ? lerp(40, top(0), prog(t, a, 0.5, E.out)) : lerp(top(0), bot(0), prog(t, a + 0.5, 0.8, E.inOut));
      return { y, on: t >= a };
    }
    const p = prog(t, K.hop[k], 0.6, E.inOut);
    if (p < 1) return { y: lerp(bot(k), top(k + 1), p), on: true };
    const next = K.hop[k + 1];
    if (next === undefined) return { y: top(k + 1) + NODE.h / 2, on: t < K.hop[k] + 1.0 };
    return { y: lerp(top(k + 1), bot(k + 1), prog(t, K.hop[k] + 0.6, next - K.hop[k] - 0.6, E.inOut)), on: true };
  }
  const p = prog(t, K.flow, 1.8, E.inOut);
  return { y: lerp(40, top(last) + NODE.h / 2, p), on: p < 1 };
}

function applyMap(t) {
  const grow = (k) => clamp(spring(t, K.grow + k * 0.12, 0.55, 0.88), 0, 1);
  NODES.forEach(([, a, b], k) => {
    const el = $["n" + k], at = K.node[k];
    const e = clamp(spring(t, at, 0.5, 0.82), 0, 1.04);
    show(el, t >= at);
    rectCss(el, nodeRect(k, grow(k)));
    setT(el, `translateY(${((1 - Math.min(e, 1)) * 24).toFixed(2)}px) scale(${(0.94 + 0.06 * e).toFixed(4)})`);
    el.style.opacity = Math.min(1, e * 1.5).toFixed(3);
    roll($["nsR" + k], t, [{ t: at + 0.15, v: a }, ...(a !== b ? [{ t: K.flow + 0.35 + k * 0.22, v: b }] : [])]);
    const arrive = k ? K.hop[k - 1] + 0.6 : K.hop[0] - 0.8;
    const visit = pulse(t, arrive, 0.5) + pulse(t, K.flow + 0.35 + k * 0.33, 0.45);
    el.style.boxShadow = `inset 0 0 0 ${(1 + 2 * visit).toFixed(2)}px ${visit > 0.02 ? `rgba(151,71,255,${(0.35 + 0.65 * visit).toFixed(3)})` : "var(--hair)"}`;
    const s = $["scr" + k], q = prog(t, K.grow + 0.3 + k * 0.12, 0.45, E.out);
    show(s, q > 0);
    setT(s, `translateX(${((1 - q) * 40).toFixed(2)}px)`);
    s.style.opacity = q.toFixed(3);
  });

  // i collegamenti verticali si disegnano dall'alto in basso e seguono le schede quando si allargano
  NODES.slice(0, -1).forEach((_, k) => {
    const a = nodeRect(k, grow(k)), b = nodeRect(k + 1, grow(k + 1));
    const y0 = a.y + a.h, len = b.y - y0;
    const p = prog(t, K.node[k + 1] - 0.1, 0.35, E.out);
    const c = COPIES.findIndex(([e]) => e === k);
    const red = c >= 0 && t >= K.copy[c] && t < K.swap[c] + 0.2;
    rectCss($["e" + k], { x: EDGE_X - 2, y: y0, w: 4, h: Math.max(0, len * p), r: 2 });
    $["e" + k].style.background = t >= K.flow - 0.1 ? "#9747FF" : red ? RED[0] : "#3A3540";
  });

  const d = dotAt(t);
  show($.dot, d.on);
  rectCss($.dot, { x: EDGE_X - 11, y: d.y - 11, w: 22, h: 22, r: 11 });

  // l'etichetta nasce dal collegamento, a destra; poi diventa il componente su misura
  COPIES.forEach(([e, name], k) => {
    const tag = $["tag" + k], stem = $["stem" + k];
    const cy = nodeRect(e).y + NODE.h + NODE.gap / 2;
    const pop = clamp(spring(t, K.copy[k], 0.42, 0.66), 0, 1.1);
    const m = prog(t, K.swap[k], 0.4, E.snappy);
    const away = prog(t, K.ph[3], 0.3, E.in);
    const w = lerp(TAGW[k][0], TAGW[k][1], m);
    const on = t >= K.copy[k] && away < 1;
    show(tag, on); show(stem, on);
    if (!on) return;
    rectCss(tag, { x: TAG.x, y: cy - TAG.h / 2, w, h: TAG.h, r: TAG.h / 2 });
    const [ink, bg] = m < 0.5 ? RED : VIOLET;
    tag.style.color = ink;
    tag.style.background = bg;
    const label = m < 0.5 ? "ricopiato a mano" : name;
    if ($["tagT" + k].textContent !== label) $["tagT" + k].textContent = label;
    tag.style.transformOrigin = "0 50%";
    setT(tag, `translateX(${((1 - Math.min(pop, 1)) * -30 + away * 40).toFixed(2)}px) scale(${(pop * (1 - away) * (1 + 0.08 * pulse(t, K.swap[k], 0.35))).toFixed(4)})`);
    rectCss(stem, { x: EDGE_X, y: cy - 1.5, w: (TAG.x - EDGE_X) * Math.min(pop, 1) * (1 - away), h: 3, r: 1.5 });
    stem.style.background = ink;
  });

  const sinkAll = prog(t, K.ph[3], 0.35, E.in);
  show($.baseL, t >= K.ph[1] + 0.2);
  if (sinkAll > 0) sink($.baseL, sinkAll); else rise($.baseL, clamp(spring(t, K.ph[1] + 0.2, 0.5, 0.88), 0, 1));
  MODULES.forEach((_, k) => {
    const el = $["mod" + k];
    const e = clamp(spring(t, K.module[k], 0.5, 0.8), 0, 1.05), o = prog(t, K.ph[3] + k * 0.04, 0.3, E.in);
    show(el, t >= K.module[k] && o < 1);
    setT(el, `translateY(${((1 - Math.min(e, 1)) * 40 + o * 60).toFixed(2)}px) scale(${(0.9 + 0.1 * e).toFixed(4)})`);
    el.style.opacity = (Math.min(1, e * 1.5) * (1 - o)).toFixed(3);
    const c = prog(t, K.check[k], 0.3, E.out);
    $["chk" + k].style.background = c > 0 ? `rgba(12,163,12,${(0.9 * c).toFixed(3)})` : "";
    $["chk" + k].style.boxShadow = `inset 0 0 0 2px ${c > 0.5 ? "transparent" : "var(--ink3)"}`;
    $["chkP" + k].setAttribute("stroke-dashoffset", (1 - prog(t, K.check[k] + 0.1, 0.25, E.out)).toFixed(3));
  });
}
