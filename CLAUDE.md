---
name: guest-dashboard-lovepostal
description: Dashboard de gestión de invitados para bodas — frontend de LOVEPOSTAL
version: "0.1.0"
model: any
tools: [Read, Edit, Write, Bash, Glob, Grep]
tags: [nextjs, react, typescript, tailwindcss, shadcn, wedding-saas]
---

Prioridad máxima: mantener la coherencia visual con el design system LOVEPOSTAL (variables CSS semánticas, nunca colores hardcodeados) y respetar el aislamiento multi-tenant en toda interacción con la API.

## Contexto del proyecto

LOVEPOSTAL es una plataforma B2C SaaS de invitaciones digitales para bodas (mercado México, foco Guadalajara). Este repo es el **frontend dashboard** donde parejas gestionan invitados, invitaciones, mesas y RSVPs.

- **Stack:** Next.js 16.0.3 · React 19.2.0 · TypeScript 5 · Tailwind CSS 4.1.9 · shadcn/ui (new-york) · Framer Motion · Zod 3.25
- **Dominios:** app.lovepostal.studio (frontend) · api.lovepostal.studio (backend) · cdn.lovepostal.studio (assets)
- **Infra:** VPS 76.13.97.90 · Docker (node:20-alpine, standalone output) · Traefik · Dokploy
- **Precios:** Esencial $2,250 MXN / Premium $4,499 MXN

## Estructura del proyecto

```
app/
  layout.tsx              — Root layout (fonts, ThemeProvider, AuthProvider, Toaster)
  globals.css             — Variables CSS del design system (light + dark)
  login/page.tsx          — Login público (sin sidebar)
  register/page.tsx       — Registro público (sin sidebar)
  forgot-password/page.tsx — Solicitar reset de contraseña (público)
  reset-password/page.tsx  — Restablecer contraseña con token (público)
  opengraph-image.tsx     — OG image generation
  robots.ts               — Robots.txt metadata
  sitemap.ts              — Sitemap metadata
  (dashboard)/            — Route group protegido (con sidebar/nav)
    layout.tsx            — AuthGuard + SidebarProvider + Navigation (layout protegido)
    page.tsx              — Dashboard principal (stats)
    guests/page.tsx       — Lista de invitados
    invitations/          — CRUD invitaciones + detalle [id]
    tables/               — CRUD mesas + detalle [id]
components/
  auth-provider.tsx       — Context de auth + hook useAuth()
  auth-guard.tsx          — Guard client-side para rutas protegidas
  auth-redirect.tsx       — Redirect si ya autenticado (login/register)
  login-form.tsx          — Formulario login con validación Zod
  register-form.tsx       — Formulario registro con validación Zod
  forgot-password-form.tsx — Formulario forgot-password (estados: idle/loading/success)
  reset-password-form.tsx  — Formulario reset-password (estados: idle/loading/success/error)
  navigation.tsx          — Sidebar + header del dashboard
  sidebar-provider.tsx    — Context de sidebar (collapsed state)
  theme-provider.tsx      — Wrapper de next-themes
  ui/                     — Componentes shadcn/ui (no editar manualmente)
lib/
  api.ts                  — Cliente API con auth headers automáticos (fetchAPI)
  auth.ts                 — Token storage (localStorage + cookie indicadora)
  types.ts                — Tipos TypeScript (Guest, Invitation, Table, Auth)
  utils.ts                — cn() helper (clsx + tailwind-merge)
  export-utils.ts         — Exportación a Excel/PDF
hooks/                    — use-mobile.ts, use-toast.ts
middleware.ts             — Protección de rutas via cookie lovepostal_auth (PUBLIC_PATHS: login, register, forgot-password, reset-password)
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

### Patrones a evitar
- Colores hardcodeados: nunca `bg-white`, `text-gray-*`, `text-red-600`, hex o rgb directo
- Usar siempre variables semánticas: `bg-card`, `text-muted-foreground`, `bg-destructive/10`
- No editar archivos dentro de `components/ui/` manualmente (generados por shadcn)
- No usar `@ts-ignore` sin justificación documentada en comentario adyacente

### Autenticación
- JWT en localStorage (`lovepostal_token`) + cookie indicadora (`lovepostal_auth=1`) para middleware Edge
- `fetchAPI()` en `lib/api.ts` inyecta `Authorization: Bearer` automáticamente (soporta peticiones sin token)
- Cualquier 401 limpia token y redirige a `/login`
- Rutas públicas (sin auth): `/login`, `/register`, `/forgot-password`, `/reset-password` (configuradas en `middleware.ts`)
- Forgot/reset password usan `fetch()` directo (no `fetchAPI()`) ya que son endpoints públicos sin JWT
- El forgot-password siempre muestra mensaje genérico (no revela si el email existe)
- El reset-password lee el token desde `?token=` en la URL y lo envía en el body
- Endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`

### Variables de entorno
- `NEXT_PUBLIC_API_URL` — URL del backend (se resuelve en BUILD TIME)
- `NEXT_PUBLIC_APP_URL` — URL del frontend (metadata, OG images)
- Para desarrollo local crear `.env.local` (nunca commitear)

## Flujo de trabajo

- **Branches:** `feature/<slug>`, `bugfix/<slug>` desde `main`
- **Commits:** Conventional Commits en inglés (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- **PR:** título < 70 chars, descripción con resumen y test plan
- **Principios:** SOLID, YAGNI, KISS — no sobreingeniería

## Testing

N/A — no hay framework de tests configurado. Al agregar tests, usar Vitest + React Testing Library (consistente con guests-api) con estructura AAA (Arrange, Act, Assert).

## Límites y seguridad

### SIEMPRE hacer (sin preguntar)
- Usar variables CSS semánticas para colores
- Tipar todo con TypeScript (strict mode habilitado)
- Validar inputs de usuario con Zod antes de enviar a la API
- Usar `fetchAPI()` de `lib/api.ts` para todas las llamadas al backend
- Ejecutar `npm run lint` antes de commitear

### PREGUNTAR primero (requiere confirmación)
- Agregar dependencias nuevas al proyecto
- Modificar `middleware.ts` o flujo de autenticación
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
- `.env*`, `middleware.ts`, `app/layout.tsx`, `app/globals.css`
- `next.config.mjs`, `Dockerfile`, `package.json`, `tsconfig.json`
- `lib/auth.ts`, `components/auth-provider.tsx`
