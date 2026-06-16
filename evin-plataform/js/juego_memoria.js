// js/juego_memoria.js
  document.addEventListener('DOMContentLoaded', () => {

  // Leer el usuario que viene en la URL (?usuario=Ana+García)
  const params        = new URLSearchParams(window.location.search);
  const usuarioActual = decodeURIComponent(params.get('usuario') || 'Anónimo');

  // ── Elementos del DOM ──────────────────────────────────────────────────────
  const memoriaGrid     = document.getElementById('memoria-grid');
  const memoriaIntentos = document.getElementById('memoria-intentos');
  const memoriaTiempo   = document.getElementById('memoria-tiempo');
  const btnReiniciar    = document.getElementById('memoria-reiniciar');
  const btnVolver       = document.getElementById('memoria-volver');
  const memoriaNivel    = document.getElementById('memoria-nivel');

  // ── Estado del juego ───────────────────────────────────────────────────────
  // Emojis por nivel — más variedad y temáticos
  const simbolosFacil  = ['🐶','🐱','🐰','🦊','🐻','🐼','🦁','🐸'];
  const simbolosMedio  = ['🍎','🍊','🍋','🍇','🍓','🍒','🥝','🍍','🌸','🌻','🌈','🦋'];
  const simbolosDificil = ['🚀','🎸','🎨','🏆','🎯','💎','🌍','🎭','🦄','🔮','🎪','🌙','⚡','🎠','🏄','🦅'];

  let cartasMemoria = [];
  let primeraCarta  = null;
  let segundaCarta  = null;
  let bloqueo       = false;
  let intentosMem   = 0;
  let tiempoMem     = 0;
  let timerIdMem    = null;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function barajar(array) {
    return array
      .map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
  }

  function obtenerSimbolos() {
    if (memoriaNivel.value === 'dificil') return simbolosDificil.slice(0, 8);
    if (memoriaNivel.value === 'medio')   return simbolosMedio.slice(0, 6);
    return simbolosFacil.slice(0, 4);
  }

  // ── Registro de sesión en el backend ──────────────────────────────────────

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
          juego:    'Encuentra las parejas',
          aciertos,
          intentos
        })
      });
    } catch (e) {
      console.error('Error al registrar sesión:', e);
    }
  }

  // ── Crear tablero ──────────────────────────────────────────────────────────

  window.crearCartasMemoria = function () {
    const simbolos = barajar([...obtenerSimbolos(), ...obtenerSimbolos()]);

    memoriaGrid.innerHTML = '';
    cartasMemoria = [];
    primeraCarta  = null;
    segundaCarta  = null;
    bloqueo       = false;
    intentosMem   = 0;
    memoriaIntentos.textContent = 0;

    if (timerIdMem) clearInterval(timerIdMem);
    tiempoMem = 0;
    memoriaTiempo.textContent = 0;
    timerIdMem = setInterval(() => {
      tiempoMem++;
      memoriaTiempo.textContent = tiempoMem;
    }, 1000);

   const cols = memoriaNivel.value === 'dificil' ? 4
           : memoriaNivel.value === 'medio'   ? 4
           : 4;
   memoriaGrid.style.gridTemplateColumns = `repeat(${cols}, 90px)`;
   memoriaGrid.style.justifyContent = 'center';

    simbolos.forEach((simbolo, index) => {
      const card = document.createElement('div');
      card.className      = 'memoria-card';
      card.dataset.simbolo = simbolo;
      card.dataset.index   = index;
      card.innerHTML = `
        <div class="memoria-card-inner">
          <div class="memoria-card-front">
            <span class="memoria-card-dorso" aria-hidden="true">?</span>
          </div>
          <div class="memoria-card-back" aria-label="${simbolo}">
            <span class="memoria-emoji">${simbolo}</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => manejarClick(card));
      memoriaGrid.appendChild(card);
      cartasMemoria.push(card);
    });
  };

  // ── Lógica de juego ────────────────────────────────────────────────────────

  function manejarClick(card) {
    if (bloqueo) return;
    if (card.classList.contains('memoria-girada') ||
        card.classList.contains('memoria-acertada')) return;

    card.classList.add('memoria-girada');

    if (!primeraCarta) {
      primeraCarta = card;
      return;
    }

    segundaCarta = card;
    bloqueo      = true;
    intentosMem++;
    memoriaIntentos.textContent = intentosMem;

    if (primeraCarta.dataset.simbolo === segundaCarta.dataset.simbolo) {
      // Acierto — añadir icono de correcto
      const iconoCorrecto = '<span class="memoria-icono-ok" aria-hidden="true">✓</span>';
      primeraCarta.classList.add('memoria-acertada');
      segundaCarta.classList.add('memoria-acertada');
      primeraCarta.querySelector('.memoria-card-back')?.insertAdjacentHTML('beforeend', iconoCorrecto);
      segundaCarta.querySelector('.memoria-card-back')?.insertAdjacentHTML('beforeend', iconoCorrecto);
      primeraCarta.setAttribute('aria-label', `Pareja encontrada: ${primeraCarta.dataset.simbolo}`);
      segundaCarta.setAttribute('aria-label', `Pareja encontrada: ${segundaCarta.dataset.simbolo}`);
      if (window.Sonidos) Sonidos.acierto();
      resetSeleccion();
      comprobarFin();
    } else {
      // Error — flash visual
      primeraCarta.classList.add('memoria-error');
      segundaCarta.classList.add('memoria-error');
      if (window.Sonidos) Sonidos.error();
      setTimeout(() => {
        primeraCarta.classList.remove('memoria-girada', 'memoria-error');
        segundaCarta.classList.remove('memoria-girada', 'memoria-error');
        resetSeleccion();
      }, 800);
    }
  }

  function resetSeleccion() {
    primeraCarta = null;
    segundaCarta = null;
    bloqueo      = false;
  }

  async function comprobarFin() {
    const terminado = cartasMemoria.every(c => c.classList.contains('memoria-acertada'));
    if (!terminado) return;

    clearInterval(timerIdMem);

    const nivel = memoriaNivel.value === 'medio'   ? 'Medio'
                : memoriaNivel.value === 'dificil' ? 'Difícil'
                :                                    'Fácil';

    const aciertos = cartasMemoria.length / 2; // todas las parejas encontradas
    if (window.Sonidos) Sonidos.victoria();

    await registrarSesion(aciertos, intentosMem);

    showModal(
      '¡Enhorabuena!',
      `Has completado el nivel ${nivel}.\n\nIntentos: ${intentosMem}\nTiempo: ${tiempoMem}s`
    );
  }

  // ── Eventos de UI ──────────────────────────────────────────────────────────

  btnReiniciar?.addEventListener('click', crearCartasMemoria);
  btnVolver?.addEventListener('click',    () => window.close());
  memoriaNivel?.addEventListener('change', crearCartasMemoria);

});
