# Chisifai Frontend

Panel de monitoreo en tiempo real para el sistema de entrega de cheesecakes Chisifai.

## Características

- Visualización en tiempo real de condiciones de entrega (temperatura, humedad, vibración)
- Mapa interactivo con ubicación de entregas activas
- Panel de alertas en tiempo real
- Gráficos de telemetría en tiempo real
- Lista de entregas activas con estado
- Vista detallada de cada entrega

## Requisitos

- Node.js 16+
- npm o yarn

## Instalación

1. `cd services/ui`
2. `npm install` o `yarn install`
3. Configurar variables de entorno (ver `.env`)
4. `npm start` o `yarn start`

## Variables de Entorno

- `REACT_APP_API_URL`: URL de la API backend (default: http://localhost:8000)
- `REACT_APP_SOCKET_URL`: URL del WebSocket para actualizaciones en tiempo real

## Estructura del Proyecto

- `src/components/`: Componentes React organizados por funcionalidad
- `src/hooks/`: Hooks personalizados para lógica compartida
- `src/services/`: Lógica de comunicación con APIs
- `src/utils/`: Funciones de utilidad y constantes
- `src/styles/`: Estilos globales y componentes

## Tecnologías Utilizadas

- React 18
- Material UI
- React Leaflet
- Recharts
- Socket.io Client
- Axios

## API Endpoints Utilizados

- `/api/telemetry/latest` - Obtener telemetría más reciente
- `/api/telemetry/history/{part_id}` - Historial de telemetría
- `/api/alerts/active` - Alertas activas
- `/api/deliveries/active` - Entregas activas