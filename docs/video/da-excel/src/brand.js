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
