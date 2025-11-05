# Chisifai - Sistema de Monitoreo de Envíos de Cheesecake

## Descripción

Chisifai es un sistema de monitoreo en tiempo real para el transporte de cheesecakes que controla temperatura y fuerza G. La aplicación permite rastrear envíos en tiempo real y recibir alertas críticas.

## Tecnologías

- **Backend**: FastAPI (Python) con SQLite
- **Frontend**: React.js
- **Base de datos**: SQLite (`chisifai.db`)
- **Puertos**: Backend (8001), Frontend (3000)

## Requisitos Previos

- Python 3.8+ 
- Node.js 14+ y Yarn
- pip (gestor de paquetes de Python)

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelRegueiro/Chisifai
cd Chisifai
```

### 2. Configurar el Backend (puerto 8001)

1. Navegue al directorio de backend:
   ```bash
   cd backend
   ```

2. Instale las dependencias de Python:
   ```bash
   pip install fastapi uvicorn pydantic sqlite3
   ```

3. Inicie el servidor backend:
   ```bash
   python api_server.py
   ```

4. Para poblar la base de datos con datos de ejemplo:
   ```bash
   python populate_database.py
   ```


### 3. Configurar el Frontend (puerto 3000)

1. En una nueva terminal, navegue al directorio de frontend:
   ```bash
   cd frontend-chisifai
   ```

2. Instale las dependencias de JavaScript con yarn o npm:
   ```bash
   npm install
   ```

3. Inicie el servidor de desarrollo:
   ```bash
   npm start
   ```

## Características

- Mapa interactivo con ubicación de envíos
- Gráficos en tiempo real de temperatura y fuerza G
- Panel de alertas y métricas clave
- Diseño responsive

## Solución de Problemas Comunes

### Problemas de CORS

**Síntomas:** KPIs muestran "undefined" o "N/A", errores de red en la consola del navegador.

**Solución:** Asegúrese de que el middleware CORS esté configurado en el backend:
- FastAPI incluye CORS middleware en `api_server.py`
- Verifique que esté permitiendo los orígenes necesarios

### Problemas de conexión con la base de datos

**Síntomas:** Error al almacenar telemetría, mensajes de error relacionados con la base de datos.

**Solución:**
- Verifique que el archivo `chisifai.db` exista en el directorio de backend
- Confirme que el backend tenga permisos de lectura/escritura en el directorio


### Problemas de conexión

**Síntomas:** Mensajes de error indicando que no se puede conectar al servidor backend.

**Solución:** 
- Verifique que el backend esté corriendo en el puerto 8001
- Confirme que la variable `REACT_APP_API_URL` esté correctamente configurada en el archivo `.env` del frontend


## Estructura del Proyecto

```
Chisifai/
├── backend/
│   ├── api_server.py            # Servidor FastAPI principal con endpoints API
│   ├── populate_database.py     # Script para poblar la base de datos con datos de ejemplo
│   ├── .env                     # Variables de entorno
│   └── chisifai.db              # Base de datos SQLite
├── frontend-chisifai/           # Aplicación React para dashboard frontend
├── sensor_simulator/            # Simulador de sensores IoT
├── chisifai_node_red_flow.json  # Flujo Node-RED (opcional)
└── media/                       # Archivos multimedia
```

## Características

- Mapa interactivo con ubicación de envíos
- Gráficos en tiempo real de temperatura y fuerza G
- Panel de alertas y métricas clave
- Diseño responsive

## Funcionalidades del Backend

- `api_server.py`: Servidor API que expone endpoints para:
  - `/api/telemetry` - Últimos datos de telemetría para todos los paquetes
  - `/api/kpis` - Indicadores clave de desempeño
  - `/api/alerts` - Alertas activas
  - `/api/location` - Datos de ubicación de los paquetes
  - `/api/temperature` - Historial de temperatura
  - `/api/gforce` - Historial de fuerza G

- `populate_database.py`: Script que:
  - Inicializa la base de datos SQLite con las tablas necesarias
  - Genera datos de ejemplo para visualización
  - Inserta datos en tiempo real continuamente
  - Limpia los datos antiguos para mantener el tamaño de la base de datos manejable

## Implementación

- **API Backend**: FastAPI que sirve datos desde SQLite a la interfaz
- **Base de datos**: SQLite para almacenamiento local de telemetría y alertas
- **Simulador de sensores**: Genera datos realistas de temperatura, fuerza G, ubicación, batería y señal
- **Frontend React**: Dashboard interactivo con mapas y gráficos en tiempo real

## Medios y Capturas de Pantalla

*Página de inicio del sistema Chisifai*
![Home Page](/media/HomePage.png)

*Dashboard principal mostrando métricas en tiempo real*
![Dashboard](/media/Dashboard.png)

