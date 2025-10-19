# Chisifai - Sistema de Monitoreo de Envíos de Cheesecake

## Descripción

Chisifai es un sistema de monitoreo en tiempo real para el transporte de cheesecakes que controla temperatura y fuerza G. La aplicación permite rastrear envíos en tiempo real y recibir alertas críticas.

## Tecnologías

- **Backend**: Flask (Python)
- **Frontend**: React.js
- **Base de datos**: SQLite
- **Puertos**: Backend (8001), Frontend (3000)

## Requisitos Previos

- Python 3.8+ 
- Node.js 14+ y Yarn
- pip (gestor de paquetes de Python)

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Chisifai
```

### 2. Configurar el Backend (puerto 8001)

1. Navegue al directorio de backend:
   ```bash
   cd backend
   ```

2. Instale las dependencias de Python:
   ```bash
   pip install flask flask-cors
   ```

3. Configure las variables de entorno (opcional, el sistema usará valores por defecto):
   - Cree un archivo `.env` en el directorio `backend` si desea personalizar configuraciones

4. Inicie el servidor backend:
   ```bash
   python telemetry_ingestor.py
   ```

### 3. Configurar el Frontend (puerto 3000)

1. En una nueva terminal, navegue al directorio de frontend:
   ```bash
   cd frontend-chisifai
   ```

2. Instale las dependencias de JavaScript:
   ```bash
   yarn install
   ```

3. Configure las variables de entorno:
   - Cree un archivo `.env` en el directorio `frontend-chisifai` con el siguiente contenido:
   ```
   REACT_APP_API_URL=http://localhost:8001
   ```

4. Inicie el servidor de desarrollo:
   ```bash
   yarn start
   ```

## Inicio Rápido

Para iniciar ambos servidores simultáneamente, puede usar el script proporcionado:

```bash
./start_servers.sh
```

Este script iniciará tanto el backend como el frontend en terminales separadas.

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

### Problemas de conexión

**Síntomas:** Mensajes de error indicando que no se puede conectar al servidor backend.

**Solución:** 
- Verifique que el backend esté corriendo en el puerto 8001
- Confirme que la variable `REACT_APP_API_URL` esté correctamente configurada en el archivo `.env` del frontend

## Estructura del Proyecto

```
Chisifai/
├── backend/
│   ├── telemetry_ingestor.py    # Servidor Flask principal
│   ├── database.py              # Configuración de base de datos
│   └── requirements.txt         # Dependencias de Python
├── frontend-chisifai/           # Aplicación React
├── sensor_simulator/            # Simulador de sensores
└── start_servers.sh             # Script para iniciar ambos servidores
```

### Inicio Rápido

Use el script proporcionado para iniciar ambos servidores:

```bash
./start_servers.sh
```

## Características

- Mapa interactivo con ubicación de envíos
- Gráficos en tiempo real de temperatura y fuerza G
- Panel de alertas y métricas clave
- Diseño responsive
