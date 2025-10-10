-- KPI 1: % of Cheese Cakes Delivered in Optimal Conditions (Service Level Agreement)
-- This measures the percentage of cheese cakes that were maintained within acceptable 
-- temperature, humidity, and vibration ranges throughout the delivery process
SELECT 
    ROUND(
        (COUNT(CASE WHEN t.temp <= 8 AND t.humidity <= 85 AND t.vibration <= 3 THEN 1 END) * 100.0) / 
        COUNT(*), 
        2
    ) AS "Quality_SLA_Percentage"
FROM telemetry t;

-- KPI 2: Average Time to Detect Anomalies
-- This measures the average time between an anomalous reading and when an alert was generated
SELECT 
    AVG(
        EXTRACT(EPOCH FROM (a.ts - t.ts))
    ) AS "Avg_Detection_Time_Seconds"
FROM alerts a
JOIN telemetry t ON a.part_id = t.part_id AND t.ts <= a.ts
WHERE (a.alert_type = 'temp_high' AND t.temp > 8)
   OR (a.alert_type = 'humidity_high' AND t.humidity > 85)
   OR (a.alert_type = 'vibration_high' AND t.vibration > 3)
GROUP BY a.id;

-- KPI 3: False Positive Rate
-- This measures the percentage of alerts that were not confirmed as real issues
-- For this example, we'll calculate the percentage of alerts that were followed by 
-- normal readings within a short time window
SELECT 
    ROUND(
        (COUNT(CASE WHEN confirmed_as_false_positive THEN 1 END) * 100.0) / 
        COUNT(*), 
        2
    ) AS "False_Positive_Rate_Percentage"
FROM (
    SELECT 
        a.id,
        EXISTS (
            SELECT 1 
            FROM telemetry t_after 
            WHERE t_after.part_id = a.part_id 
              AND t_after.ts > a.ts 
              AND t_after.ts < a.ts + INTERVAL '5 minutes'
              AND t_after.temp <= 8 
              AND t_after.humidity <= 85 
              AND t_after.vibration <= 3
        ) AS confirmed_as_false_positive
    FROM alerts a
) subquery;

-- Additional useful queries for dashboard

-- Total number of deliveries monitored
SELECT COUNT(DISTINCT part_id) AS "Total_Deliveries_Monitored" FROM telemetry;

-- Total number of alerts generated
SELECT COUNT(*) AS "Total_Alerts_Generated" FROM alerts;

-- Breakdown of alert types
SELECT 
    alert_type,
    COUNT(*) AS "Count"
FROM alerts
GROUP BY alert_type;

-- Recent telemetry data for real-time monitoring
SELECT 
    part_id,
    ts,
    temp,
    humidity,
    vibration
FROM telemetry
ORDER BY ts DESC
LIMIT 20;

-- Recent alerts for operational awareness
SELECT 
    part_id,
    alert_type,
    alert_value,
    threshold,
    ts
FROM alerts
ORDER BY ts DESC
LIMIT 20;

-- Delivery performance by part_id (showing min/max conditions for each delivery)
SELECT 
    part_id,
    MIN(temp) AS min_temp,
    MAX(temp) AS max_temp,
    MIN(humidity) AS min_humidity,
    MAX(humidity) AS max_humidity,
    MIN(vibration) AS min_vibration,
    MAX(vibration) AS max_vibration,
    MIN(ts) AS start_time,
    MAX(ts) AS end_time
FROM telemetry
GROUP BY part_id
ORDER BY start_time DESC;