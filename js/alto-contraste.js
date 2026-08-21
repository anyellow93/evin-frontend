// js/alto-contraste.js
// Botón de alto contraste — se activa/desactiva con un click
// Persiste la preferencia en localStorage

(function () {
  const STORAGE_KEY = 'evin_alto_contraste';
  const CLASE       = 'alto-contraste';

  // Crear el botón fijo
  const btn = document.createElement('button');
  btn.className       = 'btn-contraste';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label',   'Activar modo alto contraste');
  btn.innerHTML       = '◐ Alto contraste';
  document.body.appendChild(btn);

  // Aplicar preferencia guardada al cargar
  function aplicarEstado(activo) {
    if (activo) {
      document.body.classList.add(CLASE);
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label',   'Desactivar modo alto contraste');
      btn.innerHTML = '◑ Contraste normal';
    } else {
      document.body.classList.remove(CLASE);
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label',   'Activar modo alto contraste');
      btn.innerHTML = '◐ Alto contraste';
    }
  }

  // Cargar preferencia guardada
  const guardado = localStorage.getItem(STORAGE_KEY) === 'true';
  aplicarEstado(guardado);

  // Toggle al hacer click
  btn.addEventListener('click', () => {
    const activo = !document.body.classList.contains(CLASE);
    localStorage.setItem(STORAGE_KEY, activo);
    aplicarEstado(activo);
  });

  // Atajo de teclado: Alt+C
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'c') {
      btn.click();
    }
  });
})();
