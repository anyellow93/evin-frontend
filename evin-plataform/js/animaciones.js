// js/animaciones.js
// Animaciones profesionales de juegos EVIN

const Animaciones = (() => {

  const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Overlay central con emoji ────────────────────────────────
  function mostrarOverlay({ emoji, titulo, color, duracion = 1800 }) {
    if (reducirMovimiento()) return;

    const overlay = document.createElement('div');
    overlay.className = 'anim-overlay';
    overlay.innerHTML = `
      <div class="anim-overlay-contenido">
        <div class="anim-emoji">${emoji}</div>
        <div class="anim-titulo">${titulo}</div>
      </div>
    `;
    overlay.style.setProperty('--anim-color', color);
    getContenedor().appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('anim-overlay--visible'));

    setTimeout(() => {
      overlay.classList.add('anim-overlay--salida');
      setTimeout(() => overlay.remove(), 600);
    }, duracion);
  }

  // ── Confetti con colores EVIN ────────────────────────────────
  function lanzarConfetti() {
    if (reducirMovimiento()) return;

    const colores = ['#FF8C00', '#0F2E8A', '#1B4FD8', '#00C4CC', '#16a34a', '#FFD700', '#fff'];
    const formas  = ['circle', 'square', 'triangle'];
    const container = document.createElement('div');
    container.className = 'confetti-container';
    getContenedor().appendChild(container);

    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const pieza = document.createElement('div');
        const forma = formas[Math.floor(Math.random() * formas.length)];
        pieza.className = `confetti-pieza confetti-${forma}`;
        pieza.style.cssText = `
          left: ${Math.random() * 100}vw;
          background: ${colores[Math.floor(Math.random() * colores.length)]};
          width: ${Math.random() * 10 + 6}px;
          height: ${Math.random() * 10 + 6}px;
          animation-duration: ${Math.random() * 2.5 + 2}s;
          animation-delay: ${Math.random() * 0.3}s;
          transform: rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(pieza);
        setTimeout(() => pieza.remove(), 4000);
      }, i * 20);
    }

    setTimeout(() => container.remove(), 5000);
  }
  
  function getContenedor() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.body;
  }

  // ── Flash de fondo ────────────────────────────────────────────
  function flashFondo(color, seccionId) {
    if (reducirMovimiento()) return;
    const el = seccionId ? document.getElementById(seccionId) : document.body;
    if (!el) return;
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;background:${color};
      opacity:0;pointer-events:none;z-index:9990;
      transition:opacity 0.15s ease;
    `;
    getContenedor().appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0.18'; });
    setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 300); }, 300);
  }

  // ── Shake de sección ──────────────────────────────────────────
  function shake(seccionId) {
    if (reducirMovimiento()) return;
    const el = seccionId ? document.getElementById(seccionId) : document.body;
    if (!el) return;
    el.classList.add('game-over-shake');
    setTimeout(() => el.classList.remove('game-over-shake'), 600);
  }

  // ── Estrella de ronda superada ────────────────────────────────
  function estrellaRonda() {
    if (reducirMovimiento()) return;
    const star = document.createElement('div');
    star.className = 'anim-estrella';
    star.textContent = '⭐';
    getContenedor().appendChild(star);
    requestAnimationFrame(() => star.classList.add('anim-estrella--visible'));
    setTimeout(() => {
      star.classList.add('anim-estrella--salida');
      setTimeout(() => star.remove(), 500);
    }, 1200);
  }

  // ── API pública ───────────────────────────────────────────────
  function victoria(seccionId) {
    flashFondo('#16a34a', seccionId);
    mostrarOverlay({ emoji: '🏆', titulo: '¡Victoria!', color: '#16a34a', duracion: 2000 });
    setTimeout(lanzarConfetti, 300);
  }

  function gameOver(seccionId) {
    shake(seccionId);
    flashFondo('#e63946', seccionId);
    mostrarOverlay({ emoji: '💔', titulo: '¡Inténtalo de nuevo!', color: '#e63946', duracion: 1800 });
  }

  function rondaSuperada() {
    estrellaRonda();
    flashFondo('#FF8C00');
  }

  function animarAcierto(el) {
    if (!el || reducirMovimiento()) return;
    el.classList.add('celda-acierto');
    setTimeout(() => el.classList.remove('celda-acierto'), 300);
  }

  function animarError(el) {
    if (!el || reducirMovimiento()) return;
    el.classList.add('celda-error');
    setTimeout(() => el.classList.remove('celda-error'), 300);
  }

  return { victoria, gameOver, rondaSuperada, animarAcierto, animarError, lanzarConfetti };

})();

window.Animaciones = Animaciones;
