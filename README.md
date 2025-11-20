# Wedding Guest Dashboard

Dashboard para gestión de invitados y confirmaciones de boda.

## Características

- Gestión de invitados
- Sistema de invitaciones
- Dashboard con estadísticas
- Interfaz moderna con Next.js 16 y React 19
- UI components con Radix UI y Tailwind CSS
- Validación de formularios con React Hook Form y Zod

## Tecnologías

- **Framework:** Next.js 16
- **UI:** React 19, Tailwind CSS, Radix UI
- **Formularios:** React Hook Form, Zod
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **TypeScript:** Soporte completo

## Requisitos

- Node.js (versión recomendada: 18 o superior)
- npm

## Instalación

```bash
# Instalar dependencias
npm install
```

## Scripts Disponibles

```bash
# Desarrollo (puerto 3001)
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linter
npm run lint
```

## Estructura del Proyecto

```
├── app/                  # App Router de Next.js
│   ├── guests/          # Página de gestión de invitados
│   └── invitations/     # Página de invitaciones
├── components/          # Componentes React
│   └── ui/             # Componentes de UI reutilizables
├── hooks/              # Custom hooks
├── lib/                # Utilidades y tipos
└── public/             # Archivos estáticos
```

## Desarrollo

El servidor de desarrollo corre en `http://localhost:3001`

```bash
npm run dev
```
