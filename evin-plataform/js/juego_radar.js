// js/juego_radar.js
document.addEventListener('DOMContentLoaded', () => {

  // Leer el usuario que viene en la URL
  const params        = new URLSearchParams(window.location.search);
  const usuarioActual = decodeURIComponent(params.get('usuario') || 'Anónimo');

  // ── Elementos del DOM ──────────────────────────────────────────────────────
  const radarGrid         = document.getElementById('radar-grid');
  const radarObjetivoEl   = document.getElementById('radar-objetivo');
  const radarAciertosEl   = document.getElementById('radar-aciertos');
  const radarErroresEl    = document.getElementById('radar-errores');
  const radarTiempoEl     = document.getElementById('radar-tiempo');
  const radarNivelEl      = document.getElementById('radar-nivel');
  const btnEmpezar        = document.getElementById('radar-empezar');
  const btnComprobar      = document.getElementById('radar-comprobar');
  const btnVolver         = document.getElementById('radar-volver');

  // ── Catálogo de imágenes ───────────────────────────────────────────────────
  // SVG inline — no dependen de ficheros externos
  const radarItems = [
    {
      id: 'triangulo-azul', alt: 'Triángulo azul',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#4361ee" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    },
    {
      id: 'triangulo-rojo', alt: 'Triángulo rojo',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 52,52 4,52" fill="#e63946" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    },
    {
      id: 'circulo-naranja', alt: 'Círculo naranja',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="24" fill="#f4a261" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    },
    {
      id: 'circulo-azul', alt: 'Círculo azul',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="24" fill="#4361ee" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    },
    {
      id: 'cuadrado-amarillo', alt: 'Cuadrado amarillo',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="44" height="44" rx="6" fill="#f4d35e" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    },
    {
      id: 'cuadrado-verde', alt: 'Cuadrado verde',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="44" height="44" rx="6" fill="#2ecc71" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    },
    {
      id: 'cruz-morada', alt: 'Cruz morada',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="4" width="12" height="48" rx="4" fill="#9b5de5"/><rect x="4" y="22" width="48" height="12" rx="4" fill="#9b5de5"/></svg>'
    },
    {
      id: 'estrella-rosa', alt: 'Estrella rosa',
      svg: '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><polygon points="28,4 34,20 52,20 38,32 44,50 28,38 12,50 18,32 4,20 22,20" fill="#f72585" stroke="rgba(0,0,0,0.15)" stroke-width="2"/></svg>'
    }
  ];

  // ── Estado del juego ───────────────────────────────────────────────────────
  let radarObjetivo = null;
  let radarCeldas   = [];
  let radarAciertos = 0;
  let radarErrores  = 0;
  let radarTiempo   = 0;
  let radarTimerId  = null;

  // ── Configuración por nivel ────────────────────────────────────────────────

  function configPorNivel() {
    const nivel = radarNivelEl?.value || 'medio';
    if (nivel === 'facil')   return { filas: 4, cols: 4, numObjetivos: 4 };
    if (nivel === 'medio')   return { filas: 5, cols: 6, numObjetivos: 6 };
    return                          { filas: 6, cols: 8, numObjetivos: 8 };
  }

  // ── Registro de sesión ─────────────────────────────────────────────────────

  async function registrarSesion(aciertos, intentos) {
    try {
      const token = localStorage.getItem('evin_token');
      await fetch('http://162.0.228.169/api/v1/sesiones', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          alumno:   usuarioActual,
          juego:    'Radar visual',
          aciertos,
          intentos
        })
      });
    } catch (e) {
      console.error('Error al registrar sesión:', e);
    }
  }

  // ── Inicializar juego ──────────────────────────────────────────────────────

  window.iniciarRadarVisual = function () {
    // Elegir objetivo aleatorio
    radarObjetivo = radarItems[Math.floor(Math.random() * radarItems.length)];
    if (radarObjetivoEl) {
      radarObjetivoEl.innerHTML = radarObjetivo.svg +
        '<span style="margin-left:0.5rem;vertical-align:middle">' + radarObjetivo.alt + '</span>';
    }

    // Resetear marcadores
    radarAciertos = 0;
    radarErrores  = 0;
    radarTiempo   = 0;
    if (radarAciertosEl) radarAciertosEl.textContent = 0;
    if (radarErroresEl)  radarErroresEl.textContent  = 0;
    if (radarTiempoEl)   radarTiempoEl.textContent   = 0;

    if (radarTimerId) clearInterval(radarTimerId);
    radarTimerId = setInterval(() => {
      radarTiempo++;
      if (radarTiempoEl) radarTiempoEl.textContent = radarTiempo;
    }, 1000);

    crearTableroRadar();
    if (btnComprobar) btnComprobar.disabled = true;
  };

  // ── Crear tablero ──────────────────────────────────────────────────────────

  function crearTableroRadar() {
    if (!radarGrid || !radarObjetivo) return;

    const { filas, cols, numObjetivos } = configPorNivel();
    const total = filas * cols;

    radarGrid.innerHTML = '';
    radarCeldas = [];
    radarGrid.style.display             = 'grid';
    radarGrid.style.gridTemplateColumns = `repeat(${cols}, 64px)`;
    radarGrid.style.gap                 = '8px';

    // Índices donde irá el objetivo
    const todosIndices  = [...Array(total).keys()];
    const indicesObj    = todosIndices
      .sort(() => Math.random() - 0.5)
      .slice(0, numObjetivos);
    const setObj        = new Set(indicesObj);

    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'radar-cell';

      const item = setObj.has(i)
        ? radarObjetivo
        : radarItems.filter(x => x.id !== radarObjetivo.id)[
            Math.floor(Math.random() * (radarItems.length - 1))
          ];

      cell.dataset.itemId = item.id;
      cell.setAttribute('aria-label', item.alt);

      // Usar SVG inline en lugar de <img> — siempre visible
      const wrapper = document.createElement('div');
      wrapper.className   = 'radar-svg-wrap';
      wrapper.innerHTML   = item.svg;
      wrapper.setAttribute('aria-hidden', 'true');

      cell.appendChild(wrapper);
      cell.addEventListener('click', () => toggleSeleccion(cell));
      radarGrid.appendChild(cell);
      radarCeldas.push(cell);
    }
  }

  function toggleSeleccion(cell) {
    cell.classList.toggle('radar-cell-seleccionada');
    if (btnComprobar) {
      btnComprobar.disabled = !radarCeldas.some(c =>
        c.classList.contains('radar-cell-seleccionada')
      );
    }
  }

  // ── Comprobar respuesta ────────────────────────────────────────────────────

  async function comprobarRadar() {
    if (!radarCeldas.length || !radarObjetivo) return;
    if (btnComprobar) btnComprobar.disabled = true;
    clearInterval(radarTimerId);

    let aciertosRonda = 0;
    let erroresRonda  = 0;

    const iconoCorrecto = '<svg viewBox="0 0 24 24" width="18" height="18" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#155d27" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoError    = '<svg viewBox="0 0 24 24" width="18" height="18" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#7a0c14" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const iconoFaltaba  = '<svg viewBox="0 0 24 24" width="18" height="18" style="position:absolute;bottom:2px;right:2px" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#856404" stroke-width="3" fill="none"/><path d="M12 7v5l3 3" stroke="#856404" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';

    radarCeldas.forEach(cell => {
      const esObj = cell.dataset.itemId === radarObjetivo.id;
      const esSel = cell.classList.contains('radar-cell-seleccionada');

      cell.style.position = 'relative';

      if (esObj && esSel) {
        aciertosRonda++;
        cell.classList.add('radar-cell-correcta');
        cell.setAttribute('aria-label', 'Correcto');
        cell.insertAdjacentHTML('beforeend', iconoCorrecto);
      } else if (!esObj && esSel) {
        erroresRonda++;
        cell.classList.add('radar-cell-incorrecta');
        cell.setAttribute('aria-label', 'Incorrecto');
        cell.insertAdjacentHTML('beforeend', iconoError);
      } else if (esObj && !esSel) {
        cell.classList.add('radar-cell-faltante');
        cell.setAttribute('aria-label', 'Este era el objetivo');
        cell.insertAdjacentHTML('beforeend', iconoFaltaba);
      }
    });

    radarAciertos += aciertosRonda;
    radarErrores  += erroresRonda;
    if (radarAciertosEl) radarAciertosEl.textContent = radarAciertos;
    if (radarErroresEl)  radarErroresEl.textContent  = radarErrores;

    const intentos = aciertosRonda + erroresRonda;
    await registrarSesion(aciertosRonda, Math.max(intentos, 1));

    showModal(
      'Resultado de la búsqueda',
      `Has encontrado ${aciertosRonda} objetivo${aciertosRonda !== 1 ? 's' : ''} correctamente` +
      ` y has cometido ${erroresRonda} error${erroresRonda !== 1 ? 'es' : ''}.\n` +
      `Tiempo: ${radarTiempo}s`
    );
  }

  // ── Eventos de UI ──────────────────────────────────────────────────────────

  btnEmpezar?.addEventListener('click',   iniciarRadarVisual);
  btnComprobar?.addEventListener('click', comprobarRadar);
  btnVolver?.addEventListener('click', () => {
    clearInterval(radarTimerId);
    window.close();
  });
  radarNivelEl?.addEventListener('change', iniciarRadarVisual);

});
