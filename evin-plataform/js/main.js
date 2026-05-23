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

  modal.querySelector('#closeModal').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.add('hidden');
  });

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

  // ── Helpers de error ──────────────────────────────────────────────────────

  function mostrarError(el, mensaje) {
    if (!el) return;
    el.textContent   = mensaje;
    el.style.display = 'block';
  }

  function ocultarError(el) {
    if (!el) return;
    el.style.display = 'none';
  }

  // ── Helpers de navegación entre formularios ───────────────────────────────

  function mostrarLogin() {
    loginForm?.classList.remove('hidden');
    registerForm?.classList.add('hidden');
    forgotForm?.classList.add('hidden');
  }

  function mostrarRegister() {
    loginForm?.classList.add('hidden');
    registerForm?.classList.remove('hidden');
    forgotForm?.classList.add('hidden');
  }

  function mostrarForgot() {
    loginForm?.classList.add('hidden');
    registerForm?.classList.add('hidden');
    forgotForm?.classList.remove('hidden');
  }

  showRegister?.addEventListener('click',    e => { e.preventDefault(); mostrarRegister(); });
  showLogin?.addEventListener('click',       e => { e.preventDefault(); mostrarLogin(); });
  showForgot?.addEventListener('click',      e => { e.preventDefault(); mostrarForgot(); });
  showLoginForgot?.addEventListener('click', e => { e.preventDefault(); mostrarLogin(); });

  // ── Permisos por rol ──────────────────────────────────────────────────────
  // Controla qué secciones y botones del nav son visibles según el rol

  function aplicarPermisosPorRol(user) {
    const rol = user?.rol || user?.role || '';

    // Botones del nav por id del href
    const btnAlumnos    = document.querySelector('.menu-btn[href="#alumnos"]');
    const btnDashboard  = document.querySelector('.menu-btn[href="#dashboard"]');
    const btnJuegos     = document.querySelector('.menu-btn[href="#juegos"]');

    // Roles que pueden ver alumnos y dashboard
    const esGestor = rol === 'profesor' || rol === 'tecnico';

    // Alumnos: solo profesor y técnico
    if (btnAlumnos) {
      btnAlumnos.style.display = esGestor ? '' : 'none';
    }

    // Dashboard: solo profesor y técnico
    if (btnDashboard) {
      btnDashboard.style.display = esGestor ? '' : 'none';
    }

    // Juegos: todos los roles pueden jugar
    if (btnJuegos) {
      btnJuegos.style.display = '';
    }

    // Si el usuario es alumno o padre y está en una sección restringida, redirigir a inicio
    if (!esGestor) {
      const seccionActual = [...sections].find(s => !s.classList.contains('hidden'));
      if (seccionActual && (seccionActual.id === 'alumnos' || seccionActual.id === 'dashboard')) {
        showSection('inicio');
      }
    }
  }

  function resetearPermisos() {
    // Al cerrar sesión, mostrar todos los botones del nav
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.style.display = '';
    });
  }

  // Exponer para uso externo si hace falta
  window.aplicarPermisosPorRol = aplicarPermisosPorRol;
  window.resetearPermisos      = resetearPermisos;

  // ── Restaurar sesión al cargar la página ─────────────────────────────────

  const savedUser = cargarUsuario();
  if (savedUser) {
    actualizarUIUsuario(savedUser);
    aplicarPermisosPorRol(savedUser);
  }

  // ── Actualizar UI tras login/registro ────────────────────────────────────

  function actualizarUIUsuario(user) {
    const rolesLabel = {
      profesor: 'Profesor',
      tecnico:  'Técnico',
      padre:    'Familiar',
      alumno:   'Alumno'
    };

    userNameSpan.textContent = user.nombre;
    if (userRoleBadge) userRoleBadge.textContent = rolesLabel[user.rol] || user.rol || user.role;

    loginForm?.classList.add('hidden');
    registerForm?.classList.add('hidden');
    forgotForm?.classList.add('hidden');
    userInfo?.classList.remove('hidden');
  }

  // ── Validación de contraseña segura ──────────────────────────────────────

  function evaluarPassword(pwd) {
    let puntos = 0;
    if (pwd.length >= 8)          puntos++;
    if (/[A-Z]/.test(pwd))        puntos++;
    if (/[0-9]/.test(pwd))        puntos++;
    if (/[^A-Za-z0-9]/.test(pwd)) puntos++;
    return puntos;
  }

  function actualizarBarraFortaleza(pwd) {
    if (!strengthBar) return;
    const puntos = evaluarPassword(pwd);
    const spans  = strengthBar.querySelectorAll('span');
    const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    const colors = ['', '#e63946', '#f4a261', '#2a9d8f', '#2ecc71'];

    spans.forEach((span, i) => {
      span.style.background = i < puntos ? colors[puntos] : '#ddd';
    });

    if (strengthLabel) {
      strengthLabel.textContent = pwd.length ? labels[puntos] : '';
      strengthLabel.style.color = colors[puntos];
    }
  }

  function passwordEsSegura(pwd) {
    return pwd.length >= 8
      && /[A-Z]/.test(pwd)
      && /[0-9]/.test(pwd)
      && /[^A-Za-z0-9]/.test(pwd);
  }

  document.getElementById('register-password')
    ?.addEventListener('input', e => actualizarBarraFortaleza(e.target.value));

  // ── Mostrar campo alumno según rol ───────────────────────────────────────

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

    if (!email || !password) {
      mostrarError(loginError, 'Por favor, rellena todos los campos.');
      return;
    }

    try {
      const data = await Api.login(email, password);
      guardarSesion(data.token, data.user);
      actualizarUIUsuario(data.user);
      aplicarPermisosPorRol(data.user);
      showSection('inicio');
    } catch (err) {
      mostrarError(loginError, 'Correo o contraseña incorrectos. Inténtalo de nuevo.');
    }
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

    if (!nombre || !email || !password || !role) {
      mostrarError(registerError, 'Por favor, rellena todos los campos obligatorios.');
      return;
    }

    if (role === 'alumno' && !curso) {
      mostrarError(registerError, 'El curso es obligatorio para alumnos.');
      return;
    }

    if (!passwordEsSegura(password)) {
      mostrarError(registerError,
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.');
      return;
    }

    if (password !== confirm) {
      mostrarError(registerError, 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const data = await Api.register(nombre, email, password, role, curso);
      guardarSesion(data.token, data.user);
      actualizarUIUsuario(data.user);
      aplicarPermisosPorRol(data.user);
      showSection('inicio');
    } catch (err) {
      mostrarError(registerError, err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    }
  });

  // ── Recuperar contraseña ──────────────────────────────────────────────────

  forgotForm?.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    ocultarError(forgotError);
    if (forgotSuccess) forgotSuccess.style.display = 'none';

    const email = document.getElementById('forgot-email').value.trim();

    if (!email) {
      mostrarError(forgotError, 'Introduce tu correo electrónico.');
      return;
    }

    try {
      await Api.forgotPassword(email);
    } catch (_) {
      // Silenciamos el error intencionadamente por seguridad
    } finally {
      if (forgotSuccess) {
        forgotSuccess.textContent   = 'Si ese correo está registrado, recibirás un enlace en breve.';
        forgotSuccess.style.display = 'block';
      }
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
  });

  // ── Navegación con control de acceso ─────────────────────────────────────

  menuButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = btn.getAttribute('href').slice(1);
      const user   = cargarUsuario();

      // Sin sesión: solo inicio y usuario son accesibles
      if (!user && (target === 'juegos' || target === 'alumnos' || target === 'dashboard')) {
        showSection('usuario');
        mostrarLogin();
        return;
      }

      // Con sesión: verificar permisos por rol
      if (user) {
        const rol      = user.rol || user.role || '';
        const esGestor = rol === 'profesor' || rol === 'tecnico';

        if (!esGestor && (target === 'alumnos' || target === 'dashboard')) {
          showSection('inicio');
          return;
        }
      }

      showSection(target);

      // Recargar alumnos al navegar a la sección
      if (target === 'alumnos' && window.__vueAlumnos) {
        window.__vueAlumnos.cargarAlumnos();
      }
    });
  });

  // ── Parámetros de URL (modo juego standalone) ─────────────────────────────

  const params     = new URLSearchParams(window.location.search);
  const juegoParam = params.get('juego');

  if (juegoParam) {
    document.body.classList.add('solo-juego');
  }

  if (juegoParam === 'memoria') {
    showSection('juego-memoria');
    if (typeof crearCartasMemoria === 'function') crearCartasMemoria();
  } else if (juegoParam === 'grid') {
    showSection('juego-grid');
    if (typeof crearTableroGrid === 'function') crearTableroGrid();
  } else if (juegoParam === 'radar') {
    showSection('juego-radar');
    if (typeof iniciarRadarVisual === 'function') iniciarRadarVisual();
  } else if (juegoParam === 'diferencias') {
    showSection('juego-diferencias');
    if (typeof iniciarDiferencias === 'function') iniciarDiferencias();
  } else if (!juegoParam) {
    showSection('inicio');
  }

  // ── Vue: listado de juegos ────────────────────────────────────────────────

  const { createApp: createAppJuegos } = Vue;

  createAppJuegos({
    data() {
      return {
        busqueda:    '',
        filtroNivel: '',
        filtroTipo:  '',
        juegos:      [],
        cargando:    true,
        error:       null
      };
    },

    async mounted() {
      try {
        this.juegos = await Api.getJuegos();
      } catch (e) {
        this.error = 'No se pudieron cargar los juegos. Comprueba que el servidor está activo.';
      } finally {
        this.cargando = false;
      }
    },

    computed: {
      juegosFiltrados() {
        const q = this.busqueda.toLowerCase();
        return this.juegos.filter(j => {
          const texto = [j.nombre, j.descripcion, j.nivel, j.tipo]
                          .join(' ').toLowerCase().includes(q);
          const nivel = !this.filtroNivel || j.nivel === this.filtroNivel;
          const tipo  = !this.filtroTipo  || j.tipo  === this.filtroTipo;
          return texto && nivel && tipo;
        });
      }
    },

    methods: {
      verDetalles(juego) {
        showModal(juego.nombre, juego.descripcion);
      },

      jugar(juego) {
        const urlBase = window.location.origin + window.location.pathname;
        const p       = new URLSearchParams();

        const mapa = {
          'Encuentra las parejas':     'memoria',
          'Recuerda las casillas':     'grid',
          'Radar visual':              'radar',
          'Encuentra las diferencias': 'diferencias'
        };

        const clave = mapa[juego.nombre];
        if (!clave) {
          showModal(juego.nombre, 'Este juego todavía está en desarrollo.');
          return;
        }

        p.set('juego', clave);

        const user = cargarUsuario();
        if (user) p.set('usuario', encodeURIComponent(user.nombre));

        window.open(`${urlBase}?${p.toString()}`, '_blank');
      }
    }
  }).mount('#app-juegos');

  // ── Vue: listado de alumnos ───────────────────────────────────────────────

  const { createApp: createAppAlumnos } = Vue;

  const _alumnosApp = createAppAlumnos({
    data() {
      return {
        busqueda:       '',
        alumnos:        [],
        cargando:       true,
        error:          null,
        modalVisible:   false,
        modoModal:      'nuevo',
        modalError:     null,
        alumnoEditando: null,
        form: {
          nombre: '', edad: '', curso: '', dificultad: 'Fácil', progreso: 0
        },
        perfilVisible:  false,
        perfilAlumno:   null,
        perfilSesiones: [],
        perfilCargando: false
      };
    },

    computed: {
      alumnosFiltrados() {
        const q = this.busqueda.toLowerCase();
        return this.alumnos.filter(a =>
          [a.nombre, a.dificultad, a.curso].join(' ').toLowerCase().includes(q)
        );
      },

      puedeGestionar() {
        const user = cargarUsuario();
        return user && (user.rol === 'profesor' || user.rol === 'tecnico');
      },

      perfilStats() {
        if (!this.perfilSesiones.length) return null;
        const total    = this.perfilSesiones.length;
        const mediaAct = Math.round(
          this.perfilSesiones.reduce((s, x) => s + (x.porcentaje || 0), 0) / total
        );
        const juegos = [...new Set(this.perfilSesiones.map(s => s.juego))].length;
        const ultima = this.perfilSesiones[0]?.fecha || '—';
        return { total, mediaAct, juegos, ultima };
      },

      perfilGrafico() {
        return [...this.perfilSesiones].slice(0, 10).reverse();
      }
    },

    async mounted() {
      await this.cargarAlumnos();
    },

    methods: {
      async cargarAlumnos() {
        this.cargando = true;
        this.error    = null;
        try {
          this.alumnos = await Api.getAlumnos();
        } catch (e) {
          this.error = 'No se pudieron cargar los alumnos. ¿Estás logueado?';
        } finally {
          this.cargando = false;
        }
      },

      async verPerfil(alumno) {
        this.perfilAlumno   = alumno;
        this.perfilSesiones = [];
        this.perfilCargando = true;
        this.perfilVisible  = true;

        try {
          this.perfilSesiones = await Api.getSesiones({ alumno_id: alumno.id });
        } catch (e) {
          this.perfilSesiones = [];
        } finally {
          this.perfilCargando = false;
        }
      },

      cerrarPerfil() {
        this.perfilVisible = false;
        this.perfilAlumno  = null;
      },

      colorBarra(pct) {
        if (pct >= 70) return '#2ecc71';
        if (pct >= 40) return '#f4a261';
        return '#e63946';
      },

      clasePct(pct) {
        if (pct >= 70) return 'pct-alto';
        if (pct >= 40) return 'pct-medio';
        return 'pct-bajo';
      },

      formatFecha(fecha) {
        if (!fecha) return '—';
        return new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit', month: '2-digit'
        });
      },

      abrirModalNuevo() {
        this.modoModal      = 'nuevo';
        this.alumnoEditando = null;
        this.modalError     = null;
        this.form = { nombre: '', edad: '', curso: '', dificultad: 'Fácil', progreso: 0 };
        this.modalVisible   = true;
      },

      abrirModalEditar(alumno) {
        this.modoModal      = 'editar';
        this.alumnoEditando = alumno;
        this.modalError     = null;
        this.form = {
          nombre:     alumno.nombre,
          edad:       alumno.edad,
          curso:      alumno.curso,
          dificultad: alumno.dificultad || 'Fácil',
          progreso:   alumno.progreso || 0
        };
        this.modalVisible = true;
      },

      cerrarModal() {
        this.modalVisible = false;
        this.modalError   = null;
      },

      async guardarAlumno() {
        this.modalError = null;
        if (!this.form.nombre.trim()) {
          this.modalError = 'El nombre es obligatorio.';
          return;
        }
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
        } catch (e) {
          this.modalError = e.message || 'Error al guardar el alumno.';
        }
      },

      async confirmarEliminar(alumno) {
        if (!confirm(`¿Seguro que quieres eliminar a ${alumno.nombre}? Esta acción no se puede deshacer.`)) return;
        try {
          await Api.eliminarAlumno(alumno.id);
          this.alumnos = this.alumnos.filter(a => a.id !== alumno.id);
        } catch (e) {
          alert('Error al eliminar el alumno: ' + e.message);
        }
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
