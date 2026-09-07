// js/juego_puzzle.js
document.addEventListener('DOMContentLoaded', () => {

 

  // ── Elementos del DOM ──────────────────────────────────────────────────────
  const puzzleContenedor = document.getElementById('puzzle-contenedor');
  const puzzleHuecos     = document.getElementById('puzzle-huecos');
  const puzzlePiezas     = document.getElementById('puzzle-piezas');
  const puzzlePreview    = document.getElementById('puzzle-preview');
  const puzzleTiempoEl   = document.getElementById('puzzle-tiempo');
  const puzzleAciertosEl = document.getElementById('puzzle-aciertos');
  const puzzleErroresEl  = document.getElementById('puzzle-errores');
  const puzzleRondaEl    = document.getElementById('puzzle-ronda');
  const puzzleNivelActualEl = document.getElementById('puzzle-nivel-actual');
  const puzzleNivelEl    = document.getElementById('puzzle-nivel');
  const puzzleNumerosEl  = document.getElementById('puzzle-numeros');
  const puzzleSeccion    = document.getElementById('juego-puzzle');
  const btnEmpezar       = document.getElementById('puzzle-empezar');
  const btnVolver        = document.getElementById('puzzle-volver');

  // ── Anuncios para lectores de pantalla ──────────────────────────────────────
  const anuncioPolite    = document.getElementById('anuncio-juego');
  const anuncioAssertive = document.getElementById('anuncio-urgente');
  function anunciar(mensaje, urgente = false) {
    const el = urgente ? anuncioAssertive : anuncioPolite;
    if (!el) return;
    el.textContent = '';
    // Forzar que el lector de pantalla relea el mensaje aunque sea igual al anterior
    requestAnimationFrame(() => { el.textContent = mensaje; });
  }

  // ── Preferencia: mostrar números en piezas y huecos ─────────────────────────
  // Por defecto activado: emparejar por número es mucho más accesible para
  // baja visión que comparar visualmente un fragmento diminuto de imagen.
  let mostrarNumeros = localStorage.getItem('evin_puzzle_numeros') !== '0';
  function aplicarPreferenciaNumeros() {
    if (puzzleNumerosEl) puzzleNumerosEl.checked = mostrarNumeros;
    puzzleSeccion?.classList.toggle('puzzle-sin-numeros', !mostrarNumeros);
  }
  aplicarPreferenciaNumeros();
  puzzleNumerosEl?.addEventListener('change', () => {
    mostrarNumeros = puzzleNumerosEl.checked;
    localStorage.setItem('evin_puzzle_numeros', mostrarNumeros ? '1' : '0');
    puzzleSeccion?.classList.toggle('puzzle-sin-numeros', !mostrarNumeros);
  });

  // ── Ilustraciones SVG temáticas ───────────────────────────────────────────
  // Cada ilustración es un SVG 300x300 dividido en piezas por CSS background-position.
  //
  // Criterio de diseño (importante para el propio mecanismo del puzzle):
  // en el nivel Difícil el tablero es 5×5, es decir, cada pieza es solo un
  // recorte de 60×60px. Si una zona del dibujo es un color liso muy extenso
  // (un cielo plano, un fondo sin texturizar...), varias piezas de esa zona
  // resultan visualmente idénticas y el puzzle deja de poder resolverse por
  // reconocimiento visual — justo la habilidad que este juego entrena. Por
  // eso cada ilustración reparte pequeños elementos decorativos por TODO el
  // lienzo (esquinas incluidas), no solo alrededor del motivo central.
  const ilustraciones = [
  {
    id: 'sol',
    nombre: 'El sol',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cieloSol" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4FA8E0"/>
      <stop offset="60%" stop-color="#87CEEB"/>
      <stop offset="100%" stop-color="#BEE7F5"/>
    </linearGradient>
    <linearGradient id="suelo1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#66BB6A"/>
      <stop offset="100%" stop-color="#388E3C"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#cieloSol)"/>
  <!-- Nubes repartidas por todo el cielo, incluidas las esquinas -->
  <circle cx="45" cy="45" r="18" fill="#ffffff" opacity="0.75"/>
  <circle cx="65" cy="55" r="12" fill="#ffffff" opacity="0.7"/>
  <circle cx="250" cy="70" r="14" fill="#ffffff" opacity="0.6"/>
  <circle cx="270" cy="60" r="9" fill="#ffffff" opacity="0.6"/>
  <circle cx="30" cy="200" r="6" fill="#ffffff" opacity="0.5"/>
  <circle cx="270" cy="220" r="8" fill="#ffffff" opacity="0.4"/>
  <circle cx="20" cy="30" r="7" fill="#ffffff" opacity="0.5"/>
  <circle cx="280" cy="30" r="9" fill="#ffffff" opacity="0.55"/>
  <!-- Pájaros -->
  <path d="M 35 110 Q 45 100 55 110 Q 65 100 75 110" stroke="#2c3e6b" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M 220 95 Q 228 87 236 95 Q 244 87 252 95" stroke="#2c3e6b" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.55"/>
  <!-- Rayos -->
  <line x1="150" y1="20"  x2="150" y2="55"  stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="150" y1="245" x2="150" y2="280" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="20"  y1="150" x2="55"  y2="150" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="245" y1="150" x2="280" y2="150" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="57"  y1="57"  x2="81"  y2="81"  stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="219" y1="57"  x2="243" y2="81"  stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="57"  y1="243" x2="81"  y2="219" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <line x1="219" y1="243" x2="243" y2="219" stroke="#FFD700" stroke-width="12" stroke-linecap="round"/>
  <circle cx="150" cy="150" r="80" fill="#FFD700"/>
  <circle cx="150" cy="150" r="80" fill="none" stroke="#F4A100" stroke-width="3" opacity="0.5"/>
  <circle cx="120" cy="135" r="12" fill="#FF8C00"/>
  <circle cx="180" cy="135" r="12" fill="#FF8C00"/>
  <path d="M 115 175 Q 150 205 185 175" stroke="#FF8C00" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="0" y="255" width="300" height="45" fill="url(#suelo1)"/>
  <!-- Hierba repartida por todo el ancho del suelo -->
  <ellipse cx="10"  cy="270" rx="14" ry="5" fill="#2E7D32" opacity="0.5"/>
  <ellipse cx="40"  cy="278" rx="16" ry="6" fill="#2E7D32" opacity="0.6"/>
  <ellipse cx="90"  cy="272" rx="13" ry="5" fill="#1B5E20" opacity="0.5"/>
  <ellipse cx="130" cy="285" rx="20" ry="7" fill="#2E7D32" opacity="0.5"/>
  <ellipse cx="180" cy="273" rx="15" ry="5" fill="#2E7D32" opacity="0.55"/>
  <ellipse cx="230" cy="275" rx="14" ry="5" fill="#2E7D32" opacity="0.6"/>
  <ellipse cx="270" cy="290" rx="18" ry="6" fill="#1B5E20" opacity="0.5"/>
  <ellipse cx="290" cy="272" rx="12" ry="4" fill="#2E7D32" opacity="0.5"/>
</svg>`
  },
  {
    id: 'manzana',
    nombre: 'La manzana',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fondoManzana" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A5E8A5"/>
      <stop offset="100%" stop-color="#6FCF6F"/>
    </linearGradient>
    <radialGradient id="cuerpoManzana" cx="30%" cy="25%" r="80%">
      <stop offset="0%" stop-color="#ff7a82"/>
      <stop offset="45%" stop-color="#e6323f"/>
      <stop offset="100%" stop-color="#a3121f"/>
    </radialGradient>
  </defs>
  <rect width="300" height="300" fill="url(#fondoManzana)"/>
  <!-- Textura de fondo repartida por las cuatro esquinas -->
  <circle cx="35" cy="35" r="10" fill="#ffffff" opacity="0.35"/>
  <circle cx="265" cy="45" r="14" fill="#ffffff" opacity="0.3"/>
  <circle cx="40" cy="260" r="12" fill="#ffffff" opacity="0.3"/>
  <circle cx="260" cy="255" r="9" fill="#ffffff" opacity="0.35"/>
  <circle cx="255" cy="150" r="7" fill="#2E7D32" opacity="0.3"/>
  <circle cx="45" cy="150" r="6" fill="#2E7D32" opacity="0.3"/>
  <circle cx="20" cy="120" r="5" fill="#2E7D32" opacity="0.35"/>
  <circle cx="280" cy="200" r="6" fill="#ffffff" opacity="0.3"/>
  <circle cx="55" cy="30" r="6" fill="#2E7D32" opacity="0.3"/>
  <circle cx="20" cy="270" r="5" fill="#2E7D32" opacity="0.3"/>
  <circle cx="280" cy="35" r="5" fill="#ffffff" opacity="0.3"/>
  <circle cx="270" cy="275" r="5" fill="#2E7D32" opacity="0.3"/>
  <rect x="140" y="40" width="20" height="50" rx="10" fill="#8B4513"/>
  <ellipse cx="175" cy="55" rx="35" ry="18" fill="#2E7D32" transform="rotate(-30 175 55)"/>
  <ellipse cx="150" cy="175" rx="100" ry="110" fill="url(#cuerpoManzana)"/>
  <!-- Textura interior repartida por todo el cuerpo para que ninguna zona quede lisa -->
  <ellipse cx="110" cy="120" rx="26" ry="19" fill="rgba(255,255,255,0.4)" transform="rotate(-20 110 120)"/>
  <ellipse cx="190" cy="230" rx="16" ry="10" fill="rgba(255,255,255,0.22)" transform="rotate(15 190 230)"/>
  <ellipse cx="95" cy="230" rx="14" ry="9" fill="rgba(120,10,20,0.35)" transform="rotate(-10 95 230)"/>
  <ellipse cx="200" cy="130" rx="13" ry="18" fill="rgba(120,10,20,0.3)" transform="rotate(25 200 130)"/>
  <circle cx="150" cy="175" r="10" fill="rgba(120,10,20,0.3)"/>
  <ellipse cx="120" cy="200" rx="9" ry="6" fill="rgba(255,255,255,0.2)"/>
  <ellipse cx="185" cy="170" rx="8" ry="12" fill="rgba(255,255,255,0.18)"/>
  <circle cx="150" cy="235" r="7" fill="rgba(120,10,20,0.25)"/>
  <!-- Gusanito asomando — detalle simpático y otro punto de referencia visual -->
  <path d="M 165 255 q 8 10 0 18 q -8 8 0 16" stroke="#7CB342" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="165" cy="253" r="6" fill="#8BC34A"/>
  <circle cx="163" cy="251" r="1.4" fill="#33691E"/>
  <circle cx="167" cy="251" r="1.4" fill="#33691E"/>
</svg>`
  },
  {
    id: 'casa',
    nombre: 'La casa',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cieloCasa" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4FA8E0"/>
      <stop offset="100%" stop-color="#B3E5FC"/>
    </linearGradient>
    <linearGradient id="sueloCasa" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#66BB6A"/>
      <stop offset="100%" stop-color="#388E3C"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#cieloCasa)"/>
  <circle cx="240" cy="40" r="30" fill="#FFD700"/>
  <circle cx="50" cy="60" r="14" fill="#ffffff" opacity="0.75"/>
  <circle cx="70" cy="68" r="10" fill="#ffffff" opacity="0.7"/>
  <circle cx="270" cy="95" r="9" fill="#ffffff" opacity="0.6"/>
  <path d="M 250 260 Q 258 240 250 220" stroke="#8d8d8d" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.55"/>
  <!-- Humo de la chimenea, para no dejar la esquina superior derecha vacía -->
  <circle cx="248" cy="205" r="7" fill="#ffffff" opacity="0.55"/>
  <circle cx="256" cy="188" r="9" fill="#ffffff" opacity="0.5"/>
  <circle cx="250" cy="170" r="10" fill="#ffffff" opacity="0.45"/>
  <rect x="235" y="220" width="18" height="26" fill="#8B4513"/>
  <rect x="0" y="265" width="300" height="35" fill="url(#sueloCasa)"/>
  <ellipse cx="290" cy="280" rx="20" ry="6" fill="#2E7D32" opacity="0.6"/>
  <ellipse cx="15" cy="285" rx="16" ry="5" fill="#1B5E20" opacity="0.5"/>
  <!-- Árbol a la izquierda -->
  <rect x="24" y="200" width="12" height="65" rx="4" fill="#7B4B2A"/>
  <circle cx="30" cy="185" r="26" fill="#4CAF50"/>
  <circle cx="14" cy="198" r="18" fill="#66BB6A"/>
  <circle cx="46" cy="198" r="18" fill="#66BB6A"/>
  <polygon points="150,30 280,140 20,140" fill="#e63946"/>
  <rect x="40" y="138" width="220" height="130" fill="#FFCC80"/>
  <rect x="40" y="138" width="220" height="10" fill="#F4A65B" opacity="0.6"/>
  <!-- Camino de piedras hasta la puerta -->
  <ellipse cx="150" cy="278" rx="10" ry="5" fill="#D7B98E" opacity="0.9"/>
  <ellipse cx="150" cy="290" rx="11" ry="5" fill="#D7B98E" opacity="0.85"/>
  <rect x="110" y="200" width="80" height="68" rx="8" fill="#8B4513"/>
  <circle cx="178" cy="234" r="4" fill="#FFD700"/>
  <rect x="55" y="160" width="70" height="60" rx="6" fill="#B3E5FC"/>
  <line x1="90"  y1="160" x2="90"  y2="220" stroke="#8B4513" stroke-width="5"/>
  <line x1="55"  y1="190" x2="125" y2="190" stroke="#8B4513" stroke-width="5"/>
  <rect x="175" y="160" width="70" height="60" rx="6" fill="#B3E5FC"/>
  <line x1="210" y1="160" x2="210" y2="220" stroke="#8B4513" stroke-width="5"/>
  <line x1="175" y1="190" x2="245" y2="190" stroke="#8B4513" stroke-width="5"/>
</svg>`
  },
  {
    id: 'flor',
    nombre: 'La flor',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fondoFlor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#BFF2BF"/>
      <stop offset="100%" stop-color="#7FD87F"/>
    </linearGradient>
    <radialGradient id="petaloFlor" cx="35%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#FFB6DA"/>
      <stop offset="50%" stop-color="#F4599C"/>
      <stop offset="100%" stop-color="#C22A72"/>
    </radialGradient>
  </defs>
  <rect width="300" height="300" fill="url(#fondoFlor)"/>
  <circle cx="40" cy="45" r="10" fill="#ffffff" opacity="0.75"/>
  <circle cx="260" cy="55" r="13" fill="#ffffff" opacity="0.7"/>
  <circle cx="30" cy="150" r="8" fill="#ffffff" opacity="0.65"/>
  <circle cx="265" cy="150" r="7" fill="#1B5E20" opacity="0.6"/>
  <circle cx="60" cy="270" r="9" fill="#1B5E20" opacity="0.6"/>
  <circle cx="255" cy="255" r="6" fill="#ffffff" opacity="0.65"/>
  <circle cx="20" cy="220" r="5" fill="#1B5E20" opacity="0.6"/>
  <circle cx="230" cy="30" r="6" fill="#ffffff" opacity="0.7"/>
  <rect x="138" y="180" width="24" height="100" rx="12" fill="#2E7D32"/>
  <ellipse cx="100" cy="220" rx="45" ry="20" fill="#4CAF50" transform="rotate(-30 100 220)"/>
  <ellipse cx="200" cy="240" rx="45" ry="20" fill="#4CAF50" transform="rotate(30 200 240)"/>
  <!-- Pétalos con textura/veteado para que no queden lisos en ninguna zona -->
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="url(#petaloFlor)"/>
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="url(#petaloFlor)" transform="rotate(45 150 155)"/>
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="url(#petaloFlor)" transform="rotate(90 150 155)"/>
  <ellipse cx="150" cy="80"  rx="30" ry="55" fill="url(#petaloFlor)" transform="rotate(135 150 155)"/>
  <line x1="150" y1="35"  x2="150" y2="120" stroke="rgba(255,255,255,0.35)" stroke-width="3"/>
  <line x1="150" y1="190" x2="150" y2="105" stroke="rgba(255,255,255,0.3)" stroke-width="3" transform="rotate(45 150 155)"/>
  <line x1="150" y1="190" x2="150" y2="105" stroke="rgba(150,20,80,0.3)" stroke-width="3" transform="rotate(90 150 155)"/>
  <line x1="150" y1="190" x2="150" y2="105" stroke="rgba(255,255,255,0.3)" stroke-width="3" transform="rotate(135 150 155)"/>
  <circle cx="115" cy="60" r="7" fill="rgba(255,255,255,0.55)"/>
  <circle cx="185" cy="100" r="6" fill="rgba(120,10,60,0.5)"/>
  <circle cx="150" cy="155" r="45" fill="#FFD700"/>
  <circle cx="150" cy="155" r="30" fill="#FF8C00"/>
  <circle cx="140" cy="145" r="4" fill="#7A3D00"/>
  <circle cx="160" cy="150" r="3" fill="#7A3D00"/>
  <circle cx="150" cy="165" r="4" fill="#7A3D00"/>
  <circle cx="135" cy="160" r="3" fill="#7A3D00"/>
  <circle cx="165" cy="163" r="3" fill="#7A3D00"/>
  <!-- Mariposa arriba a la derecha -->
  <ellipse cx="248" cy="55" rx="14" ry="10" fill="#FFB6DA" opacity="0.9" transform="rotate(-20 248 55)"/>
  <ellipse cx="262" cy="60" rx="12" ry="9" fill="#F4599C" opacity="0.9" transform="rotate(20 262 60)"/>
  <line x1="255" y1="55" x2="255" y2="68" stroke="#3d2b1f" stroke-width="2" stroke-linecap="round"/>
  <!-- Mariquita abajo a la izquierda -->
  <circle cx="35" cy="255" r="9" fill="#e63946"/>
  <line x1="35" y1="246" x2="35" y2="264" stroke="#1a1a1a" stroke-width="1.5"/>
  <circle cx="31" cy="251" r="1.6" fill="#1a1a1a"/>
  <circle cx="39" cy="251" r="1.6" fill="#1a1a1a"/>
  <circle cx="32" cy="259" r="1.6" fill="#1a1a1a"/>
  <circle cx="35" cy="247" r="3.5" fill="#1a1a1a"/>
</svg>`
  },
  {
    id: 'pelota',
    nombre: 'El balón de playa',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cieloPelota" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4FA8E0"/>
      <stop offset="100%" stop-color="#B3E5FC"/>
    </linearGradient>
    <linearGradient id="sueloPelota" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F5DEA0"/>
      <stop offset="100%" stop-color="#E8C271"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#cieloPelota)"/>
  <circle cx="45" cy="45" r="16" fill="#ffffff" opacity="0.7"/>
  <circle cx="65" cy="55" r="10" fill="#ffffff" opacity="0.65"/>
  <circle cx="255" cy="40" r="12" fill="#ffffff" opacity="0.6"/>
  <circle cx="25" cy="230" r="8" fill="#ffffff" opacity="0.5"/>
  <circle cx="275" cy="235" r="9" fill="#ffffff" opacity="0.5"/>
  <!-- Arena en vez de césped: encaja mejor con un balón de playa -->
  <rect x="0" y="265" width="300" height="35" fill="url(#sueloPelota)"/>
  <circle cx="30"  cy="280" r="3" fill="#c9a45f" opacity="0.7"/>
  <circle cx="70"  cy="288" r="2.5" fill="#c9a45f" opacity="0.6"/>
  <circle cx="230" cy="282" r="3" fill="#c9a45f" opacity="0.7"/>
  <circle cx="270" cy="290" r="2.5" fill="#c9a45f" opacity="0.6"/>
  <ellipse cx="150" cy="268" rx="70" ry="12" fill="rgba(0,0,0,0.15)"/>
  <!-- Balón de playa: gajos de color en vez de una esfera lisa, mucho -->
  <!-- más fácil de distinguir pieza a pieza que un color rojo uniforme -->
  <g>
    <path d="M 150 150 L 150 30  A 120 120 0 0 1 253.9 90  Z" fill="#e63946"/>
    <path d="M 150 150 L 253.9 90  A 120 120 0 0 1 253.9 210 Z" fill="#FFD700"/>
    <path d="M 150 150 L 253.9 210 A 120 120 0 0 1 150 270  Z" fill="#2ecc71"/>
    <path d="M 150 150 L 150 270  A 120 120 0 0 1 46.1 210  Z" fill="#1B4FD8"/>
    <path d="M 150 150 L 46.1 210  A 120 120 0 0 1 46.1 90  Z" fill="#f4f4f4"/>
    <path d="M 150 150 L 46.1 90  A 120 120 0 0 1 150 30  Z" fill="#FF8C00"/>
  </g>
  <circle cx="150" cy="150" r="120" fill="none" stroke="#1a1a2e" stroke-width="3" opacity="0.25"/>
  <!-- Brillo curvo característico del plástico -->
  <path d="M 90 80 Q 130 60 170 75" stroke="rgba(255,255,255,0.55)" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="105" cy="95" r="22" fill="rgba(255,255,255,0.25)"/>
</svg>`
  },
  {
    id: 'pez',
    nombre: 'El pez',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paredPez" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDEBD3"/>
      <stop offset="100%" stop-color="#FBDCB5"/>
    </linearGradient>
    <linearGradient id="mesaPez" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#B67A45"/>
      <stop offset="100%" stop-color="#8B5A2B"/>
    </linearGradient>
    <radialGradient id="aguaPez" cx="45%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#BEEBF5"/>
      <stop offset="60%" stop-color="#6FD3E8"/>
      <stop offset="100%" stop-color="#2E9FBF"/>
    </radialGradient>
  </defs>
  <rect width="300" height="300" fill="url(#paredPez)"/>
  <!-- Ventana arriba a la izquierda para no dejar esa esquina vacía -->
  <rect x="20" y="20" width="60" height="60" rx="8" fill="#BEE7F5" stroke="#8B5A2B" stroke-width="6"/>
  <line x1="50" y1="20" x2="50" y2="80" stroke="#8B5A2B" stroke-width="4"/>
  <line x1="20" y1="50" x2="80" y2="50" stroke="#8B5A2B" stroke-width="4"/>
  <!-- Cuadrito decorativo arriba a la derecha -->
  <rect x="225" y="25" width="55" height="42" rx="4" fill="#F4A65B" stroke="#8B5A2B" stroke-width="5"/>
  <circle cx="252" cy="46" r="12" fill="#FFD700" opacity="0.8"/>
  <!-- Mesa -->
  <rect x="0" y="235" width="300" height="65" fill="url(#mesaPez)"/>
  <rect x="0" y="235" width="300" height="8" fill="#9c6a37" opacity="0.6"/>
  <!-- Burbujas repartidas por todo el lienzo -->
  <circle cx="30"  cy="150" r="4" fill="#ffffff" opacity="0.55"/>
  <circle cx="270" cy="130" r="5" fill="#ffffff" opacity="0.5"/>
  <circle cx="255" cy="200" r="3" fill="#ffffff" opacity="0.5"/>
  <circle cx="45"  cy="210" r="3.5" fill="#ffffff" opacity="0.5"/>
  <circle cx="150" cy="20"  r="4" fill="#ffffff" opacity="0.4"/>
  <!-- Pecera -->
  <ellipse cx="150" cy="165" rx="105" ry="90" fill="url(#aguaPez)" stroke="#ffffff" stroke-width="6" opacity="0.95"/>
  <path d="M 70 100 Q 60 165 80 225" stroke="rgba(255,255,255,0.5)" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M 90 90 Q 82 165 100 235" stroke="rgba(255,255,255,0.3)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Plantita dentro de la pecera -->
  <path d="M 110 235 Q 100 200 115 175" stroke="#2E7D32" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 122 235 Q 132 195 118 165" stroke="#388E3C" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M 190 235 Q 200 205 188 180" stroke="#2E7D32" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Piedritas -->
  <ellipse cx="150" cy="242" rx="10" ry="5" fill="#C9A45F"/>
  <ellipse cx="170" cy="245" rx="8" ry="4" fill="#B08A4C"/>
  <ellipse cx="130" cy="246" rx="7" ry="4" fill="#B08A4C"/>
  <!-- Pez pequeño azul, arriba a la derecha de la pecera -->
  <g transform="translate(198,120) rotate(15)">
    <ellipse cx="0" cy="0" rx="22" ry="14" fill="#4FC3F7"/>
    <polygon points="-20,0 -34,-10 -34,10" fill="#0288D1"/>
    <circle cx="9" cy="-3" r="2.6" fill="#0d1b4c"/>
  </g>
  <!-- Pez principal naranja -->
  <g transform="translate(120,175)">
    <polygon points="-55,0 -78,-20 -78,20" fill="#FF8C00"/>
    <ellipse cx="0" cy="0" rx="55" ry="34" fill="#FF9E1F"/>
    <path d="M -30 -30 Q 0 -46 25 -30" stroke="#FF7A00" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M -30 30  Q 0 46  25 30"  stroke="#FF7A00" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="-6" r="7" fill="#ffffff"/>
    <circle cx="32" cy="-6" r="4" fill="#1a1a1a"/>
    <path d="M 45 10 Q 55 18 45 26" stroke="#E67300" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
</svg>`
  },
  {
    id: 'arcoiris',
    nombre: 'El arcoíris',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cieloArco" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6EC6F5"/>
      <stop offset="100%" stop-color="#EAF7FF"/>
    </linearGradient>
    <linearGradient id="sueloArco" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8BDB8B"/>
      <stop offset="100%" stop-color="#4FAE4F"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#cieloArco)"/>
  <circle cx="245" cy="55" r="26" fill="#FFD700" opacity="0.9"/>
  <!-- Estrellitas y gotas repartidas por el cielo, incluidas las esquinas -->
  <path d="M 30 30 l 4 8 l 8 1 l -6 6 l 2 8 l -8 -4 l -8 4 l 2 -8 l -6 -6 l 8 -1 z" fill="#ffffff" opacity="0.8"/>
  <path d="M 270 190 l 3 6 l 6 1 l -4 4 l 1 6 l -6 -3 l -6 3 l 1 -6 l -4 -4 l 6 -1 z" fill="#ffffff" opacity="0.7"/>
  <circle cx="20" cy="150" r="4" fill="#ffffff" opacity="0.7"/>
  <circle cx="275" cy="110" r="3" fill="#ffffff" opacity="0.6"/>
  <ellipse cx="35" cy="120" rx="5" ry="7" fill="#8ecae6" opacity="0.6"/>
  <ellipse cx="255" cy="255" rx="5" ry="7" fill="#8ecae6" opacity="0.5"/>
  <!-- Arco iris: bandas concéntricas, cada una un color muy distinguible -->
  <path d="M 10 300 A 140 140 0 0 1 290 300" fill="none" stroke="#e63946" stroke-width="17"/>
  <path d="M 27 300 A 123 123 0 0 1 273 300" fill="none" stroke="#FF8C00" stroke-width="17"/>
  <path d="M 44 300 A 106 106 0 0 1 256 300" fill="none" stroke="#FFD700" stroke-width="17"/>
  <path d="M 61 300 A 89 89  0 0 1 239 300" fill="none" stroke="#2ecc71" stroke-width="17"/>
  <path d="M 78 300 A 72 72  0 0 1 222 300" fill="none" stroke="#1B4FD8" stroke-width="17"/>
  <path d="M 95 300 A 55 55  0 0 1 205 300" fill="none" stroke="#7b2ff7" stroke-width="17"/>
  <!-- Nubes en los extremos del arco -->
  <g>
    <circle cx="35"  cy="255" r="22" fill="#ffffff"/>
    <circle cx="58"  cy="245" r="26" fill="#ffffff"/>
    <circle cx="15"  cy="245" r="17" fill="#ffffff"/>
    <circle cx="80"  cy="255" r="18" fill="#ffffff"/>
  </g>
  <g>
    <circle cx="265" cy="255" r="22" fill="#ffffff"/>
    <circle cx="242" cy="245" r="26" fill="#ffffff"/>
    <circle cx="285" cy="245" r="17" fill="#ffffff"/>
    <circle cx="220" cy="255" r="18" fill="#ffffff"/>
  </g>
  <rect x="0" y="270" width="300" height="30" fill="url(#sueloArco)"/>
  <ellipse cx="30" cy="290" rx="14" ry="5" fill="#2E7D32" opacity="0.5"/>
  <ellipse cx="270" cy="290" rx="14" ry="5" fill="#2E7D32" opacity="0.5"/>
</svg>`
  },
  {
    id: 'estrella',
    nombre: 'El cielo estrellado',
    svg: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cieloEstrella" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a4e"/>
      <stop offset="55%" stop-color="#2c2a72"/>
      <stop offset="100%" stop-color="#4a2f80"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#cieloEstrella)"/>
  <!-- Estrellas repartidas en una cuadrícula irregular de 5×5 zonas: así ninguna
       pieza del nivel Difícil (60×60px) queda completamente vacía -->
  <g fill="#ffffff">
    <circle cx="22"  cy="24"  r="2.4"/>
    <circle cx="70"  cy="18"  r="1.6"/>
    <circle cx="118" cy="30"  r="2"/>
    <circle cx="205" cy="20"  r="2.2"/>
    <circle cx="255" cy="15"  r="1.6"/>
    <circle cx="285" cy="35"  r="2.4"/>
    <circle cx="35"  cy="75"  r="1.8"/>
    <circle cx="95"  cy="85"  r="2.2"/>
    <circle cx="160" cy="70"  r="1.6"/>
    <circle cx="235" cy="80"  r="2"/>
    <circle cx="275" cy="95"  r="1.8"/>
    <circle cx="15"  cy="135" r="2"/>
    <circle cx="60"  cy="150" r="1.6"/>
    <circle cx="140" cy="140" r="2.2"/>
    <circle cx="245" cy="145" r="1.8"/>
    <circle cx="285" cy="160" r="2.4"/>
    <circle cx="30"  cy="200" r="1.8"/>
    <circle cx="105" cy="195" r="2"/>
    <circle cx="175" cy="205" r="1.6"/>
    <circle cx="220" cy="190" r="2.2"/>
    <circle cx="270" cy="215" r="1.8"/>
    <circle cx="45"  cy="245" r="2"/>
    <circle cx="130" cy="250" r="1.6"/>
    <circle cx="200" cy="240" r="2"/>
    <circle cx="260" cy="255" r="1.8"/>
  </g>
  <!-- Un puñado de estrellas de cuatro puntas más grandes y brillantes -->
  <g fill="#FFF3B0">
    <path d="M 90 45 l 3 10 l 10 3 l -10 3 l -3 10 l -3 -10 l -10 -3 l 10 -3 z"/>
    <path d="M 210 110 l 4 12 l 12 4 l -12 4 l -4 12 l -4 -12 l -12 -4 l 12 -4 z"/>
    <path d="M 65 175 l 3 9 l 9 3 l -9 3 l -3 9 l -3 -9 l -9 -3 l 9 -3 z"/>
  </g>
  <!-- Luna creciente -->
  <circle cx="235" cy="55" r="34" fill="#FFF6D6" opacity="0.25"/>
  <path d="M 250 40 A 26 26 0 1 0 250 90 A 20 20 0 1 1 250 40 Z" fill="#FFF6D6"/>
  <!-- Estrella fugaz con estela -->
  <path d="M 40 100 L 110 150" stroke="#FFF6D6" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
  <path d="M 110 150 l 6 -3 l -1 7 l 8 -1 l -6 5 l 4 6 l -8 -2 l -3 7 l -3 -7 z" fill="#ffffff"/>
  <!-- Colinas y arbolito de referencia en la parte baja -->
  <path d="M 0 300 Q 90 235 200 275 Q 250 292 300 268 L 300 300 Z" fill="#14123a"/>
  <rect x="248" y="255" width="8" height="26" fill="#0d0c28"/>
  <circle cx="252" cy="245" r="16" fill="#181246"/>
</svg>`
  },
];

  // ── Estado ─────────────────────────────────────────────────────────────────
  let cols           = 3;
  let filas          = 3;
  let piezaSeleccionada = null;
  let huecoSeleccionado = null;
  // Aciertos y errores REALES de colocación, acumulados durante toda la
  // partida (las 3 rondas). Antes se registraba como "aciertos" el número
  // fijo de rondas jugadas y como "intentos" el total de movimientos —
  // daba porcentajes de acierto sin sentido (una partida perfecta podía
  // salir con un 6% de "acierto") que además contaminaban el cálculo de
  // tendencia del dashboard. Ahora aciertos/errores funcionan igual que en
  // el resto de juegos: aciertos = colocaciones correctas, intentos =
  // aciertos + errores, así que aciertos/intentos es un % real.
  let aciertosTotal  = 0;
  let erroresTotal   = 0;
  let tiempo         = 0;
  let timerId        = null;
  let ilustracionActual = null;
  let estadoTablero  = []; // array de posiciones actuales
  let juegoActivo    = false;
  let rondaActual    = 1;
  const rondasMax    = 3;

  // ── Configuración por nivel ────────────────────────────────────────────────
  // La dificultad escala una ronda tras otra a partir del nivel elegido por
  // el usuario (ronda 1 = nivel elegido, ronda 2 sube uno, ronda 3 sube otro,
  // sin pasar de Difícil) — igual que prometen las FAQs para Exploraciones y
  // Cierre visual ("el tablero crece con cada ronda superada"). Antes las
  // tres rondas eran siempre del mismo tamaño, así que "ronda" no aportaba
  // ninguna progresión real.
  const NIVELES_ORDEN = ['facil', 'medio', 'dificil'];
  const NIVELES_LABEL = { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' };

  function configNivel() {
    const base    = puzzleNivelEl?.value || 'medio';
    const baseIdx = NIVELES_ORDEN.includes(base) ? NIVELES_ORDEN.indexOf(base) : 1;
    const idx     = Math.min(baseIdx + (rondaActual - 1), NIVELES_ORDEN.length - 1);
    const nivel   = NIVELES_ORDEN[idx];
    if (nivel === 'facil')  return { cols: 3, filas: 3, nivel };
    if (nivel === 'medio')  return { cols: 4, filas: 4, nivel };
    return                         { cols: 5, filas: 5, nivel };
  }

  // ── Tamaño de cada pieza ───────────────────────────────────────────────────
  // El tablero y las piezas se apilan en vertical por debajo de 700px (ver
  // puzzle.css), así que ahí cada zona puede usar todo el ancho disponible
  // en vez de solo la mitad. Antes se dividía siempre entre dos, dejando
  // piezas diminutas (a veces <35px) en móvil — inaceptable para usuarios
  // con baja visión, que necesitan objetivos táctiles grandes y claros.
  function tamPieza() {
    const apilado         = window.matchMedia('(max-width: 699px)').matches;
    const anchoDisponible = Math.min(window.innerWidth - 48, 900);
    const anchoPorZona    = apilado ? anchoDisponible : Math.floor(anchoDisponible / 2);
    const maxPieza        = Math.min(anchoPorZona / cols, 500 / cols);
    return Math.max(Math.floor(maxPieza), 44); // nunca por debajo del mínimo táctil accesible
  }

  // ── Registro de sesión ─────────────────────────────────────────────────────
 async function registrarSesion(aciertos, intentos) {
  try {
    const token    = localStorage.getItem('evin_token');
    const user     = JSON.parse(localStorage.getItem('evin_user') || '{}');
    await fetch('https://evin.click/api/v1/sesiones', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ alumno: user.nombre || 'Anónimo', alumno_id: user.alumno_id || null, juego: 'Puzzle', aciertos, intentos })
    });
  } catch (e) { console.error('Error al registrar sesión:', e); }
}

  // ── Actualizar UI ──────────────────────────────────────────────────────────
  function actualizarUI() {
    if (puzzleAciertosEl) puzzleAciertosEl.textContent = aciertosTotal;
    if (puzzleErroresEl)  puzzleErroresEl.textContent  = erroresTotal;
    if (puzzleRondaEl)    puzzleRondaEl.textContent    = `${rondaActual} / ${rondasMax}`;
  }

  // ── Iniciar juego ──────────────────────────────────────────────────────────
  window.iniciarPuzzle = function () {
    rondaActual   = 1;
    aciertosTotal = 0;
    erroresTotal  = 0;
    tiempo        = 0;
    juegoActivo   = true;
    if (puzzleTiempoEl) puzzleTiempoEl.textContent = 0;
    actualizarUI();

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      tiempo++;
      if (puzzleTiempoEl) puzzleTiempoEl.textContent = tiempo;
    }, 1000);

    iniciarRonda();
  };

  function iniciarRonda() {
    const cfg = configNivel();
    cols  = cfg.cols;
    filas = cfg.filas;
    piezaSeleccionada = null;
    huecoSeleccionado = null;
    if (puzzleNivelActualEl) puzzleNivelActualEl.textContent = NIVELES_LABEL[cfg.nivel];
    actualizarUI();

    // Elegir ilustración aleatoria
    ilustracionActual = ilustraciones[Math.floor(Math.random() * ilustraciones.length)];

    // Mostrar preview
    if (puzzlePreview) {
      puzzlePreview.innerHTML = ilustracionActual.svg;
      puzzlePreview.querySelector('svg').setAttribute('width',  '120');
      puzzlePreview.querySelector('svg').setAttribute('height', '120');
    }

    construirPuzzle();
  }

  // ── Construir puzzle ───────────────────────────────────────────────────────
  function construirPuzzle() {
    if (!puzzleHuecos || !puzzlePiezas || !ilustracionActual) return;

    const tam   = tamPieza();
    const total = cols * filas;

    // Generar orden barajado
    const orden = [...Array(total).keys()];
    barajar(orden);
    estadoTablero = orden;

    // Estilos del grid
    const gridStyle = `display:grid;grid-template-columns:repeat(${cols},${tam}px);gap:3px;max-width:${tam*cols+cols*3}px;`;
    puzzleHuecos.style.cssText = gridStyle;
    puzzlePiezas.style.cssText = gridStyle;

    // Crear huecos (posiciones correctas)
    puzzleHuecos.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const hueco = document.createElement('div');
      hueco.className        = 'puzzle-hueco';
      hueco.dataset.pos      = i;
      hueco.style.width      = tam + 'px';
      hueco.style.height     = tam + 'px';
      hueco.style.backgroundImage  = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(ilustracionActual.svg)}")`;
      hueco.style.backgroundSize   = `${cols * tam}px ${filas * tam}px`;
      hueco.style.backgroundPosition = bgPos(i, tam);
      hueco.style.opacity    = '0.3';
      hueco.style.border     = '2px dashed #666';
      hueco.style.boxSizing  = 'border-box';
      hueco.setAttribute('tabindex', '0');
      hueco.setAttribute('role', 'button');
      hueco.setAttribute('aria-label', `Hueco número ${i + 1}`);

      const numero = document.createElement('span');
      numero.className   = 'puzzle-numero';
      numero.textContent = i + 1;
      numero.setAttribute('aria-hidden', 'true');
      hueco.appendChild(numero);

      hueco.addEventListener('click',      () => manejarClickHueco(hueco));
      hueco.addEventListener('keydown',    e  => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manejarClickHueco(hueco); }
      });
      hueco.addEventListener('dragover',   e  => e.preventDefault());
      hueco.addEventListener('drop',       e  => manejarDrop(e, hueco));
      puzzleHuecos.appendChild(hueco);
    }

    // Crear piezas (barajadas)
    puzzlePiezas.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const pieza = document.createElement('div');
      pieza.className       = 'puzzle-pieza';
      pieza.dataset.id      = orden[i]; // qué pieza es (posición correcta)
      pieza.dataset.pos     = i;        // dónde está ahora
      pieza.style.width     = tam + 'px';
      pieza.style.height    = tam + 'px';
      pieza.style.backgroundImage  = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(ilustracionActual.svg)}")`;
      pieza.style.backgroundSize   = `${cols * tam}px ${filas * tam}px`;
      pieza.style.backgroundPosition = bgPos(orden[i], tam);
      pieza.style.cursor    = 'grab';
      pieza.style.boxSizing = 'border-box';
      pieza.style.border    = '2px solid rgba(255,255,255,0.3)';
      pieza.style.borderRadius = '4px';
      pieza.setAttribute('draggable', 'true');
      pieza.setAttribute('tabindex', '0');
      pieza.setAttribute('role', 'button');
      pieza.setAttribute('aria-label', `Pieza número ${orden[i] + 1}`);

      const numero = document.createElement('span');
      numero.className   = 'puzzle-numero';
      numero.textContent = orden[i] + 1;
      numero.setAttribute('aria-hidden', 'true');
      pieza.appendChild(numero);

      pieza.addEventListener('click',     () => manejarClickPieza(pieza));
      pieza.addEventListener('keydown',   e  => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manejarClickPieza(pieza); }
      });
      pieza.addEventListener('dragstart', e  => manejarDragStart(e, pieza));
      puzzlePiezas.appendChild(pieza);
    }

    anunciar(`Ronda ${rondaActual} de ${rondasMax}, nivel ${NIVELES_LABEL[configNivel().nivel]}. ${total} piezas para colocar. Usa Tab para moverte y Enter para seleccionar, o arrastra las piezas a su hueco.`);
  }

  // Calcular background-position para una pieza dada su índice correcto
  function bgPos(idx, tam) {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return `-${col * tam}px -${row * tam}px`;
  }

  function barajar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ── Interacción: clic / teclado ──────────────────────────────────────────
  function manejarClickPieza(pieza) {
    if (!juegoActivo) return;

    // Deseleccionar la anterior
    document.querySelectorAll('.puzzle-pieza.seleccionada').forEach(p => {
      p.classList.remove('seleccionada');
    });

    piezaSeleccionada = pieza;
    pieza.classList.add('seleccionada');
    anunciar(`Pieza ${pieza.dataset.id ? parseInt(pieza.dataset.id) + 1 : ''} seleccionada. Elige ahora el hueco donde colocarla.`);

    // Si hay hueco seleccionado, colocar
    if (huecoSeleccionado) {
      colocarPieza(piezaSeleccionada, huecoSeleccionado);
    }
  }

  function manejarClickHueco(hueco) {
    if (!juegoActivo) return;

    // Si ya tiene pieza colocada, ignorar
    if (hueco.dataset.ocupado) return;

    document.querySelectorAll('.puzzle-hueco.seleccionado-hueco').forEach(h => {
      h.classList.remove('seleccionado-hueco');
    });

    huecoSeleccionado = hueco;
    hueco.classList.add('seleccionado-hueco');

    if (piezaSeleccionada) {
      colocarPieza(piezaSeleccionada, huecoSeleccionado);
    } else {
      anunciar(`Hueco ${parseInt(hueco.dataset.pos) + 1} seleccionado. Elige ahora la pieza que va aquí.`);
    }
  }

  // ── Interacción: drag & drop ───────────────────────────────────────────────
  function manejarDragStart(e, pieza) {
    e.dataTransfer.setData('piezaPos', pieza.dataset.pos);
    e.dataTransfer.effectAllowed = 'move';
    piezaSeleccionada = pieza;
  }

  function manejarDrop(e, hueco) {
    e.preventDefault();
    if (!juegoActivo) return;
    if (hueco.dataset.ocupado) return;
    if (piezaSeleccionada) colocarPieza(piezaSeleccionada, hueco);
  }

  // ── Colocar pieza en hueco ─────────────────────────────────────────────────
  function colocarPieza(pieza, hueco) {
    const huecoPos  = parseInt(hueco.dataset.pos);
    const piezaId   = parseInt(pieza.dataset.id);
    const esCorrecta = piezaId === huecoPos;

    if (esCorrecta) {
      aciertosTotal++;
      actualizarUI();

      // Colocar visualmente en el hueco
      hueco.style.backgroundImage    = pieza.style.backgroundImage;
      hueco.style.backgroundSize     = pieza.style.backgroundSize;
      hueco.style.backgroundPosition = pieza.style.backgroundPosition;
      hueco.style.opacity   = '1';
      hueco.classList.add('puzzle-correcta');
      hueco.dataset.ocupado = '1';
      hueco.setAttribute('aria-label', `Hueco número ${huecoPos + 1}, completado`);
      mostrarIconoEstado(hueco, true);

      if (window.Sonidos) Sonidos.acierto();
      anunciar(`Correcto. Pieza ${piezaId + 1} colocada en su sitio.`);

      // Eliminar pieza del panel
      pieza.style.opacity  = '0';
      pieza.style.pointerEvents = 'none';
      pieza.style.transition = 'opacity 0.3s';
      setTimeout(() => pieza.remove(), 300);

    } else {
      erroresTotal++;
      actualizarUI();

      // Error — el color nunca es la única señal: icono, texto y sonido también
      pieza.classList.add('puzzle-incorrecta');
      hueco.classList.add('puzzle-incorrecta');
      mostrarIconoEstado(hueco, false);

      if (window.Sonidos) Sonidos.error();
      anunciar(`Incorrecto. Esa pieza no va en el hueco ${huecoPos + 1}. Inténtalo de nuevo.`, true);

      setTimeout(() => {
        pieza.classList.remove('puzzle-incorrecta');
        hueco.classList.remove('puzzle-incorrecta');
      }, 600);
    }

    // Limpiar selección
    pieza.classList.remove('seleccionada');
    hueco.classList.remove('seleccionado-hueco');
    piezaSeleccionada = null;
    huecoSeleccionado = null;

    // Comprobar si completó el puzzle
    comprobarCompletado();
  }

  // Icono ✓/✗ superpuesto — refuerzo visual que no depende solo del color
  function mostrarIconoEstado(hueco, correcta) {
    const icono = document.createElement('span');
    icono.className   = 'puzzle-icono-estado ' + (correcta ? 'icono-ok' : 'icono-err');
    icono.textContent = correcta ? '✓' : '✗';
    icono.setAttribute('aria-hidden', 'true');
    hueco.appendChild(icono);
    if (!correcta) setTimeout(() => icono.remove(), 600);
  }

  // ── Comprobar si está completado ──────────────────────────────────────────
  function comprobarCompletado() {
    const huecos = puzzleHuecos.querySelectorAll('.puzzle-hueco');
    const completado = [...huecos].every(h => h.dataset.ocupado === '1');
    if (!completado) return;

    if (rondaActual >= rondasMax) {
      finJuego();
    } else {
      setTimeout(() => {
        rondaActual++;
        const nivelSiguiente = NIVELES_LABEL[configNivel().nivel];
        if (window.Sonidos) Sonidos.rondaSuperada();
        if (window.Animaciones) Animaciones.rondaSuperada();
        anunciar(`Puzzle completado. Ronda ${rondaActual - 1} superada. Empieza la ronda ${rondaActual}, nivel ${nivelSiguiente}.`);
        showModal('¡Puzzle completado!', `¡Muy bien! Ronda ${rondaActual - 1} superada. ¡Ahora la ronda ${rondaActual} — nivel ${nivelSiguiente}!`, () => iniciarPuzzle());
        setTimeout(iniciarRonda, 1800);
      }, 400);
    }
  }

  // ── Fin de juego ──────────────────────────────────────────────────────────
  async function finJuego() {
    juegoActivo = false;
    if (window.Sonidos) Sonidos.victoria();
    if (window.Animaciones) Animaciones.victoria('juego-puzzle');
    clearInterval(timerId);

    const intentosTotal = aciertosTotal + erroresTotal;
    const precision = intentosTotal > 0 ? Math.round((aciertosTotal / intentosTotal) * 100) : 100;

    anunciar(`Juego completado. ${aciertosTotal} aciertos de ${intentosTotal} colocaciones, ${precision} por ciento de precisión, en ${tiempo} segundos.`);
    await registrarSesion(aciertosTotal, intentosTotal || aciertosTotal);
    showModal('🏆 ¡Completado!',
      `Has completado ${rondasMax} puzzles.\nPrecisión: ${precision}% (${aciertosTotal} aciertos, ${erroresTotal} errores)\nTiempo: ${tiempo}s`);
  }

  // ── Resize ─────────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (juegoActivo && ilustracionActual) construirPuzzle();
  });

  // ── Eventos ────────────────────────────────────────────────────────────────
  btnEmpezar?.addEventListener('click', () => { window.iniciarModoJuego?.('juego-puzzle'); iniciarPuzzle(); });
  btnVolver?.addEventListener('click',  () => {
    // Si se abandona la partida a mitad, no perdemos el rastro de lo que
    // el alumno ya practicó: se registra una sesión parcial con los
    // aciertos y errores acumulados hasta ese momento, en vez de no
    // guardar nada (como ocurría antes, aunque llevara varios minutos jugando).
    if (juegoActivo && (aciertosTotal > 0 || erroresTotal > 0)) {
      registrarSesion(aciertosTotal, aciertosTotal + erroresTotal);
    }
    juegoActivo = false;
    clearInterval(timerId);
    window.finalizarModoJuego?.('juego-puzzle');
    if (typeof showSection === 'function') showSection('juegos');
  });
  puzzleNivelEl?.addEventListener('change', () => { if (juegoActivo) iniciarRonda(); });

});
