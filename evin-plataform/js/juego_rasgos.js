// js/juego_rasgos.js
document.addEventListener('DOMContentLoaded', () => {

  const _evinUser     = JSON.parse(localStorage.getItem('evin_user') || '{}');
  const usuarioActual = _evinUser.nombre || 'Anónimo';

  const rasgosGrid       = document.getElementById('rasgos-grid');
  const rasgosObjetivoEl = document.getElementById('rasgos-objetivo');
  const rasgosAciertosEl = document.getElementById('rasgos-aciertos');
  const rasgosErroresEl  = document.getElementById('rasgos-errores');
  const rasgosTiempoEl   = document.getElementById('rasgos-tiempo');
  const rasgosRondaEl    = document.getElementById('rasgos-ronda');
  const rasgosNivelEl    = document.getElementById('rasgos-nivel');
  const btnEmpezar       = document.getElementById('rasgos-empezar');
  const btnVolver        = document.getElementById('rasgos-volver');

  const formas = [
    { id: 'triangulo-azul',     alt: 'Triángulo azul',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#3a7fff"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="none" stroke="#3a7fff" stroke-width="4" stroke-dasharray="8 4"/></svg>' },
    { id: 'triangulo-rojo',     alt: 'Triángulo rojo',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#ff3333"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="none" stroke="#ff3333" stroke-width="4" stroke-dasharray="8 4"/></svg>' },
    { id: 'triangulo-verde',    alt: 'Triángulo verde',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#00cc44"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="none" stroke="#00cc44" stroke-width="4" stroke-dasharray="8 4"/></svg>' },
    { id: 'triangulo-amarillo', alt: 'Triángulo amarillo',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#ffdd00"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="none" stroke="#ffdd00" stroke-width="4" stroke-dasharray="8 4"/></svg>' },
    { id: 'circulo-azul',       alt: 'Círculo azul',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#3a7fff"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="none" stroke="#3a7fff" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'circulo-rojo',       alt: 'Círculo rojo',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#ff3333"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="none" stroke="#ff3333" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'circulo-verde',      alt: 'Círculo verde',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#00cc44"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="none" stroke="#00cc44" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'circulo-amarillo',   alt: 'Círculo amarillo',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="#ffdd00"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="26" fill="none" stroke="#ffdd00" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'cuadrado-azul',      alt: 'Cuadrado azul',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#3a7fff"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="none" stroke="#3a7fff" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'cuadrado-rojo',      alt: 'Cuadrado rojo',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#ff3333"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="none" stroke="#ff3333" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'cuadrado-verde',     alt: 'Cuadrado verde',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#00cc44"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="none" stroke="#00cc44" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'cuadrado-amarillo',  alt: 'Cuadrado amarillo',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="#ffdd00"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="48" height="48" fill="none" stroke="#ffdd00" stroke-width="4" stroke-dasharray="10 5"/></svg>' },
    { id: 'estrella-azul',      alt: 'Estrella azul',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#3a7fff"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="none" stroke="#3a7fff" stroke-width="3" stroke-dasharray="6 4"/></svg>' },
    { id: 'estrella-roja',      alt: 'Estrella roja',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#ff3333"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="none" stroke="#ff3333" stroke-width="3" stroke-dasharray="6 4"/></svg>' },
    { id: 'estrella-verde',     alt: 'Estrella verde',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#00cc44"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="none" stroke="#00cc44" stroke-width="3" stroke-dasharray="6 4"/></svg>' },
    { id: 'estrella-amarilla',  alt: 'Estrella amarilla',
      svgCompleto: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="#ffdd00"/></svg>',
      svgParcial:  '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,30 44,48 28,37 12,48 18,30 4,20 22,20" fill="none" stroke="#ffdd00" stroke-width="3" stroke-dasharray="6 4"/></svg>' }
  ];

  let formaObjetivo   = null;
  let rasgosCeldas    = [];
  let rasgosAciertos  = 0;
  let rasgosErrores   = 0;
  let rasgosTiempo    = 0;
  let rasgosTimerId   = null;
  let rondaActual     = 1;
  let juegoActivo     = false;

  function configPorNivel() {
    const nivel = rasgosNivelEl?.value || 'medio';
    if (nivel === 'facil')  return { rondasMax: 3, maxErrores: 2, filasBase: 3, colsBase: 3, numObjetivos: 1 };
    if (nivel === 'medio')  return { rondasMax: 5, maxErrores: 2, filasBase: 4, colsBase: 4, numObjetivos: 2 };
    return                         { rondasMax: 8, maxErrores: 2, filasBase: 5, colsBase: 5, numObjetivos: 3 };
  }

  function configRonda(ronda) {
    const base  = configPorNivel();
    const extra = ronda - 1;
    return { filas: base.filasBase, cols: base.colsBase + Math.floor(extra / 2), numObjetivos: base.numObjetivos, maxErrores: base.maxErrores, rondasMax: base.rondasMax };
  }

  function calcularTamanhoCelda(cols) {
    const anchoUtil = window.innerWidth - 48;
    const totalGaps = (cols - 1) * 6;
    return Math.max(40, Math.min(90, Math.floor((anchoUtil - totalGaps) / cols)));
  }

  async function registrarSesion(aciertos, intentos) {
    try {
      const token = localStorage.getItem('evin_token');
      await fetch('http://162.0.228.169/api/v1/sesiones', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ alumno: usuarioActual, juego: 'Rasgos críticos', aciertos, intentos })
      });
    } catch (e) { console.error('Error al registrar sesión:', e); }
  }

  function actualizarUI() {
    const cfg = configPorNivel();
    if (rasgosRondaEl)    rasgosRondaEl.textContent    = `${rondaActual} / ${cfg.rondasMax}`;
    if (rasgosErroresEl)  rasgosErroresEl.textContent  = `${rasgosErrores} / ${cfg.maxErrores}`;
    if (rasgosAciertosEl) rasgosAciertosEl.textContent = rasgosAciertos;
  }

  window.iniciarRasgos = function () {
    rondaActual    = 1;
    rasgosAciertos = 0;
    rasgosErrores  = 0;
    rasgosTiempo   = 0;
    juegoActivo    = true;
    if (rasgosTiempoEl) rasgosTiempoEl.textContent = 0;
    actualizarUI();
    if (rasgosTimerId) clearInterval(rasgosTimerId);
    rasgosTimerId = setInterval(() => { rasgosTiempo++; if (rasgosTiempoEl) rasgosTiempoEl.textContent = rasgosTiempo; }, 1000);
    iniciarRonda();
  };

  function iniciarRonda() {
    formaObjetivo = formas[Math.floor(Math.random() * formas.length)];
    if (rasgosObjetivoEl) {
      rasgosObjetivoEl.innerHTML = formaObjetivo.svgParcial +
        '<span style="margin-left:0.4rem;vertical-align:middle">¿Cuál es la forma completa?</span>';
    }
    actualizarUI();
    crearTablero();
  }

  function crearTablero() {
    if (!rasgosGrid || !formaObjetivo) return;
    const { filas, cols, numObjetivos } = configRonda(rondaActual);
    const total    = filas * cols;
    const tamCelda = calcularTamanhoCelda(cols);
    const gapPx    = tamCelda < 50 ? 4 : 8;

    rasgosGrid.innerHTML = '';
    rasgosCeldas = [];
    rasgosGrid.style.setProperty('--rasgos-cell-size', tamCelda + 'px');
    rasgosGrid.style.gridTemplateColumns = `repeat(${cols}, ${tamCelda}px)`;
    rasgosGrid.style.gap                 = `${gapPx}px`;
    rasgosGrid.style.justifyContent      = 'center';

    const indicesObj = [...Array(total).keys()].sort(() => Math.random() - 0.5).slice(0, numObjetivos);
    const setObj     = new Set(indicesObj);
    const distractores = formas.filter(f => f.id !== formaObjetivo.id);

    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'rasgos-cell';
      let svgContent, esObjetivo;

      if (setObj.has(i)) {
        svgContent = formaObjetivo.svgCompleto;
        esObjetivo = true;
      } else {
        const usarParcial = Math.random() < 0.25;
        svgContent = usarParcial ? formaObjetivo.svgParcial : distractores[Math.floor(Math.random() * distractores.length)].svgCompleto;
        esObjetivo = false;
      }

      cell.dataset.esObjetivo = esObjetivo ? '1' : '0';
      cell.setAttribute('aria-label', esObjetivo ? formaObjetivo.alt + ' completo' : 'Distractor');
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');

      const wrapper = document.createElement('div');
      wrapper.className = 'rasgos-svg-wrap';
      wrapper.innerHTML = svgContent;
      wrapper.setAttribute('aria-hidden', 'true');
      cell.appendChild(wrapper);

      cell.addEventListener('click', () => manejarClick(cell));
      cell.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manejarClick(cell); } });

      rasgosGrid.appendChild(cell);
      rasgosCeldas.push(cell);
    }
  }

  window.addEventListener('resize', () => { if (formaObjetivo && rasgosCeldas.length && juegoActivo) crearTablero(); });

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

      cell.classList.add('rasgos-cell-correcta');
      cell.insertAdjacentHTML('beforeend', iconoCorrecto);
      rasgosAciertos++;

      const pendientes = rasgosCeldas.filter(c => c.dataset.esObjetivo === '1' && !c.dataset.procesada).length;
      actualizarUI();

      if (pendientes === 0) {
        const { rondasMax } = configRonda(rondaActual);
        if (rondaActual >= rondasMax) {
          finJuego(true);
        } else {
          setTimeout(() => {
            // ── SONIDO RONDA SUPERADA ──
            if (window.Sonidos) Sonidos.rondaSuperada();
            rondaActual++;
            showModal('¡Ronda superada!', `¡Bien! Ronda ${rondaActual - 1} completada. El tablero crece.`);
            setTimeout(iniciarRonda, 1800);
          }, 400);
        }
      }
    } else {
      // ── SONIDO ERROR ──
      if (window.Sonidos) Sonidos.error();

      cell.classList.add('rasgos-cell-incorrecta');
      cell.insertAdjacentHTML('beforeend', iconoError);
      rasgosErrores++;

      rasgosGrid.style.outline = '3px solid #f00';
      setTimeout(() => { rasgosGrid.style.outline = ''; }, 400);

      actualizarUI();

      const { maxErrores } = configPorNivel();
      if (rasgosErrores >= maxErrores) setTimeout(() => finJuego(false), 500);
    }
  }

  async function finJuego(completado) {
    juegoActivo = false;
    clearInterval(rasgosTimerId);

    rasgosCeldas.forEach(cell => {
      if (cell.dataset.esObjetivo === '1' && !cell.classList.contains('rasgos-cell-correcta')) {
        cell.classList.add('rasgos-cell-faltante');
        cell.style.position = 'relative';
        cell.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" width="16" height="16" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#f80" stroke-width="3" fill="none"/></svg>');
      }
    });

    await registrarSesion(rasgosAciertos, rasgosAciertos + rasgosErrores);

    if (completado) {
      // ── SONIDO VICTORIA ──
      if (window.Sonidos) Sonidos.victoria();
      const cfg = configPorNivel();
      showModal('🏆 ¡Completado!', `Has superado las ${cfg.rondasMax} rondas.\nAciertos: ${rasgosAciertos}\nErrores: ${rasgosErrores}\nTiempo: ${rasgosTiempo}s`);
    } else {
      // ── SONIDO GAME OVER ──
      if (window.Sonidos) Sonidos.gameOver();
      showModal('💥 Game Over', `Cometiste ${rasgosErrores} errores.\nLlegaste hasta la ronda ${rondaActual}.\nAciertos totales: ${rasgosAciertos}\nTiempo: ${rasgosTiempo}s`);
    }
  }

  btnEmpezar?.addEventListener('click', iniciarRasgos);
  btnVolver?.addEventListener('click',  () => { clearInterval(rasgosTimerId); if (document.fullscreenElement) document.exitFullscreen(); if (typeof showSection === 'function') showSection('juegos'); });
  rasgosNivelEl?.addEventListener('change', iniciarRasgos);

});
