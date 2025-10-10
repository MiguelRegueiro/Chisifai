# Manual paso a paso — T2 Flip Sprint (Motify Car Parts Monitoring)

## 1. Arranque
```
cd infra
cp .env.example .env
# Update .env file to use motify instead of greendelivery
docker compose up -d
```
Servicios: Metabase (3000), Node-RED (1880), n8n (5678), ingest_api (8001), Mosquitto (1883), Postgres (5432).

## 2. BD
Ejecuta `db/ddl.sql` para crear `telemetry` y `alerts`.

## 3. Flujos
- **Node-RED solo**: importa `flows/nodered_motify_parallel.json` y *Deploy*.
- **Paralelo Node-RED + n8n**:
  - Node-RED: importa `flows/nodered_motify_parallel.json`.
  - n8n: *Import* → `flows/n8n_motify_telemetry_ingest.json` → **Activate**.

## 4. Simulación
```
cd devices
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python publisher.py --broker localhost --topic sensors/part/MOTIFY-001 --hz 0.5
```

## 5. Verificación
- Node-RED: mira nodos *debug*.
- n8n: pestaña *Executions*.
- API: `GET http://localhost:8001/health`.
- Metabase: conecta a Postgres (host: `postgres`) y consulta `telemetry`.
- Monitoreo de partes: temperatura, humedad y vibración se registran continuamente

## 6. KPIs
Usa `dashboards/metabase/queries.sql` y define 3 KPIs:
- % de partes en condiciones óptimas
- Tiempo medio de detección de alertas
- % de falsos positivos

## 7. Seguridad
Variables en `.env`, validaciones de rango, reintentos. (Opcional TLS/auth para Mosquitto).

## 8. Boss-fight
```
docker compose stop postgres
# publicar ~60s
docker compose start postgres
```
Evidencia: no perder eventos; describe mitigaciones en el informe.

## Motify Car Parts Monitoring - Descripción del Proyecto

Motify es una empresa especializada en la venta de partes de coches. Para garantizar la calidad de sus productos y mejorar la experiencia del cliente, Motify implementa un sistema de monitoreo en tiempo real de las condiciones de almacenamiento y transporte de sus partes.

Este sistema permite:
- Monitorear continuamente la temperatura, humedad y vibración de las partes sensibles
- Detectar condiciones anormales que puedan afectar la calidad de las partes
- Generar alertas automáticas cuando se superan los umbrales establecidos
- Proporcionar visibilidad en tiempo real sobre el estado de las partes
- Mejorar la trazabilidad y la toma de decisiones basada en datos