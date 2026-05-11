// js/api.js
// Centraliza todas las llamadas al backend EVIN
// Todos los métodos devuelven una Promise

const API_URL = 'http://localhost:3001/api/v1';

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
      // Lanza un error con el mensaje del backend para mostrarlo en la UI
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

  register(nombre, email, password, role = 'profesor', curso = '') {
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
  }
};
