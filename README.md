# Chisifai - Sistema de Monitoreo de Envíos de Cheesecake

## Descripción

Chisifai es un sistema de monitoreo en tiempo real para el transporte de cheesecakes que controla temperatura y fuerza G. La aplicación permite rastrear envíos en tiempo real y recibir alertas críticas.

## Tecnologías

- **Backend**: FastAPI (puerto 8001)
- **Frontend**: React.js (puerto 3000)

## Instalación

### Backend (puerto 8001)

1. Navegue al directorio de backend:
   ```bash
   cd backend
   ```

2. Instale las dependencias:
   ```bash
   pip install fastapi uvicorn[standard] pydantic
   ```

3. Inicie el servidor:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001
   ```

### Frontend (puerto 3000)

1. Navegue al directorio de frontend:
   ```bash
   cd frontend-chisifai
   ```

2. Instale las dependencias:
   ```bash
   yarn install
   ```

3. Cree un archivo `.env` con la URL de la API:
   ```
   REACT_APP_API_URL=http://localhost:8001
   ```

4. Inicie el servidor de desarrollo:
   ```bash
   yarn start
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
