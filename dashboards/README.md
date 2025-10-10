# Panel de Monitoreo de Tarta de Queso Chisifai

Este directorio contiene las consultas SQL y las instrucciones de configuración para el panel de Metabase que visualiza los KPIs para el sistema de monitoreo de entrega de tartas de queso de Chisifai.

## KPIs que se Están Rastreando

1. **SLA de Calidad de Entrega**: Porcentaje de tartas de queso mantenidas en condiciones óptimas durante toda la entrega
2. **Tiempo Promedio de Detección de Alertas**: Tiempo desde la ocurrencia de una anomalía hasta la generación de la alerta
3. **Tasa de Falsos Positivos**: Porcentaje de alertas que no se confirmaron como problemas reales

## Configuración del Panel de Metabase

1. Accede a Metabase en `http://localhost:3000`
2. Sigue el asistente de configuración inicial (si es la primera vez)
3. Conéctate a la base de datos PostgreSQL:
   - Host: `localhost`
   - Puerto: `5432`
   - Base de datos: `motify`
   - Usuario: `motify`
   - Contraseña: `motify`
4. Importa las consultas en `chisifai_kpi_queries.sql` para crear visualizaciones
5. Crea un panel con estas visualizaciones

## Visualizaciones Clave

El panel debe incluir:
- Monitoreo en tiempo real de temperatura, humedad y vibración
- Vista de mapa de ubicaciones de entrega (si se agregan datos de ubicación)
- Gráficos de series temporales que muestran tendencias históricas
- Resumen de alertas mostrando el número y tipos de alertas
- Indicadores KPI mostrando los indicadores clave de rendimiento