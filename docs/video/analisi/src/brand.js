// Merkorn: il marchio a cinque blocchi e il fondale a nebulosa, condivisi dalle prove.
// Il marchio è una griglia 5 × 3 di blocchi quadrati che si toccano agli angoli.
const MARK = [[2, 0], [1, 1], [3, 1], [0, 2], [4, 2]];

function markHtml(key) {
  return MARK.map((_, i) => `<i class="abs" data-k="${key}${i}" style="background:var(--accent)"></i>`).join("");
}

// s: lato di un blocco; p(i): 0 → 1, il blocco i esce da quello in cima e scende al suo posto
function placeMark(key, x, y, s, p = () => 1, from = null) {
  const top = { x: x + 2 * s, y, w: s, h: s, r: s * 0.12 };
  MARK.forEach(([c, r], i) => {
    const el = $[key + i], q = p(i);
    const own = { x: x + c * s, y: y + r * s, w: s, h: s, r: s * 0.12 };
    const start = i === 0 ? from || own : top;
    show(el, q > 0 || (i === 0 && from));
    rectCss(el, mixRect(start, own, clamp(q, 0, 1.06)));
  });
}

// Nebulosa: tre nuvole di luce che si spostano lentamente e chiudono il giro con il video
function nebulaHtml(key = "neb") {
  return `<div class="full" data-k="${key}" style="background:var(--scene)"></div>`;
}

function placeNebula(t, el, hue = [151, 71, 255], hue2 = [109, 40, 217], strength = 1) {
  const W = FILM.W, H = FILM.H;
  const blob = (cx, cy, rx, ry, c, a) => `radial-gradient(${rx.toFixed(0)}px ${ry.toFixed(0)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px, rgba(${c.join(",")},${(a * strength).toFixed(3)}), rgba(${c.join(",")},0))`;
  el.style.background = [
    blob(W * (0.18 + 0.03 * loop(t, 1)), H * (0.22 + 0.02 * loop(t, 1, 0.25)), W * 0.55, H * 0.6, hue, 0.30),
    blob(W * (0.86 + 0.02 * loop(t, 1, 0.5)), H * (0.8 + 0.03 * loop(t, 1, 0.1)), W * 0.6, H * 0.7, hue2, 0.34),
    blob(W * (0.6 + 0.04 * loop(t, 1, 0.7)), H * (0.35 + 0.03 * loop(t, 1, 0.4)), W * 0.35, H * 0.4, hue, 0.12),
  ].join(",") + ",var(--scene)";
}

// Chiusura "powered by Merkorn", come nelle storie di Merkorn: fondo nero, alone viola, marchio sopra la scritta
const LOCK = {};
// il fondale va dietro la finestra, il marchio e la scritta davanti
function lockupBackHtml() {
  return `<div class="full" data-k="lkBlack" style="background:#030205"></div><div class="full" data-k="lkGlow"></div>`;
}
function lockupHtml() {
  return `${markHtml("mk")}
    <div class="abs mask" data-k="lkClip"><div class="abs row" data-k="lkRow" style="left:0;top:0;align-items:baseline;white-space:nowrap">
      <span class="t" data-k="lkBy" style="font-family:var(--display);font-weight:400;color:#8E8A95"></span>
      <span class="t" data-k="lkName" style="font-family:var(--display);font-weight:700;letter-spacing:-.02em;color:var(--ink)"></span>
    </div></div>`;
}

// k: scala (1 = misure della storia verticale 1080 × 1920)
function layoutLockup(cx, cy, k = 1) {
  const by = 44 * k, name = 68 * k, gap = Math.round(14 * k), s = Math.round(34 * k);
  $.lkBy.textContent = "powered by";
  $.lkName.textContent = "Merkorn";
  Object.assign($.lkBy.style, { fontSize: by + "px", lineHeight: "1.2" });
  Object.assign($.lkName.style, { fontSize: name + "px", lineHeight: "1.2", marginLeft: gap + "px" });
  const w = measure("powered by", by, 400, "font-family:var(--display)") + gap + measure("Merkorn", name, 700, "font-family:var(--display);letter-spacing:-.02em");
  const h = Math.ceil(name * 1.2) + 4;
  const markH = 3 * s, gapV = Math.round(34 * k), total = markH + gapV + h;
  Object.assign(LOCK, { cx, cy, k, s, x: Math.round(cx - (5 * s) / 2), y: Math.round(cy - total / 2) });
  LOCK.top = { x: LOCK.x + 2 * s, y: LOCK.y, w: s, h: s, r: s * 0.12 };
  Object.assign($.lkClip.style, { left: Math.round(cx - w / 2) + "px", top: LOCK.y + markH + gapV + "px", width: Math.ceil(w + 8) + "px", height: h + "px" });
}

// open: il blocco del primo fotogramma comincia ad aprirsi nella finestra (il video parte dalla fine, per chiudere il giro)
// t0: la finestra è tornata blocco; out: la firma esce e il marchio si richiude nel blocco del primo fotogramma
function placeLockup(t, t0, { open = -Infinity, out = Infinity } = {}) {
  const glow = (g) => {
    const R = 330 * LOCK.k * (0.8 + 0.2 * g), gy = LOCK.y + 1.5 * LOCK.s + 20 * LOCK.k;
    $.lkGlow.style.background = `radial-gradient(${R.toFixed(0)}px ${(R * 0.92).toFixed(0)}px at ${LOCK.cx}px ${gy.toFixed(0)}px, rgba(110,40,200,${(0.55 * g).toFixed(3)}), rgba(70,20,140,${(0.22 * g).toFixed(3)}) 45%, rgba(0,0,0,0) 100%)`;
  };
  const opening = t < open + 0.7;
  const closing = t >= t0 - 0.35;
  for (const key of ["lkBlack", "lkGlow"]) show($[key], opening || closing);
  show($.lkClip, closing);
  MARK.forEach((_, i) => show($["mk" + i], false));
  if (opening) {
    const q = prog(t, open, 0.6, E.inOut);
    $.lkBlack.style.opacity = (1 - q).toFixed(3);
    glow(1 - q);
    if (t < open) placeMark("mk", LOCK.x, LOCK.y, LOCK.s, (i) => (i === 0 ? 1 : 0));
    return;
  }
  if (!closing) return;
  $.lkBlack.style.opacity = prog(t, t0 - 0.35, 0.6, E.inOut).toFixed(3);
  glow(prog(t, t0, 1.0, E.out));
  const back = (i) => 1 - prog(t, out + 0.3 + (4 - i) * 0.05, 0.35, E.in);
  if (t >= t0) placeMark("mk", LOCK.x, LOCK.y, LOCK.s, (i) => (i === 0 ? 1 : Math.min(spring(t, t0 + 0.05 + i * 0.07, 0.5, 0.8), back(i))));
  if (t < out) rise($.lkRow, clamp(spring(t, t0 + 0.45, 0.55, 0.88), 0, 1));
  else sink($.lkRow, prog(t, out, 0.3, E.in));
}
