# EVIN — Plataforma educativa accesible

**Demo en producción:** [evin.click](https://evin.click)

EVIN es una plataforma web para la **estimulación visual y el aprendizaje personalizado** de alumnado con necesidades educativas específicas. Los docentes gestionan contenidos y siguen el progreso de cada alumno desde un panel de administración. El alumnado trabaja con una interfaz accesible, diseñada según los criterios **WCAG 2.1**.

Es mi **Proyecto Fin de Grado** de Ingeniería Informática (UNED), calificado con **Matrícula de Honor**. Lo sigo desarrollando y está publicado en producción.



---

## Funcionalidades

- **Autenticación** de usuarios con Devise + JWT y gestión de sesiones
- **Roles**: docente y alumno, cada uno con su propia vista
- **Gestión de contenidos educativos** desde el panel del docente
- **Seguimiento del progreso** individual de cada alumno
- **Interfaz accesible y responsive** (WCAG 2.1): contraste, navegación por teclado y tamaños adaptables



---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | Vue.js 3 (Composition API), Vue Router, Pinia |
| Backend | Ruby on Rails 7 (modo API), arquitectura MVC |
| API | REST + JSON |
| Autenticación | Devise + JWT |
| Base de datos | PostgreSQL |
| Control de versiones | Git / GitHub |

## Arquitectura

```
┌──────────────────┐   HTTP/JSON + JWT   ┌──────────────────┐        ┌────────────┐
│  evin-frontend   │ ──────────────────► │   evin-backend   │ ─────► │ PostgreSQL │
│  Vue 3 + Pinia   │ ◄────────────────── │  Rails 7 API     │        └────────────┘
└──────────────────┘                     └──────────────────┘
```

Frontend y backend van en repositorios separados y se comunican solo por la API REST.

- Backend: `evin-backend`
- Frontend: `evin-frontend`

---

## Instalación en local

### Requisitos
- Ruby 3.x y Bundler
- Node.js 18+ y npm
- PostgreSQL 14+

### Backend
```bash
git clone https://github.com/anyellow93/evin-backend.git
cd evin-backend
bundle install
cp .env.example .env        # configura credenciales de BD y DEVISE_JWT_SECRET_KEY
rails db:create db:migrate db:seed
rails server                # http://localhost:3000
```

### Frontend
```bash
git clone https://github.com/anyellow93/evin-frontend.git
cd evin-frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:3000
npm run dev                 # http://localhost:5173
```

### Usuario de prueba

- Docente: `demo.docente@evin.test` / `Demo1234!`
- Alumno: `demo-alumno@evin.test` / `Demo1234!`

---

## Decisiones técnicas

- **API separada del frontend**: permite desplegar y escalar cada parte por separado, y deja abierta la posibilidad de una app móvil en el futuro.
- **JWT en lugar de cookies de sesión**: autenticación sin estado entre dominios distintos (frontend y API).
- **Pinia** para el estado global (usuario autenticado, progreso), porque es el gestor oficial y recomendado en Vue 3.
- **Accesibilidad desde el diseño**: el público objetivo la necesita, así que se tuvo en cuenta desde el principio y no se añadió al final.

## Documentación

El proyecto incluye documentación técnica con diagramas UML de casos de uso, secuencia y clases (carpeta `docs/`).

## Próximos pasos

- [ ] Tests automatizados (RSpec en backend, Vitest en frontend)
- [ ] Más tipos de actividades de estimulación visual
- [ ] Informes de progreso exportables para familias

---

## Autor

**Ángel López Antón** — Ingeniero Informático
[LinkedIn](https://linkedin.com/in/angellopez26) · [GitHub](https://github.com/anyellow93) · angelopez267@gmail.com
