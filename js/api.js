// js/api.js
// Centraliza todas las llamadas al backend EVIN
// Todos los métodos devuelven una Promise

const API_URL = 'https://evin.click/api/v1';

const Api = {

  // ── Helpers internos ───────────────────────────────────────────────────────

  _headers() {
    const token = localStorage.getItem('evin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

 async _fetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: this._headers()
  });
  const data = await response.json();
  if (!response.ok) {
    // Sesión expirada — solo si había token guardado
    if (response.status === 401 && localStorage.getItem('evin_token')) {
      localStorage.removeItem('evin_token');
      localStorage.removeItem('evin_user');
      if (typeof showModal === 'function') {
        showModal('Sesión expirada', 'Tu sesión ha caducado. Por favor, inicia sesión de nuevo.');
      }
      if (typeof showSection === 'function') showSection('usuario');
      document.getElementById('nav-login-btn')?.classList.remove('hidden');
      document.getElementById('nav-perfil-btn')?.classList.add('hidden');
      if (typeof resetearPermisos === 'function') resetearPermisos();
    }
    const mensaje = data.error || (data.errors && data.errors.join(', ')) || 'Error desconocido';
    throw new Error(mensaje);
  }
  return data;
 },

  // ── Autenticación ──────────────────────────────────────────────────────────

  login(email, password) {
    return this._fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register(nombre, email, password, role = 'alumno', curso = '') {
    return this._fetch('/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password, role, curso })
    });
  },

  me() {
    return this._fetch('/me');
  },
  
 

  forgotPassword(email) {
    return this._fetch('/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
 },

  resetPassword(token, password) {
    return this._fetch('/password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  },

  // ── Juegos ─────────────────────────────────────────────────────────────────

  getJuegos() {
    return this._fetch('/juegos');
  },

  // ── Alumnos ────────────────────────────────────────────────────────────────

  getAlumnos() {
    return this._fetch('/alumnos');
  },

  getAlumno(id) {
    return this._fetch(`/alumnos/${id}`);
  },

  crearAlumno(datos) {
    return this._fetch('/alumnos', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
  },

  actualizarAlumno(id, datos) {
    return this._fetch(`/alumnos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos)
    });
  },

  eliminarAlumno(id) {
    return this._fetch(`/alumnos/${id}`, {
      method: 'DELETE'
    });
  },
  
  getDashboard() {
  return this._fetch('/dashboard');
  },
  
  getEstadisticas(id) {
  return this._fetch(`/alumnos/${id}/estadisticas`);
  },
  
  actualizarPerfil(datos) {
  return this._fetch('/me', {
    method: 'PATCH',
    body: JSON.stringify(datos)
  });
 },

  // ── Sesiones ───────────────────────────────────────────────────────────────

  getSesiones(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const path = params ? `/sesiones?${params}` : '/sesiones';
    return this._fetch(path);
  },

  crearSesion(alumno, juego, aciertos, intentos, alumno_id = null) {
    return this._fetch('/sesiones', {
      method: 'POST',
      body: JSON.stringify({ alumno, alumno_id, juego, aciertos, intentos })
    });
  },

  // ── Administración de usuarios (solo rol "tecnico") ───────────────────────

  getUsuarios() {
    return this._fetch('/users');
  },

  actualizarRolUsuario(id, rol) {
    return this._fetch(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ rol })
    });
  }
};
