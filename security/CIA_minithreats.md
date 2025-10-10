# Análisis de Seguridad para el Sistema de Monitoreo Chisifai

Este documento describe las consideraciones clave de seguridad para el sistema de monitoreo de entrega de tartas de queso de Chisifai siguiendo el modelo de seguridad CIA (Confidencialidad, Integridad, Disponibilidad).

## Confidencialidad (C)

### Amenazas
- **Exposición de Credenciales**: Claves API, credenciales de base de datos u otros secretos almacenados accidentalmente en el código
- **Intercepción de Datos**: Datos telemétricos que contienen información sensible podrían ser interceptados durante la transmisión
- **Acceso No Autorizado**: Usuarios no autorizados que obtienen acceso al sistema de monitoreo o a los datos almacenados

### Mitigaciones
- **Variables de Entorno**: Todos los valores de configuración sensibles (contraseñas de base de datos, claves API) deben almacenarse en variables de entorno, no codificados en el código fuente
- **Cifrado TLS**: Usar TLS para toda la transmisión de datos (MQTT sobre TLS, HTTPS para llamadas API)
- **Controles de Acceso**: Implementar controles de acceso basados en roles para el panel de Metabase y los puntos finales de la API
- **Segmentación de Red**: Usar redes Docker para aislar servicios y limitar la exposición

## Integridad (I)

### Amenazas
- **Manipulación de Datos**: Actores maliciosos alterando datos telemétricos en tránsito o en reposo
- **Datos Mal Formados**: Datos inválidos que se inyectan y podrían corromper el sistema o causar errores
- **Inyección de Código**: Atacantes que usan campos de datos para inyectar código malicioso

### Mitigaciones
- **Validación de Entrada**: Validación estricta de todos los datos telemétricos entrantes (verificación de tipo, verificación de rango, validación de formato)
- **Sumas de Verificación**: Implementar verificaciones de integridad de datos donde sea apropiado
- **Consultas Parametrizadas**: Usar consultas SQL parametrizadas para prevenir inyección SQL
- **Aplicación de Esquema de Datos**: Validación estricta de esquema para todos los datos entrantes

## Disponibilidad (A)

### Amenazas
- **Interrupción de Servicio**: Ataques DDoS o fallos de sistema causando tiempo de inactividad
- **Pérdida de Datos**: Fallos críticos del sistema resultando en pérdida de datos telemétricos
- **Partición de Red**: Problemas de red causando que componentes del sistema se vuelvan no disponibles

### Mitigaciones
- **Mecanismos de Reintento**: Lógica de reintento automático para llamadas API fallidas en flujos Node-RED
- **Circuit Breakers**: Prevenir fallos en cascada cuando los servicios downstream no están disponibles
- **Copia de Seguridad de Datos**: Copia de seguridad regular de datos críticos
- **Controles de Salud**: Implementar controles de salud para todos los servicios
- **Almacenamiento en búfer/QoS**: Cola de mensajes cuando los servicios downstream no están disponibles

## Notas de Implementación Específica

### Para el Sistema Chisifai
- Datos de temperatura por encima de 8°C activan alertas para la calidad de la tarta de queso
- El sistema debe validar que los valores de temperatura sean físicamente posibles (por ejemplo, no por debajo de cero absoluto o por encima de límites razonables)
- Todos los campos de datos deben tener verificaciones de rango razonables
- El sistema debe registrar y posiblemente alertar sobre patrones de datos anómalos que podrían indicar manipulación

### Estado Actual de la Implementación
- La validación de entrada está implementada en la API de ingesta FastAPI
- Las variables de entorno se usan para la configuración de la base de datos
- La agrupación de conexiones y los controles de salud están implementados en la API
- Los flujos Node-RED incluyen validación básica; podrían mejorarse con verificaciones más sofisticadas
- Los mecanismos de reintento deben configurarse en los flujos Node-RED (actualmente existe una implementación básica)

### Recomendaciones
1. Implementar TLS para todas las comunicaciones
2. Agregar mecanismos de autenticación para los puntos finales de la API
3. Mejorar el registro para monitoreo de seguridad
4. Actualizaciones de seguridad regulares de todas las dependencias
5. Agregar limitación de tasa para prevenir abusos