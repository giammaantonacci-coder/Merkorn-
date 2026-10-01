film({ W: 1920, H: 1080, BPM: 120, BEATS: 56 });

// Merkorn, "Prima l'analisi": il metodo in quattro fasi, con le parole del sito.
// Si segue un ordine dall'ufficio al magazzino, si segnano i punti dove i dati si ricopiano a mano,
// poi le fondamenta, i componenti su misura e una schermata per ogni attività.
// Il cliente, i dati e i numeri sono inventati. Il video parte e finisce sullo stesso blocco viola.
const CLIENT = "Rossi Forniture";
const RED = ["#FF8A7A", "rgba(208,59,59,.18)"], VIOLET = ["#C29BFF", "rgba(151,71,255,.2)"];

const PHASES = [
  ["Fase 1 · Analisi", "Studiamo come lavorate"],
  ["Fase 2 · Fondamenta", "Partiamo da moduli collaudati"],
  ["Fase 3 · Su misura", "Sviluppiamo le parti specifiche"],
  ["Fase 4 · Interfaccia", "Una schermata per ogni attività"],
];
// [reparto, strumento di oggi, strumento dopo]
const NODES = [
  ["Cliente", "Telefono ed email", "Telefono ed email"],
  ["Ufficio", "Foglio Excel", "Ordini in ufficio"],
  ["Magazzino", "Fogli stampati", "Tablet in reparto"],
  ["Spedizione", "DDT scritto a mano", "App per le consegne"],
  ["Amministrazione", "Programma di fatture", "Fatturazione collegata"],
];
const NODE = { y: 352, w: 180, h: 96, gap: 50, x0: 45 };
const nodeX = (k) => NODE.x0 + k * (NODE.w + NODE.gap);
const LINE_Y = NODE.y + NODE.h / 2;
// i passaggi dove i dati si ricopiano a mano, e il componente su misura che li sostituisce
const COPIES = [[1, "Commesse"], [2, "Documenti di trasporto"], [3, "Consegne"]];
const MODULES = ["Anagrafiche", "Permessi", "Stampe", "Contabilità"];
const BASE = { y: 594, h: 60, w: 255, gap: 15 };
const OPEN_H = 352;

const K = {};
function timeline() {
  K.open = B(2);
  K.ph = [K.open + 0.8, 8.6, 11.6, 15.8];
  K.node = NODES.map((_, k) => 1.7 + k * 0.32);
  // l'ordine si ferma in ogni reparto; nei passaggi ricopiati a mano compare l'etichetta rossa
  K.hop = NODES.slice(0, -1).map((_, k) => 3.6 + k * 1.0);
  K.copy = COPIES.map(([e]) => K.hop[e] + 0.62);
  K.module = MODULES.map((_, k) => K.ph[1] + 0.35 + k * 0.14);
  K.check = MODULES.map((_, k) => K.ph[1] + 1.1 + k * 0.18);
  K.swap = COPIES.map((_, k) => K.ph[2] + 0.35 + k * 0.2);
  K.flow = K.ph[2] + 1.4;
  K.grow = K.ph[3] + 0.35;
  K.pull = 20.9; K.close = 23.0; K.out = K.close + 0.6 + 3.4;
}

function build(stage) {
  timeline();
  const node = ([name, before], k) => `
    <div class="abs" data-k="n${k}" style="border-radius:16px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair);overflow:hidden">
      <span class="abs t" style="left:16px;top:16px;font-family:var(--display);font-size:18px;font-weight:700;letter-spacing:-.01em">${name}</span>
      <div class="abs mask" style="left:16px;top:50px;width:${NODE.w - 24}px;height:24px"><div class="abs" data-k="ns${k}" style="left:0;top:0;width:${NODE.w - 24}px;height:24px"></div></div>
      ${k ? `<div class="abs" data-k="scr${k}" style="left:12px;top:${NODE.h}px;width:${NODE.w - 24}px;height:${OPEN_H - NODE.h - 12}px">${screen(k)}</div>` : ""}
    </div>`;
  const edges = NODES.slice(0, -1).map((_, k) => `<line data-k="e${k}" x1="${nodeX(k) + NODE.w}" y1="${LINE_Y}" x2="${nodeX(k + 1)}" y2="${LINE_Y}" stroke-width="3" stroke-linecap="round"/>`).join("");
  const app = `
    <div class="full" style="background:var(--winBg)"></div>
    <div class="abs" style="left:0;top:0;width:1200px;height:52px;box-shadow:inset 0 -1px 0 var(--hair)"></div>
    <span class="abs t" style="left:0;width:1200px;top:16px;text-align:center;font-size:14px;font-weight:500;color:var(--ink2)">Mappa del processo · ${CLIENT}</span>
    <div class="abs mask" style="left:45px;top:84px;width:700px;height:24px"><div class="abs" data-k="eyebrow" style="left:0;top:0;width:700px;height:24px"></div></div>
    <div class="abs mask" style="left:45px;top:110px;width:900px;height:58px"><div class="abs" data-k="phase" style="left:0;top:0;width:900px;height:58px"></div></div>
    <svg class="abs" style="left:0;top:0;overflow:visible" width="1200" height="780">${edges}</svg>
    <i class="abs" data-k="dot" style="width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 6px rgba(151,71,255,.25)"></i>
    ${NODES.map(node).join("")}
    ${COPIES.map((_, k) => `<div class="abs center" data-k="tag${k}" style="height:30px;border-radius:15px;font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden"><span data-k="tagT${k}"></span></div><i class="abs" data-k="stem${k}" style="width:2px;border-radius:1px"></i>`).join("")}
    <div class="abs mask" style="left:45px;top:${BASE.y - 32}px;width:400px;height:22px"><span class="abs t" data-k="baseL" style="left:0;top:0;font-size:12px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--ink3);line-height:22px">Moduli collaudati</span></div>
    ${MODULES.map((m, k) => `<div class="abs row" data-k="mod${k}" style="left:${45 + k * (BASE.w + BASE.gap)}px;top:${BASE.y}px;width:${BASE.w}px;height:${BASE.h}px;padding:0 18px;gap:12px;border-radius:14px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair);transform-origin:50% 100%">
      <i class="center" data-k="chk${k}" style="width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink3)"><svg width="14" height="14" viewBox="0 0 14 14"><path data-k="chkP${k}" d="M3 7.4 5.9 10.2 11 4.4" fill="none" stroke="#F2EFEA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1"/></svg></i>
      <span class="t" style="font-size:16px;font-weight:600">${m}</span></div>`).join("")}
    <div class="full" data-k="seal" style="background:var(--accent)"></div>`;

  stage.innerHTML = `
    ${nebulaHtml()}
    ${lockupBackHtml()}
    ${desktopMarkup(app, { name: CLIENT })}
    <div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);
  $.eyebrowR = roller($.eyebrow, "font-size:12.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);line-height:24px");
  $.phaseR = roller($.phase, "font-family:var(--display);font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:58px");
  NODES.forEach((_, k) => { $["nsR" + k] = roller($["ns" + k], "font-size:13.5px;color:var(--ink2);line-height:24px"); });
  COPIES.forEach(([, name], k) => { TAGW.push([measure("ricopiato a mano", 13.5, 600) + 28, measure(name, 13.5, 600) + 28]); });
  layoutLockup(FILM.W / 2, FILM.H / 2, 1.2);
}
const TAGW = [];

// Le piccole schermate della fase 4: ogni reparto ha la sua, pensata per chi la usa
function screen(k) {
  const card = (inner, css = "") => `<div class="abs" style="left:0;top:0;width:100%;height:100%;border-radius:12px;background:var(--winBg);box-shadow:inset 0 0 0 1px var(--hair);overflow:hidden;${css}">${inner}</div>`;
  const row = (a, b, y) => `<span class="abs t" style="left:12px;top:${y}px;font-size:12px;font-weight:600">${a}</span><span class="abs t" style="right:12px;top:${y}px;font-size:12px;color:var(--ink2)">${b}</span><i class="abs" style="left:12px;right:12px;top:${y + 24}px;height:1px;background:var(--hair)"></i>`;
  const pill = (text, [ink, bg], x, y) => `<span class="abs t" style="left:${x}px;top:${y}px;padding:0 10px;border-radius:12px;font-size:11.5px;font-weight:600;line-height:24px;color:${ink};background:${bg}">${text}</span>`;
  const btn = (text, y, h = 52) => `<div class="abs center" style="left:12px;right:12px;top:${y}px;height:${h}px;border-radius:12px;background:var(--accent);font-family:var(--display);font-size:15px;font-weight:700">${text}</div>`;
  const label = (text, y, size = 12, color = "var(--ink2)") => `<span class="abs t" style="left:12px;top:${y}px;font-size:${size}px;color:${color}">${text}</span>`;
  if (k === 1) return card(`${label("ORDINI", 12, 10.5, "var(--ink3)")}${row("#1055", "€ 1.640", 36)}${row("#1054", "€ 1.290", 68)}${row("#1053", "€ 560", 100)}${row("#1052", "€ 1.344", 132)}${pill("Da evadere", ["#FAB219", "rgba(250,178,25,.14)"], 12, 172)}`);
  if (k === 2) return card(`${label("PRELIEVO #1055", 14, 10.5, "var(--ink3)")}${label("Teglie inox", 38, 15, "var(--ink)")}${label("12 pezzi · scaffale B3", 62)}${btn("Prelievo fatto", 112, 96)}`, "border-radius:18px");
  if (k === 3) return card(`<div class="abs" style="left:16px;right:16px;top:0;bottom:0;border-radius:20px;background:#0B0A0E;box-shadow:inset 0 0 0 1px var(--hair)">
      <i class="abs" style="left:50%;top:8px;width:40px;height:6px;margin-left:-20px;border-radius:3px;background:#1E1A23"></i>
      ${label("CONSEGNA #1055", 26, 10, "var(--ink3)")}${label("Da Pino", 46, 14, "var(--ink)")}${label("Via Roma 12", 68, 11.5)}
      <div class="abs center" style="left:8px;right:8px;top:150px;height:44px;border-radius:12px;background:var(--accent);font-family:var(--display);font-size:13px;font-weight:700;white-space:nowrap">Firma cliente</div></div>`, "background:transparent;box-shadow:none");
  return card(`${label("FATTURA N. 418", 12, 10.5, "var(--ink3)")}${label("Ristorante Da Pino", 36, 13.5, "var(--ink)")}${label("€ 1.640,00", 60, 20, "var(--ink)")}${pill("Consegnata", ["#4CC94C", "rgba(12,163,12,.18)"], 12, 100)}${label("Inviata allo SdI il 18/09", 140, 11.5)}`);
}

function apply(t) {
  placeNebula(t, $.neb);
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
  placeLockup(t, K.close + 0.6, { open: K.open, out: K.out });
}

function camera(t) {
  return cameraAt(t, [
    { t: 0, ...onWindow(600, 400, 1.32) },
    { t: K.open + 0.7, ...onWindow(600, 404, 1.36), d: K.ph[3] - K.open - 0.7 },
    { t: K.ph[3] + 0.3, ...onWindow(600, 410, 1.5), d: 1.2 },
    { t: K.ph[3] + 1.6, ...onWindow(600, 412, 1.54), d: K.pull - K.ph[3] - 1.6 },
    { t: K.pull, ...onWindow(600, 390, 1.0), d: K.close - K.pull + 0.3 },
  ]);
}

function markInWindow(v) {
  const m = LOCK.top;
  return { x: (m.x - FILM.W / 2) / v.z + v.cx - WIN.x, y: (m.y - FILM.H / 2) / v.z + v.cy - WIN.y, w: m.w / v.z, h: m.h / v.z, r: m.r / v.z };
}

// dove si trova l'ordine: in fase 1 si ferma in ogni reparto, in fase 3 attraversa tutto in un solo passaggio
function dotAt(t) {
  const edgeX = (k, p) => lerp(nodeX(k) + NODE.w, nodeX(k + 1), p);
  if (t < K.flow) {
    let k = -1;
    K.hop.forEach((h, i) => { if (t >= h) k = i; });
    if (k < 0) return { x: nodeX(0) + NODE.w, on: t >= K.hop[0] - 0.3 };
    const p = prog(t, K.hop[k], 0.6, E.inOut);
    if (p < 1) return { x: edgeX(k, p), on: true };
    // dentro il reparto, dietro la scheda: riappare dall'altra parte al passo successivo
    const next = K.hop[k + 1];
    if (next === undefined) return { x: nodeX(k + 1) + NODE.w / 2, on: t < K.hop[k] + 1.0 };
    return { x: lerp(nodeX(k + 1), nodeX(k + 1) + NODE.w, prog(t, K.hop[k] + 0.6, next - K.hop[k] - 0.6, E.inOut)), on: true };
  }
  const p = prog(t, K.flow, 1.8, E.inOut);
  return { x: lerp(nodeX(0) + NODE.w, nodeX(4) + NODE.w / 2, p), on: p < 1 };
}

function applyMap(t) {
  roll($.eyebrowR, t, PHASES.map(([e], k) => ({ t: K.ph[k], v: e })));
  roll($.phaseR, t, PHASES.map(([, h], k) => ({ t: K.ph[k] + 0.06, v: h })));

  const grow = (k) => (k ? clamp(spring(t, K.grow + (k - 1) * 0.12, 0.55, 0.88), 0, 1) : 0);
  NODES.forEach(([, a, b], k) => {
    const el = $["n" + k], at = K.node[k];
    const e = clamp(spring(t, at, 0.5, 0.82), 0, 1.04);
    show(el, t >= at);
    rectCss(el, { x: nodeX(k), y: NODE.y, w: NODE.w, h: lerp(NODE.h, OPEN_H, grow(k)), r: 16 });
    setT(el, `translateY(${((1 - Math.min(e, 1)) * 24).toFixed(2)}px) scale(${(0.94 + 0.06 * e).toFixed(4)})`);
    el.style.opacity = Math.min(1, e * 1.5).toFixed(3);
    roll($["nsR" + k], t, [{ t: at + 0.15, v: a }, ...(a !== b ? [{ t: K.flow + 0.35 + k * 0.18, v: b }] : [])]);
    // il reparto si accende quando l'ordine ci passa
    const visit = k ? pulse(t, k < 4 ? K.hop[k - 1] + 0.6 : K.hop[3] + 0.6, 0.5) + pulse(t, K.flow + 0.2 + k * 0.33, 0.45) : 0;
    el.style.boxShadow = `inset 0 0 0 ${(1 + 1.5 * visit).toFixed(2)}px ${visit > 0.02 ? `rgba(151,71,255,${(0.35 + 0.65 * visit).toFixed(3)})` : "var(--hair)"}`;
    if (k) {
      const s = $["scr" + k], q = prog(t, K.grow + 0.25 + (k - 1) * 0.12, 0.45, E.out);
      show(s, q > 0);
      setT(s, `translateY(${((1 - q) * 30).toFixed(2)}px)`);
      s.style.opacity = q.toFixed(3);
    }
  });

  // i collegamenti si disegnano lungo la loro lunghezza; rossi dove si ricopia a mano, viola quando il passaggio è automatico
  NODES.slice(0, -1).forEach((_, k) => {
    const el = $["e" + k], len = NODE.gap;
    const p = prog(t, K.node[k + 1] - 0.1, 0.35, E.out);
    el.setAttribute("stroke-dasharray", `${len} ${len}`);
    el.setAttribute("stroke-dashoffset", ((1 - p) * len).toFixed(2));
    const c = COPIES.findIndex(([e]) => e === k);
    const red = c >= 0 && t >= K.copy[c] && t < K.swap[c] + 0.2;
    el.setAttribute("stroke", t >= K.flow - 0.1 ? "#9747FF" : red ? RED[0] : "#3A3540");
  });

  const d = dotAt(t);
  show($.dot, d.on);
  rectCss($.dot, { x: d.x, y: LINE_Y, w: 18, h: 18, r: 9 });

  // l'etichetta rossa nasce dal collegamento e poi diventa il componente su misura
  COPIES.forEach(([e, name], k) => {
    const tag = $["tag" + k], stem = $["stem" + k];
    const cx = (nodeX(e) + NODE.w + nodeX(e + 1)) / 2;
    const pop = clamp(spring(t, K.copy[k], 0.42, 0.66), 0, 1.1);
    const m = prog(t, K.swap[k], 0.4, E.snappy);
    const away = prog(t, K.ph[3], 0.3, E.in);
    const w = lerp(TAGW[k][0], TAGW[k][1], m);
    const on = t >= K.copy[k] && away < 1;
    show(tag, on); show(stem, on);
    if (!on) return;
    rectCss(tag, { x: cx - w / 2, y: NODE.y - 80, w, h: 30, r: 15 });
    const [ink, bg] = m < 0.5 ? RED : VIOLET;
    tag.style.color = ink;
    tag.style.background = bg;
    const label = m < 0.5 ? "ricopiato a mano" : name;
    if ($["tagT" + k].textContent !== label) $["tagT" + k].textContent = label;
    tag.style.transformOrigin = "50% 100%";
    setT(tag, `translateY(${((1 - Math.min(pop, 1)) * 30 + away * 40).toFixed(2)}px) scale(${(pop * (1 - away) * (1 + 0.08 * pulse(t, K.swap[k], 0.35))).toFixed(4)})`);
    rectCss(stem, { x: cx - 1, y: NODE.y - 50, w: 2, h: (LINE_Y - NODE.y + 50) * Math.min(pop, 1) * (1 - away), r: 1 });
    stem.style.background = ink;
  });

  // le fondamenta: entrano dal basso, ognuna si spunta; escono quando i reparti si aprono
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
    $["chk" + k].style.boxShadow = `inset 0 0 0 1.5px ${c > 0.5 ? "transparent" : "var(--ink3)"}`;
    $["chkP" + k].setAttribute("stroke-dashoffset", (1 - prog(t, K.check[k] + 0.1, 0.25, E.out)).toFixed(3));
  });
}
