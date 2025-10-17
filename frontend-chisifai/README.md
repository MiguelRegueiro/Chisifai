# Panel de Control Frontend Chisifai

## Descripción General

Chisifai es un panel de control de monitoreo para rastrear envíos de cheesecake con datos de telemetría en tiempo real. El frontend proporciona una vista completa de ubicaciones de envío, lecturas de temperatura, mediciones de fuerza G y alertas críticas.

## Características

- Rastreo de envíos en tiempo real en un mapa interactivo
- Gráficos en vivo de monitoreo de temperatura y fuerza G
- Panel de control con indicadores clave de desempeño (KPIs)
- Sistema de alertas para eventos críticos
- Diseño responsive para diferentes tamaños de pantalla

## Arquitectura

El frontend está construido usando React.js con las siguientes tecnologías:

- **React.js**: Framework UI basado en componentes
- **React Bootstrap**: Layout y estilizado responsive
- **React Leaflet**: Visualización de mapas interactivos
- **Chart.js**: Visualización de datos en tiempo real
- **React Router**: Enrutamiento del lado del cliente
- **Yarn**: Gestión de paquetes

## Componentes Clave

- `Dashboard.js`: Componente de layout principal
- `DataContext.js`: Gestión global de estado
- `Map.js`: Mapa interactivo con ubicaciones de envío
- `TemperatureChart.js`: Visualización en tiempo real de temperatura
- `GForceChart.js`: Visualización en tiempo real de fuerza G
- `KPIs.js`: Visualización de indicadores clave de desempeño
- `Alerts.js`: Notificaciones de alertas críticas
- `apiService.js`: Capa de comunicación API

## Configuración

1. Clone el repositorio
2. Instale las dependencias: `yarn install`
3. Cree un archivo `.env` con su URL de API:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```
4. Inicie el servidor de desarrollo: `yarn start`
5. Abra su navegador en http://localhost:3000

## Compilación para Producción

Para crear una compilación de producción:

```bash
yarn build
```

La compilación optimizada se colocará en la carpeta `build/`.

## Variables de Entorno

- `REACT_APP_API_URL`: URL de la API backend (por defecto: http://localhost:8000)

## Seguridad

Esta aplicación ha sido configurada teniendo en cuenta la seguridad:
- Las dependencias se actualizan regularmente para abordar vulnerabilidades
- Las llamadas API usan HTTPS seguro cuando se despliega en producción
- La validación de entradas debe implementarse en el backend

## Endpoints de API Usados

El frontend se comunica con la API backend para obtener:
- `/api/telemetry` - Datos de telemetría de envío en tiempo real
- `/api/kpis` - Indicadores clave de desempeño
- `/api/alerts` - Alertas y notificaciones críticas
- `/api/location` - Datos de ubicación del envío
- `/api/temperature` - Lecturas de temperatura
- `/api/gforce` - Mediciones de fuerza G