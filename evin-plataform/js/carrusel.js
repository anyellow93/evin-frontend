// js/carrusel.js
// Carrusel EVIN — lógica de navegación, autoplay, swipe y teclado
// Cargar antes de </body> en index.html:
// <script src="js/carrusel.js" defer></script>

(function () {
  const track   = document.getElementById('carrusel-track');
  const prev    = document.getElementById('carrusel-prev');
  const next    = document.getElementById('carrusel-next');
  const dots    = document.querySelectorAll('.evin-carrusel-dot');
  const carrusel = document.querySelector('.evin-carrusel');

  if (!track || !prev || !next || !carrusel) return; // salir si no existe el carrusel

  const total   = dots.length;
  let current   = 0;
  let autoTimer = null;
  const DELAY   = 5500; // ms entre slides

  // Respeta prefers-reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function irA(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('activo', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function iniciarAuto() {
    if (reducedMotion) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => irA(current + 1), DELAY);
  }

  function reiniciarAuto() {
    clearInterval(autoTimer);
    iniciarAuto();
  }

  // Flechas
  prev.addEventListener('click', () => { irA(current - 1); reiniciarAuto(); });
  next.addEventListener('click', () => { irA(current + 1); reiniciarAuto(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => { irA(Number(dot.dataset.idx)); reiniciarAuto(); });
  });

  // Swipe táctil
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { irA(diff > 0 ? current + 1 : current - 1); reiniciarAuto(); }
  });

  // Teclado accesible
  carrusel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { irA(current - 1); reiniciarAuto(); }
    if (e.key === 'ArrowRight') { irA(current + 1); reiniciarAuto(); }
  });

  // Pausar autoplay al pasar el ratón
  carrusel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carrusel.addEventListener('mouseleave', iniciarAuto);

  iniciarAuto();
})();
