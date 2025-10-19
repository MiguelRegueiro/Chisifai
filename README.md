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
- FastAPI incluye CORS middleware en `main.py`
- Verifique que esté permitiendo los orígenes necesarios

### Problemas de conexión con la base de datos

**Síntomas:** Error al almacenar telemetría, mensajes de error relacionados con la base de datos.

**Solución:**
- Verifique que el archivo `.env` tenga la configuración correcta de DATABASE_URL
- Para desarrollo con SQLite: `DATABASE_URL=sqlite:///./chisifai.db`
- Para producción con PostgreSQL: `DATABASE_URL=postgresql://usuario:contraseña@localhost/nombre_bd`


### Problemas de conexión

**Síntomas:** Mensajes de error indicando que no se puede conectar al servidor backend.

**Solución:** 
- Verifique que el backend esté corriendo en el puerto 8001
- Confirme que la variable `REACT_APP_API_URL` esté correctamente configurada en el archivo `.env` del frontend


## Estructura del Proyecto

```
Chisifai/
├── backend/
│   ├── main.py                  # Servidor FastAPI principal con endpoints API
│   ├── database.py              # Configuración de base de datos SQLAlchemy
│   ├── models.py                # Modelos de datos Pydantic para validación
│   ├── .env                     # Variables de entorno
│   ├── telemetry_ingestor.py    # Versión Flask (anterior/alternativa sin base de datos SQL)
│   └── requirements.txt         # Dependencias de Python
├── frontend-chisifai/           # Aplicación React para dashboard frontend
├── sensor_simulator/            # Simulador de sensores IoT que publica a MQTT
├── chisifai_node_red_flow.json  # Flujo Node-RED con validación y reintento
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

## Medios y Capturas de Pantalla

![Dashboard](/media/Dashboard.png)
*Dashboard principal mostrando métricas en tiempo real*

![Home Page](/media/HomePage.png)
*Página de inicio del sistema Chisifai*

![Node-RED Flow](/media/NodeRedFlow.png)
*Flujo Node-RED para procesamiento de telemetría con validación y reintento*

![Consulta Base de Datos](/media/SELECTaBaseDeDatos.png)
*Consulta SELECT mostrando la secuencia de eventos almacenados con timestamps correctos*

