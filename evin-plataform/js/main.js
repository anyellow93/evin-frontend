// js/main.js
document.addEventListener('DOMContentLoaded', () => {

  // ── Helpers de sesión local ────────────────────────────────────────────────

  function guardarSesion(token, user) {
    localStorage.setItem('evin_token', token);
    localStorage.setItem('evin_user',  JSON.stringify(user));
  }

  function cargarUsuario() {
    const raw = localStorage.getItem('evin_user');
    return raw ? JSON.parse(raw) : null;
  }

  function borrarSesion() {
    localStorage.removeItem('evin_token');
    localStorage.removeItem('evin_user');
  }

  // ── Navegación ─────────────────────────────────────────────────────────────

  const menuButtons = document.querySelectorAll('.menu-btn');
  const sections    = document.querySelectorAll('main > section');
  const navToggle   = document.querySelector('.nav-toggle');
  const mainNav     = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  }

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => mainNav?.classList.remove('open'));
  });

  function showSection(idToShow) {
    sections.forEach(s => s.classList.toggle('hidden', s.id !== idToShow));
    menuButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('href') === `#${idToShow}`);
    });
  }
  window.showSection = showSection;

  // ── Modal principal ────────────────────────────────────────────────────────

  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalTitle');
    modal.innerHTML = `
      <div class="modal-content">
        <button id="closeModal" aria-label="Cerrar modal">&times;</button>
        <h2 id="modalTitle"></h2>
        <p  id="modalDesc"></p>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalTitle = modal.querySelector('#modalTitle');
  const modalDesc  = modal.querySelector('#modalDesc');

  window.showModal = function (title, description) {
    modalTitle.textContent = title;
    modalDesc.textContent  = description;
    modal.classList.remove('hidden');
    modal.querySelector('#closeModal').focus();
  };

  modal.querySelector('#closeModal').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.add('hidden'); });

  // ── Auth — elementos del DOM ───────────────────────────────────────────────

  const loginForm       = document.getElementById('login-form');
  const registerForm    = document.getElementById('register-form');
  const forgotForm      = document.getElementById('forgot-form');
  const userInfo        = document.getElementById('user-info');
  const showRegister    = document.getElementById('show-register');
  const showLogin       = document.getElementById('show-login');
  const showForgot      = document.getElementById('show-forgot');
  const showLoginForgot = document.getElementById('show-login-from-forgot');
  const logoutBtn       = document.getElementById('logout');
  const userNameSpan    = document.getElementById('user-name');
  const userRoleBadge   = document.getElementById('user-role');
  const loginError      = document.getElementById('login-error');
  const registerError   = document.getElementById('register-error');
  const forgotError     = document.getElementById('forgot-error');
  const forgotSuccess   = document.getElementById('forgot-success');
  const alumnoExtra     = document.getElementById('alumno-extra');
  const categorySelect  = document.getElementById('register-category');
  const strengthBar     = document.getElementById('password-strength-bar');
  const strengthLabel   = document.getElementById('password-strength-label');

  function mostrarError(el, msg) { if (!el) return; el.textContent = msg; el.style.display = 'block'; }
  function ocultarError(el)      { if (!el) return; el.style.display = 'none'; }

  function mostrarLogin()    { loginForm?.classList.remove('hidden'); registerForm?.classList.add('hidden'); forgotForm?.classList.add('hidden'); }
  function mostrarRegister() { loginForm?.classList.add('hidden'); registerForm?.classList.remove('hidden'); forgotForm?.classList.add('hidden'); }
  function mostrarForgot()   { loginForm?.classList.add('hidden'); registerForm?.classList.add('hidden'); forgotForm?.classList.remove('hidden'); }

  showRegister?.addEventListener('click',    e => { e.preventDefault(); mostrarRegister(); });
  showLogin?.addEventListener('click',       e => { e.preventDefault(); mostrarLogin(); });
  showForgot?.addEventListener('click',      e => { e.preventDefault(); mostrarForgot(); });
  showLoginForgot?.addEventListener('click', e => { e.preventDefault(); mostrarLogin(); });

  // ── Permisos por rol ──────────────────────────────────────────────────────

  function aplicarPermisosPorRol(user) {
    const rol      = user?.rol || user?.role || '';
    const esGestor = rol === 'profesor' || rol === 'tecnico';
    const btnAlumnos   = document.querySelector('.menu-btn[href="#alumnos"]');
    const btnDashboard = document.querySelector('.menu-btn[href="#dashboard"]');
    if (btnAlumnos)   btnAlumnos.style.display   = esGestor ? '' : 'none';
    if (btnDashboard) btnDashboard.style.display  = esGestor ? '' : 'none';
    if (!esGestor) {
      const seccionActual = [...sections].find(s => !s.classList.contains('hidden'));
      if (seccionActual && (seccionActual.id === 'alumnos' || seccionActual.id === 'dashboard')) showSection('inicio');
    }
  }

  function resetearPermisos() {
    document.querySelectorAll('.menu-btn').forEach(btn => { btn.style.display = ''; });
  }

  window.aplicarPermisosPorRol = aplicarPermisosPorRol;
  window.resetearPermisos      = resetearPermisos;

  // ── Restaurar sesión ──────────────────────────────────────────────────────

  const savedUser = cargarUsuario();
  if (savedUser) { actualizarUIUsuario(savedUser); aplicarPermisosPorRol(savedUser); }

  // ── Actualizar UI ─────────────────────────────────────────────────────────

  function actualizarUIUsuario(user) {
    const rolesLabel = { profesor: 'Profesor', tecnico: 'Técnico', padre: 'Familiar', alumno: 'Alumno' };
    userNameSpan.textContent = user.nombre;
    if (userRoleBadge) userRoleBadge.textContent = rolesLabel[user.rol] || user.rol || user.role;
    loginForm?.classList.add('hidden');
    registerForm?.classList.add('hidden');
    forgotForm?.classList.add('hidden');
    userInfo?.classList.remove('hidden');
    const navLoginBtn     = document.getElementById('nav-login-btn');
    const navPerfilBtn    = document.getElementById('nav-perfil-btn');
    const navPerfilNombre = document.getElementById('nav-perfil-nombre');
    if (navLoginBtn)      navLoginBtn.classList.add('hidden');
    if (navPerfilBtn)     navPerfilBtn.classList.remove('hidden');
    if (navPerfilNombre)  navPerfilNombre.textContent = user.nombre;
  }

  // ── Panel perfil de usuario ───────────────────────────────────────────────

  const navPerfilBtn      = document.getElementById('nav-perfil-btn');
  const navLoginBtn       = document.getElementById('nav-login-btn');
  const navPerfilNombre   = document.getElementById('nav-perfil-nombre');
  const perfilOverlay     = document.getElementById('perfil-usuario-overlay');
  const perfilCerrarBtn   = document.getElementById('perfil-usuario-cerrar');
  const perfilCancelarBtn = document.getElementById('perfil-usuario-cancelar');
  const perfilForm        = document.getElementById('perfil-usuario-form');
  const perfilAvatar      = document.getElementById('perfil-usuario-avatar');
  const perfilNombreDisp  = document.getElementById('perfil-usuario-nombre-display');
  const perfilRolDisp     = document.getElementById('perfil-usuario-rol-display');
  const perfilEmailDisp   = document.getElementById('perfil-usuario-email-display');
  const perfilError       = document.getElementById('perfil-error');
  const perfilSuccess     = document.getElementById('perfil-success');

  function abrirPerfilUsuario() {
    const user = cargarUsuario();
    if (!user) return;
    const rolesLabel = { profesor: 'Profesor', tecnico: 'Técnico', padre: 'Familiar', alumno: 'Alumno' };
    document.getElementById('perfil-nombre').value        = user.nombre || '';
    document.getElementById('perfil-email').value         = user.email  || '';
    document.getElementById('perfil-pwd-actual').value    = '';
    document.getElementById('perfil-pwd-nueva').value     = '';
    document.getElementById('perfil-pwd-confirmar').value = '';
    if (perfilNombreDisp) perfilNombreDisp.textContent = user.nombre;
    if (perfilRolDisp)    perfilRolDisp.textContent    = rolesLabel[user.rol] || user.rol || '';
    if (perfilEmailDisp)  perfilEmailDisp.textContent  = user.email || '';
    if (perfilAvatar && window.Avatar) {
      perfilAvatar.innerHTML = `<img src="${Avatar.svg(user.nombre, 72)}" alt="Avatar" style="border-radius:50%;width:72px;height:72px;">`;
    }
    if (perfilError)   perfilError.style.display   = 'none';
    if (perfilSuccess) perfilSuccess.style.display = 'none';
    perfilOverlay?.classList.remove('hidden');
  }

  function cerrarPerfilUsuario() { perfilOverlay?.classList.add('hidden'); }

  navPerfilBtn?.addEventListener('click',    e => { e.preventDefault(); abrirPerfilUsuario(); });
  perfilCerrarBtn?.addEventListener('click',   cerrarPerfilUsuario);
  perfilCancelarBtn?.addEventListener('click', cerrarPerfilUsuario);
  perfilOverlay?.addEventListener('click', e => { if (e.target === perfilOverlay) cerrarPerfilUsuario(); });

  document.getElementById('perfil-usuario-logout')?.addEventListener('click', () => {
    cerrarPerfilUsuario();
    borrarSesion();
    userInfo?.classList.add('hidden');
    mostrarLogin();
    resetearPermisos();
    navLoginBtn?.classList.remove('hidden');
    navPerfilBtn?.classList.add('hidden');
    showSection('inicio');
  });

  perfilForm?.addEventListener('submit', async e => {
    e.preventDefault();
    if (perfilError)   perfilError.style.display   = 'none';
    if (perfilSuccess) perfilSuccess.style.display = 'none';
    const nombre     = document.getElementById('perfil-nombre').value.trim();
    const email      = document.getElementById('perfil-email').value.trim();
    const pwdActual  = document.getElementById('perfil-pwd-actual').value;
    const pwdNueva   = document.getElementById('perfil-pwd-nueva').value;
    const pwdConfirm = document.getElementById('perfil-pwd-confirmar').value;
    if (!nombre || !email) { if (perfilError) { perfilError.textContent = 'El nombre y el correo son obligatorios.'; perfilError.style.display = 'block'; } return; }
    if (pwdNueva && pwdNueva !== pwdConfirm) { if (perfilError) { perfilError.textContent = 'Las contraseñas nuevas no coinciden.'; perfilError.style.display = 'block'; } return; }
    if (pwdNueva && pwdNueva.length < 8) { if (perfilError) { perfilError.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.'; perfilError.style.display = 'block'; } return; }
    try {
      const payload = { nombre, email };
      if (pwdNueva) { payload.password_actual = pwdActual; payload.password = pwdNueva; }
      await Api.actualizarPerfil(payload);
      const user = cargarUsuario();
      user.nombre = nombre; user.email = email;
      localStorage.setItem('evin_user', JSON.stringify(user));
      if (navPerfilNombre)  navPerfilNombre.textContent  = nombre;
      if (userNameSpan)     userNameSpan.textContent     = nombre;
      if (perfilNombreDisp) perfilNombreDisp.textContent = nombre;
      if (perfilAvatar && window.Avatar) {
        perfilAvatar.innerHTML = `<img src="${Avatar.svg(nombre, 72)}" alt="Avatar" style="border-radius:50%;width:72px;height:72px;">`;
      }
      if (perfilSuccess) { perfilSuccess.textContent = '¡Perfil actualizado correctamente!'; perfilSuccess.style.display = 'block'; }
    } catch (err) {
      if (perfilError) { perfilError.textContent = err.message || 'Error al guardar los cambios.'; perfilError.style.display = 'block'; }
    }
  });

  // ── Validación contraseña ─────────────────────────────────────────────────

  function evaluarPassword(pwd) {
    let p = 0;
    if (pwd.length >= 8)          p++;
    if (/[A-Z]/.test(pwd))        p++;
    if (/[0-9]/.test(pwd))        p++;
    if (/[^A-Za-z0-9]/.test(pwd)) p++;
    return p;
  }

  function actualizarBarraFortaleza(pwd) {
    if (!strengthBar) return;
    const p = evaluarPassword(pwd);
    const spans  = strengthBar.querySelectorAll('span');
    const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    const colors = ['', '#e63946', '#f4a261', '#2a9d8f', '#2ecc71'];
    spans.forEach((s, i) => { s.style.background = i < p ? colors[p] : '#ddd'; });
    if (strengthLabel) { strengthLabel.textContent = pwd.length ? labels[p] : ''; strengthLabel.style.color = colors[p]; }
  }

  function passwordEsSegura(pwd) {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);
  }

  document.getElementById('register-password')?.addEventListener('input', e => actualizarBarraFortaleza(e.target.value));

  categorySelect?.addEventListener('change', () => {
    if (categorySelect.value === 'alumno') {
      alumnoExtra?.classList.remove('hidden');
      document.getElementById('register-alumno-nombre').required = true;
    } else {
      alumnoExtra?.classList.add('hidden');
      document.getElementById('register-alumno-nombre').required = false;
    }
  });

  // ── Login ─────────────────────────────────────────────────────────────────

  loginForm?.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    ocultarError(loginError);
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) { mostrarError(loginError, 'Por favor, rellena todos los campos.'); return; }
    try {
      const data = await Api.login(email, password);
      guardarSesion(data.token, data.user);
      actualizarUIUsuario(data.user);
      aplicarPermisosPorRol(data.user);
      showSection('inicio');
    } catch (err) { mostrarError(loginError, 'Correo o contraseña incorrectos. Inténtalo de nuevo.'); }
  });

  // ── Registro ──────────────────────────────────────────────────────────────

  registerForm?.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    ocultarError(registerError);
    const nombre   = document.getElementById('register-name').value.trim();
    const email    = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm  = document.getElementById('register-password-confirm').value;
    const role     = document.getElementById('register-category').value;
    const curso    = document.getElementById('register-alumno-curso')?.value.trim() || '';
    if (!nombre || !email || !password || !role) { mostrarError(registerError, 'Por favor, rellena todos los campos obligatorios.'); return; }
    if (role === 'alumno' && !curso) { mostrarError(registerError, 'El curso es obligatorio para alumnos.'); return; }
    if (!passwordEsSegura(password)) { mostrarError(registerError, 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.'); return; }
    if (password !== confirm) { mostrarError(registerError, 'Las contraseñas no coinciden.'); return; }
    try {
      const data = await Api.register(nombre, email, password, role, curso);
      guardarSesion(data.token, data.user);
      actualizarUIUsuario(data.user);
      aplicarPermisosPorRol(data.user);
      showSection('inicio');
    } catch (err) { mostrarError(registerError, err.message || 'Error al crear la cuenta. Inténtalo de nuevo.'); }
  });

  // ── Recuperar contraseña ──────────────────────────────────────────────────

  forgotForm?.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    ocultarError(forgotError);
    if (forgotSuccess) forgotSuccess.style.display = 'none';
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) { mostrarError(forgotError, 'Introduce tu correo electrónico.'); return; }
    try { await Api.forgotPassword(email); } catch (_) {}
    finally {
      if (forgotSuccess) { forgotSuccess.textContent = 'Si ese correo está registrado, recibirás un enlace en breve.'; forgotSuccess.style.display = 'block'; }
      document.getElementById('forgot-email').value = '';
    }
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  logoutBtn?.addEventListener('click', () => {
    borrarSesion();
    userInfo?.classList.add('hidden');
    mostrarLogin();
    resetearPermisos();
    showSection('inicio');
    navLoginBtn?.classList.remove('hidden');
    navPerfilBtn?.classList.add('hidden');
  });

  // ── Navegación con control de acceso ─────────────────────────────────────

  menuButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = btn.getAttribute('href').slice(1);
      const user   = cargarUsuario();
      if (!user && (target === 'juegos' || target === 'alumnos' || target === 'dashboard')) {
        showSection('usuario'); mostrarLogin(); return;
      }
      if (user) {
        const rol      = user.rol || user.role || '';
        const esGestor = rol === 'profesor' || rol === 'tecnico';
        if (!esGestor && (target === 'alumnos' || target === 'dashboard')) { showSection('inicio'); return; }
      }
      showSection(target);
      if (target === 'alumnos' && window.__vueAlumnos) window.__vueAlumnos.cargarAlumnos();
    });
  });

  // ── Iniciar en sección inicio ────────────────────────────────────────────
  showSection('inicio');

  // ── SVGs para tarjetas de juego ───────────────────────────────────────────

  const svgJuegos = {
    memoria: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="5"  y="5"  width="50" height="50" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <rect x="65" y="5"  width="50" height="50" rx="8" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <rect x="5"  y="65" width="50" height="50" rx="8" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <rect x="65" y="65" width="50" height="50" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <text x="90" y="48" text-anchor="middle" font-size="24">🐶</text>
      <text x="30" y="108" text-anchor="middle" font-size="24">🐶</text>
      <text x="30" y="38" text-anchor="middle" font-size="20" fill="rgba(255,255,255,0.6)" font-weight="700">?</text>
      <text x="90" y="108" text-anchor="middle" font-size="20" fill="rgba(255,255,255,0.6)" font-weight="700">?</text>
      <circle cx="90" cy="90" r="12" fill="#2ecc71"/>
      <text x="90" y="95" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">✓</text>
    </svg>`,

    grid: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="5"  y="5"  width="34" height="34" rx="6" fill="#ffb703"/>
      <rect x="43" y="5"  width="34" height="34" rx="6" fill="rgba(255,255,255,0.15)"/>
      <rect x="81" y="5"  width="34" height="34" rx="6" fill="#ffb703"/>
      <rect x="5"  y="43" width="34" height="34" rx="6" fill="rgba(255,255,255,0.15)"/>
      <rect x="43" y="43" width="34" height="34" rx="6" fill="#ffb703"/>
      <rect x="81" y="43" width="34" height="34" rx="6" fill="rgba(255,255,255,0.15)"/>
      <rect x="5"  y="81" width="34" height="34" rx="6" fill="rgba(255,255,255,0.15)"/>
      <rect x="43" y="81" width="34" height="34" rx="6" fill="rgba(255,255,255,0.15)"/>
      <rect x="81" y="81" width="34" height="34" rx="6" fill="#ffb703"/>
    </svg>`,

    radar: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="12" fill="rgba(255,255,255,0.2)"/>
      <rect   x="38" y="8"  width="24" height="24" rx="4" fill="rgba(255,255,255,0.2)"/>
      <circle cx="80" cy="20" r="12" fill="rgba(255,255,255,0.2)"/>
      <polygon points="108,8 120,32 96,32" fill="rgba(255,255,255,0.2)"/>
      <circle cx="20" cy="60" r="12" fill="rgba(255,255,255,0.2)"/>
      <polygon points="60,48 72,72 48,72" fill="#f4d35e" stroke="#fff" stroke-width="2"/>
      <circle cx="100" cy="60" r="12" fill="rgba(255,255,255,0.2)"/>
      <rect   x="8"  y="88" width="24" height="24" rx="4" fill="rgba(255,255,255,0.2)"/>
      <circle cx="60" cy="100" r="12" fill="rgba(255,255,255,0.2)"/>
      <circle cx="100" cy="100" r="12" fill="rgba(255,255,255,0.2)"/>
      <circle cx="60" cy="60" r="18" fill="none" stroke="#f4d35e" stroke-width="2.5" stroke-dasharray="5 3" opacity="0.9"/>
    </svg>`,

    diferencias: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="15" width="54" height="90" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <circle cx="29" cy="45" r="12" fill="#4361ee" opacity="0.9"/>
      <rect   x="10" y="62" width="38" height="12" rx="3" fill="#f4a261" opacity="0.9"/>
      <polygon points="29,82 41,103 17,103" fill="#2ecc71" opacity="0.9"/>
      <rect x="64" y="15" width="54" height="90" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <circle cx="91" cy="45" r="12" fill="#e63946" opacity="0.9"/>
      <rect   x="72" y="62" width="38" height="12" rx="3" fill="#f4a261" opacity="0.9"/>
      <polygon points="91,75 103,103 79,103" fill="#2ecc71" opacity="0.9"/>
      <circle cx="91" cy="45" r="16" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 2" opacity="0.85"/>
      <circle cx="103" cy="33" r="7" fill="#2ecc71"/>
      <text x="103" y="37" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">✓</text>
    </svg>`,

    rasgos: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="60,8 72,40 106,40 80,60 90,92 60,72 30,92 40,60 14,40 48,40" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="8 4"/>
      <polygon points="60,8 72,40 106,40 80,60 90,92 60,72 30,92 40,60 14,40 48,40" fill="rgba(255,255,255,0.15)"/>
      <text x="60" y="115" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)" font-weight="600">¿Cuál es completa?</text>
    </svg>`,

    puzzle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="5"  y="5"  width="50" height="50" rx="6" fill="rgba(255,255,255,0.8)"/>
      <rect x="65" y="5"  width="50" height="50" rx="6" fill="#2ecc71" opacity="0.8"/>
      <rect x="5"  y="65" width="50" height="50" rx="6" fill="#4361ee" opacity="0.8"/>
      <rect x="65" y="65" width="50" height="50" rx="6" fill="rgba(255,255,255,0.15)" stroke="#fff" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="90" y="100" text-anchor="middle" font-size="28">🧩</text>
      <path d="M 55 30 Q 60 20 65 30" stroke="#00897b" stroke-width="4" fill="rgba(0,137,123,0.3)"/>
      <path d="M 90 55 Q 100 60 90 65" stroke="#00897b" stroke-width="4" fill="rgba(0,137,123,0.3)"/>
    </svg>`
  };

  // ── Vue: listado de juegos ────────────────────────────────────────────────

  const { createApp: createAppJuegos } = Vue;

  createAppJuegos({
    data() {
      return { busqueda: '', filtroNivel: '', filtroTipo: '', juegos: [], cargando: true, error: null };
    },

    async mounted() {
      try { this.juegos = await Api.getJuegos(); }
      catch (e) { this.error = 'No se pudieron cargar los juegos.'; }
      finally { this.cargando = false; }
    },

    computed: {
      juegosFiltrados() {
        const q = this.busqueda.toLowerCase();
        return this.juegos.filter(j => {
          const texto = [j.nombre, j.descripcion, j.nivel, j.tipo].join(' ').toLowerCase().includes(q);
          const nivel = !this.filtroNivel || j.nivel === this.filtroNivel;
          const tipo  = !this.filtroTipo  || j.tipo  === this.filtroTipo;
          return texto && nivel && tipo;
        });
      }
    },

    methods: {
      headerJuego(juego) {
        const mapa = {
          'Encuentra las parejas':     { grad: 'juego-grad-memoria',     svg: svgJuegos.memoria },
          'Recuerda las casillas':     { grad: 'juego-grad-grid',        svg: svgJuegos.grid },
          'Radar visual':              { grad: 'juego-grad-radar',       svg: svgJuegos.radar },
          'Encuentra las diferencias': { grad: 'juego-grad-diferencias', svg: svgJuegos.diferencias },
          'Rasgos Críticos':           { grad: 'juego-grad-rasgos',      svg: svgJuegos.rasgos },
          'Puzzle':                    { grad: 'juego-grad-puzzle',      svg: svgJuegos.puzzle }
        };
        return mapa[juego.nombre] || { grad: 'juego-grad-default', svg: '<svg viewBox="0 0 120 120"><text x="60" y="70" text-anchor="middle" font-size="50">🎮</text></svg>' };
      },

      verDetalles(juego) { showModal(juego.nombre, juego.descripcion); },

      jugar(juego) {
        const mapa = {
          'Encuentra las parejas':     'juego-memoria',
          'Recuerda las casillas':     'juego-grid',
          'Radar visual':              'juego-radar',
          'Encuentra las diferencias': 'juego-diferencias',
          'Rasgos críticos':           'juego-rasgos',
          'Puzzle':                    'juego-puzzle'
        };

        const seccionId = mapa[juego.nombre];
        if (!seccionId) { showModal(juego.nombre, 'Este juego todavía está en desarrollo.'); return; }

        // Mostrar sección del juego
        showSection(seccionId);

        // Iniciar el juego
        if (seccionId === 'juego-memoria'     && typeof crearCartasMemoria === 'function') crearCartasMemoria();
        if (seccionId === 'juego-grid'        && typeof crearTableroGrid   === 'function') crearTableroGrid();
        if (seccionId === 'juego-radar'       && typeof iniciarRadarVisual === 'function') iniciarRadarVisual();
        if (seccionId === 'juego-diferencias' && typeof iniciarDiferencias === 'function') iniciarDiferencias();
        if (seccionId === 'juego-rasgos'      && typeof iniciarRasgos      === 'function') iniciarRasgos();
        if (seccionId === 'juego-puzzle'      && typeof iniciarPuzzle      === 'function') iniciarPuzzle();

        // Solicitar pantalla completa — debe ir después del init para que el DOM esté listo
        try {
          const seccionEl = document.getElementById(seccionId);
	  if (seccionEl) {
  		if (seccionEl.requestFullscreen) seccionEl.requestFullscreen();
  		else if (seccionEl.webkitRequestFullscreen) seccionEl.webkitRequestFullscreen();
	  }	
        } catch(e) {}
      }
    }
  }).mount('#app-juegos');

  // ── Vue: listado de alumnos ───────────────────────────────────────────────

  const { createApp: createAppAlumnos } = Vue;

  const _alumnosApp = createAppAlumnos({
    data() {
      return {
        busqueda: '', alumnos: [], cargando: true, error: null,
        modalVisible: false, modoModal: 'nuevo', modalError: null, alumnoEditando: null,
        form: { nombre: '', edad: '', curso: '', dificultad: 'Fácil', progreso: 0 },
        perfilVisible: false, perfilAlumno: null, perfilSesiones: [], perfilCargando: false,
        perfilEstadisticas: null
      };
    },

    computed: {
      alumnosFiltrados() {
        const q = this.busqueda.toLowerCase();
        return this.alumnos.filter(a => [a.nombre, a.dificultad, a.curso].join(' ').toLowerCase().includes(q));
      },
      puedeGestionar() {
        const user = cargarUsuario();
        return user && (user.rol === 'profesor' || user.rol === 'tecnico');
      },
      perfilStats() {
        if (!this.perfilEstadisticas) return null;
        return this.perfilEstadisticas;
      },
      perfilGrafico() { return [...this.perfilSesiones].slice(0, 10).reverse(); },
      tendenciaIcono() {
        const t = this.perfilEstadisticas?.tendencia;
        if (t === 'mejorando')  return { icono: '📈', texto: 'Mejorando',           clase: 'tendencia-bien' };
        if (t === 'empeorando') return { icono: '📉', texto: 'Necesita atención',   clase: 'tendencia-mal' };
        if (t === 'estable')    return { icono: '➡️',  texto: 'Estable',             clase: 'tendencia-neutral' };
        return                         { icono: '📊', texto: 'Sin datos suficientes', clase: 'tendencia-neutral' };
      }
    },

    async mounted() { await this.cargarAlumnos(); },

    methods: {
      avatarSvg(nombre)       { return window.Avatar ? window.Avatar.svg(nombre || '?', 60) : ''; },
      avatarSvgGrande(nombre) { return window.Avatar ? window.Avatar.svg(nombre || '?', 72) : ''; },

      async cargarAlumnos() {
        this.cargando = true; this.error = null;
        try { this.alumnos = await Api.getAlumnos(); }
        catch (e) { this.error = 'No se pudieron cargar los alumnos. ¿Estás logueado?'; }
        finally { this.cargando = false; }
      },

      async verPerfil(alumno) {
        this.perfilAlumno      = alumno;
        this.perfilSesiones    = [];
        this.perfilEstadisticas = null;
        this.perfilCargando    = true;
        this.perfilVisible     = true;
        try {
          const [sesiones, estadisticas] = await Promise.all([
            Api.getSesiones({ alumno_id: alumno.id }),
            Api.getEstadisticas(alumno.id)
          ]);
          this.perfilSesiones    = sesiones;
          this.perfilEstadisticas = estadisticas;
        } catch (e) {
          this.perfilSesiones    = [];
          this.perfilEstadisticas = null;
        } finally {
          this.perfilCargando = false;
        }
      },

      cerrarPerfil() { this.perfilVisible = false; this.perfilAlumno = null; },

      colorBarra(pct) { return pct >= 70 ? '#2ecc71' : pct >= 40 ? '#f4a261' : '#e63946'; },
      clasePct(pct)   { return pct >= 70 ? 'pct-alto' : pct >= 40 ? 'pct-medio' : 'pct-bajo'; },
      formatFecha(f)  { if (!f) return '—'; return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }); },

      abrirModalNuevo() {
        this.modoModal = 'nuevo'; this.alumnoEditando = null; this.modalError = null;
        this.form = { nombre: '', edad: '', curso: '', dificultad: 'Fácil', progreso: 0 };
        this.modalVisible = true;
      },

      abrirModalEditar(alumno) {
        this.modoModal = 'editar'; this.alumnoEditando = alumno; this.modalError = null;
        this.form = { nombre: alumno.nombre, edad: alumno.edad, curso: alumno.curso, dificultad: alumno.dificultad || 'Fácil', progreso: alumno.progreso || 0 };
        this.modalVisible = true;
      },

      cerrarModal() { this.modalVisible = false; this.modalError = null; },

      async guardarAlumno() {
        this.modalError = null;
        if (!this.form.nombre.trim()) { this.modalError = 'El nombre es obligatorio.'; return; }
        try {
          if (this.modoModal === 'nuevo') {
            const nuevo = await Api.crearAlumno(this.form);
            this.alumnos.push(nuevo);
          } else {
            const actualizado = await Api.actualizarAlumno(this.alumnoEditando.id, this.form);
            const idx = this.alumnos.findIndex(a => a.id === this.alumnoEditando.id);
            if (idx !== -1) this.alumnos.splice(idx, 1, actualizado);
          }
          this.cerrarModal();
        } catch (e) { this.modalError = e.message || 'Error al guardar el alumno.'; }
      },

      async confirmarEliminar(alumno) {
        if (!confirm(`¿Seguro que quieres eliminar a ${alumno.nombre}?`)) return;
        try {
          await Api.eliminarAlumno(alumno.id);
          this.alumnos = this.alumnos.filter(a => a.id !== alumno.id);
        } catch (e) { alert('Error al eliminar: ' + e.message); }
      },

      claseProgreso(valor) {
        if (valor >= 70) return 'progreso-alto';
        if (valor >= 40) return 'progreso-medio';
        return 'progreso-bajo';
      }
    }
  });

  window.__vueAlumnos = _alumnosApp.mount('#app-alumnos');

});
