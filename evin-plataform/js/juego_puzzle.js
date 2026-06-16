// js/juego_puzzle.js
document.addEventListener('DOMContentLoaded', () => {

  const params        = new URLSearchParams(window.location.search);
  const usuarioActual = decodeURIComponent(params.get('usuario') || 'Anónimo');

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
        <!-- Rayos -->
        <line x1="150" y1="30"  x2="150" y2="10"  stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="150" y1="270" x2="150" y2="290" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="30"  y1="150" x2="10"  y2="150" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="270" y1="150" x2="290" y2="150" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="68"  y1="68"  x2="54"  y2="54"  stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="232" y1="68"  x2="246" y2="54"  stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="68"  y1="232" x2="54"  y2="246" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <line x1="232" y1="232" x2="246" y2="246" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
        <!-- Círculo solar -->
        <circle cx="150" cy="150" r="70" fill="#FFD700" stroke="#FFA500" stroke-width="4"/>
        <!-- Cara -->
        <circle cx="125" cy="135" r="10" fill="#FFA500"/>
        <circle cx="175" cy="135" r="10" fill="#FFA500"/>
        <path d="M 120 175 Q 150 200 180 175" stroke="#FFA500" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- Nubes -->
        <ellipse cx="60"  cy="80"  rx="35" ry="20" fill="white" opacity="0.9"/>
        <ellipse cx="240" cy="60"  rx="40" ry="22" fill="white" opacity="0.9"/>
        <!-- Hierba -->
        <rect x="0" y="260" width="300" height="40" fill="#4CAF50"/>
        <ellipse cx="150" cy="260" rx="300" ry="20" fill="#66BB6A"/>
      </svg>`
    },
    {
      id: 'gato',
      nombre: 'El gato',
      svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#FFF8DC"/>
        <!-- Cuerpo -->
        <ellipse cx="150" cy="210" rx="80" ry="70" fill="#FF8C00"/>
        <!-- Cabeza -->
        <circle cx="150" cy="120" r="65" fill="#FF8C00"/>
        <!-- Orejas -->
        <polygon points="95,70 75,20 115,60"  fill="#FF8C00"/>
        <polygon points="205,70 225,20 185,60" fill="#FF8C00"/>
        <polygon points="98,65 82,30 112,58"  fill="#FFB6C1"/>
        <polygon points="202,65 218,30 188,58" fill="#FFB6C1"/>
        <!-- Ojos -->
        <ellipse cx="120" cy="110" rx="16" ry="18" fill="#00CC44"/>
        <ellipse cx="180" cy="110" rx="16" ry="18" fill="#00CC44"/>
        <ellipse cx="120" cy="112" rx="7"  ry="14" fill="#111"/>
        <ellipse cx="180" cy="112" rx="7"  ry="14" fill="#111"/>
        <circle  cx="116" cy="107" r="3"  fill="white"/>
        <circle  cx="176" cy="107" r="3"  fill="white"/>
        <!-- Nariz -->
        <polygon points="150,130 142,140 158,140" fill="#FF69B4"/>
        <!-- Boca -->
        <path d="M 142 140 Q 135 152 125 148" stroke="#333" stroke-width="2.5" fill="none"/>
        <path d="M 158 140 Q 165 152 175 148" stroke="#333" stroke-width="2.5" fill="none"/>
        <!-- Bigotes -->
        <line x1="90"  y1="135" x2="135" y2="140" stroke="#333" stroke-width="2"/>
        <line x1="90"  y1="148" x2="135" y2="147" stroke="#333" stroke-width="2"/>
        <line x1="210" y1="135" x2="165" y2="140" stroke="#333" stroke-width="2"/>
        <line x1="210" y1="148" x2="165" y2="147" stroke="#333" stroke-width="2"/>
        <!-- Cola -->
        <path d="M 225 240 Q 270 200 260 160 Q 250 130 270 110" stroke="#FF8C00" stroke-width="18" fill="none" stroke-linecap="round"/>
        <!-- Patas -->
        <ellipse cx="110" cy="270" rx="28" ry="18" fill="#FF8C00"/>
        <ellipse cx="190" cy="270" rx="28" ry="18" fill="#FF8C00"/>
      </svg>`
    },
    {
      id: 'arbol',
      nombre: 'El árbol',
      svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#87CEEB"/>
        <!-- Suelo -->
        <rect x="0" y="255" width="300" height="45" fill="#8B4513"/>
        <rect x="0" y="255" width="300" height="12" fill="#4CAF50"/>
        <!-- Tronco -->
        <rect x="128" y="180" width="44" height="80" rx="8" fill="#8B4513"/>
        <rect x="135" y="185" width="8"  height="70" rx="4" fill="#A0522D" opacity="0.5"/>
        <!-- Copa capas -->
        <polygon points="150,30 80,140 220,140"  fill="#2E7D32"/>
        <polygon points="150,60 70,160 230,160"  fill="#388E3C"/>
        <polygon points="150,95 65,190 235,190"  fill="#43A047"/>
        <!-- Detalles copa -->
        <circle cx="110" cy="90"  r="15" fill="#1B5E20" opacity="0.4"/>
        <circle cx="190" cy="100" r="12" fill="#1B5E20" opacity="0.4"/>
        <circle cx="150" cy="70"  r="10" fill="#1B5E20" opacity="0.4"/>
        <!-- Manzanas -->
        <circle cx="120" cy="130" r="10" fill="#e63946"/>
        <circle cx="180" cy="125" r="10" fill="#e63946"/>
        <circle cx="150" cy="145" r="10" fill="#FFD700"/>
        <!-- Pájaros -->
        <path d="M 50 60 Q 55 55 60 60" stroke="#333" stroke-width="2.5" fill="none"/>
        <path d="M 240 80 Q 245 75 250 80" stroke="#333" stroke-width="2.5" fill="none"/>
      </svg>`
    },
    {
      id: 'casa',
      nombre: 'La casa',
      svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#87CEEB"/>
        <!-- Suelo -->
        <rect x="0" y="265" width="300" height="35" fill="#4CAF50"/>
        <!-- Tejado -->
        <polygon points="150,40 40,140 260,140" fill="#e63946"/>
        <polygon points="150,40 40,140 55,140 150,55 245,140 260,140" fill="#c62828"/>
        <!-- Chimenea -->
        <rect x="195" y="60" width="28" height="55" fill="#8B4513"/>
        <rect x="192" y="55" width="34" height="12" rx="3" fill="#6D4C41"/>
        <!-- Humo -->
        <circle cx="205" cy="45" r="8"  fill="#ccc" opacity="0.7"/>
        <circle cx="215" cy="32" r="10" fill="#bbb" opacity="0.6"/>
        <circle cx="208" cy="20" r="7"  fill="#aaa" opacity="0.5"/>
        <!-- Pared -->
        <rect x="55" y="138" width="190" height="130" fill="#FFCC80"/>
        <!-- Puerta -->
        <rect x="120" y="195" width="60" height="73" rx="6" fill="#8B4513"/>
        <rect x="123" y="198" width="54" height="67" rx="4" fill="#A0522D"/>
        <circle cx="172" cy="233" r="5" fill="#FFD700"/>
        <!-- Ventana izq -->
        <rect x="68" y="160" width="58" height="50" rx="5" fill="#B3E5FC"/>
        <rect x="68" y="160" width="58" height="50" rx="5" fill="none" stroke="#8B4513" stroke-width="5"/>
        <line x1="97" y1="160" x2="97" y2="210" stroke="#8B4513" stroke-width="3"/>
        <line x1="68" y1="185" x2="126" y2="185" stroke="#8B4513" stroke-width="3"/>
        <!-- Ventana der -->
        <rect x="174" y="160" width="58" height="50" rx="5" fill="#B3E5FC"/>
        <rect x="174" y="160" width="58" height="50" rx="5" fill="none" stroke="#8B4513" stroke-width="5"/>
        <line x1="203" y1="160" x2="203" y2="210" stroke="#8B4513" stroke-width="3"/>
        <line x1="174" y1="185" x2="232" y2="185" stroke="#8B4513" stroke-width="3"/>
        <!-- Flores -->
        <circle cx="80"  cy="263" r="8" fill="#FF69B4"/>
        <circle cx="100" cy="260" r="8" fill="#FF4500"/>
        <circle cx="200" cy="263" r="8" fill="#FFD700"/>
        <circle cx="220" cy="260" r="8" fill="#FF69B4"/>
      </svg>`
    },
    {
      id: 'pez',
      nombre: 'El pez',
      svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#1565C0"/>
        <!-- Fondo marino -->
        <ellipse cx="150" cy="310" rx="200" ry="60" fill="#0D47A1"/>
        <!-- Burbujas -->
        <circle cx="60"  cy="60"  r="8"  fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
        <circle cx="240" cy="90"  r="6"  fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
        <circle cx="80"  cy="180" r="5"  fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
        <circle cx="230" cy="200" r="9"  fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <!-- Algas -->
        <path d="M 40 300 Q 30 260 45 230 Q 55 200 40 170" stroke="#2E7D32" stroke-width="6" fill="none"/>
        <path d="M 260 300 Q 270 255 255 220 Q 245 190 265 160" stroke="#388E3C" stroke-width="6" fill="none"/>
        <!-- Cola -->
        <polygon points="55,150 20,110 20,190" fill="#FF6F00"/>
        <!-- Cuerpo -->
        <ellipse cx="165" cy="150" rx="110" ry="65" fill="#FF8F00"/>
        <!-- Vientre -->
        <ellipse cx="165" cy="165" rx="85"  ry="40" fill="#FFCC02"/>
        <!-- Aleta dorsal -->
        <polygon points="130,88 150,55 190,88" fill="#E65100"/>
        <!-- Aleta pectoral -->
        <ellipse cx="155" cy="175" rx="35" ry="18" fill="#E65100" transform="rotate(-20,155,175)"/>
        <!-- Ojo -->
        <circle cx="240" cy="135" r="22" fill="white"/>
        <circle cx="244" cy="133" r="14" fill="#1565C0"/>
        <circle cx="248" cy="129" r="5"  fill="black"/>
        <circle cx="244" cy="127" r="4"  fill="white"/>
        <!-- Boca -->
        <path d="M 268 155 Q 278 165 268 172" stroke="#E65100" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Escamas -->
        <path d="M 120 130 Q 135 120 150 130" stroke="#E65100" stroke-width="2" fill="none"/>
        <path d="M 150 130 Q 165 120 180 130" stroke="#E65100" stroke-width="2" fill="none"/>
        <path d="M 130 155 Q 145 145 160 155" stroke="#E65100" stroke-width="2" fill="none"/>
        <path d="M 160 155 Q 175 145 190 155" stroke="#E65100" stroke-width="2" fill="none"/>
      </svg>`
    }
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
    const maxAncho = Math.min(window.innerWidth - 32, 500);
    return Math.floor(maxAncho / cols);
  }

  // ── Registro de sesión ─────────────────────────────────────────────────────
  async function registrarSesion(aciertos, intentos) {
    try {
      const token = localStorage.getItem('evin_token');
      await fetch('http://162.0.228.169/api/v1/sesiones', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ alumno: usuarioActual, juego: 'Puzzle', aciertos, intentos })
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
    const gridStyle = `display:grid;grid-template-columns:repeat(${cols},${tam}px);gap:3px;`;
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
      if (window.Sonidos) Sonidos.acierto();

      // Eliminar pieza del panel
      pieza.style.opacity  = '0';
      pieza.style.pointerEvents = 'none';
      pieza.style.transition = 'opacity 0.3s';
      setTimeout(() => pieza.remove(), 300);

    } else {
    
      if (window.Sonidos) Sonidos.error();
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
        showModal('¡Puzzle completado!', `¡Muy bien! Ronda ${rondaActual - 1} superada. ¡Ahora la siguiente ilustración!`);
        setTimeout(iniciarRonda, 1800);
      }, 400);
    }
  }

  // ── Fin de juego ──────────────────────────────────────────────────────────
  async function finJuego() {
    juegoActivo = false;
    clearInterval(timerId);
    await registrarSesion(rondasMax, movimientos);
    showModal('🏆 ¡Completado!',
      `Has completado ${rondasMax} puzzles.\nMovimientos totales: ${movimientos}\nTiempo: ${tiempo}s`);
      if (window.Sonidos) Sonidos.victoria();
  }

  // ── Resize ─────────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (juegoActivo && ilustracionActual) construirPuzzle();
  });

  // ── Eventos ────────────────────────────────────────────────────────────────
  btnEmpezar?.addEventListener('click', iniciarPuzzle);
  btnVolver?.addEventListener('click',  () => { clearInterval(timerId); window.close(); });
  puzzleNivelEl?.addEventListener('change', () => { if (juegoActivo) iniciarRonda(); });

});
