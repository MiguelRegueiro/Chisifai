-- Chisifai Cheese Cake Delivery Monitoring - Database Schema

-- Telemetry table to store sensor data from cheese cake deliveries
CREATE TABLE IF NOT EXISTS telemetry (
    id SERIAL PRIMARY KEY,
    part_id VARCHAR(50) NOT NULL,
    ts TIMESTAMP WITH TIME ZONE NOT NULL,
    temp DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    vibration DECIMAL(5,2) NOT NULL,
    lat DECIMAL(8,6) DEFAULT 0.0,  -- Latitude for location tracking
    lng DECIMAL(9,6) DEFAULT 0.0,  -- Longitude for location tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_telemetry_part_id ON telemetry(part_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_ts ON telemetry(ts);
CREATE INDEX IF NOT EXISTS idx_telemetry_part_id_ts ON telemetry(part_id, ts);

-- Alerts table to store detected incidents
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    part_id VARCHAR(50) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,  -- 'temp_high', 'humidity_high', 'vibration_high'
    alert_value DECIMAL(5,2) NOT NULL,
    threshold DECIMAL(5,2) NOT NULL,
    ts TIMESTAMP WITH TIME ZONE NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for alerts table
CREATE INDEX IF NOT EXISTS idx_alerts_part_id ON alerts(part_id);
CREATE INDEX IF NOT EXISTS idx_alerts_ts ON alerts(ts);
CREATE INDEX IF NOT EXISTS idx_alerts_alert_type ON alerts(alert_type);