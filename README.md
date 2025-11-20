# Wedding Guest Dashboard

Dashboard para gestión de invitados y confirmaciones de boda.

## Backend API

Este frontend se conecta con el backend API disponible en:
**[https://github.com/JCastro-bit/guests-api](https://github.com/JCastro-bit/guests-api)**

El backend debe estar corriendo en `http://localhost:3000` para que el frontend funcione correctamente.

## Características

- Gestión de invitados y invitaciones
- Dashboard con estadísticas en tiempo real
- Interfaz moderna con Next.js 16 y React 19
- UI components con Radix UI y Tailwind CSS
- Validación de formularios con React Hook Form y Zod
- **Integración con API Backend** - Se conecta con el backend en `http://localhost:3000`

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

El archivo `.env.local` ya está configurado para desarrollo local:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si tu backend corre en un puerto diferente, actualiza este valor.

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

### Estadísticas
- `GET /api/v1/stats/dashboard` - Obtener estadísticas del dashboard

### Health Check
- `GET /health` - Verificar estado del backend

## Tipos y Schema

Los tipos TypeScript del frontend están sincronizados con el schema OpenAPI del backend. Ver `lib/types.ts` para más detalles.

## Carga de Datos Enriquecidos

El endpoint `GET /api/v1/invitations/` del backend no incluye los invitados en la respuesta por razones de rendimiento. Para resolver esto, el frontend implementa la función `getInvitationsWithGuests()` que:

1. Obtiene todas las invitaciones en paralelo con todos los invitados
2. Agrupa los invitados por `invitationId`
3. Enriquece cada invitación con su array correspondiente de invitados

Esto permite mostrar correctamente el número de invitados en las tarjetas de invitación sin necesidad de hacer múltiples llamadas al API.
