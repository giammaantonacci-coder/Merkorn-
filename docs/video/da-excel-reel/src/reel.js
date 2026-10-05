// Versione reel per Instagram (9:16, 1080 × 1920): la stessa scena del video orizzontale.
// Qui cambia solo il formato; in scenes.js VERT allarga l'inquadratura e ricompone le scritte che non entrerebbero.
const filmLandscape = film;
film = (o) => filmLandscape({ ...o, W: 1080, H: 1920 });
