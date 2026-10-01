film({ W: 1080, H: 1920, BPM: 120, BEATS: 36 });

// Bozza di prova: la stessa finestra cambia forma per tre aziende diverse.
// Aziende, targhe, persone e numeri sono inventati.
const BRAND = { name: "Merkorn", line: "Un gestionale su misura, per ognuna." };
const PILL = {
  lav: ["In lavorazione", "#1F5FBF", "#E2ECFB"], pronta: ["Pronta", "#1E7A46", "#DDF3E5"], attesa: ["Attesa ricambi", "#B4540A", "#FDEBD3"],
  pren: ["Prenotata", "#5B5B66", "#EEEEF2"], viaggio: ["In viaggio", "#1F5FBF", "#E2ECFB"], cons: ["Consegnata", "#1E7A46", "#DDF3E5"],
  carico: ["In carico", "#5B5B66", "#EEEEF2"], ritardo: ["In ritardo", "#B42318", "#FDE3E1"], corso: ["In corso", "#1F5FBF", "#E2ECFB"],
  quasi: ["Collaudo", "#6D28D9", "#EDE6FD"], ferma: ["Ferma", "#B42318", "#FDE3E1"], fatta: ["Completata", "#1E7A46", "#DDF3E5"],
};
const SCENES = [
  {
    bg: "#FFD23F", head: ["Un'officina", "meccanica."], sticker: "Interventi, targhe, ricambi.",
    client: ["Officina Neri", "#E4572E"], tabs: ["Interventi", "Veicoli", "Ricambi", "Clienti"], title: "Interventi di oggi",
    kpi: [["In officina", ["7", "6"]], ["Pronte al ritiro", ["3", "4"]]],
    rows: [["Tagliando e freni", "Fiat Panda · FR 482 KL", "lav", "pronta"], ["Cambio gomme", "VW Golf · GM 105 TS", "pronta"],
      ["Diagnosi motore", "Ford Fiesta · EZ 931 BR", "attesa"], ["Revisione", "Renault Clio · FT 220 MN", "pren"],
      ["Sostituzione frizione", "Opel Corsa · GA 774 PD", "lav"], ["Ricarica clima", "Toyota Yaris · FY 318 LC", "pronta"],
      ["Convergenza", "Kia Picanto · GC 609 RE", "pren"]],
  },
  {
    bg: "#3A86FF", head: ["Un'azienda", "di trasporti."], sticker: "Viaggi, mezzi, autisti.",
    client: ["Trasporti Valli", "#1D4ED8"], tabs: ["Spedizioni", "Mezzi", "Autisti", "Clienti"], title: "Consegne di oggi",
    kpi: [["In viaggio", ["12", "11"]], ["Consegnate", ["28", "29"]]],
    rows: [["Milano → Bologna", "6 bancali · Luca Ferri", "viaggio", "cons"], ["Torino → Genova", "3 bancali · Marta Sala", "cons"],
      ["Verona → Padova", "9 bancali · Gino Riva", "carico"], ["Brescia → Bergamo", "2 bancali · Anna Conti", "cons"],
      ["Parma → Modena", "5 bancali · Paolo Greco", "viaggio"], ["Como → Varese", "4 bancali · Sara Neri", "ritardo"],
      ["Pavia → Lodi", "7 bancali · Elia Costa", "carico"]],
  },
  {
    bg: "#FF5D8F", head: ["Un laboratorio", "di produzione."], sticker: "Commesse, fasi, macchine.",
    client: ["Laboratorio Gatti", "#BE185D"], tabs: ["Commesse", "Produzione", "Macchine", "Magazzino"], title: "Avanzamento commesse",
    kpi: [["Commesse aperte", ["9", "9"]], ["Da consegnare", ["4", "4"]]],
    rows: [["C-214 · Telai inox", "Saldatura", "corso", "corso", 0.6, 0.75], ["C-215 · Staffe su misura", "Taglio laser", "corso", "", 0.3],
      ["C-216 · Carter macchina", "Verniciatura", "corso", "", 0.85], ["C-217 · Ripiani forati", "Controllo finale", "quasi", "", 0.95],
      ["C-218 · Supporti motore", "Attesa materiale", "ferma", "", 0], ["C-219 · Cornici alluminio", "Spedita", "fatta", "", 1],
      ["C-220 · Pannelli forati", "Taglio laser", "corso", "", 0.15]],
  },
  { bg: "#FFD23F", head: ["E la tua", "azienda?"] },
];
const HEAD = { x: 72, y: 132, size: 112, lh: 129 };
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
      <div class="abs mask" style="left:24px;top:132px;width:760px;height:50px"><span class="abs t" data-k="title${k}" style="left:0;top:0;font-size:34px;font-weight:700;letter-spacing:-.6px;line-height:48px">${s.title}</span></div>
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
    <div class="full" style="background:#fff"></div>
    <i class="abs" style="left:0;top:64px;width:${WIN.w}px;height:1px;background:var(--hair)"></i>
    <i class="abs" style="left:0;top:114px;width:${WIN.w}px;height:1px;background:var(--hair)"></i>
    <div class="abs" data-k="tabLine" style="top:111px;height:3px;border-radius:2px"></div>
    ${[0, 1].map((i) => `<div class="abs" style="left:${24 + i * (CARD.w + CARD.gap)}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;border-radius:16px;background:var(--side)"></div>`).join("")}
    <div class="abs mask" style="left:0;top:${ROW.y}px;width:${WIN.w}px;height:${WIN.h - ROW.y}px"><div class="abs" style="left:0;top:${-ROW.y}px;width:${WIN.w}px;height:${WIN.h}px">
      ${SCENES.slice(0, 3).map((s, k) => `<div class="full" data-k="R${k}"></div>`).join("")}
    </div></div>
    ${SCENES.slice(0, 3).map(layer).join("")}`;

  stage.innerHTML = `
    <div class="full" data-k="bgBase"></div>
    <div class="full" data-k="bgWipe"></div>
    ${[0, 1].map((l) => `<div class="abs mask" style="left:${HEAD.x - 8}px;top:${HEAD.y + l * HEAD.lh}px;width:${FILM.W - HEAD.x}px;height:${HEAD.lh + 8}px">
      ${SCENES.map((s, k) => `<span class="abs t" data-k="h${k}_${l}" style="left:8px;top:0;font-size:${HEAD.size}px;font-weight:800;letter-spacing:-.045em;line-height:${HEAD.lh}px">${s.head[l]}</span>`).join("")}</div>`).join("")}
    ${desktopMarkup(app, { name: "" })}
    ${SCENES.slice(0, 3).map((s, k) => `<div class="abs center" data-k="st${k}" style="left:0;top:0;height:92px;padding:0 34px;border-radius:20px;background:#fff;box-shadow:0 0 0 4px #111,9px 9px 0 4px #111;font-size:40px;font-weight:700;letter-spacing:-.02em;white-space:nowrap">${s.sticker}</div>`).join("")}
    <div class="full" data-k="end">
      <div class="abs" data-k="mark" style="background:#111"></div>
      <div class="abs mask" data-k="wmClip"><div data-k="wm" class="t" style="font-size:150px;font-weight:800;letter-spacing:-.045em;line-height:1.25">${BRAND.name}</div></div>
      <div class="abs mask" data-k="lnClip" style="height:62px"><div data-k="ln" class="t" style="font-size:44px;font-weight:600;line-height:60px;letter-spacing:-.015em">${BRAND.line}</div></div>
    </div>`;
  collect(stage);
  // le righe vivono nel contenitore con maschera, così entrano ed escono dal bordo della lista
  SCENES.slice(0, 3).forEach((s, k) => s.rows.forEach((_, i) => $["R" + k].appendChild($[`row${k}_${i}`])));
  SCENES.slice(0, 3).forEach((s, k) => s.kpi.forEach((_, i) => { $[`kr${k}_${i}`] = roller($[`kv${k}_${i}`], "font-size:40px;font-weight:800;letter-spacing:-1px;line-height:50px"); }));
  SCENES.slice(0, 3).forEach((s, k) => {
    s.stW = Math.ceil(measure(s.sticker, 40, 700, "letter-spacing:-.02em") + 68);
    s.tabW = measure(s.tabs[0], 17, 700);
  });
  const wmW = measure(BRAND.name, 150, 800, "letter-spacing:-.045em");
  END.mark = { x: (FILM.W - 150) / 2, y: 700, w: 150, h: 150, r: 34 };
  Object.assign($.wmClip.style, { left: Math.round((FILM.W - wmW) / 2) + "px", top: "880px", width: Math.ceil(wmW + 10) + "px", height: "188px" });
  const lnW = measure(BRAND.line, 44, 600, "letter-spacing:-.015em");
  Object.assign($.lnClip.style, { left: Math.round((FILM.W - lnW) / 2) + "px", top: "1090px", width: Math.ceil(lnW + 6) + "px" });
}
const END = {};

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
    $.winShadow.style.boxShadow = `${(14 * (1 - close)).toFixed(2)}px ${(14 * (1 - close)).toFixed(2)}px 0 4px #111, 0 0 0 4px #111`;
    $.winClip.style.background = close > 0.5 ? "#111" : "";
    show($.L0, close < 0.5); show($.L1, close < 0.5); show($.L2, close < 0.5);
    applyApp(t, k);
    show($.pointer, false);
  }
  applyStickers(t);
  applyEnd(t);
}

function applyBg(t, k) {
  // il nuovo colore si allarga dalla finestra
  const prev = k > 0 ? SCENES[k - 1].bg : SCENES[0].bg;
  $.bgBase.style.background = prev;
  const p = k > 0 ? prog(t, K.sc[k] - 0.05, 0.7, E.inOut) : 1;
  $.bgWipe.style.background = SCENES[k].bg;
  const c = toStage(VIEW, VIEW.cx, VIEW.cy);
  $.bgWipe.style.clipPath = p >= 1 ? "" : `circle(${(p * 2300).toFixed(1)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px)`;
}

const enterAt = (k) => (k === 0 ? -10 : K.sc[k]);
const leaveAt = (k) => (k < 3 ? K.sc[k + 1] - 0.3 : Infinity);

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
    const pop = clamp(spring(t, a, 0.42, 0.62), 0, 1.2), out = prog(t, d, 0.25, E.in);
    show(el, t >= a && out < 1);
    el.style.left = Math.round((FILM.W - s.stW) / 2) + "px";
    el.style.top = "1692px";
    el.style.transform = `rotate(${k % 2 ? 2.5 : -3}deg) scale(${(pop * (1 - out)).toFixed(4)})`;
  });
}

function markInWindow(v) {
  const m = END.mark;
  return { x: (m.x - FILM.W / 2) / v.z + v.cx - WIN.x, y: (m.y - FILM.H / 2) / v.z + v.cy - WIN.y, w: m.w / v.z, h: m.h / v.z, r: m.r / v.z };
}

function applyEnd(t) {
  const on = t >= K.sc[3] + 0.9;
  show($.end, on);
  if (!on) return;
  rectCss($.mark, END.mark);
  rise($.wm, clamp(spring(t, K.sc[3] + 1.0, 0.55, 0.88), 0, 1));
  rise($.ln, clamp(spring(t, K.sc[3] + 1.5, 0.55, 0.88), 0, 1));
}
