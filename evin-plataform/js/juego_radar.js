// js/juego_radar.js
document.addEventListener('DOMContentLoaded', () => {

  const _evinUser     = JSON.parse(localStorage.getItem('evin_user') || '{}');
  const usuarioActual = _evinUser.nombre || 'Anónimo';

  const radarGrid       = document.getElementById('radar-grid');
  const radarObjetivoEl = document.getElementById('radar-objetivo');
  const radarAciertosEl = document.getElementById('radar-aciertos');
  const radarErroresEl  = document.getElementById('radar-errores');
  const radarTiempoEl   = document.getElementById('radar-tiempo');
  const radarRondaEl    = document.getElementById('radar-ronda');
  const radarNivelEl    = document.getElementById('radar-nivel');
  const btnEmpezar      = document.getElementById('radar-empezar');
  const btnComprobar    = document.getElementById('radar-comprobar');
  const btnVolver       = document.getElementById('radar-volver');

  const radarItems = [
    { id: 'triangulo-azul',     alt: 'Triángulo azul',     svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#3a7fff"/></svg>' },
    { id: 'triangulo-rojo',     alt: 'Triángulo rojo',     svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#ff3333"/></svg>' },
    { id: 'triangulo-verde',    alt: 'Triángulo verde',    svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#00cc44"/></svg>' },
    { id: 'triangulo-amarillo', alt: 'Triángulo amarillo', svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#ffdd00"/></svg>' },
    { id: 'circulo-azul',       alt: 'Círculo azul',       svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#3a7fff"/></svg>' },
    { id: 'circulo-rojo',       alt: 'Círculo rojo',       svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#ff3333"/></svg>' },
    { id: 'circulo-verde',      alt: 'Círculo verde',      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#00cc44"/></svg>' },
    { id: 'circulo-amarillo',   alt: 'Círculo amarillo',   svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#ffdd00"/></svg>' },
    { id: 'cuadrado-azul',      alt: 'Cuadrado azul',      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#3a7fff"/></svg>' },
    { id: 'cuadrado-rojo',      alt: 'Cuadrado rojo',      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#ff3333"/></svg>' },
    { id: 'cuadrado-verde',     alt: 'Cuadrado verde',     svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#00cc44"/></svg>' },
    { id: 'cuadrado-amarillo',  alt: 'Cuadrado amarillo',  svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#ffdd00"/></svg>' },
    { id: 'estrella-azul',      alt: 'Estrella azul',      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#3a7fff"/></svg>' },
    { id: 'estrella-roja',      alt: 'Estrella roja',      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#ff3333"/></svg>' },
    { id: 'estrella-verde',     alt: 'Estrella verde',     svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#00cc44"/></svg>' },
    { id: 'estrella-amarilla',  alt: 'Estrella amarilla',  svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#ffdd00"/></svg>' }
  ];

  let radarObjetivo    = null;
  let radarCeldas      = [];
  let radarAciertos    = 0;
  let radarErrores     = 0;
  let radarTiempo      = 0;
  let radarTimerId     = null;
  let rondaActual      = 1;
  let objetivosEncontrados = 0;
  let juegoActivo      = false;

  function configPorNivel() {
    const nivel = radarNivelEl?.value || 'medio';
    if (nivel === 'facil')  return { rondasMax: 3, maxErrores: 2, filasBase: 3, colsBase: 4, numObjetivos: 3 };
    if (nivel === 'medio')  return { rondasMax: 5, maxErrores: 2, filasBase: 4, colsBase: 5, numObjetivos: 4 };
    return                         { rondasMax: 8, maxErrores: 2, filasBase: 5, colsBase: 6, numObjetivos: 5 };
  }

  function configRonda(ronda) {
    const base  = configPorNivel();
    const extra = ronda - 1;
    return {
      filas:        base.filasBase,
      cols:         base.colsBase + extra,
      numObjetivos: base.numObjetivos + Math.floor(extra / 2),
      maxErrores:   base.maxErrores,
      rondasMax:    base.rondasMax
    };
  }

  function calcularTamanhoCelda(cols) {
    const padding   = 24;
    const gapPx     = 6;
    const anchoUtil = window.innerWidth - padding * 2;
    const totalGaps = (cols - 1) * gapPx;
    const tamano    = Math.floor((anchoUtil - totalGaps) / cols);
    return Math.max(36, Math.min(80, tamano));
  }

  async function registrarSesion(aciertos, intentos) {
    try {
      const token = localStorage.getItem('evin_token');
      await fetch('http://162.0.228.169/api/v1/sesiones', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ alumno: usuarioActual, juego: 'Radar visual', aciertos, intentos })
      });
    } catch (e) { console.error('Error al registrar sesión:', e); }
  }

  function actualizarUI() {
    const cfg = configPorNivel();
    if (radarRondaEl)    radarRondaEl.textContent   = `${rondaActual} / ${cfg.rondasMax}`;
    if (radarErroresEl)  radarErroresEl.textContent = `${radarErrores} / ${cfg.maxErrores}`;
    if (radarAciertosEl) radarAciertosEl.textContent = radarAciertos;
  }

  window.iniciarRadarVisual = function () {
    rondaActual           = 1;
    radarAciertos         = 0;
    radarErrores          = 0;
    radarTiempo           = 0;
    objetivosEncontrados  = 0;
    juegoActivo           = true;
    if (radarTiempoEl) radarTiempoEl.textContent = 0;
    actualizarUI();
    if (radarTimerId) clearInterval(radarTimerId);
    radarTimerId = setInterval(() => {
      radarTiempo++;
      if (radarTiempoEl) radarTiempoEl.textContent = radarTiempo;
    }, 1000);
    iniciarRonda();
  };

  function iniciarRonda() {
    objetivosEncontrados = 0;
    radarObjetivo = radarItems[Math.floor(Math.random() * radarItems.length)];
    if (radarObjetivoEl) {
      radarObjetivoEl.innerHTML = radarObjetivo.svg +
        '<span style="margin-left:0.4rem;vertical-align:middle">' + radarObjetivo.alt + '</span>';
    }
    actualizarUI();
    crearTableroRadar();
    if (btnComprobar) btnComprobar.disabled = true;
  }

  function crearTableroRadar() {
    if (!radarGrid || !radarObjetivo) return;
    const { filas, cols, numObjetivos } = configRonda(rondaActual);
    const total    = filas * cols;
    const tamCelda = calcularTamanhoCelda(cols);
    const gapPx    = tamCelda < 48 ? 4 : 6;

    radarGrid.innerHTML = '';
    radarCeldas = [];
    radarGrid.style.setProperty('--radar-cell-size', tamCelda + 'px');
    radarGrid.style.gridTemplateColumns = `repeat(${cols}, ${tamCelda}px)`;
    radarGrid.style.gap                 = `${gapPx}px`;
    radarGrid.style.justifyContent      = 'center';

    const indicesObj = [...Array(total).keys()].sort(() => Math.random() - 0.5).slice(0, numObjetivos);
    const setObj     = new Set(indicesObj);
    const distractores = radarItems.filter(x => x.id !== radarObjetivo.id);

    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'radar-cell';
      const item = setObj.has(i)
        ? radarObjetivo
        : distractores[Math.floor(Math.random() * distractores.length)];

      cell.dataset.itemId     = item.id;
      cell.dataset.esObjetivo = setObj.has(i) ? '1' : '0';
      cell.setAttribute('aria-label', item.alt);
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');

      const wrapper = document.createElement('div');
      wrapper.className = 'radar-svg-wrap';
      wrapper.innerHTML = item.svg;
      wrapper.setAttribute('aria-hidden', 'true');
      cell.appendChild(wrapper);

      cell.addEventListener('click', () => manejarClick(cell));
      cell.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manejarClick(cell); }
      });

      radarGrid.appendChild(cell);
      radarCeldas.push(cell);
    }
  }

  window.addEventListener('resize', () => {
    if (radarObjetivo && radarCeldas.length && juegoActivo) crearTableroRadar();
  });

  function manejarClick(cell) {
    if (!juegoActivo) return;
    if (cell.dataset.procesada) return;

    const esObjetivo = cell.dataset.esObjetivo === '1';
    cell.dataset.procesada = '1';
    cell.style.position = 'relative';

    const iconoCorrecto = '<svg viewBox="0 0 24 24" width="16" height="16" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#0f0" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoError    = '<svg viewBox="0 0 24 24" width="16" height="16" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#f00" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';

    if (esObjetivo) {
      // ── SONIDO ACIERTO ──
      if (window.Sonidos) Sonidos.acierto();

      cell.classList.add('radar-cell-correcta');
      cell.insertAdjacentHTML('beforeend', iconoCorrecto);
      radarAciertos++;
      objetivosEncontrados++;
      actualizarUI();

      const { numObjetivos, rondasMax } = configRonda(rondaActual);
      if (objetivosEncontrados >= numObjetivos) {
        if (rondaActual >= rondasMax) {
          finJuego(true);
        } else {
          setTimeout(() => {
            // ── SONIDO RONDA SUPERADA ──
            if (window.Sonidos) Sonidos.rondaSuperada();
            rondaActual++;
            showModal('¡Ronda superada!', `Completaste la ronda ${rondaActual - 1}. ¡Ahora el tablero es más grande!`);
            setTimeout(iniciarRonda, 1800);
          }, 400);
        }
      }
    } else {
      // ── SONIDO ERROR ──
      if (window.Sonidos) Sonidos.error();

      cell.classList.add('radar-cell-incorrecta');
      cell.insertAdjacentHTML('beforeend', iconoError);
      radarErrores++;
      actualizarUI();

      radarGrid.style.outline = '3px solid #f00';
      setTimeout(() => { radarGrid.style.outline = ''; }, 400);

      const { maxErrores } = configPorNivel();
      if (radarErrores >= maxErrores) {
        setTimeout(() => finJuego(false), 500);
      }
    }
  }

  async function finJuego(completado) {
    juegoActivo = false;
    clearInterval(radarTimerId);

    radarCeldas.forEach(cell => {
      if (cell.dataset.esObjetivo === '1' && !cell.classList.contains('radar-cell-correcta')) {
        cell.classList.add('radar-cell-faltante');
        cell.style.position = 'relative';
        cell.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" width="16" height="16" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#f80" stroke-width="3" fill="none"/></svg>');
      }
    });

    await registrarSesion(radarAciertos, radarAciertos + radarErrores);

    // ── SONIDO FIN ──
    if (completado) {
      if (window.Sonidos) Sonidos.victoria();
      const cfg = configPorNivel();
      showModal('🏆 ¡Completado!',
        `Has superado las ${cfg.rondasMax} rondas.\nAciertos: ${radarAciertos}\nErrores: ${radarErrores}\nTiempo: ${radarTiempo}s`);
    } else {
      if (window.Sonidos) Sonidos.gameOver();
      showModal('💥 Game Over',
        `Cometiste ${radarErrores} errores.\nLlegaste hasta la ronda ${rondaActual}.\nAciertos totales: ${radarAciertos}\nTiempo: ${radarTiempo}s`);
    }
  }

  btnEmpezar?.addEventListener('click', iniciarRadarVisual);
  btnVolver?.addEventListener('click',  () => { clearInterval(radarTimerId); if (document.fullscreenElement) document.exitFullscreen(); if (typeof showSection === 'function') showSection('juegos'); });
  radarNivelEl?.addEventListener('change', iniciarRadarVisual);

});
