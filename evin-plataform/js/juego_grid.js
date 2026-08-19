// js/juego_grid.js
document.addEventListener('DOMContentLoaded', () => {


  const gridTablero    = document.getElementById('grid-tablero');
  const gridRondaEl    = document.getElementById('grid-ronda');
  const gridAciertosEl = document.getElementById('grid-aciertos');
  const gridErroresEl  = document.getElementById('grid-errores');
  const gridNivelEl    = document.getElementById('grid-nivel');
  const gridFilasEl    = document.getElementById('grid-filas');
  const gridColsEl     = document.getElementById('grid-cols');
  const btnEmpezar     = document.getElementById('grid-empezar');
  const btnComprobar   = document.getElementById('grid-comprobar');
  const btnVolver      = document.getElementById('grid-volver');

  const FILAS_MIN = 3, FILAS_MAX = 8, COLS_MIN = 3, COLS_MAX = 8;

  let gridFilas     = 3;
  let gridCols      = 3;
  let numObjetivo   = 3;
  let celdas        = [];
  let indicesObj    = [];
  let fase          = 'espera';
  let ronda         = 1;
  let aciertosTotal = 0;
  let erroresTotal  = 0;

  // El nivel solo fija la dificultad (nº de objetivos a memorizar) y
  // propone unas filas/columnas de partida en los selects; el jugador
  // puede después ajustarlas manualmente a cualquier combinación
  // dentro del rango permitido (p. ej. 5x7, 6x3...).
  function configurarNivel() {
    let filasSugeridas, colsSugeridas;
    if (gridNivelEl.value === 'facil') {
      filasSugeridas = 3; colsSugeridas = 3; numObjetivo = 3;
    } else if (gridNivelEl.value === 'medio') {
      filasSugeridas = 4; colsSugeridas = 4; numObjetivo = 5;
    } else {
      filasSugeridas = 5; colsSugeridas = 5; numObjetivo = 7;
    }
    if (gridFilasEl) gridFilasEl.value = filasSugeridas;
    if (gridColsEl)  gridColsEl.value  = colsSugeridas;
    leerDimensiones();
  }

  // Lee y valida las filas/columnas elegidas por el usuario en los selects.
  function leerDimensiones() {
    const filas = parseInt(gridFilasEl?.value, 10);
    const cols  = parseInt(gridColsEl?.value, 10);
    gridFilas = Number.isFinite(filas) ? Math.min(FILAS_MAX, Math.max(FILAS_MIN, filas)) : gridFilas;
    gridCols  = Number.isFinite(cols)  ? Math.min(COLS_MAX,  Math.max(COLS_MIN,  cols))  : gridCols;
    // El nº de objetivos nunca puede superar el nº de casillas disponibles.
    const totalCasillas = gridFilas * gridCols;
    if (numObjetivo >= totalCasillas) numObjetivo = Math.max(1, totalCasillas - 1);
  }

  function barajar(arr) {
    return arr.map(v => ({ v, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ v }) => v);
  }

  async function registrarSesion(aciertos, intentos) {
  try {
    const token    = localStorage.getItem('evin_token');
    const user     = JSON.parse(localStorage.getItem('evin_user') || '{}');
    await fetch('https://evin.click/api/v1/sesiones', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ alumno: user.nombre || 'Anónimo', alumno_id: user.alumno_id || null, juego: 'Recuerda las casillas', aciertos, intentos })
    });
  } catch (e) { console.error('Error al registrar sesión:', e); }
}

  window.crearTableroGrid = function () {
    leerDimensiones();
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

      celda.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manejarClick(celda); }
      });

      const inner = document.createElement('div');
      inner.className = 'grid-celda-inner';
      celda.appendChild(inner);

      celda.addEventListener('click', () => manejarClick(celda));
      gridTablero.appendChild(celda);
      celdas.push(celda);
    }
  };

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
    celda.setAttribute('aria-pressed', celda.classList.contains('grid-celda-seleccionada') ? 'true' : 'false');
  }

  async function comprobarRespuesta() {
    if (fase !== 'respondiendo') return;
    fase = 'resultado';
    btnComprobar.disabled = true;

    const setObj = new Set(indicesObj);
    let aciertos = 0;
    let errores  = 0;

    const iconoCorrecto = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#155d27" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoError    = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#7a0c14" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoFaltaba  = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#856404" stroke-width="3" fill="none"/><path d="M12 7v5l3 3" stroke="#856404" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';

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

    // ── SONIDO — después de calcular aciertos y errores ──
    if (errores === 0) {
      if (window.Sonidos) Sonidos.victoria();
      if (window.Animaciones) Animaciones.victoria('juego-grid');
    } else {
      if (window.Sonidos) Sonidos.error();
    }

    await registrarSesion(aciertos, numObjetivo);

    const msg = errores === 0
      ? '¡Perfecto! Has acertado todas las casillas.'
      : `Has acertado ${aciertos} casilla${aciertos !== 1 ? 's' : ''} y has cometido ${errores} error${errores !== 1 ? 'es' : ''}.`;

    showModal('Resultado de la ronda', msg, () => nuevaRonda());

    ronda++;
    gridRondaEl.textContent = ronda;
  }

  btnEmpezar?.addEventListener('click',   () => { window.iniciarModoJuego?.('juego-grid'); nuevaRonda(); });
  btnComprobar?.addEventListener('click', comprobarRespuesta);
  btnVolver?.addEventListener('click',    () => { window.finalizarModoJuego?.('juego-grid'); if (typeof showSection === 'function') showSection('juegos'); });
  gridNivelEl?.addEventListener('change', () => { configurarNivel(); crearTableroGrid(); });
  gridFilasEl?.addEventListener('change', crearTableroGrid);
  gridColsEl?.addEventListener('change',  crearTableroGrid);

  

});
