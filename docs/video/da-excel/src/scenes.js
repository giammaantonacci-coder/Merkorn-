film({ W: 1920, H: 1080, BPM: 120, BEATS: 62 });

// Merkorn, "Da Excel al gestionale": un foglio di calcolo caotico diventa un gestionale su misura,
// poi l'ordine appena inserito scala il magazzino e diventa una fattura elettronica.
// Il video parte e finisce sullo stesso blocco viola, così gira in loop.
// Tutti i nomi, gli importi, i codici e i numeri sono inventati.
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
// la riga che viene digitata nel foglio: [campo, colonna, testo]
const TYPED = 13, TYPE_SPEED = 0.055;
const TYPE = [["num", 0, "1054"], ["cli", 1, "Idraulica Costa"], ["dat", 2, "17/09"], ["pro", 3, "Raccordi ottone"], ["Qty", 4, "300"], ["imp", 5, "1.290,00"], ["st", 6, "consegnato"]];
const FORMULA = "=SOMMA(F2:F15)+F17-F3";
const NEW = ["1055", "Ristorante Da Pino", "18/09", "Teglie inox", "", "1.640,00", "", 0];

const GOOD = ["#4CC94C", "rgba(12,163,12,.18)"], WARN = ["#FAB219", "rgba(250,178,25,.14)"], BLUE = ["#6FB0E4", "rgba(58,143,208,.18)"];
const STATI = [["Da evadere", ...WARN], ["In consegna", ...BLUE], ["Consegnato", ...GOOD]];

// Foglio di calcolo, in punti finestra
const SH = { top: 108, row: 30, rn: 40, cols: [40, 100, 300, 400, 580, 640, 760, 900, 1200] };
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const TABS = [["ORDINI_def_v3", 1], ["MAGAZZINO (2)", 2], ["copia di Fatture", 3], ["NON TOCCARE", 4]];
// Gestionale, in punti finestra
const SIDE_W = 220;
const MENU = ["Dashboard", "Ordini", "Magazzino", "Fatture", "Clienti", "Report"];
const MENU_Y = (k) => 100 + k * 40;
const GT = { x: 248, w: 928, top: 290, row: 52, head: 256 };
const KPI_Y = 140, KPI_H = 92, KPI_W = 296;
const BTN = { x: 992, y: 22, w: 184, h: 42 };
const SHOWN = 8;

// Le tre schermate: titolo, pulsante, schede di riepilogo, filtri e intestazioni della tabella
const SCREENS = {
  ord: {
    title: "Ordini", btn: "+ Nuovo ordine",
    kpi: [["Ordini del mese", "14", "15"], ["Da evadere", "4", "5"], ["Fatturato del mese", "€ 20.481,50", "€ 22.121,50"]],
    chips: [["Tutti", "14", "15"], ["Da evadere", "4", "5"], ["In consegna", "4", "4"], ["Consegnati", "6", "6"]],
    head: [["Cliente", 16], ["Data", 282], ["Prodotto", 382], ["Importo", 600], ["Stato", 762]],
  },
  mag: {
    title: "Magazzino", btn: "+ Nuovo articolo",
    kpi: [["Articoli a magazzino", "248", "248"], ["Sotto scorta", "1", "2"], ["Valore magazzino", "€ 84.310,00", "€ 83.590,00"]],
    chips: [["Tutti", "248", "248"], ["Sotto scorta", "1", "2"], ["In arrivo", "3", "3"]],
    head: [["Articolo", 16], ["Giacenza", 300], ["Scorta minima", 420], ["Livello", 560], ["Stato", 762]],
  },
  fat: {
    title: "Fatture", btn: "+ Nuova fattura",
    kpi: [["Da emettere", "1", "0"], ["Emesse a settembre", "23", "24"], ["Totale emesso", "€ 31.870,00", "€ 33.510,00"]],
    chips: [["Tutte", "24", "24"], ["Da emettere", "1", "0"], ["Consegnate", "23", "24"]],
    head: [["Cliente", 16], ["Data", 282], ["Ordine", 382], ["Importo", 600], ["Stato", 762]],
  },
};
const ORDER = ["ord", "mag", "fat"];

// [articolo, codice, giacenza, giacenza dopo l'ordine, scorta minima]
const MAG = [
  ["Teglie inox", "ART-0412", 30, 18, 20], ["Viti inox M6", "ART-0108", 1200, 1200, 500], ["Pannelli rovere", "ART-0233", 46, 46, 20],
  ["Staffe zincate", "ART-0317", 85, 85, 100], ["Mensole noce", "ART-0251", 14, 14, 10], ["Carrelli piani", "ART-0520", 9, 9, 6],
  ["Vassoi alluminio", "ART-0405", 130, 130, 60], ["Raccordi ottone", "ART-0144", 640, 640, 300],
];
// [cliente, numero, data, ordine, importo]
const FAT = [
  ["Ristorante Da Pino", "418", "18/09", "1055", "1.640,00"], ["Idraulica Costa", "417", "17/09", "1054", "1.290,00"],
  ["Fiori di Marta", "416", "16/09", "1053", "560,00"], ["Bar Centrale", "415", "15/09", "1052", "1.344,00"],
  ["Autofficina Neri", "414", "15/09", "1051", "1.980,00"], ["Tipografia Riva", "413", "12/09", "1050", "1.460,00"],
  ["Farmacia Greco", "412", "11/09", "1049", "870,00"], ["Cantina Ruggeri", "411", "10/09", "1048", "2.950,00"],
];
const EMIT = { x: 744, y: 10, w: 168, h: 32 };

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
    open: B(2),
  });
  // qualcuno compila l'ultima riga del foglio, cella per cella, poi riscrive il totale: #RIF!
  let at = K.open + 1.6;
  K.cells = TYPE.map(([, , text]) => { const c = { at, end: at + text.length * TYPE_SPEED }; at = c.end + 0.2; return c; });
  K.toTotal = at;
  K.formula = at + 0.25;
  K.hit = K.formula + FORMULA.length * 0.04 + 0.2;
  K.err = K.hit;
  // l'errore scuote l'inquadratura; la camera si allontana, compare "Metti ordine.", poi si apre il gestionale
  K.shake = K.hit + 0.05;
  K.away = K.hit + 0.55;
  K.motto = K.away + 0.8;
  K.mottoOut = K.motto + 1.6;
  K.morph = K.mottoOut + 0.35;
  K.wide = K.morph - 0.1;
  K.labels = K.morph + 1.0; K.values = K.labels + 0.25;
  K.point = K.labels + 1.5; K.click = K.point + 0.5;
  K.pMag = K.click + 1.5; K.mag = K.pMag + 0.5; K.stock = K.mag + 1.5;
  K.pFat = K.stock + 1.5; K.fat = K.pFat + 0.5; K.pEmit = K.fat + 1.0; K.emit = K.pEmit + 0.5; K.sdi = K.emit + 1.0;
  // dopo l'ultima operazione: tre secondi di respiro, la camera arretra piano, poi la finestra torna blocco
  K.pull = K.sdi + 0.5; K.close = K.sdi + 3.0;
  K.out = K.close + 0.6 + 3.2;
  K.newRow = K.click + 0.15;
  K.enter = { ord: K.labels, mag: K.mag + 0.12, fat: K.fat + 0.12 };
  K.leave = { ord: K.mag, mag: K.fat, fat: Infinity };
  K.change = { ord: K.newRow + 0.25, mag: K.stock + 0.2, fat: K.emit + 0.25 };
  const M = (k) => W(110, MENU_Y(k) + 17);
  POINTER.splice(0, POINTER.length,
    { t: 0, ...W(820, 640) },
    { t: K.point, ...W(BTN.x + 120, BTN.y + 26), d: 0.45 },
    { t: K.pMag, ...M(2), d: 0.6 },
    { t: K.pFat, ...M(3), d: 0.45 },
    { t: K.pEmit, ...W(GT.x + EMIT.x + 110, GT.top + EMIT.y + 20), d: 0.6 },
    { t: K.emit + 0.45, ...W(GT.x + EMIT.x + 250, GT.top + 120), d: 0.6 });
}
const POINTER = [];
const W = (x, y) => ({ x: WIN.x + x, y: WIN.y + y });

const esc = (s) => s.replace(/&/g, "&amp;");
const txt = (k, s, css = "") => `<span class="abs t" data-k="${k}" style="left:0;top:0;${css}">${esc(s)}</span>`;
const pillCss = "height:26px;padding:0 12px;border-radius:13px;font-size:13px;font-weight:600;line-height:26px";

function build(stage) {
  timeline();
  const grid = [];
  for (const x of SH.cols) grid.push(`<i class="abs" style="left:${x}px;top:84px;width:1px;height:${SH.top - 84 + SH.row * (ORD.length + 1)}px;background:#D6D6D6"></i>`);
  for (let r = 0; r <= ORD.length + 1; r++) grid.push(`<i class="abs" style="left:0;top:${SH.top + r * SH.row}px;width:1200px;height:1px;background:#D6D6D6"></i>`);
  const letters = LETTERS.map((l, i) => `<span class="abs t" style="left:${SH.cols[i]}px;width:${SH.cols[i + 1] - SH.cols[i]}px;top:88px;text-align:center;font-size:12px;color:#666">${l}</span>`).join("");

  const ordRow = (r, i, key) => {
    const [num, cli, dat, pro, qty, imp, raw, , note, , ink] = r;
    const inkCss = ink ? `color:${ink};` : "";
    return `
    <div class="abs" data-k="${key}" style="left:0;top:0;width:1200px;height:30px;color:#222">
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
  const shell = (key, i, inner) => `
    <div class="abs" data-k="${key}" style="left:${GT.x}px;top:${GT.top + i * GT.row}px;width:${GT.w}px;height:${GT.row}px;border-radius:10px">
      ${inner}<i class="abs" style="left:16px;right:16px;bottom:0;height:1px;background:var(--hair)"></i>
    </div>`;
  const magRow = ([name, code, q0, , min], i) => shell("m" + i, i, `
      <span class="abs t" style="left:16px;top:8px;font-size:16px;font-weight:600">${name}</span>
      <span class="abs t" style="left:16px;top:30px;font-size:12.5px;font-weight:500;color:var(--ink3)">${code}</span>
      <div class="abs mask" style="left:300px;top:12px;width:90px;height:26px"><div class="abs" data-k="mq${i}" style="left:0;top:0;width:90px;height:26px"></div></div>
      <span class="abs t" style="left:420px;top:16px;font-size:15px;color:var(--ink2)">${min}</span>
      <div class="abs" style="left:560px;top:22px;width:140px;height:8px;border-radius:4px;background:rgba(242,239,234,.08)">
        <i class="abs" data-k="mb${i}" style="left:0;top:0;height:8px;border-radius:4px"></i>
        <b class="abs" style="left:69px;top:-3px;width:2px;height:14px;border-radius:1px;background:var(--ink)"></b>
      </div>
      <div class="abs" data-k="mp${i}" style="left:762px;top:13px;${pillCss}"></div>`);
  const fatRow = ([cli, n, dat, ord, imp], i) => shell("f" + i, i, `
      <span class="abs t" style="left:16px;top:8px;font-size:16px;font-weight:600">${cli}</span>
      <span class="abs t" style="left:16px;top:30px;font-size:12.5px;font-weight:500;color:var(--ink3)">Fattura n. ${n}</span>
      <span class="abs t" style="left:282px;top:16px;font-size:15px">${dat}</span>
      <span class="abs t" style="left:382px;top:16px;font-size:15px;color:var(--ink2)">Ordine #${ord}</span>
      <span class="abs t" style="left:600px;top:16px;font-size:15px;font-weight:600">€ ${imp}</span>
      <div class="abs center" data-k="fp${i}" style="left:762px;top:13px;${pillCss};${i ? `color:${GOOD[0]};background:${GOOD[1]}` : ""}">${i ? "Consegnata" : ""}</div>`);

  const screenBits = (s) => {
    const S = SCREENS[s];
    return `
      ${S.chips.map(([l, n], k) => `<div class="abs row" data-k="chip_${s}${k}" style="left:0;top:84px;height:36px;padding:0 14px;gap:8px;border-radius:10px;font-size:14px;font-weight:600;transform-origin:0 50%;${k ? "box-shadow:inset 0 0 0 1px var(--hair);color:var(--ink2)" : "background:var(--ink);color:var(--winBg)"}"><span>${l}</span><span data-k="chipN_${s}${k}" style="opacity:.6">${n}</span></div>`).join("")}
      <div class="abs" data-k="thead_${s}" style="left:${GT.x}px;top:${GT.head}px;width:${GT.w}px;height:30px">
        ${S.head.map(([l, x], k) => `<div class="abs mask" style="left:${x}px;top:0;width:150px;height:22px"><span class="abs t" data-k="th_${s}${k}" style="left:0;top:0;font-size:12.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);line-height:22px">${l}</span></div>`).join("")}
      </div>`;
  };

  const app = `
    <div class="full" data-k="appBg" style="background:#FFFFFF"></div>
    <div class="abs" data-k="sheetChrome" style="left:0;top:0;width:1200px;height:780px;color:#222">
      <div class="abs" style="left:0;top:0;width:1200px;height:52px;background:#1D6F42"></div>
      <span class="abs t" style="left:0;width:1200px;top:15px;text-align:center;font-size:14px;font-weight:600;color:#fff">ORDINI_def_v3 (copia) (2).xlsx</span>
      <div class="abs row" style="left:0;top:52px;width:1200px;height:32px;background:#F7F7F7;box-shadow:inset 0 -1px 0 #D6D6D6;padding-left:12px;gap:14px;font-size:13px">
        <i style="font-style:italic;color:#888;font-weight:600">fx</i><span data-k="fxText" style="color:#333;white-space:pre"></span>
      </div>
      <div class="abs" style="left:0;top:84px;width:1200px;height:24px;background:#F2F2F2"></div>
      ${letters}${grid.join("")}
      <div class="abs" style="left:0;top:${SH.top + SH.row * ORD.length}px;width:1200px;height:30px;background:#FAFAFA">
        <span class="abs t" style="left:106px;top:7px;font-size:13px;font-weight:700">TOTALE</span>
        <span class="abs t" data-k="ref" style="left:646px;top:7px;font-size:13px;font-weight:700;color:#D0021B;padding:0 3px;margin-left:-3px"></span>
        <span class="abs t" style="left:766px;top:7px;font-size:13px;color:#333">da evadere: ???</span>
      </div>
      <div class="abs" style="left:0;top:744px;width:1200px;height:36px;background:#F2F2F2;box-shadow:inset 0 1px 0 #D6D6D6"></div>
      <div class="abs" data-k="cell" style="box-shadow:inset 0 0 0 2px #1D6F42"><i class="abs" style="right:-4px;bottom:-4px;width:7px;height:7px;background:#1D6F42;box-shadow:0 0 0 1px #fff"></i></div>
      <i class="abs" data-k="caret" style="width:1.5px;height:17px;background:#111"></i>
    </div>
    <div class="abs" data-k="side" style="background:#F2F2F2"></div>
    <div class="abs row" data-k="brand" style="left:20px;top:52px;gap:10px">
      <i style="width:26px;height:26px;border-radius:7px;background:#C2410C"></i><span class="t" style="font-family:var(--display);font-size:16px;font-weight:700">${CLIENT}</span>
    </div>
    <div class="abs" data-k="menuSel" style="left:12px;width:196px;height:34px;border-radius:10px;background:var(--lift2);box-shadow:inset 3px 0 0 var(--accent)"></div>
    ${MENU.map((m, k) => `<div class="abs" data-k="menu${k}" style="left:12px;top:${MENU_Y(k)}px;width:196px;height:34px">
      <div class="abs mask" style="left:14px;top:0;width:170px;height:34px"><span class="abs t" data-k="menuT${k}" style="left:0;top:7px;font-size:15px;font-weight:500">${m}</span></div>
    </div>`).join("")}
    ${TABS.map(([label], k) => `<span class="abs t" data-k="tab${k}" style="left:0;top:0;font-size:12.5px;color:${k === 3 ? "#D0021B" : "#333"};font-weight:${k === 0 ? 700 : 400}">${label}</span>`).join("")}
    <div class="abs mask" style="left:${GT.x}px;top:20px;width:420px;height:48px"><div class="abs" data-k="title" style="left:0;top:0;width:420px;height:48px"></div></div>
    <div class="abs" data-k="btn" style="left:${BTN.x}px;top:${BTN.y}px;width:${BTN.w}px;height:${BTN.h}px;border-radius:14px;background:var(--accent);overflow:hidden">
      <div class="abs" data-k="btnHost" style="left:0;top:0;width:${BTN.w}px;height:${BTN.h}px"></div>
    </div>
    ${[0, 1, 2].map((k) => `<div class="abs" data-k="kpi${k}" style="overflow:hidden">
      <div class="abs mask" style="left:20px;top:14px;width:270px;height:24px"><div class="abs" data-k="kpiL${k}" style="left:0;top:0;width:270px;height:24px"></div></div>
      <div class="abs mask" style="left:20px;top:40px;width:270px;height:44px"><div class="abs" data-k="kpiV${k}" style="left:0;top:0;width:270px;height:44px"></div></div>
    </div>`).join("")}
    ${ORDER.map(screenBits).join("")}
    <div class="full" data-k="rows">
      ${ORD.map((r, i) => ordRow(r, i, "r" + i)).join("")}${ordRow([...NEW.slice(0, 7), 0, "", "", ""], -2, "nw")}
      ${MAG.map(magRow).join("")}${FAT.map(fatRow).join("")}
    </div>
    <div class="abs center" data-k="emit" style="color:var(--ink);font-size:14px;font-weight:600;overflow:hidden;white-space:nowrap"><span class="t" data-k="emitT"></span></div>
    <div class="full" data-k="seal" style="background:var(--accent)"></div>`;

  stage.innerHTML = `
    ${nebulaHtml()}
    ${lockupBackHtml()}
    ${desktopMarkup(app, { name: CLIENT })}
    <div class="full" data-k="dimMotto" style="background:#030205"></div>
    <div class="full" data-k="motto">
      <div class="abs mask" data-k="mottoA" style="height:240px"><span class="abs t" data-k="mottoAT" style="left:0;top:0;font-family:var(--display);font-size:190px;font-weight:700;letter-spacing:-.045em;line-height:230px">Metti</span></div>
      <div class="abs mask" data-k="mottoB" style="height:240px"><span class="abs t" data-k="mottoBT" style="left:0;top:0;font-family:var(--display);font-size:190px;font-weight:700;letter-spacing:-.045em;line-height:230px;color:#B57BFF">ordine.</span></div>
    </div>
    <div class="full" data-k="word">${lockupHtml()}</div>`;
  collect(stage);
  const gap = 46, wA = measure("Metti", 190, 700, "font-family:var(--display);letter-spacing:-.045em"), wB = measure("ordine.", 190, 700, "font-family:var(--display);letter-spacing:-.045em");
  const x0 = Math.round((FILM.W - (wA + gap + wB)) / 2), y0 = Math.round(FILM.H / 2 - 122);
  Object.assign($.mottoA.style, { left: x0 + "px", top: y0 + "px", width: Math.ceil(wA + 12) + "px" });
  Object.assign($.mottoB.style, { left: Math.round(x0 + wA + gap) + "px", top: y0 + "px", width: Math.ceil(wB + 12) + "px" });
  $.titleR = roller($.title, "font-family:var(--display);font-size:32px;font-weight:700;letter-spacing:-.03em;line-height:48px");
  $.btnR = roller($.btnHost, `width:${BTN.w}px;text-align:center;font-size:15px;font-weight:600;line-height:${BTN.h}px;color:var(--ink)`);
  for (let k = 0; k < 3; k++) {
    $["kpiLR" + k] = roller($["kpiL" + k], "font-size:14px;color:var(--ink2);line-height:24px");
    $["kpiR" + k] = roller($["kpiV" + k], "font-family:var(--display);font-size:32px;font-weight:700;letter-spacing:-.02em;line-height:44px");
  }
  MAG.forEach((_, i) => { $["mqR" + i] = roller($["mq" + i], "font-size:15px;font-weight:600;line-height:26px"); });
  CHIPX.length = 0;
  for (const s of ORDER) {
    let x = GT.x;
    SCREENS[s].chips.forEach(([l, a, b], k) => { CHIPX.push([s, k, x]); x += Math.round(measure(`${l}  ${a.length > b.length ? a : b}`, 14, 600) + 36) + 10; });
  }
  layoutLockup(FILM.W / 2, FILM.H / 2, 1.2);
}
const CHIPX = [];

function applyMotto(t) {
  const on = t >= K.motto - 0.4 && t < K.mottoOut + 0.6;
  show($.dimMotto, on); show($.motto, on);
  if (!on) return;
  $.dimMotto.style.opacity = (0.62 * Math.min(prog(t, K.motto - 0.4, 0.5), 1 - prog(t, K.mottoOut + 0.05, 0.45))).toFixed(3);
  [["mottoAT", 0], ["mottoBT", 0.12]].forEach(([k, d], n) => {
    const out = prog(t, K.mottoOut + (1 - n) * 0.06, 0.3, E.in);
    if (out > 0) sink($[k], out); else rise($[k], clamp(spring(t, K.motto + d, 0.5, 0.86), 0, 1));
  });
}

function apply(t) {
  applyMotto(t);
  placeNebula(t, $.neb);
  const v = camera(t);
  $.appBg.style.background = `color-mix(in srgb, var(--winBg) ${(pc(t) * 100).toFixed(1)}%, #FFFFFF)`;
  const opening = prog(t, K.open, 0.7, E.inOut), closing = prog(t, K.close, 0.6, E.inOut);
  const on = t >= K.open && closing < 1;
  show($.world, on);
  if (on) {
    const rect = closing > 0 ? mixRect(FULL, markInWindow(v), closing) : opening < 1 ? mixRect(markInWindow(v), FULL, opening) : FULL;
    placeWorld(v, { rect, chrome: Math.min(prog(t, K.open + 0.5, 0.3), 1 - prog(t, K.close, 0.2)), desk: 0, hw: 0 });
    applySheet(t);
    applyApp(t);
    // il blocco viola si apre nella finestra all'inizio e la finestra torna blocco alla fine
    const seal = t < K.close ? 1 - prog(t, K.open + 0.15, 0.45, E.inOut) : prog(t, K.close + 0.1, 0.35, E.out);
    $.seal.style.opacity = seal.toFixed(3);
    show($.seal, seal > 0);
    placePointer(t, POINTER, [K.click, K.mag, K.fat, K.emit], K.point - 0.1, K.pull + 0.3);
    $.pointer.style.opacity = (prog(t, K.point - 0.1, 0.2, E.out) * (1 - prog(t, K.pull, 0.3))).toFixed(3);
  }
  placeLockup(t, K.close + 0.6, { open: K.open, out: K.out });
}

// centro orizzontale della camera su una colonna del foglio, senza uscire dalla finestra
const cellX = (c) => clamp((SH.cols[c] + SH.cols[c + 1]) / 2, 400, 800);

// la scossa dell'errore: pochi pixel, si smorza in mezzo secondo
function shake(t, v) {
  const d = t - K.shake;
  if (d < 0 || d > 0.7) return v;
  const s = Math.exp(-d / 0.16);
  const dx = 18 * s * Math.sin(2 * Math.PI * 21 * d), dy = 11 * s * Math.sin(2 * Math.PI * 29 * d + 1.1);
  return view(v.cx - dx / v.z, v.cy - dy / v.z, v.z);
}

function camera(t) {
  return shake(t, cameraRaw(t));
}

function cameraRaw(t) {
  return cameraAt(t, [
    { t: 0, ...onWindow(600, 380, 1.42) },
    { t: K.open + 0.7, ...onWindow(600, 384, 1.45), d: K.cells[0].at - 0.6 - K.open - 0.7 },
    // da vicino sulla riga che si scrive: la camera segue il cursore di cella in cella
    ...K.cells.map((c, i) => ({ t: c.at - (i ? 0.22 : 0.65), ...onWindow(cellX(TYPE[i][1]), 432, 2.45 + 0.025 * i), d: i ? 0.5 : 0.75 })),
    // poi sul totale, dove compare l'errore, e un poco più vicino
    { t: K.toTotal - 0.05, ...onWindow(cellX(5), 446, 2.6), d: 0.55 },
    { t: K.toTotal + 0.5, ...onWindow(cellX(5), 452, 2.75), d: K.away - K.toTotal - 0.5 },
    // zoom out: il foglio diventa piccolo al centro, dietro la scritta
    { t: K.away, ...onWindow(600, 390, 0.5), d: 1.2 },
    { t: K.away + 1.2, ...onWindow(600, 390, 0.47), d: K.wide - K.away - 1.2 },
    // si apre il gestionale: la camera torna avanti mentre il foglio si trasforma
    { t: K.wide, ...onWindow(600, 390, 1.24), d: 1.7 },
    { t: K.labels, ...onWindow(640, 392, 1.3), d: 1.0 },
    { t: K.values + 0.6, ...onWindow(640, 392, 1.31), d: K.point - K.values - 0.6 },
    { t: K.newRow + 0.4, ...onWindow(640, 392, 1.325), d: K.pMag - K.newRow - 0.4 },
    { t: K.mag + 0.6, ...onWindow(640, 392, 1.34), d: K.pFat - K.mag - 0.6 },
    { t: K.emit + 0.4, ...onWindow(640, 392, 1.36), d: K.pull - K.emit - 0.4 },
    { t: K.pull, ...onWindow(600, 390, 1.0), d: K.close - K.pull + 0.3 },
  ]);
}

function markInWindow(v) {
  const m = LOCK.top;
  return { x: (m.x - FILM.W / 2) / v.z + v.cx - WIN.x, y: (m.y - FILM.H / 2) / v.z + v.cy - WIN.y, w: m.w / v.z, h: m.h / v.z, r: m.r / v.z };
}

// La trasformazione: prima il foglio si ripulisce, poi ogni riga, colonna e scheda diventa un pezzo del gestionale.
const pc = (t) => prog(t, K.morph, 0.45, E.inOut);
const pm = (t) => prog(t, K.morph + 0.45, 0.85, E.inOut);
const screenAt = (t) => (t >= K.fat ? "fat" : t >= K.mag ? "mag" : "ord");

function applySheet(t) {
  const p = pm(t);
  $.sheetChrome.style.opacity = (1 - pc(t)).toFixed(3);
  show($.sheetChrome, pc(t) < 1);
  applyTyping(t);

  // numeri di riga → barra laterale
  rectCss($.side, mixRect({ x: 0, y: 84, w: SH.rn, h: 696, r: 0 }, { x: 0, y: 0, w: SIDE_W, h: 780, r: 0 }, p));
  $.side.style.background = `color-mix(in srgb, var(--side) ${(pc(t) * 100).toFixed(1)}%, #F2F2F2)`;
  $.side.style.boxShadow = `inset -1px 0 0 ${pc(t) > 0.5 ? "var(--hair)" : "#D6D6D6"}`;
  const br = spring(t, K.labels, 0.5, 0.88);
  show($.brand, t >= K.labels);
  setT($.brand, `translateY(${((1 - clamp(br, 0, 1)) * 16).toFixed(2)}px)`);
  $.brand.style.opacity = clamp(br * 1.4, 0, 1).toFixed(3);

  // schede del foglio → voci di menu
  const tabX = [16, 156, 296, 456];
  TABS.forEach(([, to], k) => {
    const q = prog(t, K.morph + 0.1 + k * 0.05, 0.8, E.inOut);
    setT($["tab" + k], `translate(${lerp(tabX[k], 26, q).toFixed(2)}px,${lerp(753, MENU_Y(to) + 7, q).toFixed(2)}px)`);
    $["tab" + k].style.opacity = (1 - prog(t, K.morph + 0.55 + k * 0.05, 0.3, E.in)).toFixed(3);
    show($["tab" + k], q < 1);
  });
  const selY = track(t, MENU_Y(1), [{ t: K.mag + 0.02, to: MENU_Y(2), spring: [0.4, 0.86] }, { t: K.fat + 0.02, to: MENU_Y(3), spring: [0.4, 0.86] }]);
  $.menuSel.style.top = selY.toFixed(2) + "px";
  show($.menuSel, t >= K.labels);
  $.menuSel.style.opacity = prog(t, K.labels, 0.3).toFixed(3);
  const cur = { ord: 1, mag: 2, fat: 3 }[screenAt(t)];
  MENU.forEach((_, k) => {
    const at = K.morph + 0.75 + k * 0.05;
    show($["menu" + k], t >= at);
    rise($["menuT" + k], clamp(spring(t, at, 0.45, 0.88), 0, 1));
    $["menuT" + k].style.color = k === cur && t >= K.labels ? "var(--ink)" : "var(--ink2)";
    $["menuT" + k].style.fontWeight = k === cur && t >= K.labels ? "600" : "500";
    setT($["menu" + k], `scale(${press(t, k === 2 ? K.mag : k === 3 ? K.fat : -9, 0.96).toFixed(4)})`);
  });
}

function applyApp(t) {
  const p = pm(t), cur = screenAt(t);
  roll($.titleR, t, ORDER.map((s) => ({ t: K.enter[s] - 0.02, v: SCREENS[s].title })));
  roll($.btnR, t, ORDER.map((s) => ({ t: K.enter[s] + 0.08, v: SCREENS[s].btn })));
  const bt = clamp(spring(t, K.labels + 0.1, 0.45, 0.72), 0, 1.06);
  show($.btn, t >= K.labels + 0.1);
  setT($.btn, `scale(${(bt * press(t, K.click, 0.93)).toFixed(4)})`);

  // riga dei totali → tre schede di riepilogo, che poi cambiano contenuto con la schermata
  for (let k = 0; k < 3; k++) {
    const from = { x: 40 + k * 380, y: SH.top + SH.row * ORD.length, w: 380, h: 30, r: 0 };
    const to = { x: GT.x + k * (KPI_W + 20), y: KPI_Y, w: KPI_W, h: KPI_H, r: 14 };
    const el = $["kpi" + k];
    rectCss(el, mixRect(from, to, prog(t, K.morph + 0.15 + k * 0.05, 0.85, E.inOut)));
    el.style.background = `color-mix(in srgb, var(--surface) ${(pc(t) * 100).toFixed(1)}%, #FAFAFA)`;
    el.style.boxShadow = p > 0.5 ? "inset 0 0 0 1px var(--hair)" : "";
    show(el, t >= K.morph);
    roll($["kpiLR" + k], t, ORDER.map((s) => ({ t: K.enter[s] + k * 0.06, v: SCREENS[s].kpi[k][0] })));
    const steps = [];
    for (const s of ORDER) {
      const [, a, b] = SCREENS[s].kpi[k];
      steps.push({ t: (s === "ord" ? K.values : K.enter[s] + 0.08) + k * 0.08, v: a });
      if (b !== a) steps.push({ t: K.change[s] + k * 0.08, v: b });
    }
    roll($["kpiR" + k], t, steps);
    const [, a, b] = SCREENS[cur].kpi[k];
    const glow = a !== b && t >= K.change[cur] ? 1 - prog(t, K.change[cur] + 0.9, 1.2) : 0;
    $["kpiR" + k].b.style.color = $["kpiR" + k].a.style.color = glow > 0 ? `color-mix(in srgb, #B57BFF ${(glow * 100).toFixed(1)}%, var(--ink))` : "";
  }

  // filtri e intestazioni: entrano con la schermata, escono quando si cambia
  for (const [s, k, x] of CHIPX) {
    const el = $[`chip_${s}${k}`], at = K.enter[s] + 0.1 + k * 0.06, off = prog(t, K.leave[s], 0.2, E.in);
    el.style.left = x + "px";
    show(el, t >= at && off < 1);
    setT(el, `scale(${(clamp(spring(t, at, 0.42, 0.7), 0, 1.08) * (1 - off)).toFixed(4)})`);
    // le fatture consegnate salgono solo quando lo SdI conferma la consegna
    const [, a, b] = SCREENS[s].chips[k], n = t >= (s === "fat" && k === 2 ? K.sdi : K.change[s]) ? b : a;
    if ($[`chipN_${s}${k}`].textContent !== n) $[`chipN_${s}${k}`].textContent = n;
  }
  for (const s of ORDER) {
    show($["thead_" + s], t >= K.enter[s] && t < K.leave[s] + 0.3);
    SCREENS[s].head.forEach((_, k) => {
      const el = $[`th_${s}${k}`];
      if (t >= K.leave[s]) sink(el, prog(t, K.leave[s], 0.25, E.in));
      else rise(el, clamp(spring(t, K.enter[s] + 0.05 + k * 0.04, 0.5, 0.88), 0, 1));
    });
  }

  const push = clamp(spring(t, K.newRow, 0.5, 0.9), 0, 1);
  ORD.forEach((r, i) => placeRow(t, "r" + i, r, i, p, push));
  show($.nw, t >= K.newRow && t < K.mag + 0.5);
  if (t >= K.newRow) placeRow(t, "nw", NEW, -1, 1, push);
  $.rows.style.clipPath = p >= 1 ? `inset(${GT.top - 2}px 0 ${780 - (GT.top + GT.row * SHOWN)}px 0)` : "";
  applyMag(t);
  applyFat(t);
}

// Una riga di una schermata nuova sale al suo posto; quando si cambia schermata scorre via verso sinistra
function rowMotion(t, el, i, at, off) {
  const e = clamp(spring(t, at + 0.15 + i * 0.045, 0.5, 0.88), 0, 1), o = prog(t, off + i * 0.025, 0.26, E.in);
  show(el, t >= at + 0.15 + i * 0.045 && o < 1);
  setT(el, `translate(${(-o * 60).toFixed(2)}px,${((1 - e) * 40).toFixed(2)}px)`);
  el.style.clipPath = o > 0 ? `inset(0 ${(o * 100).toFixed(2)}% 0 0)` : "";
  el.style.opacity = o > 0 ? "" : Math.min(1, e * 1.6).toFixed(3);
}

function applyMag(t) {
  MAG.forEach(([, , q0, q1, min], i) => {
    const el = $["m" + i];
    rowMotion(t, el, i, K.mag, K.leave.mag);
    if (t < K.mag) return;
    const after = i === 0 && t >= K.stock;
    roll($["mqR" + i], t, [{ t: K.mag + 0.2, v: String(q0) }, ...(q1 !== q0 ? [{ t: K.stock, v: String(q1) }] : [])]);
    const q = i === 0 ? track(t, q0, [{ t: K.stock, to: q1, d: 0.5, e: E.snappy }]) : q0;
    const low = q < min;
    const bar = $["mb" + i];
    bar.style.width = (clamp(q / (2 * min)) * 140 * prog(t, K.mag + 0.3 + i * 0.045, 0.6, E.out)).toFixed(2) + "px";
    bar.style.background = low ? WARN[0] : GOOD[0];
    const label = low ? "Sotto scorta" : "Disponibile", [ink, bg] = low ? WARN : GOOD;
    const pill = $["mp" + i];
    if (pill.textContent !== label) pill.textContent = label;
    pill.style.color = ink;
    pill.style.background = bg;
    setT(pill, i === 0 ? `scale(${(1 + 0.12 * pulse(t, K.stock + 0.2, 0.4)).toFixed(4)})` : "none");
    el.style.background = after ? `rgba(250,178,25,${(0.08 * (1 - prog(t, K.stock + 1.0, 1.0))).toFixed(3)})` : "";
  });
}

function applyFat(t) {
  FAT.forEach((_, i) => rowMotion(t, $["f" + i], i, K.fat, K.leave.fat));
  // "Emetti fattura" diventa l'etichetta dello stato: inviata allo SdI, poi consegnata
  const on = t >= K.fat + 0.15 && t < K.close + 1;
  show($.emit, on);
  show($.fp0, false);
  if (!on) return;
  const e = clamp(spring(t, K.fat + 0.15, 0.5, 0.88), 0, 1);
  const m = prog(t, K.emit + 0.12, 0.35, E.snappy);
  const label = t >= K.sdi ? "Consegnata" : m >= 0.5 ? "Inviata allo SdI" : "Emetti fattura";
  const [ink, bg] = t >= K.sdi ? GOOD : BLUE;
  const pillW = measure(t >= K.sdi ? "Consegnata" : "Inviata allo SdI", 13, 600) + 24;
  const btn = { x: GT.x + EMIT.x, y: GT.top + EMIT.y, w: EMIT.w, h: EMIT.h, r: 10 };
  const pill = { x: GT.x + 762, y: GT.top + 13, w: pillW, h: 26, r: 13 };
  const r = mixRect(btn, pill, m);
  rectCss($.emit, { ...r, y: r.y + (1 - e) * 40 });
  $.emit.style.opacity = Math.min(1, e * 1.6).toFixed(3);
  $.emit.style.background = m < 0.5 ? "var(--accent)" : bg;
  $.emit.style.color = m < 0.5 ? "var(--ink)" : ink;
  $.emit.style.fontSize = m < 0.5 ? "14px" : "13px";
  if ($.emitT.textContent !== label) $.emitT.textContent = label;
  setT($.emit, `scale(${(press(t, K.emit, 0.94) * (1 + 0.1 * pulse(t, K.sdi, 0.4))).toFixed(4)})`);
  $.f0.style.background = t >= K.emit ? `rgba(151,71,255,${(0.1 * (1 - prog(t, K.sdi + 0.8, 1.0))).toFixed(3)})` : "";
}

function placeRow(t, key, r, i, p, push) {
  const isNew = i < 0, far = i >= SHOWN;
  const c = isNew ? 1 : pc(t);
  const el = $[key];
  const src = { x: 0, y: SH.top + i * SH.row, w: 1200, h: SH.row, r: 0 };
  const dst = { x: GT.x, y: GT.top + (isNew ? -GT.row + push * GT.row : i * GT.row + push * GT.row), w: GT.w, h: GT.row, r: 10 };
  let rect;
  if (far) {
    // le righe che non entrano scivolano fuori dal fondo della tabella
    const q = prog(t, K.morph + (i - SHOWN) * 0.02, 0.4, E.in);
    rect = { ...src, y: src.y + q * 120 };
    el.style.opacity = (1 - q).toFixed(3);
    show(el, q < 1);
    p = 0;
  } else {
    rect = isNew ? dst : mixRect(src, dst, p);
    el.style.opacity = "";
    // passando al magazzino, le righe degli ordini scorrono via
    const o = prog(t, K.mag + Math.max(i + 1, 0) * 0.025, 0.26, E.in);
    setT(el, o > 0 ? `translateX(${(-o * 60).toFixed(2)}px)` : "none");
    el.style.clipPath = o > 0 ? `inset(0 ${(o * 100).toFixed(2)}% 0 0)` : "";
    show(el, o < 1);
  }
  rectCss(el, rect);
  const fill = r[9] || "#FFFFFF";
  const fresh = isNew ? 1 - prog(t, K.newRow + 1.4, 1.4) : 0;
  $[key + "Bg"].style.background = isNew ? `color-mix(in srgb, #2A1F3D ${(fresh * 100).toFixed(1)}%, var(--winBg))` : `color-mix(in srgb, var(--winBg) ${(c * 100).toFixed(1)}%, ${fill})`;
  $[key + "Bg"].style.borderRadius = rect.r.toFixed(2) + "px";
  const gone = far ? 1 : 1 - prog(t, K.morph, 0.3, E.in);
  for (const k of ["Rn", "Qty", "Note"]) { $[key + k].style.opacity = gone.toFixed(3); show($[key + k], gone > 0 && !isNew); }
  $[key + "Hair"].style.opacity = p.toFixed(3);
  for (const [f, { a, b }] of Object.entries(F)) {
    const e = $[key + f];
    const x = lerp(a[0], b[0], p), y = lerp(a[1], b[1], p);
    e.style.left = (p >= 1 ? Math.round(x) : x.toFixed(2)) + "px";
    e.style.top = (p >= 1 ? Math.round(y) : y.toFixed(2)) + "px";
    e.style.fontSize = lerp(a[2], b[2], p).toFixed(2) + "px";
    e.style.fontWeight = String(Math.round(lerp(a[3], b[3], p) / 100) * 100);
    const inkTo = f === "num" ? "var(--ink3)" : "var(--ink)";
    e.style.color = `color-mix(in srgb, ${inkTo} ${(c * 100).toFixed(1)}%, ${r[10] || "#222"})`;
    if (f === "num") { const v = p > 0.5 ? "Ordine #" + r[0] : r[0]; if (e.textContent !== v) e.textContent = v; }
    if (f === "imp") { const v = p > 0.5 ? "€ " + r[5] : r[5]; if (e.textContent !== v) e.textContent = v; }
  }
  // lo stato scritto a mano diventa un'etichetta colorata
  const [label, ink, bg] = STATI[r[7]];
  const st = $[key + "st"], pill = $[key + "Pill"];
  const sp = isNew ? 1 : far ? 0 : prog(t, K.morph + 0.15 + i * 0.03, 0.5, E.inOut);
  const want = sp > 0.5 || isNew ? label : r[6];
  if (st.textContent !== want) st.textContent = want;
  const sx = lerp(766 + 12 * sp, 762 + 12, p), sy = lerp(7, 17, p);
  st.style.left = (p >= 1 ? Math.round(sx) : sx.toFixed(2)) + "px";
  st.style.top = (p >= 1 ? Math.round(sy) : sy.toFixed(2)) + "px";
  st.style.fontSize = "13px";
  st.style.fontWeight = sp > 0.5 ? "600" : (r[6] === r[6].toUpperCase() ? "700" : "400");
  st.style.color = sp > 0.5 ? ink : `color-mix(in srgb, var(--ink) ${(c * 100).toFixed(1)}%, ${r[10] || "#222"})`;
  const pw = measure(label, 13, 600) + 24;
  rectCss(pill, { x: lerp(760, 762, p), y: lerp(2, 13, p), w: pw * sp, h: 26, r: 13 });
  pill.style.background = bg;
  show(pill, sp > 0);
  if (i === TYPED) TYPE.forEach(([f], c) => { const v = typed(t, c); if ($[key + f].textContent !== v) $[key + f].textContent = v; });
}

const typed = (t, c) => {
  const text = TYPE[c][2], { at } = K.cells[c];
  return t < at ? "" : text.slice(0, clamp(Math.floor((t - at) / TYPE_SPEED) + 1, 0, text.length));
};

function applyTyping(t) {
  // il cursore di Excel salta di cella in cella mentre si scrive, poi va sul totale
  const y = SH.top + TYPED * SH.row, totY = SH.top + ORD.length * SH.row, cols = SH.cols;
  const moves = [];
  K.cells.forEach((c, i) => { if (i) moves.push({ t: c.at - 0.16, x: cols[TYPE[i][1]], w: cols[TYPE[i][1] + 1] - cols[TYPE[i][1]], y }); });
  moves.push({ t: K.toTotal, x: cols[5], w: cols[6] - cols[5], y: totY });
  const along = (f, base) => track(t, base, moves.map((m) => ({ t: m.t, d: 0.14, e: E.snappy, to: m[f] })));
  const cell = { x: along("x", cols[0]), y: along("y", y), w: along("w", cols[1] - cols[0]), h: SH.row + 1, r: 0 };
  rectCss($.cell, { ...cell, x: cell.x - 1, y: cell.y - 1, w: cell.w + 2 });
  show($.cell, t >= K.open + 0.6 && t < K.wide);
  $.cell.style.opacity = (1 - prog(t, K.wide - 0.3, 0.3)).toFixed(3);

  // la barra della formula ripete quello che si scrive
  let active = -1;
  K.cells.forEach((c, i) => { if (t >= c.at - 0.16) active = i; });
  let fx = active >= 0 ? typed(t, active) : "";
  let typing = active >= 0 && t < K.cells[active].end + 0.05;
  if (t >= K.toTotal) {
    const n = t < K.formula ? 0 : clamp(Math.floor((t - K.formula) / 0.04) + 1, 0, FORMULA.length);
    fx = FORMULA.slice(0, n);
    typing = t < K.hit;
  }
  if ($.fxText.textContent !== fx) $.fxText.textContent = fx;

  // il cursore di testo lampeggia alla fine di quello che si sta scrivendo
  const blink = typing || Math.floor((t - K.open) / 0.45) % 2 === 0;
  const inCell = t >= K.cells[0].at && t < K.toTotal && active >= 0;
  if (inCell) {
    const span = $[`r${TYPED}${TYPE[active][0]}`];
    $.caret.style.left = (cols[TYPE[active][1]] + 6 + span.offsetWidth + 1) + "px";
    $.caret.style.top = (y + 6) + "px";
  } else if (t >= K.formula && t < K.hit) {
    $.caret.style.left = (cols[5] + 6) + "px";
    $.caret.style.top = (totY + 6) + "px";
  }
  show($.caret, (inCell || (t >= K.formula && t < K.hit)) && blink);

  // Invio: il totale non torna, compare #RIF!
  const ref = t >= K.hit ? "#RIF!" : "";
  if ($.ref.textContent !== ref) $.ref.textContent = ref;
  const err = pulse(t, K.hit, 0.5) + pulse(t, K.hit + 0.55, 0.5);
  $.ref.style.background = t >= K.hit ? `rgba(208,2,27,${(0.1 + 0.2 * err).toFixed(3)})` : "";
  setT($.ref, `scale(${(1 + 0.12 * pulse(t, K.hit, 0.35)).toFixed(4)})`);
}
