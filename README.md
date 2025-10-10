# Chisifai
### Sistema de Monitoreo de Entrega de Tartas de Queso Chisifai

## Resumen
Chisifai es una empresa premium de entrega de tartas de queso que requiere un monitoreo cuidadoso de las condiciones ambientales durante el transporte para garantizar la calidad del producto. Este sistema proporciona monitoreo en tiempo real de los niveles de temperatura, humedad y vibración durante la entrega de tartas de queso para prevenir la putrefacción y daños.

## Componentes del Proyecto

### 1. Simulación de Datos IoT
- Publicador MQTT que genera datos telemétricos realistas de entrega de tartas de queso
- Simula varias condiciones ambientales que afectan a las tartas de queso durante el transporte
- Frecuencia e identificadores de entrega configurables

### 2. API de Ingesta de Datos
- Servicio basado en FastAPI para recibir datos telemétricos
- Valida y almacena datos en la base de datos PostgreSQL
- Implementa verificaciones de rango para temperatura, humedad y vibración específicas para los requisitos de las tartas de queso

### 3. Flujos de Procesamiento
- **Flujo Node-RED**: Se suscribe a temas MQTT, valida datos y reenvía a la API de ingesta
- **Flujo n8n**: Alternativa de canalización de procesamiento basado en webhooks
- Ambos incluyen validación de datos y detección sofisticada de alertas para anomalías sostenidas

### 4. Almacenamiento
- Base de datos PostgreSQL con esquema optimizado para datos telemétricos
- Tablas separadas para telemetría y alertas
- Indexación adecuada para consultas eficientes

### 5. Visualización
- Panel de Metabase para monitorear condiciones de entrega de tartas de queso
- KPIs que rastrean SLA de calidad, tiempo de detección de alertas y tasas de falsos positivos

## Características Principales

### Monitoreo Ambiental
- **Temperatura**: Monitoreo para requisitos de refrigeración (rango normal ~2-8°C)
- **Humedad**: Seguimiento de niveles de humedad que podrían afectar la textura de la tarta de queso (rango normal 40-70%)
- **Vibración**: Detección de posibles daños por movimiento o manipulación (rango normal 0.1-1.2G)

### Sistema Avanzado de Alertas
- Detección de anomalía sostenida: alertas activadas solo después de N lecturas consecutivas que exceden los umbrales
- Umbrales configurables:
  - Temperatura > 8°C sostenida durante 3 lecturas
  - Humedad > 85% sostenida durante 3 lecturas
  - Vibración > 3.0G sostenida durante 3 lecturas
- Generación automática de alertas para condiciones anómalas
- Clasificación de tipos de alertas para identificación rápida

### KPIs de Negocio
1. **SLA de Calidad de Entrega**: % de tartas de queso mantenidas en condiciones óptimas
2. **Tiempo de Detección de Alertas**: Tiempo promedio para detectar anomalías
3. **Tasa de Falsos Positivos**: % de alertas que resultan ser no problemáticas

## Arquitectura
El sistema sigue una arquitectura moderna de canalización de datos:
- **Edge**: Publicador MQTT simulando sensores IoT en entregas de tartas de queso
- **Ingesta**: API Gateway recibiendo y validando datos
- **Procesamiento**: Análisis en tiempo real con detección de alertas con estado
- **Almacenamiento**: Almacenamiento persistente en PostgreSQL
- **Visualización**: Panel de inteligencia de negocios

## Seguridad (CIA)
- Variables de entorno para toda la configuración sensible
- Validación de entrada para todos los campos de datos
- Aislamiento de red usando Docker
- Patrones seguros de comunicación

## Comenzando

### Requisitos previos
- Docker y Docker Compose
- Python 3.8+

### Configuración
1. Clona el repositorio
2. Navega al directorio `infra`
3. Copia el archivo de entorno: `cp .env.example .env`
4. Inicia los servicios: `docker-compose up -d --build`
5. Ejecuta el esquema de base de datos: `docker exec -i t2-postgres psql -U motify -d motify < ../db/ddl.sql`
6. Importa el flujo Node-RED: `nodered_chisifai_parallel.json`
7. Ejecuta el publicador MQTT para simular datos de entrega de tarta de queso

### Ejecución de la Simulación
```
cd devices
source .venv/bin/activate  # Activar el entorno virtual creado anteriormente
python chisifai_publisher.py --broker localhost --topic sensors/cheesecake/CHISIFAI-001 --hz 0.5 --cheesecake-id CHISIFAI-001
```

### Configuración del Panel de Metabase
1. Accede a Metabase en `http://localhost:3000`
2. Conéctate a la base de datos PostgreSQL usando las credenciales en `.env`
3. Usa las consultas en `dashboards/chisifai_kpi_queries.sql` para crear visualizaciones

## Prueba de Resiliencia ("Boss Fight")
Para probar la resiliencia del sistema:
1. Inicia la publicación de datos
2. Detén el contenedor PostgreSQL: `docker stop t2-postgres`
3. Espera 60 segundos mientras los datos continúan generándose
4. Reinicia PostgreSQL: `docker start t2-postgres`
5. Verifica que todos los datos (incluyendo los generados durante el corte) se almacenen correctamente

## Archivos y Directorios
- `devices/chisifai_publisher.py` - Publicador personalizado para monitoreo de tartas de queso
- `flows/nodered_chisifai_parallel.json` - Flujo Node-RED mejorado con detección de alertas
- `services/ingest_api/app/main.py` - API con endpoint de creación de alertas
- `db/ddl.sql` - Esquema de base de datos
- `dashboards/chisifai_kpi_queries.sql` - Consultas KPI para Metabase
- `security/CIA_minithreats.md` - Documentación de análisis de seguridad
- `doc/` - Archivos de documentación

## Impacto en el Negocio
Este sistema permite a Chisifai:
- Mantener estándares premium de calidad para sus tartas de queso
- Responder rápidamente a problemas de entrega antes de que afecten la calidad del producto
- Seguir el rendimiento de entrega con KPIs accionables
- Reducir pérdidas de productos y quejas de clientes
- Ganar confianza de cliente mediante garantía de calidad
