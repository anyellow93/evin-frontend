// js/admin.js
// Sección de administración: solo el rol "tecnico" (admin de EVIN) puede
// entrar aquí y cambiar el rol de otras cuentas. La visibilidad del enlace
// de navegación y el guard de acceso viven en roles.js / main.js; este
// archivo solo se ocupa de cargar y actualizar la lista de usuarios.
document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;

  const app = createApp({
    data() {
      return {
        usuarios:   [],
        busqueda:   '',
        cargando:   true,
        error:      null,
        mensaje:    null,
        guardandoId: null
      };
    },

    computed: {
      usuariosFiltrados() {
        const q = this.busqueda.trim().toLowerCase();
        if (!q) return this.usuarios;
        return this.usuarios.filter(u =>
          [u.nombre, u.email].join(' ').toLowerCase().includes(q)
        );
      }
    },

    async mounted() {
      const token = localStorage.getItem('evin_token');
      if (!token) { this.cargando = false; return; }
      await this.cargarUsuarios();
    },

    methods: {
      etiquetaRol(rol) {
        const etiquetas = { profesor: 'Profesor', tecnico: 'Técnico', padre: 'Familiar', alumno: 'Alumno' };
        return etiquetas[rol] || rol;
      },

      async cargarUsuarios() {
        this.cargando = true;
        this.error    = null;
        try {
          this.usuarios = await Api.getUsuarios();
        } catch (e) {
          this.error = e.message || 'No se pudo cargar la lista de usuarios. ¿Tienes permisos de administrador?';
        } finally {
          this.cargando = false;
        }
      },

      async cambiarRol(usuario, nuevoRol) {
        if (nuevoRol === usuario.rol) return;
        const etiqueta = this.etiquetaRol(nuevoRol);
        if (!confirm(`¿Cambiar el rol de ${usuario.nombre} a "${etiqueta}"?`)) {
          return; // el <select> se re-renderiza con el valor real de usuario.rol
        }
        this.mensaje = null;
        this.error   = null;
        this.guardandoId = usuario.id;
        try {
          const actualizado = await Api.actualizarRolUsuario(usuario.id, nuevoRol);
          const idx = this.usuarios.findIndex(u => u.id === usuario.id);
          if (idx !== -1) this.usuarios.splice(idx, 1, actualizado);
          this.mensaje = `Rol de ${actualizado.nombre} actualizado a "${this.etiquetaRol(actualizado.rol)}".`;
        } catch (e) {
          this.error = e.message || 'No se pudo actualizar el rol.';
        } finally {
          this.guardandoId = null;
        }
      }
    }
  });

  window.__vueAdmin = app.mount('#app-admin');
});
