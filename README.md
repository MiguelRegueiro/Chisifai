# Chisifai - Sistema de Monitoreo de Envíos de Cheesecake

## Descripción

Chisifai es un sistema de monitoreo en tiempo real para el transporte de cheesecakes que controla temperatura y fuerza G. La aplicación permite rastrear envíos en tiempo real y recibir alertas críticas.

## Tecnologías

- **Backend**: FastAPI (Python) with PostgreSQL
- **Frontend**: React.js
- **MQTT Broker**: For sensor data publishing
- **Node-RED**: For data processing pipeline
- **Base de datos**: PostgreSQL (with SQLite fallback for development)
- **Puertos**: Backend (8001), Frontend (3000), Node-RED (1880)

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
   pip install -r requirements.txt
   ```

3. Inicie el servidor backend:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8001
   ```

4. Inicialice la base de datos (si es necesario):
   ```bash
   python init_db.py
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

**Solución:** Asegúrese de que flask-cors esté instalado y configurado en el backend:
- Instale flask-cors: `pip install flask-cors`
- Verifique que `CORS(app)` esté habilitado en `telemetry_ingestor.py`


## Estructura del Proyecto

```
Chisifai/
├── backend/
│   ├── main.py                  # Servidor FastAPI principal
│   ├── database.py              # Configuración de base de datos SQLAlchemy
│   ├── models.py                # Modelos de datos Pydantic
│   ├── init_db.py               # Script de inicialización de base de datos
│   ├── .env                     # Variables de entorno
│   └── requirements.txt         # Dependencias de Python
├── frontend-chisifai/           # Aplicación React
├── sensor_simulator/            # Simulador de sensores MQTT
├── chisifai_node_red_flow.json  # Flujo Node-RED para procesamiento de datos
└── start_servers.sh             # Script para iniciar todos los servidores
```

## Características

- Mapa interactivo con ubicación de envíos
- Gráficos en tiempo real de temperatura y fuerza G
- Panel de alertas y métricas clave
- Diseño responsive

## Implementación del Capítulo 1 - "Del sensor al primer dato"

- **Simulador de sensores**: Publicador MQTT que genera datos realistas de telemetría
- **Flujo Node-RED**: Validación de JSON y lógica de reintento para alta disponibilidad
- **API de ingesta**: FastAPI con integración PostgreSQL para almacenamiento persistente
- **Resiliencia**: Sistema capaz de manejar fallos temporales sin pérdida de datos
