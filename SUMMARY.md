# **Resumen de Implementación del Sistema Chisifai**

## **Visión General del Proyecto**

Se implementó con éxito un sistema IoT completo para el monitoreo de las operaciones de entrega de cheesecakes de **Chisifai**, adaptado a partir del desafío **GreenDelivery**, pero personalizado para los requerimientos específicos de la empresa.

El sistema garantiza el control de calidad durante la distribución, asegurando que los productos mantengan las condiciones óptimas de temperatura, humedad y vibración hasta su entrega final.

---

## **Componentes Implementados**

### **1. Infraestructura**

* ✅ Todos los servicios Docker configurados y operativos (PostgreSQL, Mosquitto, Node-RED, n8n, Metabase y FastAPI).
* ✅ Creación del esquema de base de datos con tablas de **telemetría** y **alertas**.
* ✅ Configuración del entorno con prácticas sólidas de seguridad y aislamiento.

---

### **2. Generación y Recolección de Datos**

* ✅ Desarrollo de un **publicador MQTT personalizado** (`chisifai_publisher.py`) para transmitir datos de telemetría de los cheesecakes.
* ✅ Generación de datos realistas con rangos ajustados a los requisitos de conservación alimentaria:

  * **Temperatura:** 2–8 °C (con alerta si supera 8 °C)
  * **Humedad:** 40–70 % (alerta alta a partir de 85 %)
  * **Vibración:** 0.1–1.2 G (alerta alta a partir de 3.0 G)

---

### **3. Procesamiento y Alertas**

* ✅ Flujo mejorado en **Node-RED** con detección de anomalías sostenidas.
* ✅ Implementación de lógica **con estado** para detectar violaciones consecutivas (3 lecturas seguidas fuera del rango).
* ✅ Creación de un **endpoint dedicado en FastAPI** para el registro de alertas.
* ✅ Procesamiento en tiempo real de todos los datos de telemetría.

---

### **4. Analítica y Visualización**

* ✅ Configuración de **consultas SQL de KPI** para el tablero de **Metabase**.
* ✅ Cálculo de indicadores clave:

  * Cumplimiento de SLA de calidad
  * Tiempo promedio de detección de alertas
  * Tasa de falsos positivos
* ✅ Consultas optimizadas para análisis integral de entregas y rendimiento operativo.

---

### **5. Seguridad**

* ✅ Análisis de seguridad **CIA (Confidencialidad, Integridad, Disponibilidad)** documentado.
* ✅ Uso de **variables de entorno** para la configuración sensible.
* ✅ Validación estricta de todos los campos de entrada.
* ✅ Archivo **.gitignore** configurado para evitar exposición de credenciales o secretos.

---

### **6. Pruebas de Resiliencia**

* ✅ Ejecución del **escenario Boss Fight** (caída de base de datos durante 60 s).
* ✅ Verificación exitosa de la **recuperación automática** del sistema tras la interrupción.
* ⚙️ Se documentó la necesidad de mecanismos de reintento más robustos para un entorno de producción.

---

## **Detalles Técnicos Relevantes**

### **Principales Cambios respecto al Starter Kit**

1. Adaptación del contexto: de piezas de automóvil (**Motify**) a **entrega de cheesecakes Chisifai**.
2. Ajuste de umbrales a las condiciones de transporte alimentario (temperatura < 8 °C).
3. Incorporación de lógica con memoria en Node-RED para alertas sostenidas.
4. Nuevo endpoint de alertas en FastAPI.
5. Publicador MQTT diseñado específicamente para datos de productos alimenticios.
6. Documentación actualizada con enfoque en **calidad alimentaria y seguridad**.

---

### **Arquitectura del Sistema**

* **Edge:** Publicador MQTT con sensores ambientales de transporte.
* **Ingesta:** API FastAPI con validación y endpoints de telemetría y alertas.
* **Procesamiento:** Node-RED con detección de anomalías con estado.
* **Almacenamiento:** PostgreSQL con tablas de telemetría y alertas.
* **Visualización:** Tablero de **Metabase** con KPIs operativos y de calidad.

---

## **Archivos Clave del Proyecto**

* `devices/chisifai_publisher.py` – Publicador MQTT de datos ambientales.
* `flows/nodered_chisifai_parallel.json` – Flujo Node-RED con detección mejorada.
* `services/ingest_api/app/main.py` – API de ingesta con endpoint de alertas.
* `dashboards/chisifai_kpi_queries.sql` – Consultas SQL para indicadores de desempeño.
* `dashboards/README.md` – Guía de configuración de dashboard.
* `security/CIA_minithreats.md` – Análisis de seguridad CIA.
* `doc/Informe_T2_EquipoX.pdf` – Informe final del proyecto.
* `boss_fight_test.py` – Script de prueba de resiliencia.
* `.env` – Configuración del entorno.
* `.gitignore` – Protección de archivos sensibles.
* `README.md` – Documentación general del sistema.

---

## **Valor para el Negocio – Chisifai**

* ✅ **Garantiza la calidad premium** de los cheesecakes durante toda la cadena logística.
* ✅ **Previene el deterioro o daño** del producto en transporte.
* ✅ **Proporciona información accionable** para optimizar rutas y procesos de entrega.
* ✅ **Reduce reclamaciones y devoluciones** por problemas de calidad.
* ✅ **Refuerza la confianza del cliente** mediante trazabilidad y control.
* ✅ **Habilita decisiones basadas en datos**, mejorando la eficiencia y sostenibilidad.


