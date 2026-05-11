// js/juego_grid.js
document.addEventListener('DOMContentLoaded', () => {

  // Leer el usuario que viene en la URL
  const params        = new URLSearchParams(window.location.search);
  const usuarioActual = decodeURIComponent(params.get('usuario') || 'Anónimo');
  const alumnoId      = params.get('alumno_id') || null;

  // ── Elementos del DOM ──────────────────────────────────────────────────────
  const gridTablero    = document.getElementById('grid-tablero');
  const gridRondaEl    = document.getElementById('grid-ronda');
  const gridAciertosEl = document.getElementById('grid-aciertos');
  const gridErroresEl  = document.getElementById('grid-errores');
  const gridNivelEl    = document.getElementById('grid-nivel');
  const btnEmpezar     = document.getElementById('grid-empezar');
  const btnComprobar   = document.getElementById('grid-comprobar');
  const btnVolver      = document.getElementById('grid-volver');

  // ── Estado del juego ───────────────────────────────────────────────────────
  let gridFilas     = 3;
  let gridCols      = 3;
  let numObjetivo   = 3;
  let celdas        = [];
  let indicesObj    = [];
  let fase          = 'espera';
  let ronda         = 1;
  let aciertosTotal = 0;
  let erroresTotal  = 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function configurarNivel() {
    if (gridNivelEl.value === 'facil') {
      gridFilas = 3; gridCols = 3; numObjetivo = 3;
    } else if (gridNivelEl.value === 'medio') {
      gridFilas = 4; gridCols = 4; numObjetivo = 5;
    } else {
      gridFilas = 5; gridCols = 5; numObjetivo = 7;
    }
  }

  function barajar(arr) {
    return arr
      .map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
  }

  // ── Registro de sesión ─────────────────────────────────────────────────────

  async function registrarSesion(aciertos, intentos) {
    try {
      const token = localStorage.getItem('evin_token');
      await fetch('http://localhost:3001/api/v1/sesiones', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          alumno:    usuarioActual,
          alumno_id: alumnoId,
          juego:    'Recuerda las casillas',
          aciertos,
          intentos
        })
      });
    } catch (e) {
      console.error('Error al registrar sesión:', e);
    }
  }

  // ── Crear tablero ──────────────────────────────────────────────────────────

  window.crearTableroGrid = function () {
    configurarNivel();
    gridTablero.innerHTML = '';
    celdas = [];
    gridTablero.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

    for (let i = 0; i < gridFilas * gridCols; i++) {
      const celda = document.createElement('div');
      celda.className     = 'grid-celda';
      celda.dataset.index = i;
      celda.setAttribute('role', 'button');
      celda.setAttribute('tabindex', '0');
      celda.setAttribute('aria-pressed', 'false');

      // Teclado: Enter y Espacio también activan la celda
      celda.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          manejarClick(celda);
        }
      });

      const inner = document.createElement('div');
      inner.className = 'grid-celda-inner';
      celda.appendChild(inner);

      celda.addEventListener('click', () => manejarClick(celda));
      gridTablero.appendChild(celda);
      celdas.push(celda);
    } // ← cierre del for
  }; // ← cierre de crearTableroGrid

  // ── Lógica de ronda ────────────────────────────────────────────────────────

  function nuevaRonda() {
    fase = 'mostrando';
    btnComprobar.disabled = true;
    crearTableroGrid();

    const indices = [...Array(gridFilas * gridCols).keys()];
    indicesObj    = barajar(indices).slice(0, numObjetivo);

    indicesObj.forEach(i => celdas[i].classList.add('grid-celda-objetivo'));

    setTimeout(() => {
      indicesObj.forEach(i => celdas[i].classList.remove('grid-celda-objetivo'));
      fase = 'respondiendo';
      btnComprobar.disabled = false;
    }, 1500);
  }

  function manejarClick(celda) {
    if (fase !== 'respondiendo') return;
    celda.classList.toggle('grid-celda-seleccionada');
    celda.setAttribute(
      'aria-pressed',
      celda.classList.contains('grid-celda-seleccionada') ? 'true' : 'false'
    );
  }

  async function comprobarRespuesta() {
    if (fase !== 'respondiendo') return;
    fase = 'resultado';
    btnComprobar.disabled = true;

    const setObj = new Set(indicesObj);
    let aciertos = 0;
    let errores  = 0;

    // Iconos SVG para cada estado — no dependen solo del color
    const iconoCorrecto   = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#155d27" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoError      = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#7a0c14" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoFaltaba    = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#856404" stroke-width="3" fill="none"/><path d="M12 7v5l3 3" stroke="#856404" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';

    celdas.forEach(c => {
      const idx   = Number(c.dataset.index);
      const esObj = setObj.has(idx);
      const esSel = c.classList.contains('grid-celda-seleccionada');
      const inner = c.querySelector('.grid-celda-inner');

      if (esObj && esSel) {
        aciertos++;
        c.classList.add('grid-celda-correcta');
        c.setAttribute('aria-label', 'Correcto');
        if (inner) inner.innerHTML = iconoCorrecto;
      } else if (!esObj && esSel) {
        errores++;
        c.classList.add('grid-celda-incorrecta');
        c.setAttribute('aria-label', 'Incorrecto');
        if (inner) inner.innerHTML = iconoError;
      } else if (esObj && !esSel) {
        
        c.classList.add('grid-celda-eracorrecta');
        c.setAttribute('aria-label', 'Esta era la casilla correcta');
        if (inner) inner.innerHTML = iconoFaltaba;
      }
    });

    aciertosTotal += aciertos;
    erroresTotal  += errores;
    gridAciertosEl.textContent = aciertosTotal;
    gridErroresEl.textContent  = erroresTotal;

    await registrarSesion(aciertos, numObjetivo);

    const msg = errores === 0
      ? '¡Perfecto! Has acertado todas las casillas.'
      : `Has acertado ${aciertos} casilla${aciertos !== 1 ? 's' : ''} y has cometido ${errores} error${errores !== 1 ? 'es' : ''}.`;

    showModal('Resultado de la ronda', msg);

    ronda++;
    gridRondaEl.textContent = ronda;
  }

  // ── Eventos de UI ──────────────────────────────────────────────────────────

  btnEmpezar?.addEventListener('click',   nuevaRonda);
  btnComprobar?.addEventListener('click', comprobarRespuesta);
  btnVolver?.addEventListener('click',    () => window.close());
  gridNivelEl?.addEventListener('change', crearTableroGrid);

  // Primera configuración visual (sin iniciar ronda)
  crearTableroGrid();

});
