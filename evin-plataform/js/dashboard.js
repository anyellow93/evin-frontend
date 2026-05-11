// js/dashboard.js
// Vue app del dashboard — añadir como <script> después de main.js

document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;

  createApp({
    data() {
      return {
        alumnos:   [],
        sesiones:  [],
        cargando:  true,
        error:     null
      };
    },

    computed: {
      totalAlumnos() {
        return this.alumnos.length;
      },

      totalSesiones() {
        return this.sesiones.length;
      },

      sesionesHoy() {
        const hoy = new Date().toISOString().slice(0, 10);
        return this.sesiones.filter(s => s.fecha === hoy).length;
      },

      mediaGlobal() {
        if (!this.sesiones.length) return 0;
        const suma = this.sesiones.reduce((acc, s) => acc + (s.porcentaje || 0), 0);
        return Math.round(suma / this.sesiones.length);
      },

      rankingAlumnos() {
        return [...this.alumnos]
          .sort((a, b) => (b.progreso || 0) - (a.progreso || 0))
          .slice(0, 8);
      },

      sesionesRecientes() {
        return this.sesiones.slice(0, 10);
      },

      alumnosAtencion() {
        return this.alumnos.filter(a => (a.progreso || 0) < 40);
      }
    },

    async mounted() {
      await this.cargarDatos();
    },

    methods: {
      async cargarDatos() {
        this.cargando = true;
        this.error    = null;
        try {
          const [alumnos, sesiones] = await Promise.all([
            Api.getAlumnos(),
            Api.getSesiones()
          ]);
          this.alumnos  = alumnos;
          this.sesiones = sesiones;
        } catch (e) {
          this.error = 'No se pudieron cargar los datos. ¿Estás logueado?';
        } finally {
          this.cargando = false;
        }
      },

      colorProgreso(pct) {
        if (pct >= 70) return '#2ecc71';
        if (pct >= 40) return '#f4a261';
        return '#e63946';
      },

      posClass(i) {
        if (i === 0) return 'pos-oro';
        if (i === 1) return 'pos-plata';
        if (i === 2) return 'pos-bronce';
        return 'pos-normal';
      },

      clasePct(pct) {
        if (pct >= 70) return 'pct-alto';
        if (pct >= 40) return 'pct-medio';
        return 'pct-bajo';
      },

      formatFecha(fecha) {
        if (!fecha) return '—';
        return new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit', month: '2-digit', year: '2-digit'
        });
      }
    }
  }).mount('#app-dashboard');
});
