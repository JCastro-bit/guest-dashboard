# CLAUDE.md — LOVEPOSTAL Guest Dashboard

## Proyecto
- **Nombre:** LOVEPOSTAL — Dashboard de Invitados de Boda
- **Dominio:** lovepostal.studio (NO lovepostal.app)
- **Subdominio app:** app.lovepostal.studio
- **Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui + TypeScript
- **Iconos:** Lucide React (línea fina, 16-20px)
- **Animaciones:** Framer Motion

## Comandos
- `npm run dev` — Servidor de desarrollo (puerto 3001)
- `npm run build` — Build de producción
- `npm run lint` — ESLint
- Backend API debe estar en `http://localhost:3000`

## Paleta de Colores (CSS Variables HSL)
- `--primary`: terracota #D4714E — `hsl(16 61% 57%)`
- `--background`: crema claro #FDFAF6 — `hsl(30 67% 97%)`
- `--foreground`: marrón oscuro #2D1B0E — `hsl(25 53% 12%)`
- `--secondary`: crema arena #F5E6D3 — `hsl(34 63% 89%)`
- `--destructive`: rojo #C0392B — `hsl(0 72% 51%)`
- `--success`: verde #4A7C59 — `hsl(140 26% 39%)`
- `--warning`: dorado #C9A96E — `hsl(38 42% 60%)`
- `--info`: azul #5B7FA5 — `hsl(211 28% 50%)`

## Reglas de Estilo
- NUNCA usar colores hardcodeados (hex, rgb, tailwind colors como text-red-600). Usar variables semánticas.
- NUNCA usar `bg-white`. Usar `bg-card` o `bg-background`.
- NUNCA usar text-gray-*, bg-slate-*, etc. Usar `text-muted-foreground`, `bg-muted`, etc.
- Para estados de éxito: `text-success`, `bg-success/10`
- Para advertencias: `text-warning`, `bg-warning/10`
- Para errores/destructivo: `text-destructive`, `bg-destructive/10`
- Para información: `text-info`, `bg-info/10`
- Bordes: `rounded-lg` (0.5rem / 8px)
- Sombras: cálidas con base marrón `rgba(45, 27, 14, 0.08)`

## Tipografía
- **Títulos (h1, h2):** Playfair Display → clase `font-serif`
- **Body/UI:** Noto Sans → clase `font-sans`
- Las fonts se cargan via `next/font/google` en `app/layout.tsx`

## Logos (CDN)
- Header light: `https://cdn.lovepostal.studio/logotipos/logo_lovepostal_6.webp`
- Header dark: `https://cdn.lovepostal.studio/logotipos/logo_lovepostal_4.webp`
- Footer: `https://cdn.lovepostal.studio/logotipos/logo_lovepostal_5.webp`

## Estructura
```
app/          — Pages (Next.js App Router)
components/   — React components
components/ui/ — shadcn/ui components (no editar manualmente)
lib/          — API client, types, utilities
hooks/        — Custom hooks
public/       — Static assets
```

## Convenciones
- Componentes shadcn usan variables CSS semánticas — se actualizan automáticamente al cambiar el tema
- Dark mode vía `next-themes` con `ThemeProvider` en layout
- API client en `lib/api.ts` con `NEXT_PUBLIC_API_URL`
- Tipos TypeScript en `lib/types.ts`

## Docker / Deploy (Dokploy)
- **Dockerfile:** Multi-stage (deps → builder → runner), standalone output
- **Base image:** node:20-alpine
- **Container port:** 3000
- **Build arg:** `NEXT_PUBLIC_API_URL=https://api.lovepostal.studio`
- **NEXT_PUBLIC_* vars** se resuelven en BUILD TIME (cambiar requiere rebuild)
- **Dominio:** app.lovepostal.studio (Traefik + Let's Encrypt)
- **Dokploy config:** Build Type = Dockerfile, Container Port = 3000, HTTPS enabled
- **Build local:** `docker build --build-arg NEXT_PUBLIC_API_URL=https://api.lovepostal.studio -t guest-dashboard .`
- **Run local:** `docker run -p 3000:3000 guest-dashboard`
