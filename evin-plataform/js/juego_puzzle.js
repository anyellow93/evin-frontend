// js/juego_puzzle.js
document.addEventListener('DOMContentLoaded', () => {

 

  // ── Elementos del DOM ──────────────────────────────────────────────────────
  const puzzleContenedor = document.getElementById('puzzle-contenedor');
  const puzzleHuecos     = document.getElementById('puzzle-huecos');
  const puzzlePiezas     = document.getElementById('puzzle-piezas');
  const puzzlePreview    = document.getElementById('puzzle-preview');
  const puzzleTiempoEl   = document.getElementById('puzzle-tiempo');
  const puzzleMovsEl     = document.getElementById('puzzle-movimientos');
  const puzzleRondaEl    = document.getElementById('puzzle-ronda');
  const puzzleNivelEl    = document.getElementById('puzzle-nivel');
  const btnEmpezar       = document.getElementById('puzzle-empezar');
  const btnVolver        = document.getElementById('puzzle-volver');

  // ── Ilustraciones SVG temáticas ───────────────────────────────────────────
  // Cada ilustración es un SVG 300x300 dividido en piezas por CSS background-position
  const ilustraciones = [
  {
    id: 'sol',
    nombre: 'El sol',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#87CEEB"/>
  <!-- Rayos simples y gruesos -->
  <line x1="150" y1="20"  x2="150" y2="55"  stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="150" y1="245" x2="150" y2="280" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="20"  y1="150" x2="55"  y2="150" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="245" y1="150" x2="280" y2="150" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="57"  y1="57"  x2="81"  y2="81"  stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="219" y1="57"  x2="243" y2="81"  stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="57"  y1="243" x2="81"  y2="219" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="219" y1="243" x2="243" y2="219" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <!-- Círculo solar grande y sólido -->
  <circle cx="150" cy="150" r="80" fill="#FFD700"/>
  <!-- Cara simple -->
  <circle cx="120" cy="135" r="12" fill="#FF8C00"/>
  <circle cx="180" cy="135" r="12" fill="#FF8C00"/>
  <path d="M 115 175 Q 150 205 185 175" stroke="#FF8C00" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Suelo verde sólido -->
  <rect x="0" y="255" width="300" height="45" fill="#4CAF50"/>
</svg>`
  },
  {
    id: 'manzana',
    nombre: 'La manzana',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#90EE90"/>
  <!-- Tallo -->
  <rect x="140" y="40" width="20" height="50" rx="10" fill="#8B4513"/>
  <!-- Hoja -->
  <ellipse cx="175" cy="55" rx="35" ry="18" fill="#2E7D32" transform="rotate(-30 175 55)"/>
  <!-- Manzana grande y sólida -->
  <ellipse cx="150" cy="175" rx="100" ry="110" fill="#e63946"/>
  <!-- Brillo -->
  <ellipse cx="110" cy="120" rx="25" ry="18" fill="rgba(255,255,255,0.35)" transform="rotate(-20 110 120)"/>
</svg>`
  },
  {
    id: 'casa',
    nombre: 'La casa',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#87CEEB"/>
  <!-- Suelo -->
  <rect x="0" y="265" width="300" height="35" fill="#4CAF50"/>
  <!-- Tejado grande sólido -->
  <polygon points="150,30 280,140 20,140" fill="#e63946"/>
  <!-- Pared sólida -->
  <rect x="40" y="138" width="220" height="130" fill="#FFCC80"/>
  <!-- Puerta grande -->
  <rect x="110" y="200" width="80" height="68" rx="8" fill="#8B4513"/>
  <!-- Ventana izquierda grande -->
  <rect x="55" y="160" width="70" height="60" rx="6" fill="#B3E5FC"/>
  <line x1="90"  y1="160" x2="90"  y2="220" stroke="#8B4513" stroke-width="5"/>
  <line x1="55"  y1="190" x2="125" y2="190" stroke="#8B4513" stroke-width="5"/>
  <!-- Ventana derecha grande -->
  <rect x="175" y="160" width="70" height="60" rx="6" fill="#B3E5FC"/>
  <line x1="210" y1="160" x2="210" y2="220" stroke="#8B4513" stroke-width="5"/>
  <line x1="175" y1="190" x2="245" y2="190" stroke="#8B4513" stroke-width="5"/>
</svg>`
  },
  {
    id: 'flor',
    nombre: 'La flor',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#90EE90"/>
  <!-- Tallo grueso -->
  <rect x="138" y="180" width="24" height="100" rx="12" fill="#2E7D32"/>
  <!-- Hojas -->
  <ellipse cx="100" cy="220" rx="45" ry="20" fill="#4CAF50" transform="rotate(-30 100 220)"/>
  <ellipse cx="200" cy="240" rx="45" ry="20" fill="#4CAF50" transform="rotate(30 200 240)"/>
  <!-- Pétalos grandes y sólidos -->
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="#FF69B4"/>
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="#FF69B4" transform="rotate(45 150 155)"/>
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="#FF69B4" transform="rotate(90 150 155)"/>
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="#FF69B4" transform="rotate(135 150 155)"/>
  <!-- Centro grande -->
  <circle cx="150" cy="155" r="45" fill="#FFD700"/>
  <circle cx="150" cy="155" r="30" fill="#FF8C00"/>
</svg>`
  },
  {
    id: 'pelota',
    nombre: 'La pelota',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#87CEEB"/>
  <!-- Suelo -->
  <rect x="0" y="265" width="300" height="35" fill="#4CAF50"/>
  <!-- Sombra -->
  <ellipse cx="150" cy="268" rx="70" ry="12" fill="rgba(0,0,0,0.2)"/>
  <!-- Pelota grande sólida -->
  <circle cx="150" cy="155" r="120" fill="#e63946"/>
  <!-- Franjas blancas gruesas -->
  <path d="M 30 155 Q 150 80 270 155" stroke="white" stroke-width="18" fill="none"/>
  <path d="M 30 155 Q 150 230 270 155" stroke="white" stroke-width="18" fill="none"/>
  <line x1="150" y1="35" x2="150" y2="275" stroke="white" stroke-width="18"/>
  <!-- Brillo -->
  <circle cx="100" cy="95" r="28" fill="rgba(255,255,255,0.3)"/>
</svg>`
  },
];

  // ── Estado ─────────────────────────────────────────────────────────────────
  let cols           = 3;
  let filas          = 3;
  let piezaSeleccionada = null;
  let huecoSeleccionado = null;
  let movimientos    = 0;
  let tiempo         = 0;
  let timerId        = null;
  let ilustracionActual = null;
  let estadoTablero  = []; // array de posiciones actuales
  let juegoActivo    = false;
  let rondaActual    = 1;
  const rondasMax    = 3;

  // ── Configuración por nivel ────────────────────────────────────────────────
  function configNivel() {
    const nivel = puzzleNivelEl?.value || 'medio';
    if (nivel === 'facil')  return { cols: 3, filas: 3 };
    if (nivel === 'medio')  return { cols: 4, filas: 4 };
    return                         { cols: 5, filas: 5 };
  }

  // ── Tamaño de cada pieza ───────────────────────────────────────────────────
  function tamPieza() {
    const anchoDisponible = Math.min(window.innerWidth - 64, 900);
    const anchoPorZona    = Math.floor(anchoDisponible / 2); // dividir entre tablero y piezas
    const maxPieza        = Math.min(anchoPorZona / cols, 500 / cols);
    return Math.floor(maxPieza);
  }

  // ── Registro de sesión ─────────────────────────────────────────────────────
 async function registrarSesion(aciertos, intentos) {
  try {
    const token    = localStorage.getItem('evin_token');
    const user     = JSON.parse(localStorage.getItem('evin_user') || '{}');
    await fetch('https://evin.click/api/v1/sesiones', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ alumno: user.nombre || 'Anónimo', alumno_id: user.alumno_id || null, juego: 'Puzzle', aciertos, intentos })
    });
  } catch (e) { console.error('Error al registrar sesión:', e); }
}

  // ── Actualizar UI ──────────────────────────────────────────────────────────
  function actualizarUI() {
    if (puzzleMovsEl)  puzzleMovsEl.textContent  = movimientos;
    if (puzzleRondaEl) puzzleRondaEl.textContent = `${rondaActual} / ${rondasMax}`;
  }

  // ── Iniciar juego ──────────────────────────────────────────────────────────
  window.iniciarPuzzle = function () {
    rondaActual  = 1;
    movimientos  = 0;
    tiempo       = 0;
    juegoActivo  = true;
    if (puzzleTiempoEl) puzzleTiempoEl.textContent = 0;
    actualizarUI();

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      tiempo++;
      if (puzzleTiempoEl) puzzleTiempoEl.textContent = tiempo;
    }, 1000);

    iniciarRonda();
  };

  function iniciarRonda() {
    const cfg = configNivel();
    cols  = cfg.cols;
    filas = cfg.filas;
    piezaSeleccionada = null;
    huecoSeleccionado = null;
    movimientos = 0;
    actualizarUI();

    // Elegir ilustración aleatoria
    ilustracionActual = ilustraciones[Math.floor(Math.random() * ilustraciones.length)];

    // Mostrar preview
    if (puzzlePreview) {
      puzzlePreview.innerHTML = ilustracionActual.svg;
      puzzlePreview.querySelector('svg').setAttribute('width',  '120');
      puzzlePreview.querySelector('svg').setAttribute('height', '120');
    }

    construirPuzzle();
  }

  // ── Construir puzzle ───────────────────────────────────────────────────────
  function construirPuzzle() {
    if (!puzzleHuecos || !puzzlePiezas || !ilustracionActual) return;

    const tam   = tamPieza();
    const total = cols * filas;

    // Generar orden barajado
    const orden = [...Array(total).keys()];
    barajar(orden);
    estadoTablero = orden;

    // Estilos del grid
    const gridStyle = `display:grid;grid-template-columns:repeat(${cols},${tam}px);gap:3px;max-width:${tam*cols+cols*3}px;`;
    puzzleHuecos.style.cssText = gridStyle;
    puzzlePiezas.style.cssText = gridStyle;

    // Crear huecos (posiciones correctas)
    puzzleHuecos.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const hueco = document.createElement('div');
      hueco.className        = 'puzzle-hueco';
      hueco.dataset.pos      = i;
      hueco.style.width      = tam + 'px';
      hueco.style.height     = tam + 'px';
      hueco.style.backgroundImage  = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(ilustracionActual.svg)}")`;
      hueco.style.backgroundSize   = `${cols * tam}px ${filas * tam}px`;
      hueco.style.backgroundPosition = bgPos(i, tam);
      hueco.style.opacity    = '0.25';
      hueco.style.border     = '2px dashed #666';
      hueco.style.boxSizing  = 'border-box';
      hueco.setAttribute('aria-label', `Hueco ${i + 1}`);
      hueco.addEventListener('click',      () => manejarClickHueco(hueco));
      hueco.addEventListener('dragover',   e  => e.preventDefault());
      hueco.addEventListener('drop',       e  => manejarDrop(e, hueco));
      puzzleHuecos.appendChild(hueco);
    }

    // Crear piezas (barajadas)
    puzzlePiezas.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const pieza = document.createElement('div');
      pieza.className       = 'puzzle-pieza';
      pieza.dataset.id      = orden[i]; // qué pieza es (posición correcta)
      pieza.dataset.pos     = i;        // dónde está ahora
      pieza.style.width     = tam + 'px';
      pieza.style.height    = tam + 'px';
      pieza.style.backgroundImage  = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(ilustracionActual.svg)}")`;
      pieza.style.backgroundSize   = `${cols * tam}px ${filas * tam}px`;
      pieza.style.backgroundPosition = bgPos(orden[i], tam);
      pieza.style.cursor    = 'grab';
      pieza.style.boxSizing = 'border-box';
      pieza.style.border    = '2px solid rgba(255,255,255,0.3)';
      pieza.style.borderRadius = '4px';
      pieza.setAttribute('draggable', 'true');
      pieza.setAttribute('aria-label', `Pieza ${orden[i] + 1}`);
      pieza.addEventListener('click',     () => manejarClickPieza(pieza));
      pieza.addEventListener('dragstart', e  => manejarDragStart(e, pieza));
      puzzlePiezas.appendChild(pieza);
    }
  }

  // Calcular background-position para una pieza dada su índice correcto
  function bgPos(idx, tam) {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return `-${col * tam}px -${row * tam}px`;
  }

  function barajar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ── Interacción: clic ──────────────────────────────────────────────────────
  function manejarClickPieza(pieza) {
    if (!juegoActivo) return;

    // Deseleccionar la anterior
    document.querySelectorAll('.puzzle-pieza.seleccionada').forEach(p => {
      p.classList.remove('seleccionada');
      p.style.border = '2px solid rgba(255,255,255,0.3)';
    });

    piezaSeleccionada = pieza;
    pieza.classList.add('seleccionada');
    pieza.style.border = '3px solid #ff0';

    // Si hay hueco seleccionado, colocar
    if (huecoSeleccionado) {
      colocarPieza(piezaSeleccionada, huecoSeleccionado);
    }
  }

  function manejarClickHueco(hueco) {
    if (!juegoActivo) return;

    // Si ya tiene pieza colocada, ignorar
    if (hueco.dataset.ocupado) return;

    document.querySelectorAll('.puzzle-hueco.seleccionado-hueco').forEach(h => {
      h.classList.remove('seleccionado-hueco');
      h.style.border = '2px dashed #666';
    });

    huecoSeleccionado = hueco;
    hueco.classList.add('seleccionado-hueco');
    hueco.style.border = '3px solid #ff0';

    if (piezaSeleccionada) {
      colocarPieza(piezaSeleccionada, huecoSeleccionado);
    }
  }

  // ── Interacción: drag & drop ───────────────────────────────────────────────
  function manejarDragStart(e, pieza) {
    e.dataTransfer.setData('piezaPos', pieza.dataset.pos);
    e.dataTransfer.effectAllowed = 'move';
    piezaSeleccionada = pieza;
  }

  function manejarDrop(e, hueco) {
    e.preventDefault();
    if (!juegoActivo) return;
    if (hueco.dataset.ocupado) return;
    if (piezaSeleccionada) colocarPieza(piezaSeleccionada, hueco);
  }

  // ── Colocar pieza en hueco ─────────────────────────────────────────────────
  function colocarPieza(pieza, hueco) {
    const huecoPos  = parseInt(hueco.dataset.pos);
    const piezaId   = parseInt(pieza.dataset.id);
    const esCorrecta = piezaId === huecoPos;

    movimientos++;
    actualizarUI();

    if (esCorrecta) {
      // Colocar visualmente en el hueco
      hueco.style.backgroundImage    = pieza.style.backgroundImage;
      hueco.style.backgroundSize     = pieza.style.backgroundSize;
      hueco.style.backgroundPosition = pieza.style.backgroundPosition;
      hueco.style.opacity   = '1';
      hueco.style.border    = '2px solid #0f0';
      hueco.style.boxShadow = '0 0 8px rgba(0,255,0,0.4)';
      hueco.dataset.ocupado = '1';

      // Eliminar pieza del panel
      pieza.style.opacity  = '0';
      pieza.style.pointerEvents = 'none';
      pieza.style.transition = 'opacity 0.3s';
      setTimeout(() => pieza.remove(), 300);

    } else {
      // Error — flash rojo
      pieza.style.border = '3px solid #f00';
      hueco.style.border = '3px solid #f00';
      setTimeout(() => {
        pieza.style.border = '2px solid rgba(255,255,255,0.3)';
        hueco.style.border = '2px dashed #666';
      }, 500);
    }

    // Limpiar selección
    pieza.classList.remove('seleccionada');
    hueco.classList.remove('seleccionado-hueco');
    piezaSeleccionada = null;
    huecoSeleccionado = null;

    // Comprobar si completó el puzzle
    comprobarCompletado();
  }

  // ── Comprobar si está completado ──────────────────────────────────────────
  function comprobarCompletado() {
    const huecos = puzzleHuecos.querySelectorAll('.puzzle-hueco');
    const completado = [...huecos].every(h => h.dataset.ocupado === '1');
    if (!completado) return;

    if (rondaActual >= rondasMax) {
      finJuego();
    } else {
      setTimeout(() => {
        rondaActual++;
        if (window.Animaciones) Animaciones.rondaSuperada();
        showModal('¡Puzzle completado!', `¡Muy bien! Ronda ${rondaActual - 1} superada. ¡Ahora la siguiente ilustración!`, () => iniciarPuzzle());
        setTimeout(iniciarRonda, 1800);
      }, 400);
    }
  }

  // ── Fin de juego ──────────────────────────────────────────────────────────
  async function finJuego() {
    
    juegoActivo = false;
    if (window.Animaciones) Animaciones.victoria('juego-puzzle');
    clearInterval(timerId);
    await registrarSesion(rondasMax, movimientos);
    showModal('🏆 ¡Completado!',
      `Has completado ${rondasMax} puzzles.\nMovimientos totales: ${movimientos}\nTiempo: ${tiempo}s`);
  }

  // ── Resize ─────────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (juegoActivo && ilustracionActual) construirPuzzle();
  });

  // ── Eventos ────────────────────────────────────────────────────────────────
  btnEmpezar?.addEventListener('click', iniciarPuzzle);
  btnVolver?.addEventListener('click',  () => { clearInterval(timerId); if (document.fullscreenElement) document.exitFullscreen(); if (typeof showSection === 'function') showSection('juegos'); });
  puzzleNivelEl?.addEventListener('change', () => { if (juegoActivo) iniciarRonda(); });

});
