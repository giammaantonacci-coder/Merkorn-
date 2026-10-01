film({ W: 1080, H: 1920, BPM: 120, BEATS: 36 });

// Bozza di prova: la stessa finestra cambia forma per tre aziende diverse.
// Aziende, targhe, persone e numeri sono inventati.
const BRAND = { name: "MERKORN", line: "Software gestionale su misura", cta: "Prenota un appuntamento", url: "merkorn.com" };
const GOOD = "#4CC94C", GOOD_BG = "rgba(12,163,12,.18)", WARN = "#FAB219", WARN_BG = "rgba(250,178,25,.14)";
const BLUE = "#6FB0E4", BLUE_BG = "rgba(58,143,208,.18)", CRIT = "#FF8A7A", CRIT_BG = "rgba(208,59,59,.2)";
const PILL = {
  lav: ["In lavorazione", BLUE, BLUE_BG], pronta: ["Pronta", GOOD, GOOD_BG], attesa: ["Attesa ricambi", WARN, WARN_BG],
  pren: ["Prenotata", "#A7A2AE", "rgba(242,239,234,.08)"], viaggio: ["In viaggio", BLUE, BLUE_BG], cons: ["Consegnata", GOOD, GOOD_BG],
  carico: ["In carico", "#A7A2AE", "rgba(242,239,234,.08)"], ritardo: ["In ritardo", CRIT, CRIT_BG], corso: ["In corso", BLUE, BLUE_BG],
  quasi: ["Collaudo", "#C29BFF", "rgba(151,71,255,.2)"], ferma: ["Ferma", CRIT, CRIT_BG], fatta: ["Completata", GOOD, GOOD_BG],
};
const SCENES = [
  {
    hue: [[151, 71, 255], [109, 40, 217]], accent: "#B57BFF", head: ["Un'officina", "meccanica."], sticker: "Interventi, targhe, ricambi.",
    client: ["Officina Neri", "#E4572E"], tabs: ["Interventi", "Veicoli", "Ricambi", "Clienti"], title: "Interventi di oggi",
    kpi: [["In officina", ["7", "6"]], ["Pronte al ritiro", ["3", "4"]]],
    rows: [["Tagliando e freni", "Fiat Panda · FR 482 KL", "lav", "pronta"], ["Cambio gomme", "VW Golf · GM 105 TS", "pronta"],
      ["Diagnosi motore", "Ford Fiesta · EZ 931 BR", "attesa"], ["Revisione", "Renault Clio · FT 220 MN", "pren"],
      ["Sostituzione frizione", "Opel Corsa · GA 774 PD", "lav"], ["Ricarica clima", "Toyota Yaris · FY 318 LC", "pronta"],
      ["Convergenza", "Kia Picanto · GC 609 RE", "pren"]],
  },
  {
    hue: [[58, 143, 208], [40, 70, 170]], accent: "#6FB0E4", head: ["Un'azienda", "di trasporti."], sticker: "Viaggi, mezzi, autisti.",
    client: ["Trasporti Valli", "#1D4ED8"], tabs: ["Spedizioni", "Mezzi", "Autisti", "Clienti"], title: "Consegne di oggi",
    kpi: [["In viaggio", ["12", "11"]], ["Consegnate", ["28", "29"]]],
    rows: [["Milano → Bologna", "6 bancali · Luca Ferri", "viaggio", "cons"], ["Torino → Genova", "3 bancali · Marta Sala", "cons"],
      ["Verona → Padova", "9 bancali · Gino Riva", "carico"], ["Brescia → Bergamo", "2 bancali · Anna Conti", "cons"],
      ["Parma → Modena", "5 bancali · Paolo Greco", "viaggio"], ["Como → Varese", "4 bancali · Sara Neri", "ritardo"],
      ["Pavia → Lodi", "7 bancali · Elia Costa", "carico"]],
  },
  {
    hue: [[184, 134, 42], [140, 70, 30]], accent: "#E0B25A", head: ["Un laboratorio", "di produzione."], sticker: "Commesse, fasi, macchine.",
    client: ["Laboratorio Gatti", "#BE185D"], tabs: ["Commesse", "Produzione", "Macchine", "Magazzino"], title: "Avanzamento commesse",
    kpi: [["Commesse aperte", ["9", "9"]], ["Da consegnare", ["4", "4"]]],
    rows: [["C-214 · Telai inox", "Saldatura", "corso", "corso", 0.6, 0.75], ["C-215 · Staffe su misura", "Taglio laser", "corso", "", 0.3],
      ["C-216 · Carter macchina", "Verniciatura", "corso", "", 0.85], ["C-217 · Ripiani forati", "Controllo finale", "quasi", "", 0.95],
      ["C-218 · Supporti motore", "Attesa materiale", "ferma", "", 0], ["C-219 · Cornici alluminio", "Spedita", "fatta", "", 1],
      ["C-220 · Pannelli forati", "Taglio laser", "corso", "", 0.15]],
  },
  { hue: [[151, 71, 255], [109, 40, 217]], accent: "#B57BFF", head: ["E la vostra", "azienda?"] },
];
const HEAD = { x: 72, y: 136, size: 108, lh: 124 };
const ROW = { x: 24, y: 330, h: 88, w: 772 };
const CARD = { y: 196, h: 108, w: 378, gap: 16 };
const Z = 1.2, VIEW = view(WIN.x + WIN.w / 2, WIN.y + 430, Z);

const K = {};
function timeline() {
  K.sc = [-1, B(10), B(19), B(28)];
  K.act = K.sc.slice(0, 3).map((s, k) => (k === 0 ? B(4) : s + 2 * FILM.P * 2));
  POINTER.splice(0, POINTER.length);
}
const POINTER = [];
const scene = (t) => (t >= K.sc[3] ? 3 : t >= K.sc[2] ? 2 : t >= K.sc[1] ? 1 : 0);
const W = (x, y) => ({ x: WIN.x + x, y: WIN.y + y });

function build(stage) {
  timeline();
  const layer = (s, k) => `
    <div class="full" data-k="L${k}">
      <div class="abs mask" style="left:96px;top:14px;width:420px;height:36px"><div class="abs row" data-k="brand${k}" style="left:0;top:0;height:36px;gap:10px">
        <i style="width:24px;height:24px;border-radius:7px;background:${s.client[1]}"></i><span class="t" style="font-size:18px;font-weight:700">${s.client[0]}</span></div></div>
      ${s.tabs.map((tab, i) => `<div class="abs mask" style="left:${24 + i * 150}px;top:70px;width:150px;height:40px"><span class="abs t" data-k="tab${k}_${i}" style="left:0;top:8px;font-size:17px;font-weight:${i ? 500 : 700};color:${i ? "var(--ink2)" : "var(--ink)"}">${tab}</span></div>`).join("")}
      <div class="abs mask" style="left:24px;top:132px;width:760px;height:50px"><span class="abs t" data-k="title${k}" style="left:0;top:0;font-family:var(--display);font-size:34px;font-weight:700;letter-spacing:-.03em;line-height:48px">${s.title}</span></div>
      ${s.kpi.map(([label], i) => `
        <div class="abs mask" style="left:${24 + i * (CARD.w + CARD.gap) + 22}px;top:${CARD.y + 18}px;width:330px;height:26px"><span class="abs t" data-k="kl${k}_${i}" style="left:0;top:0;font-size:17px;color:var(--ink2);line-height:26px">${label}</span></div>
        <div class="abs mask" style="left:${24 + i * (CARD.w + CARD.gap) + 22}px;top:${CARD.y + 48}px;width:330px;height:50px"><div class="abs" data-k="kv${k}_${i}" style="left:0;top:0;width:330px;height:50px"></div></div>`).join("")}
      ${s.rows.map((r, i) => `
        <div class="abs" data-k="row${k}_${i}" style="left:${ROW.x}px;top:${ROW.y + i * ROW.h}px;width:${ROW.w}px;height:${ROW.h}px">
          <span class="abs t" style="left:20px;top:16px;font-size:20px;font-weight:600">${r[0]}</span>
          <span class="abs t" style="left:20px;top:48px;font-size:16px;color:var(--ink3)">${r[1]}</span>
          <div class="abs center" data-k="pill${k}_${i}" style="right:20px;top:26px;height:34px;padding:0 14px;border-radius:17px;font-size:15px;font-weight:600"></div>
          ${r.length > 4 ? `<div class="abs" style="left:20px;right:20px;bottom:10px;height:5px;border-radius:3px;background:var(--hair)"><div class="abs" data-k="bar${k}_${i}" style="left:0;top:0;height:5px;border-radius:3px;background:${s.client[1]}"></div></div>` : ""}
          <i class="abs" style="left:20px;right:20px;bottom:0;height:1px;background:var(--hair)"></i>
        </div>`).join("")}
    </div>`;
  const app = `
    <div class="full" style="background:var(--winBg)"></div>
    <i class="abs" style="left:0;top:64px;width:${WIN.w}px;height:1px;background:var(--hair)"></i>
    <i class="abs" style="left:0;top:114px;width:${WIN.w}px;height:1px;background:var(--hair)"></i>
    <div class="abs" data-k="tabLine" style="top:111px;height:3px;border-radius:2px"></div>
    ${[0, 1].map((i) => `<div class="abs" style="left:${24 + i * (CARD.w + CARD.gap)}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;border-radius:16px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--hair)"></div>`).join("")}
    <div class="abs mask" style="left:0;top:${ROW.y}px;width:${WIN.w}px;height:${WIN.h - ROW.y}px"><div class="abs" style="left:0;top:${-ROW.y}px;width:${WIN.w}px;height:${WIN.h}px">
      ${SCENES.slice(0, 3).map((s, k) => `<div class="full" data-k="R${k}"></div>`).join("")}
    </div></div>
    ${SCENES.slice(0, 3).map(layer).join("")}`;

  stage.innerHTML = `
    ${nebulaHtml("bgBase")}
    ${nebulaHtml("bgWipe")}
    ${lockupBackHtml()}
    ${[0, 1].map((l) => `<div class="abs mask" style="left:${HEAD.x - 8}px;top:${HEAD.y + l * HEAD.lh}px;width:${FILM.W - HEAD.x}px;height:${HEAD.lh + 8}px">
      ${SCENES.map((s, k) => `<span class="abs t" data-k="h${k}_${l}" style="left:8px;top:0;font-family:var(--display);font-size:${HEAD.size}px;font-weight:700;letter-spacing:-.035em;line-height:${HEAD.lh}px;color:${l ? s.accent : "var(--ink)"}">${s.head[l]}</span>`).join("")}</div>`).join("")}
    ${desktopMarkup(app, { name: "" })}
    ${SCENES.slice(0, 3).map((s, k) => `<div class="abs center" data-k="st${k}" style="left:0;top:0;height:84px;padding:0 34px;border-radius:18px;background:rgba(16,14,19,.84);box-shadow:inset 0 0 0 1px var(--hair);font-size:36px;font-weight:600;letter-spacing:-.01em;white-space:nowrap">${s.sticker}</div>`).join("")}
    <div class="full" data-k="end">${lockupHtml()}</div>`;
  collect(stage);
  // le righe vivono nel contenitore con maschera, così entrano ed escono dal bordo della lista
  SCENES.slice(0, 3).forEach((s, k) => s.rows.forEach((_, i) => $["R" + k].appendChild($[`row${k}_${i}`])));
  SCENES.slice(0, 3).forEach((s, k) => s.kpi.forEach((_, i) => { $[`kr${k}_${i}`] = roller($[`kv${k}_${i}`], "font-family:var(--display);font-size:42px;font-weight:700;letter-spacing:-.02em;line-height:50px"); }));
  SCENES.slice(0, 3).forEach((s, k) => {
    s.stW = Math.ceil(measure(s.sticker, 36, 600, "letter-spacing:-.01em") + 68);
    s.tabW = measure(s.tabs[0], 17, 700);
  });
  layoutLockup(FILM.W / 2, FILM.H / 2, 1);
}

function apply(t) {
  const k = scene(t);
  applyBg(t, k);
  applyHead(t);
  const close = prog(t, K.sc[3] + 0.35, 0.6, E.inOut);
  show($.world, close < 1);
  if (close < 1) {
    const v = view(VIEW.cx, VIEW.cy, Z * (1 + 0.02 * loop(t, 2)));
    const rect = close > 0 ? mixRect(FULL, markInWindow(v), close) : FULL;
    placeWorld(v, { rect, chrome: 1 - prog(t, K.sc[3] + 0.35, 0.2), desk: 0, hw: 0 });
    $.winClip.style.background = close > 0.5 ? "var(--accent)" : "";
    show($.L0, close < 0.5); show($.L1, close < 0.5); show($.L2, close < 0.5);
    applyApp(t, k);
    show($.pointer, false);
  }
  applyStickers(t);
  applyEnd(t);
}

function applyBg(t, k) {
  // il nuovo colore si allarga dalla finestra
  const prev = SCENES[Math.max(0, k - 1)];
  placeNebula(t, $.bgBase, ...prev.hue, 1.25);
  const p = k > 0 ? prog(t, K.sc[k] - 0.05, 0.7, E.inOut) : 1;
  placeNebula(t, $.bgWipe, ...SCENES[k].hue, 1.25);
  const c = toStage(VIEW, VIEW.cx, VIEW.cy);
  $.bgWipe.style.clipPath = p >= 1 ? "" : `circle(${(p * 2300).toFixed(1)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px)`;
}

const enterAt = (k) => (k === 0 ? -10 : K.sc[k]);
const leaveAt = (k) => (k < 3 ? K.sc[k + 1] - 0.3 : K.sc[3] + 2.1);

function applyHead(t) {
  SCENES.forEach((s, k) => [0, 1].forEach((l) => {
    const el = $[`h${k}_${l}`];
    const a = enterAt(k) + 0.15 + l * 0.08, d = leaveAt(k) + (1 - l) * 0.05;
    const inP = clamp(spring(t, a, 0.5, 0.86), 0, 1), out = prog(t, d, 0.28, E.in);
    show(el, t >= a && out < 1);
    if (out > 0) sink(el, out); else rise(el, inP);
  }));
}

function applyApp(t, k) {
  SCENES.slice(0, 3).forEach((s, j) => {
    const a = enterAt(j), d = leaveAt(j);
    const on = t >= a && t < d + 0.5;
    show($["L" + j], on);
    show($["R" + j], on);
    if (!on) return;
    const out = (i) => prog(t, d + i * 0.03, 0.28, E.in);
    const inn = (i, delay = 0) => clamp(spring(t, a + 0.3 + delay + i * 0.05, 0.5, 0.88), 0, 1);
    const slot = (el, i, delay) => { if (out(i) > 0) sink(el, out(i)); else rise(el, inn(i, delay)); };
    slot($["brand" + j], 0, -0.1);
    s.tabs.forEach((_, i) => slot($[`tab${j}_${i}`], i, -0.05));
    slot($["title" + j], 0, 0);
    s.kpi.forEach(([, v], i) => {
      slot($[`kl${j}_${i}`], i, 0.05);
      roll($[`kr${j}_${i}`], t, [{ t: a + 0.4 + i * 0.06, v: v[0] }, { t: K.act[j] + 0.15 + i * 0.06, v: v[1] }]);
      if (out(i) > 0) sink($[`kv${j}_${i}`], out(i)); else setT($[`kv${j}_${i}`], "none");
    });
    s.rows.forEach((r, i) => {
      const el = $[`row${j}_${i}`];
      const e = inn(i, 0.15), o = out(i);
      setT(el, `translate(${(-o * 60).toFixed(2)}px,${((1 - e) * 60).toFixed(2)}px)`);
      el.style.clipPath = o > 0 ? `inset(0 ${(o * 100).toFixed(2)}% 0 0)` : "";
      el.style.opacity = o > 0 ? "" : Math.min(1, e * 1.5).toFixed(3);
      const changed = i === 0 && r[3] && t >= K.act[j];
      const [label, ink, bg] = PILL[changed ? r[3] : r[2]];
      const pill = $[`pill${j}_${i}`];
      if (pill.textContent !== label) pill.textContent = label;
      pill.style.color = ink;
      pill.style.background = bg;
      setT(pill, i === 0 ? `scale(${(1 + 0.12 * pulse(t, K.act[j], 0.4)).toFixed(4)})` : "none");
      if (r.length > 4) {
        const to = i === 0 && r[5] !== undefined ? track(t, r[4], [{ t: K.act[j], to: r[5], d: 0.6, e: E.snappy }]) : r[4];
        $[`bar${j}_${i}`].style.width = (to * (ROW.w - 40) * prog(t, a + 0.5 + i * 0.05, 0.6, E.out)).toFixed(2) + "px";
      }
      el.style.background = i === 0 && t >= K.act[j] ? `rgba(17,17,17,${(0.05 * (1 - prog(t, K.act[j] + 0.6, 1.2))).toFixed(3)})` : "";
      el.style.borderRadius = "12px";
    });
  });
  // la sottolineatura della scheda attiva prende il colore del cliente e la larghezza della sua prima voce
  const s = SCENES[Math.min(k, 2)], prev = SCENES[Math.max(0, Math.min(k, 2) - 1)];
  const q = k > 0 && k < 3 ? prog(t, K.sc[k] + 0.2, 0.4, E.snappy) : 1;
  $.tabLine.style.left = "24px";
  $.tabLine.style.width = lerp(prev.tabW, s.tabW, q).toFixed(2) + "px";
  $.tabLine.style.background = q < 0.5 ? prev.client[1] : s.client[1];
}

function applyStickers(t) {
  SCENES.slice(0, 3).forEach((s, k) => {
    const el = $["st" + k];
    const a = enterAt(k) + 0.9, d = leaveAt(k) - 0.05;
    const pop = clamp(spring(t, a, 0.5, 0.8), 0, 1.1), out = prog(t, d, 0.25, E.in);
    show(el, t >= a && out < 1);
    el.style.left = Math.round((FILM.W - s.stW) / 2) + "px";
    el.style.top = "1692px";
    el.style.transform = `translateY(${((1 - Math.min(pop, 1)) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * pop) * (1 - out)})`;
    el.style.opacity = Math.min(1, pop * 1.4).toFixed(3);
  });
}

function markInWindow(v) {
  const m = LOCK.top;
  return { x: (m.x - FILM.W / 2) / v.z + v.cx - WIN.x, y: (m.y - FILM.H / 2) / v.z + v.cy - WIN.y, w: m.w / v.z, h: m.h / v.z, r: m.r / v.z };
}

function applyEnd(t) {
  // la finestra è diventata il blocco in cima: gli altri quattro scendono da lì e sotto compare la firma
  placeLockup(t, K.sc[3] + 0.95);
}
