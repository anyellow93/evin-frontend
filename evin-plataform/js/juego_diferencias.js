// js/juego_diferencias.js
document.addEventListener('DOMContentLoaded', () => {

  const params        = new URLSearchParams(window.location.search);
  const usuarioActual = decodeURIComponent(params.get('usuario') || 'Anónimo');
  const alumnoId      = params.get('alumno_id') || null;

  // ── Elementos del DOM ──────────────────────────────────────────────────────
  const panelIzq       = document.getElementById('diferencias-izq');
  const panelDer       = document.getElementById('diferencias-der');
  const contadorEl     = document.getElementById('diferencias-contador');
  const totalEl        = document.getElementById('diferencias-total');
  const tiempoEl       = document.getElementById('diferencias-tiempo');
  const nivelEl        = document.getElementById('diferencias-nivel');
  const btnEmpezar     = document.getElementById('diferencias-empezar');
  const btnVolver      = document.getElementById('diferencias-volver');
  const mensajeEl      = document.getElementById('diferencias-mensaje');

  // ── Formas y colores disponibles ──────────────────────────────────────────
  const FORMAS  = ['circulo', 'cuadrado', 'triangulo', 'rombo', 'estrella'];
  const COLORES = ['#e63946', '#4361ee', '#2ecc71', '#f4a261', '#9b5de5',
                   '#00b4d8', '#f4d35e', '#e76f51', '#2a9d8f', '#ff6b6b'];

  // ── Estado ────────────────────────────────────────────────────────────────
  let tableroBase    = [];
  let tableroMod     = [];
  let diferencias    = new Set();
  let encontradas    = new Set();
  let numDiferencias = 4;
  let cols           = 4;
  let filas          = 4;
  let timerID        = null;
  let segundos       = 0;
  let jugando        = false;

  // ── Helpers ───────────────────────────────────────────────────────────────

  function aleatorio(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function configNivel() {
    const nivel = nivelEl?.value || 'medio';
    if (nivel === 'facil')  { filas = 3; cols = 3; numDiferencias = 3; }
    if (nivel === 'medio')  { filas = 4; cols = 4; numDiferencias = 5; }
    if (nivel === 'dificil'){ filas = 5; cols = 5; numDiferencias = 7; }
  }

  function generarCelda() {
    return { forma: aleatorio(FORMAS), color: aleatorio(COLORES) };
  }

  function svgForma(forma, color, size = 56) {
    const s = size;
    const c = s / 2;
    // Versión oscurecida del color para el borde
    const filtroId = `sombra_${Math.random().toString(36).slice(2,7)}`;
    const sombra = `
      <defs>
        <filter id="${filtroId}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>`;

    switch (forma) {
      case 'circulo':
        return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
          ${sombra}
          <circle cx="${c}" cy="${c}" r="${c - 5}" fill="${color}" filter="url(#${filtroId})"
            stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        </svg>`;
      case 'cuadrado':
        return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
          ${sombra}
          <rect x="5" y="5" width="${s - 10}" height="${s - 10}" rx="6" fill="${color}"
            filter="url(#${filtroId})" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        </svg>`;
      case 'triangulo':
        return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
          ${sombra}
          <polygon points="${c},5 ${s - 5},${s - 5} 5,${s - 5}" fill="${color}"
            filter="url(#${filtroId})" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        </svg>`;
      case 'rombo':
        return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
          ${sombra}
          <polygon points="${c},5 ${s - 5},${c} ${c},${s - 5} 5,${c}" fill="${color}"
            filter="url(#${filtroId})" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        </svg>`;
      case 'estrella':
        const puntos = [];
        for (let i = 0; i < 10; i++) {
          const angulo = (i * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? c - 5 : (c - 5) * 0.45;
          puntos.push(`${c + r * Math.cos(angulo)},${c + r * Math.sin(angulo)}`);
        }
        return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
          ${sombra}
          <polygon points="${puntos.join(' ')}" fill="${color}"
            filter="url(#${filtroId})" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        </svg>`;
    }
  }

  // ── Construir tablero ─────────────────────────────────────────────────────

  function generarTableros() {
    tableroBase = [];
    tableroMod  = [];
    diferencias = new Set();
    encontradas = new Set();

    const total = filas * cols;

    // Generar tablero base
    for (let i = 0; i < total; i++) {
      tableroBase.push(generarCelda());
    }

    // Copiar tablero y modificar celdas aleatorias
    tableroMod = tableroBase.map(c => ({ ...c }));

    const indices = [...Array(total).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, numDiferencias);

    indices.forEach(idx => {
      diferencias.add(idx);
      const original = tableroBase[idx];
      // Cambiar forma O color (alternando para variedad)
      if (Math.random() > 0.5) {
        let nuevaForma = aleatorio(FORMAS);
        while (nuevaForma === original.forma) nuevaForma = aleatorio(FORMAS);
        tableroMod[idx] = { ...original, forma: nuevaForma };
      } else {
        let nuevoColor = aleatorio(COLORES);
        while (nuevoColor === original.color) nuevoColor = aleatorio(COLORES);
        tableroMod[idx] = { ...original, color: nuevoColor };
      }
    });
  }

  function renderTablero(panel, tablero, esModificado) {
    panel.innerHTML = '';
    panel.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    tablero.forEach((celda, idx) => {
      const div = document.createElement('div');
      div.className   = 'dif-celda';
      div.dataset.idx = idx;
      div.innerHTML   = svgForma(celda.forma, celda.color);

      if (esModificado) {
        div.addEventListener('click', () => manejarClick(idx, div));
      }

      panel.appendChild(div);
    });
  }

  // ── Lógica de juego ───────────────────────────────────────────────────────

  // Iconos SVG de feedback
  const iconoCorrecto = '<span class="dif-icono dif-icono-ok" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M5 13l4 4L19 7" stroke="#155d27" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span>';
  const iconoError    = '<span class="dif-icono dif-icono-err" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18" stroke="#7a0c14" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span>';

  function manejarClick(idx, celda) {
    if (!jugando) return;
    if (encontradas.has(idx)) return;

    if (diferencias.has(idx)) {
      // Acierto
      encontradas.add(idx);
      celda.classList.add('dif-correcta');
      celda.setAttribute('aria-label', 'Diferencia encontrada');
      celda.insertAdjacentHTML('beforeend', iconoCorrecto);

      // Marcar también en el tablero izquierdo
      const celdaIzq = panelIzq.querySelector(`[data-idx="${idx}"]`);
      if (celdaIzq) {
        celdaIzq.classList.add('dif-correcta');
        celdaIzq.insertAdjacentHTML('beforeend', iconoCorrecto);
      }

      actualizarContador();

      if (encontradas.size === diferencias.size) {
        finJuego(true);
      }
    } else {
      // Error — icono temporal
      celda.classList.add('dif-error');
      const icono = document.createElement('span');
      icono.className = 'dif-icono dif-icono-err';
      icono.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18" stroke="#7a0c14" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
      celda.appendChild(icono);
      setTimeout(() => {
        celda.classList.remove('dif-error');
        icono.remove();
      }, 600);
    }
  }

  function actualizarContador() {
    if (contadorEl) contadorEl.textContent = encontradas.size;
    if (totalEl)    totalEl.textContent    = diferencias.size;
  }

  async function finJuego(completado) {
    jugando = false;
    clearInterval(timerID);

    await registrarSesion(encontradas.size, diferencias.size);

    if (mensajeEl) {
      mensajeEl.textContent  = completado
        ? `¡Enhorabuena! Has encontrado todas las diferencias en ${segundos}s.`
        : `Juego terminado. Encontraste ${encontradas.size} de ${diferencias.size} diferencias.`;
      mensajeEl.style.display = 'block';
    }

    if (completado) {
      showModal(
        '¡Enhorabuena!',
        `Has encontrado las ${diferencias.size} diferencias en ${segundos} segundos.`
      );
    }
  }

  // ── Timer ─────────────────────────────────────────────────────────────────

  function iniciarTimer() {
    segundos = 0;
    if (tiempoEl) tiempoEl.textContent = 0;
    clearInterval(timerID);
    timerID = setInterval(() => {
      segundos++;
      if (tiempoEl) tiempoEl.textContent = segundos;
    }, 1000);
  }

  // ── Registro de sesión ────────────────────────────────────────────────────

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
          alumno:    usuarioActual,
          alumno_id: alumnoId,
          juego:    'Encuentra las diferencias',
          aciertos,
          intentos
        })
      });
    } catch (e) {
      console.error('Error al registrar sesión:', e);
    }
  }

  // ── Iniciar juego ─────────────────────────────────────────────────────────

  window.iniciarDiferencias = function () {
    configNivel();
    generarTableros();

    if (mensajeEl) mensajeEl.style.display = 'none';

    renderTablero(panelIzq, tableroBase, false);
    renderTablero(panelDer, tableroMod,  true);

    actualizarContador();
    iniciarTimer();
    jugando = true;
  };

  // ── Eventos ───────────────────────────────────────────────────────────────

  btnEmpezar?.addEventListener('click',  iniciarDiferencias);
  btnVolver?.addEventListener('click',   () => { clearInterval(timerID); window.close(); });
  nivelEl?.addEventListener('change',    iniciarDiferencias);

});
