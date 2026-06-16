// js/avatar.js
// Genera avatares SVG con iniciales al estilo Gmail
// Sin dependencias externas, sin backend

const Avatar = {

  // Paleta de colores — igual que Gmail/Google
  _colores: [
    '#1a73e8', '#e8710a', '#0f9d58', '#d93025',
    '#9334e6', '#007b83', '#c5221f', '#137333',
    '#b06000', '#1967d2', '#6a0dad', '#00695c',
    '#ad1457', '#0277bd', '#558b2f', '#4527a0'
  ],

  // Obtener color consistente a partir del nombre
  _color(nombre) {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this._colores[Math.abs(hash) % this._colores.length];
  },

  // Obtener iniciales (máximo 2)
  _iniciales(nombre) {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  },

  // Generar SVG data URL
  svg(nombre, size = 60) {
    const color    = this._color(nombre || '?');
    const iniciales = this._iniciales(nombre);
    const fontSize  = Math.round(size * 0.42);

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${size / 2}" fill="${color}"/>
      <text
        x="50%" y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-family="Roboto, system-ui, sans-serif"
        font-size="${fontSize}"
        font-weight="600"
        fill="#ffffff"
        letter-spacing="1"
      >${iniciales}</text>
    </svg>`;

    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  },

  // Elemento <img> con el avatar
  img(nombre, size = 60, className = '') {
    const img  = document.createElement('img');
    img.src    = this.svg(nombre, size);
    img.alt    = `Avatar de ${nombre}`;
    img.width  = size;
    img.height = size;
    if (className) img.className = className;
    return img;
  }
};

// Exponer globalmente para Vue y JS
window.Avatar = Avatar;
