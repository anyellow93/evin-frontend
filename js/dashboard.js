// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;

  const app = createApp({
    data() {
      return {
        datos:    null,
        cargando: true,
        error:    null
      };
    },

    computed: {
      totalAlumnos()    { return this.datos?.total_alumnos      || 0; },
      totalSesiones()   { return this.datos?.total_sesiones     || 0; },
      sesionesHoy()     { return this.datos?.sesiones_hoy       || 0; },
      sesionesHoy2()    { return this.datos?.sesiones_semana    || 0; },
      activosHoy()      { return this.datos?.activos_semana     || []; },
      sinSesiones()     { return this.datos?.sin_sesiones       || []; },
      juegosPop()       { return this.datos?.juegos_populares   || []; },
      actividad()       { return this.datos?.actividad_reciente || []; },
      tendencias()      { return this.datos?.tendencias || { mejorando: 0, empeorando: 0, estable: 0 }; }
    },

    async mounted() {
      const token = localStorage.getItem('evin_token');
      if (!token) { this.cargando = false; return; }
      await this.cargarDatos();
    },

    methods: {
      async cargarDatos() {
        const token = localStorage.getItem('evin_token');
        if (!token) { this.cargando = false; return; }
        this.cargando = true;
        this.error    = null;
        try {
          this.datos = await Api.getDashboard();
        } catch (e) {
          this.error = 'No se pudieron cargar los datos del dashboard.';
        } finally {
          this.cargando = false;
        }
      },

      posClass(i) {
        if (i === 0) return 'pos-oro';
        if (i === 1) return 'pos-plata';
        if (i === 2) return 'pos-bronce';
        return 'pos-normal';
      },

      formatFecha(fecha) {
        if (!fecha) return '—';
        return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      },

      barraJuego(sesiones) {
        const max = Math.max(...this.juegosPop.map(j => j.sesiones), 1);
        return Math.round((sesiones / max) * 100);
      },

      colorTendencia(t) {
        if (t === 'mejorando')  return '#2ecc71';
        if (t === 'empeorando') return '#e63946';
        return '#f4a261';
      }
    }
  });

  window.__vueDashboard = app.mount('#app-dashboard');
});
