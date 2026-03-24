Prioridad máxima: mantener la coherencia visual con el design system LOVEPOSTAL (variables CSS semánticas, nunca colores hardcodeados) y respetar el aislamiento multi-tenant en toda interacción con la API.

## Contexto del proyecto

LOVEPOSTAL es una plataforma B2C SaaS de invitaciones digitales para bodas (mercado México, foco Guadalajara). Este repo es el **frontend dashboard** donde parejas gestionan invitados, invitaciones, mesas y RSVPs, más las páginas públicas (welcome, invitaciones por slug).

- **Stack:** Next.js 16.0.3 · React 19.2.0 · TypeScript 5 · Tailwind CSS 4.1.9 · shadcn/ui (new-york) · Framer Motion · Zod 3.25
- **Dominios:** app.lovepostal.studio (frontend) · api.lovepostal.studio (backend) · cdn.lovepostal.studio (assets)
- **Infra:** VPS 76.13.97.90 · Docker (node:20-alpine, standalone output) · Traefik · Dokploy
- **Precios:** Esencial $2,250 MXN / Premium $4,499 MXN

## Estructura del proyecto

```
app/
  layout.tsx              — Root layout (fonts, ThemeProvider, AuthProvider, Toaster)
  error.tsx               — Error boundary global
  not-found.tsx           — Página 404 global
  globals.css             — Variables CSS del design system (light + dark)
  login/page.tsx          — Login público (sin sidebar)
  register/page.tsx       — Registro público (sin sidebar)
  forgot-password/page.tsx — Solicitar reset de contraseña (público)
  reset-password/page.tsx  — Restablecer contraseña con token (público)
  welcome/page.tsx        — Landing pública para usuarios no autenticados
  i/[slug]/page.tsx       — Vista pública de invitación por slug (con RSVP)
  i/[slug]/not-found.tsx  — 404 para slugs inexistentes
  robots.ts               — Robots.txt metadata
  sitemap.ts              — Sitemap metadata (incluye invitaciones públicas)
  (dashboard)/            — Route group protegido (con sidebar/nav)
    layout.tsx            — AuthGuard + SidebarProvider + Navigation
    error.tsx             — Error boundary del dashboard
    loading.tsx           — Loading skeleton del dashboard
    page.tsx              — Dashboard principal (stats + UpgradeBanner + ErrorAlert)
    guests/               — Lista de invitados (con loading skeleton y ErrorAlert)
    invitations/          — CRUD invitaciones + detalle [id] (crear gateado por PlanGate)
    mi-invitacion/        — Editor split-screen de invitación con preview en tiempo real
    tables/               — CRUD mesas + detalle [id] (crear gateado por PlanGate)
    upgrade/              — Selección de plan + success/failure/pending
components/
  auth-provider.tsx       — Context de auth + hook useAuth()
  auth-guard.tsx          — Guard client-side para rutas protegidas
  auth-redirect.tsx       — Redirect si ya autenticado (login/register)
  login-form.tsx          — Formulario login con validación Zod
  register-form.tsx       — Formulario registro con validación Zod
  forgot-password-form.tsx — Formulario forgot-password
  reset-password-form.tsx  — Formulario reset-password
  upgrade-banner.tsx      — Banner de upgrade (self-contained)
  plan-gate.tsx           — Overlay de bloqueo para acciones sin plan activo
  error-alert.tsx         — Banner inline reutilizable para errores de carga
  navigation.tsx          — Sidebar + header del dashboard (badge de plan)
  sidebar-provider.tsx    — Context de sidebar (collapsed state)
  search-provider.tsx     — Context de búsqueda global (Cmd+K)
  search-command.tsx      — Modal de búsqueda con command palette
  invitation-editor.tsx   — Editor split-screen con panel de controles + preview en tiempo real
  invitation-preview.tsx  — Componente visual de invitación con 4 templates (clasico, romantico, moderno, rustico)
  invitation-edit-section.tsx — Editor colapsable legacy (usado en onboarding)
  create-first-invitation.tsx — Formulario de creación inicial de invitación (cuando no existe master)
  invitation-public/      — Componentes de vista pública de invitación (hero, location, rsvp)
  ui/                     — Componentes shadcn/ui (no editar manualmente)
lib/
  api.ts                  — Cliente API con auth headers automáticos (fetchAPI, createPaymentPreference)
  auth.ts                 — Token storage (localStorage + cookie indicadora)
  templates.ts            — Definición de 4 templates de invitación (clasico/romantico/moderno/rustico) con colores, fonts, message templates
  types.ts                — Tipos TypeScript (Guest, Invitation con slug, Table, Auth, Plan, PlanStatus)
  plan.ts                 — Helpers de plan (canWrite, isPlanActive, hasQrAccess, PLAN_LABELS, PLAN_PRICES)
  utils.ts                — cn() helper (clsx + tailwind-merge)
  export-utils.ts         — Exportación a Excel/PDF
hooks/
  use-mobile.ts           — Detección responsive
  use-toast.ts            — Hook para sonner toast
  use-async.ts            — Hook para operaciones async con loading/error state
proxy.ts                  — Protección de rutas via cookie lovepostal_auth (antes middleware.ts)
```

## Comandos esenciales

```bash
npm run dev              # Servidor de desarrollo en puerto 3001
npm run build            # Build de producción (standalone)
npm run lint             # ESLint
npm run start            # Servidor de producción
```

**Docker:**
```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.lovepostal.studio -t guest-dashboard .
docker run -p 3000:3000 guest-dashboard
```

**Testing:** N/A — no hay framework de tests configurado en este proyecto.

## Convenciones de código

### Estilo y naming
- Componentes: PascalCase, un componente por archivo, archivos kebab-case (`guest-table.tsx`)
- Variables/funciones: camelCase. Tipos/interfaces: PascalCase
- Path alias: `@/*` mapea a la raíz del proyecto
- Iconos: Lucide React, 16-20px, línea fina
- Formularios: react-hook-form + zod para validación
- Notificaciones: sonner (toast)

### Paleta de colores (variables CSS semánticas obligatorias)
| Token | Uso | HSL |
|-------|-----|-----|
| `--primary` | Terracota, acciones principales | `hsl(16 61% 57%)` |
| `--background` | Fondo crema | `hsl(30 67% 97%)` |
| `--foreground` | Texto marrón oscuro | `hsl(25 53% 12%)` |
| `--success` | Estados confirmados | `hsl(140 26% 39%)` |
| `--destructive` | Errores, eliminar | `hsl(0 72% 51%)` |
| `--warning` | Advertencias | `hsl(38 42% 60%)` |
| `--info` | Información | `hsl(211 28% 50%)` |

### Tipografía
- Títulos (h1, h2): `font-serif` (Playfair Display)
- Body/UI: `font-sans` (Noto Sans)
- Templates de invitación usan fuentes adicionales cargadas en layout.tsx: Cormorant Garamond (`--font-cormorant`), Josefin Sans (`--font-josefin`), Lato (`--font-lato`), Raleway (`--font-raleway`). Se aplican via inline style dinámico en InvitationPreview

### Logos CDN
- Páginas públicas (login, register, welcome, forgot/reset-password): `logo_lovepostal_4.webp`
- Navigation sidebar (collapsed): `logo_lovepostal_6.webp` (isotipo)
- OG image: `cdn.lovepostal.studio/og-image.jpg`

### Patrones a evitar
- Colores hardcodeados: nunca `bg-white`, `text-gray-*`, `text-red-600`, hex o rgb directo
- Usar siempre variables semánticas: `bg-card`, `text-muted-foreground`, `bg-destructive/10`
- No editar archivos dentro de `components/ui/` manualmente (generados por shadcn)
- No usar `@ts-ignore` sin justificación documentada en comentario adyacente

### Proxy (antes Middleware)

Next.js 16 renombró `middleware.ts` → `proxy.ts` y `export function middleware` → `export function proxy`.

- Cookie indicadora `lovepostal_auth` — presencia indica sesión activa (no valida JWT, solo UX)
- **PUBLIC_PATHS:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/i/`, `/welcome`
- **IMPORTANTE:** usar `/i/` (con trailing slash) para que `startsWith` no matchee `/invitations` u otras rutas `/i*`
- Usuarios no autenticados en `/` → redirect a `/welcome`
- Usuarios no autenticados en rutas protegidas → redirect a `/login?from=<pathname>`

### Autenticación
- JWT en localStorage (`lovepostal_token`) + cookie indicadora (`lovepostal_auth=1`) para proxy Edge
- `fetchAPI()` en `lib/api.ts` inyecta `Authorization: Bearer` automáticamente (soporta peticiones sin token)
- Cualquier 401 limpia token y redirige a `/login`
- Forgot/reset password usan `fetch()` directo (no `fetchAPI()`) ya que son endpoints públicos sin JWT
- El forgot-password siempre muestra mensaje genérico (no revela si el email existe)
- El reset-password lee el token desde `?token=` en la URL y lo envía en el body
- Endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`
- `GET /auth/me` devuelve `plan` y `planStatus` en el usuario; `auth-provider` aplica fallbacks (`'free'` / `'inactive'`) en login, register e initial load

### Planes y pagos
- Tipos: `Plan = 'free' | 'esencial' | 'premium'`, `PlanStatus = 'inactive' | 'active' | 'expired'`
- `AuthUser` incluye `plan` y `planStatus`; `auth-provider` expone `refreshUser()` para re-fetch de `/auth/me`
- Helpers en `lib/plan.ts`: `canWrite()` (plan activo y no free), `isPlanActive()`, `hasQrAccess()` (solo premium)
- **Plan gate (client-side UX, no seguridad):** `PlanGate` bloquea visualmente botones de crear; `UpgradeBanner` muestra banner en dashboard
- Ambos componentes son self-contained: leen de `useAuth()` internamente, no requieren props de plan
- **Upgrade flow:** `/upgrade` → `createPaymentPreference()` → MercadoPago → `/upgrade/success|failure|pending`
- Success page hace auto-refresh (5 intentos c/3s) de `refreshUser()` para detectar activación del plan

### Sistema de templates de invitación
- 4 templates definidos en `lib/templates.ts`: `clasico` (free), `romantico`, `moderno`, `rustico` (esencial+)
- Cada template tiene: colores (primary/background/text/accent), fuentes (heading/body), messageTemplate con variables `{{coupleName}}`, `{{eventDate}}`, `{{venue}}`
- `InvitationPreview` renderiza la invitación según el template seleccionado (4 layouts visuales distintos)
- Colores de templates se aplican como inline style dinámico (`style={{ backgroundColor: template.colors.background }}`) — esto es correcto porque son valores dinámicos
- `InvitationEditor` es el editor split-screen: panel izquierdo (40%) con controles, panel derecho (60%) con preview en tiempo real
- En mobile: toggle button alterna entre vista editor y preview

### Vista pública de invitación (`/i/[slug]`)
- Ruta pública, no requiere autenticación
- Llama a `GET /api/v1/public/invitations/:slug` para datos de la invitación (incluye `templateId`, `colorPalette`)
- Renderiza `InvitationPreview` con el template guardado (default: `clasico`)
- RSVP via `PATCH /api/v1/public/invitations/:slug/rsvp`
- Componentes RSVP en `components/invitation-public/` (rsvp-section). Hero y location ya no se usan (reemplazados por InvitationPreview)

### Manejo de errores
- **`fetchAPI()` (lib/api.ts):** Traduce códigos HTTP a mensajes en español user-friendly (400, 401, 403, 404, 409, 422, 429, 500, 503). Errores de red → "No se pudo conectar con el servidor."
- **401 global:** Limpia token y redirige a `/login` automáticamente
- **Server components:** `Promise.allSettled` o try/catch; `<ErrorAlert />` inline con "Reintentar"
- **Client components:** `toast.error()` con mensaje del Error (ya en español desde `fetchAPI`)
- **Error boundaries:** `app/error.tsx` (global) y `app/(dashboard)/error.tsx` (dashboard)
- **404:** `app/not-found.tsx` (global) + `invitations/[id]/not-found.tsx`, `tables/[id]/not-found.tsx`, `i/[slug]/not-found.tsx`

### Variables de entorno
- `NEXT_PUBLIC_API_URL` — URL del backend (se resuelve en BUILD TIME)
- `NEXT_PUBLIC_APP_URL` — URL del frontend (metadata, OG images)
- Para desarrollo local crear `.env.local` (nunca commitear)

## Flujo de trabajo

- **Branches:** `feature/<slug>`, `bugfix/<slug>` desde `main`
- **Commits:** Conventional Commits en inglés (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- **PR:** título < 70 chars, descripción con resumen y test plan
- **Principios:** SOLID, YAGNI, KISS — no sobreingeniería

## Skills (`.claude/skills/`)

Skills disponibles para guiar generación de código frontend y SEO:

| Skill | Propósito | Cuándo se activa |
|-------|-----------|------------------|
| **frontend-design** | Interfaces distintivas y production-grade, evita estética genérica "AI slop" | Al crear componentes, páginas o UI nuevas |
| **ui-design-system** | Tokens de diseño, arquitectura de componentes, accesibilidad | Al crear/mantener design systems o tokens |
| **react-best-practices** | 40+ reglas de performance React/Next.js organizadas por impacto | Al escribir componentes React, hooks, data fetching |
| **senior-frontend** | Patterns avanzados, scaffolding, bundle analysis | Al crear componentes complejos o optimizar bundles |
| **seo-optimizer** | SEO técnico, schema markup, Core Web Vitals, keyword strategy | Al optimizar meta tags, structured data o contenido |

Cada skill tiene un `SKILL.md` con instrucciones detalladas y algunos incluyen `references/` con guías extendidas (ej: `react-best-practices/references/rules/` con 40+ reglas individuales).

## Testing

N/A — no hay framework de tests configurado. Al agregar tests, usar Vitest + React Testing Library (consistente con guests-api) con estructura AAA (Arrange, Act, Assert).

## Límites y seguridad

### SIEMPRE hacer (sin preguntar)
- Usar variables CSS semánticas para colores
- Tipar todo con TypeScript (strict mode habilitado)
- Validar inputs de usuario con Zod antes de enviar a la API
- Usar `fetchAPI()` de `lib/api.ts` para todas las llamadas al backend autenticadas
- Ejecutar `npm run lint` antes de commitear

### PREGUNTAR primero (requiere confirmación)
- Agregar dependencias nuevas al proyecto
- Modificar `proxy.ts` o flujo de autenticación
- Cambios en `app/layout.tsx` o `globals.css`
- Push a `main` o crear PRs
- Modificar la configuración de Docker o deploy

### NUNCA hacer (prohibido absoluto)
- Modificar `.env*` o archivos con credenciales
- Hard delete en BD (solo soft delete con `deletedAt`)
- Queries sin filtro de tenant en contexto multi-tenant
- Commitear secrets, tokens o API keys
- Ignorar errores TypeScript con `@ts-ignore` sin justificación documentada
- Ejecutar comandos destructivos contra la base de datos de producción
- Usar colores hardcodeados (hex, rgb, clases Tailwind como `text-red-600`, `bg-white`)
- Editar manualmente archivos en `components/ui/` (usar `npx shadcn@latest add`)

### Archivos protegidos (no modificar sin confirmación explícita)
- `.env*`, `proxy.ts`, `app/layout.tsx`, `app/globals.css`
- `next.config.mjs`, `Dockerfile`, `package.json`, `tsconfig.json`
- `lib/auth.ts`, `components/auth-provider.tsx`
