# EVIN — Frontend

**Demo en producción:** [evin.click](https://evin.click) · **Backend (API):** [evin-backend](https://github.com/anyellow93/evin-backend)

EVIN es una plataforma web para la **estimulación visual y el aprendizaje personalizado** de alumnado con necesidades educativas específicas. Los docentes gestionan contenidos y siguen el progreso de cada alumno. El alumnado trabaja con una interfaz accesible, diseñada según los criterios **WCAG 2.1**.

Es mi **Proyecto Fin de Grado** de Ingeniería Informática (UNED), calificado con **Matrícula de Honor**. Lo sigo desarrollando y está publicado en producción.

Este repositorio contiene el **frontend**: una aplicación en HTML, CSS y JavaScript que usa **componentes de Vue 3** y consume la API REST del backend en Ruby on Rails.



---

## Funcionalidades

- Inicio de sesión contra la API (Devise + JWT)
- Vistas diferenciadas para **docente** y **alumno**
- Panel del docente para gestionar contenidos y ver el progreso del alumnado
- Actividades interactivas de estimulación visual (por ejemplo, puzzle y carrusel)
- **Interfaz accesible y responsive** (WCAG 2.1): contraste, navegación por teclado y tamaños adaptables
- Optimizada con **PageSpeed Insights** (rendimiento y SEO)

---

## Stack técnico

| Parte | Tecnología |
|---|---|
| Estructura | HTML5 semántico |
| Estilos | CSS3, diseño responsive |
| Lógica | JavaScript (ES6+) con **componentes Vue 3** |
| Comunicación | API REST (JSON) + JWT |
| Backend | Ruby on Rails 7 + PostgreSQL ([evin-backend](https://github.com/anyellow93/evin-backend)) |

La app no necesita compilación ni bundler: Vue 3 se carga directamente en el navegador, así el despliegue se reduce a servir archivos estáticos.

## Estructura del proyecto

```
evin-frontend/
├── index.html      # punto de entrada
├── css/            # estilos
├── js/             # componentes Vue 3 y lógica de la aplicación
├── img/            # imágenes y recursos
└── robots.txt
```

## Arquitectura

```
┌───────────────────────────┐   HTTP/JSON + JWT   ┌──────────────────┐      ┌────────────┐
│ evin-frontend             │ ──────────────────► │ evin-backend     │ ───► │ PostgreSQL │
│ HTML + CSS + JS (Vue 3)   │ ◄────────────────── │ Rails 7 API      │      └────────────┘
└───────────────────────────┘                     └──────────────────┘
```

---

## Ejecutar en local

No hace falta instalar dependencias. Basta con servir la carpeta con cualquier servidor estático:

```bash
git clone https://github.com/anyellow93/evin-frontend.git
cd evin-frontend

# Opción 1: Python
python3 -m http.server 8080

# Opción 2: extensión "Live Server" de VS Code (clic derecho en index.html → Open with Live Server)
```

Abre `http://localhost:8080`. Para que funcione el login, el backend tiene que estar arrancado (ver [evin-backend](https://github.com/anyellow93/evin-backend)).

---

## Decisiones técnicas

- **Vue 3 sin bundler**: permite usar componentes reactivos sin la complejidad de un proceso de build, con un despliegue muy sencillo.
- **Frontend y API separados**: cada parte se despliega por separado y la API podría reutilizarse en una app móvil.
- **JWT** para autenticarse contra la API sin depender de cookies de sesión.
- **Accesibilidad desde el diseño**: el público objetivo la necesita, así que se tuvo en cuenta desde el principio.

## Prueba la demo

Entra en [evin.click](https://evin.click) con estas cuentas de demostración:

| Rol | Email | Contraseña |
|---|---|---|
| Docente | demo.docente@evin.click | Demo1234! |
| Alumno | demo.alumno@evin.click | Demo1234! |

## Autor

**Ángel López Antón** — Ingeniero Informático
[LinkedIn](https://linkedin.com/in/angellopez26) · [GitHub](https://github.com/anyellow93) · angelopez267@gmail.com
