// js/sonidos.js
// Señales sonoras para los juegos EVIN
// Generadas con Web Audio API — sin ficheros externos
// Respeta prefers-reduced-motion y permite silenciar

const Sonidos = (() => {

  let ctx = null;
  let silenciado = false;

  // Inicializar AudioContext (requiere interacción del usuario)
  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Reanudar si estaba suspendido
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Función base para tocar una nota
  function nota(frecuencia, inicio, duracion, volumen = 0.3, tipo = 'sine', fadeOut = true) {
    const c    = getCtx();
    const osc  = c.createOscillator();
    const gain = c.createGain();

    osc.connect(gain);
    gain.connect(c.destination);

    osc.type      = tipo;
    osc.frequency.setValueAtTime(frecuencia, c.currentTime + inicio);

    gain.gain.setValueAtTime(0, c.currentTime + inicio);
    gain.gain.linearRampToValueAtTime(volumen, c.currentTime + inicio + 0.01);

    if (fadeOut) {
      gain.gain.setValueAtTime(volumen, c.currentTime + inicio + duracion - 0.05);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + inicio + duracion);
    }

    osc.start(c.currentTime + inicio);
    osc.stop(c.currentTime + inicio + duracion);
  }

  // ── Sonidos del juego ──────────────────────────────────────

  function acierto() {
    if (silenciado) return;
    try {
      // Dos notas ascendentes — Do y Mi
      nota(523, 0,    0.12, 0.25, 'sine');
      nota(659, 0.1,  0.18, 0.25, 'sine');
    } catch (e) {}
  }

  function error() {
    if (silenciado) return;
    try {
      // Tono grave corto
      nota(200, 0,   0.08, 0.2, 'square');
      nota(150, 0.08, 0.12, 0.15, 'square');
    } catch (e) {}
  }

  function gameOver() {
    if (silenciado) return;
    try {
      // Secuencia descendente
      nota(440, 0,    0.15, 0.25, 'sine');
      nota(370, 0.15, 0.15, 0.25, 'sine');
      nota(311, 0.30, 0.15, 0.25, 'sine');
      nota(262, 0.45, 0.3,  0.25, 'sine');
    } catch (e) {}
  }

  function victoria() {
    if (silenciado) return;
    try {
      // Melodía alegre — Do Mi Sol Do
      nota(523, 0,    0.12, 0.25, 'sine');
      nota(659, 0.12, 0.12, 0.25, 'sine');
      nota(784, 0.24, 0.12, 0.25, 'sine');
      nota(1047, 0.36, 0.25, 0.3, 'sine');
    } catch (e) {}
  }

  function rondaSuperada() {
    if (silenciado) return;
    try {
      // Dos notas cortas ascendentes
      nota(659, 0,    0.1, 0.2, 'sine');
      nota(784, 0.12, 0.2, 0.2, 'sine');
    } catch (e) {}
  }

  function voltear() {
    if (silenciado) return;
    try {
      // Click suave al girar carta
      nota(800, 0, 0.05, 0.1, 'sine');
    } catch (e) {}
  }

  // ── Control de silencio ────────────────────────────────────

  function setSilenciado(valor) {
    silenciado = valor;
    localStorage.setItem('evin_silenciado', valor ? '1' : '0');
    actualizarBoton();
  }

  function toggleSilencio() {
    setSilenciado(!silenciado);
  }

  function actualizarBoton() {
    const btn = document.getElementById('btn-sonido');
    if (!btn) return;
    btn.textContent = silenciado ? '🔇 Sonido' : '🔊 Sonido';
    btn.setAttribute('aria-label', silenciado ? 'Activar sonido' : 'Silenciar sonido');
    btn.classList.toggle('silenciado', silenciado);
  }

  // Recuperar preferencia guardada
  function init() {
    const guardado = localStorage.getItem('evin_silenciado');
    if (guardado === '1') silenciado = true;

    // Crear botón de sonido fijo en pantalla
    if (!document.getElementById('btn-sonido')) {
      const btn = document.createElement('button');
      btn.id        = 'btn-sonido';
      btn.className = 'btn-sonido';
      btn.setAttribute('aria-label', silenciado ? 'Activar sonido' : 'Silenciar sonido');
      btn.textContent = silenciado ? '🔇 Sonido' : '🔊 Sonido';
      btn.addEventListener('click', () => {
        // Inicializar contexto en primer clic (requiere interacción)
        try { getCtx(); } catch (e) {}
        toggleSilencio();
      });
      document.body.appendChild(btn);
    }

    actualizarBoton();
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { acierto, error, gameOver, victoria, rondaSuperada, voltear, toggleSilencio, setSilenciado };

})();

window.Sonidos = Sonidos;
