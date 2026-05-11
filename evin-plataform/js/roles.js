// js/roles.js
// Gestión de vistas según rol — añadir como <script> DESPUÉS de main.js

// Permisos por rol
const PERMISOS = {
  profesor: {
    nav:       ['inicio', 'dashboard', 'juegos', 'alumnos', 'faq', 'contactos'],
    secciones: ['inicio', 'dashboard', 'juegos', 'alumnos', 'faq', 'contactos']
  },
  tecnico: {
    nav:       ['inicio', 'dashboard', 'juegos', 'alumnos', 'faq', 'contactos'],
    secciones: ['inicio', 'dashboard', 'juegos', 'alumnos', 'faq', 'contactos']
  },
  padre: {
    nav:       ['inicio', 'juegos', 'faq', 'contactos'],
    secciones: ['inicio', 'juegos', 'faq', 'contactos']
  },
  alumno: {
    nav:       ['inicio', 'juegos', 'faq'],
    secciones: ['inicio', 'juegos', 'faq']
  }
};

function aplicarPermisosPorRol(user) {
  if (!user || !user.role) return;

  const permisos = PERMISOS[user.role] || PERMISOS['alumno'];

  // ── Mostrar/ocultar items del menú de navegación ──────────────
  document.querySelectorAll('.menu-btn').forEach(btn => {
    const target = btn.getAttribute('href')?.slice(1);
    if (!target || target === 'usuario') return; // el botón de login siempre visible

    const visible = permisos.nav.includes(target);
    btn.parentElement.style.display = visible ? '' : 'none';
  });

  // ── Mostrar badge de rol en la cabecera ───────────────────────
  const badge = document.getElementById('user-role');
  if (badge) {
    const etiquetas = {
      profesor: '👨‍🏫 Profesor',
      tecnico:  '🔧 Técnico',
      padre:    '👨‍👧 Familiar',
      alumno:   '🎓 Alumno'
    };
    badge.textContent = etiquetas[user.role] || user.role;
    badge.className   = `user-role-badge rol-${user.role}`;
  }

  // ── Personalizar mensaje de bienvenida según rol ──────────────
  const bienvenida = document.getElementById('inicio-bienvenida');
  if (bienvenida) {
    const mensajes = {
      profesor: `Hola, <strong>${user.nombre}</strong>. Aquí puedes gestionar tus alumnos y lanzar ejercicios de estimulación visual.`,
      tecnico:  `Hola, <strong>${user.nombre}</strong>. Tienes acceso completo a la plataforma.`,
      padre:    `Hola, <strong>${user.nombre}</strong>. Aquí puedes ver el progreso y los juegos disponibles para tu hijo/a.`,
      alumno:   `¡Hola, <strong>${user.nombre}</strong>! ¿Listo para jugar y entrenar tu visión?`
    };
    bienvenida.innerHTML = mensajes[user.role] || `Bienvenido, <strong>${user.nombre}</strong>.`;
  }
}

function resetearPermisos() {
  // Al hacer logout, mostrar todo el menú de nuevo
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.parentElement.style.display = '';
  });

  const badge = document.getElementById('user-role');
  if (badge) badge.textContent = '';
}

// Exponer para que main.js lo pueda llamar
window.aplicarPermisosPorRol = aplicarPermisosPorRol;
window.resetearPermisos       = resetearPermisos;
