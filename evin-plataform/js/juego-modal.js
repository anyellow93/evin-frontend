// js/juego-modal.js
// Modal independiente para usar en las ventanas de juego
// No depende de main.js ni de la ventana principal

(function () {
  // Inyectar estilos del modal directamente
  const style = document.createElement('style');
  style.textContent = `
    #juego-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 9999;
      align-items: center;
      justify-content: center;
    }
    #juego-modal-overlay.visible {
      display: flex;
    }
    #juego-modal-box {
      background: #fff;
      border-radius: 14px;
      padding: 2rem 2.2rem;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.2);
      font-family: 'Roboto', system-ui, sans-serif;
      position: relative;
    }
    #juego-modal-box h2 {
      margin: 0 0 0.8rem;
      color: #1d3557;
      font-size: 1.3rem;
    }
    #juego-modal-box p {
      margin: 0;
      color: #444;
      font-size: 0.95rem;
      line-height: 1.5;
      white-space: pre-line;
    }
    #juego-modal-cerrar {
      position: absolute;
      top: 0.7rem;
      right: 0.9rem;
      background: none;
      border: none;
      font-size: 1.4rem;
      cursor: pointer;
      color: #666;
    }
    #juego-modal-cerrar:hover { color: #e63946; }
  `;
  document.head.appendChild(style);

  // Crear estructura HTML del modal
  const overlay = document.createElement('div');
  overlay.id = 'juego-modal-overlay';
  overlay.innerHTML = `
    <div id="juego-modal-box">
      <button id="juego-modal-cerrar" aria-label="Cerrar">&times;</button>
      <h2 id="juego-modal-titulo"></h2>
      <p  id="juego-modal-desc"></p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Cerrar al pulsar el botón o la tecla Escape
  document.getElementById('juego-modal-cerrar').addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });

  function cerrarModal() {
    overlay.classList.remove('visible');
  }

  // Exponer showModal globalmente para que los juegos puedan usarlo
  window.showModal = function (titulo, descripcion) {
    document.getElementById('juego-modal-titulo').textContent = titulo;
    document.getElementById('juego-modal-desc').textContent   = descripcion;
    overlay.classList.add('visible');
  };
})();
