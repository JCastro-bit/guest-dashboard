# LOVEPOSTAL — Guest Dashboard

Dashboard para gestión de invitados y confirmaciones de boda para [LOVEPOSTAL](https://lovepostal.studio).

## Backend API

Este frontend se conecta con el backend API disponible en:
**[https://github.com/JCastro-bit/guests-api](https://github.com/JCastro-bit/guests-api)**

El backend debe estar corriendo en `http://localhost:3000` para que el frontend funcione correctamente.

## Características

- Gestión de invitados e invitaciones
- Dashboard con estadísticas en tiempo real
- Gestión de mesas y asignación de asientos
- Dark mode con paleta de marca LOVEPOSTAL (terracota/crema)
- Exportación a Excel, PDF y CSV
- Interfaz moderna con Next.js 16 y React 19
- UI components con shadcn/ui + Radix UI + Tailwind CSS v4
- Tipografía: Playfair Display (títulos) + Noto Sans (body)
- Iconos: Lucide React
- **Integración con API Backend** - Se conecta con el backend en `http://localhost:3000`

## Tecnologías

- **Framework:** Next.js 16
- **UI:** React 19, Tailwind CSS v4, shadcn/ui, Radix UI
- **Animaciones:** Framer Motion
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **TypeScript:** Soporte completo
- **Tema:** next-themes (dark/light mode)

## Requisitos

- Node.js (versión recomendada: 18 o superior)
- npm
- **Backend API corriendo en `http://localhost:3000`**
  - Clona el repositorio del backend: [https://github.com/JCastro-bit/guests-api](https://github.com/JCastro-bit/guests-api)
  - Sigue las instrucciones de instalación del backend
  - Asegúrate de que esté corriendo en el puerto 3000

## Configuración

### 1. Configurar el Backend

Antes de iniciar el frontend, asegúrate de tener el backend corriendo:

```bash
# En otro terminal, clona y configura el backend
git clone https://github.com/JCastro-bit/guests-api.git
cd guests-api
# Sigue las instrucciones de instalación del README del backend
npm install
npm run dev # o el comando correspondiente para iniciar el backend
```

### 2. Instalar dependencias del Frontend

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta si es necesario:

```bash
cp .env.example .env.local
```

Variables disponibles:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000    # URL del backend API
NEXT_PUBLIC_APP_URL=http://localhost:3001    # URL de esta app (para metadata/OG)
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
│   ├── invitations/     # Página de invitaciones
│   └── tables/          # Página de gestión de mesas
├── components/          # Componentes React
│   └── ui/             # Componentes shadcn/ui
├── hooks/              # Custom hooks
├── lib/                # API client, tipos, utilidades
└── public/             # Archivos estáticos
```

## Desarrollo

El servidor de desarrollo corre en `http://localhost:3001`

```bash
npm run dev
```

### Conectando con el Backend Local

1. **Backend**: Asegúrate de que tu backend API esté corriendo en `http://localhost:3000`
2. **Frontend**: Ejecuta `npm run dev` (corre en puerto 3001)
3. El frontend se conectará automáticamente al backend usando la configuración de `.env.local`

## API Backend

El frontend consume los siguientes endpoints del backend:

### Invitaciones
- `GET /api/v1/invitations/` - Listar invitaciones
- `GET /api/v1/invitations/{id}` - Ver detalles de invitación
- `POST /api/v1/invitations/` - Crear invitación
- `POST /api/v1/invitations/with-guests` - Crear invitación con invitados
- `PUT /api/v1/invitations/{id}` - Actualizar invitación
- `DELETE /api/v1/invitations/{id}` - Eliminar invitación

### Invitados
- `GET /api/v1/guests/` - Listar invitados
- `GET /api/v1/guests/{id}` - Ver detalles de invitado
- `POST /api/v1/guests/` - Crear invitado
- `PUT /api/v1/guests/{id}` - Actualizar invitado
- `DELETE /api/v1/guests/{id}` - Eliminar invitado

### Mesas
- `GET /api/v1/tables/` - Listar mesas
- `GET /api/v1/tables/{id}` - Ver detalles de mesa
- `POST /api/v1/tables/` - Crear mesa
- `PUT /api/v1/tables/{id}` - Actualizar mesa
- `DELETE /api/v1/tables/{id}` - Eliminar mesa

### Estadísticas
- `GET /api/v1/stats/dashboard` - Estadísticas del dashboard
- `GET /api/v1/stats/tables` - Estadísticas de mesas

### Health Check
- `GET /health` - Verificar estado del backend

## Guía de Marca

Para lineamientos detallados de marca, colores, tipografía y convenciones de código, consulta [CLAUDE.md](./CLAUDE.md).

## Dominio

- **Producción:** app.lovepostal.studio
- **Sitio principal:** lovepostal.studio
- **CDN assets:** cdn.lovepostal.studio
