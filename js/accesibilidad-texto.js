// js/accesibilidad-texto.js
// Control de tamaño de texto de la sección Accesibilidad.
// Aplica una clase a <html> que escala el font-size base (ver
// css/accesibilidad-fuentes.css, que define los tamaños en rem),
// y persiste la preferencia en localStorage.

(function () {
  const STORAGE_KEY = 'evin_tamano_texto';
  const NIVELES     = ['normal', 'grande', 'xgrande'];
  const CLASES      = { normal: '', grande: 'texto-grande', xgrande: 'texto-xgrande' };

  function aplicarNivel(nivel) {
    document.documentElement.classList.remove('texto-grande', 'texto-xgrande');
    if (CLASES[nivel]) document.documentElement.classList.add(CLASES[nivel]);
  }

  // Aplicar preferencia guardada lo antes posible (evita parpadeo de tamaño)
  const guardado = localStorage.getItem(STORAGE_KEY);
  const nivelInicial = NIVELES.includes(guardado) ? guardado : 'normal';
  aplicarNivel(nivelInicial);

  document.addEventListener('DOMContentLoaded', () => {
    let nivelActual = nivelInicial;

    const btnDisminuir = document.getElementById('texto-disminuir');
    const btnNormal     = document.getElementById('texto-normal');
    const btnAumentar   = document.getElementById('texto-aumentar');
    const btnContraste  = document.getElementById('accesibilidad-toggle-contraste');

    function actualizar(nivel) {
      nivelActual = nivel;
      aplicarNivel(nivel);
      localStorage.setItem(STORAGE_KEY, nivel);
      [btnDisminuir, btnNormal, btnAumentar].forEach(b => b?.setAttribute('aria-pressed', 'false'));
      if (nivel === 'normal'  && btnNormal)     btnNormal.setAttribute('aria-pressed', 'true');
      if (nivel === 'grande'  && btnAumentar)   btnAumentar.setAttribute('aria-pressed', 'true');
      if (nivel === 'xgrande' && btnAumentar)   btnAumentar.setAttribute('aria-pressed', 'true');
    }

    btnDisminuir?.addEventListener('click', () => {
      const idx = NIVELES.indexOf(nivelActual);
      actualizar(NIVELES[Math.max(idx - 1, 0)]);
    });
    btnAumentar?.addEventListener('click', () => {
      const idx = NIVELES.indexOf(nivelActual);
      actualizar(NIVELES[Math.min(idx + 1, NIVELES.length - 1)]);
    });
    btnNormal?.addEventListener('click', () => actualizar('normal'));

    actualizar(nivelInicial);

    // El botón "Activar/desactivar" de la sección Accesibilidad reutiliza
    // el mismo botón fijo que crea alto-contraste.js.
    btnContraste?.addEventListener('click', () => {
      document.querySelector('.btn-contraste')?.click();
    });
  });
})();
