# Wedding Guest Dashboard

Dashboard para gestión de invitados y confirmaciones de boda.

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

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

El archivo `.env.local` ya está configurado para desarrollo local:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si tu backend corre en un puerto diferente, actualiza este valor.

### 3. Asegúrate de que el backend esté corriendo

El frontend necesita que el backend API esté disponible en `http://localhost:3000` para funcionar correctamente.

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
