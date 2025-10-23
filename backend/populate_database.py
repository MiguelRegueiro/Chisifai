#!/usr/bin/env python3
"""
Simplified database population script for Chisifai dashboard
This script initializes the database and populates it with sample data
"""

import sqlite3
import json
import random
import time
from datetime import datetime, timedelta
import uuid


# Database setup
DB_FILE = 'chisifai.db'


def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create telemetry table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_id TEXT NOT NULL,
            temperature REAL NOT NULL,
            g_force REAL NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp TEXT NOT NULL,
            battery_level REAL,
            signal_strength INTEGER
        )
    ''')
    
    # Create alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_id TEXT NOT NULL,
            alert_type TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            is_resolved BOOLEAN DEFAULT 0,
            severity TEXT DEFAULT 'medium'
        )
    ''')
    
    conn.commit()
    conn.close()


def generate_sample_telemetry():
    """Generate sample telemetry data with appropriate cheesecake temperatures"""
    # Starting location (Madrid, Spain)
    base_lat = 40.4168
    base_lng = -3.7038
    
    # Generate data for packages with realistic readings
    packages = []
    # Generate data for 5 different packages
    for i in range(5):
        package_id = f"PKG-{random.randint(100, 999)}"
        
        # Generate realistic data for the past 24 hours (50 readings per package)
        for j in range(50):
            # Temperature between 18-24°C with occasional spikes (2% of time)
            if random.random() < 0.02:
                # Simulate temperature spike
                temperature = round(27 + random.random() * 8, 2)  # 27-35°C
            else:
                # Normal temperature range for cheesecakes
                temperature = round(19 + random.random() * 4, 2)  # 19-23°C
            
            # G-force around 1.0 with occasional spikes
            if random.random() < 0.05:
                # Simulate impact event
                g_force = round(2.6 + random.random() * 1.4, 2)  # 2.6-4.0G
            else:
                # Normal g-force
                g_force = round(0.9 + random.random() * 0.4, 2)  # 0.9-1.3G
            
            # Add some movement to the location
            lat = round(base_lat + (random.random() - 0.5) * 0.1, 6)
            lng = round(base_lng + (random.random() - 0.5) * 0.1, 6)
            
            # Timestamp going back 24 hours
            timestamp = (datetime.now() - timedelta(minutes=j*30)).isoformat()
            
            # Battery and signal
            battery = round(100 - (j * 0.1), 2)  # Battery slowly drains
            signal = random.randint(-80, -40)
            
            packages.append({
                'package_id': package_id,
                'temperature': temperature,
                'g_force': g_force,
                'latitude': lat,
                'longitude': lng,
                'timestamp': timestamp,
                'battery_level': battery,
                'signal_strength': signal
            })
            
    return packages


def generate_realtime_telemetry():
    """Generate realistic real-time telemetry data"""
    # Starting location (Madrid, Spain)
    base_lat = 40.4168
    base_lng = -3.7038
    
    packages = []
    # Generate data for 5 different packages
    for i in range(5):
        package_id = f"PKG-{random.randint(100, 999)}"
        
        # Temperature between 18-24°C with occasional spikes (2% of time)
        if random.random() < 0.02:
            # Simulate temperature spike
            temperature = round(27 + random.random() * 8, 2)  # 27-35°C
        else:
            # Normal temperature range
            temperature = round(19 + random.random() * 4, 2)  # 19-23°C
        
        # G-force around 1.0 with occasional spikes
        if random.random() < 0.05:
            # Simulate impact event
            g_force = round(2.6 + random.random() * 1.4, 2)  # 2.6-4.0G
        else:
            # Normal g-force
            g_force = round(0.9 + random.random() * 0.4, 2)  # 0.9-1.3G
        
        # Add some movement to the location
        lat = round(base_lat + (random.random() - 0.5) * 0.1, 6)
        lng = round(base_lng + (random.random() - 0.5) * 0.1, 6)
        
        # Current timestamp
        timestamp = datetime.now().isoformat()
        
        # Battery and signal
        battery = round(100 - random.random() * 20, 2)  # Random battery level
        signal = random.randint(-80, -40)
        
        packages.append({
            'package_id': package_id,
            'temperature': temperature,
            'g_force': g_force,
            'latitude': lat,
            'longitude': lng,
            'timestamp': timestamp,
            'battery_level': battery,
            'signal_strength': signal
        })
    
    return packages


def insert_telemetry_data():
    """Insert sample telemetry data into the database"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Generate and insert new data
    packages = generate_sample_telemetry()
    
    for pkg in packages:
        # Insert telemetry record
        cursor.execute('''
            INSERT INTO telemetry 
            (package_id, temperature, g_force, latitude, longitude, timestamp, battery_level, signal_strength)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            pkg['package_id'],
            pkg['temperature'],
            pkg['g_force'],
            pkg['latitude'],
            pkg['longitude'],
            pkg['timestamp'],
            pkg['battery_level'],
            pkg['signal_strength']
        ))
        
        # Create alerts for temperature issues
        if pkg['temperature'] > 26.0:
            cursor.execute('''
                INSERT INTO alerts 
                (package_id, alert_type, message, timestamp, severity)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                pkg['package_id'],
                'Temperatura Excedida',
                f'Temperatura demasiado alta: {pkg["temperature"]}°C',
                pkg['timestamp'],
                'high'
            ))
        
        # Create alerts for g-force issues
        if pkg['g_force'] > 2.5:
            cursor.execute('''
                INSERT INTO alerts 
                (package_id, alert_type, message, timestamp, severity)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                pkg['package_id'],
                'Posible Impacto',
                f'Fuerza G inusual: {pkg["g_force"]}G',
                pkg['timestamp'],
                'high'
            ))
    
    conn.commit()
    conn.close()
    print(f"Inserted {len(packages)} telemetry records and associated alerts")


def insert_realtime_data():
    """Insert real-time telemetry data into the database"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    packages = generate_realtime_telemetry()
    
    for pkg in packages:
        # Insert telemetry record
        cursor.execute('''
            INSERT INTO telemetry 
            (package_id, temperature, g_force, latitude, longitude, timestamp, battery_level, signal_strength)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            pkg['package_id'],
            pkg['temperature'],
            pkg['g_force'],
            pkg['latitude'],
            pkg['longitude'],
            pkg['timestamp'],
            pkg['battery_level'],
            pkg['signal_strength']
        ))
        
        # Create alerts for temperature issues
        if pkg['temperature'] > 26.0:
            cursor.execute('''
                INSERT INTO alerts 
                (package_id, alert_type, message, timestamp, severity)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                pkg['package_id'],
                'Temperatura Excedida',
                f'Temperatura demasiado alta: {pkg["temperature"]}°C',
                pkg['timestamp'],
                'high'
            ))
        
        # Create alerts for g-force issues
        if pkg['g_force'] > 2.5:
            cursor.execute('''
                INSERT INTO alerts 
                (package_id, alert_type, message, timestamp, severity)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                pkg['package_id'],
                'Posible Impacto',
                f'Fuerza G inusual: {pkg["g_force"]}G',
                pkg['timestamp'],
                'high'
            ))
    
    conn.commit()
    conn.close()
    print(f"Inserted {len(packages)} real-time telemetry records")


def cleanup_old_data():
    """Remove data older than 24 hours to keep DB size manageable"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Calculate cutoff time (24 hours ago)
    cutoff_time = datetime.now() - timedelta(hours=24)
    cutoff_str = cutoff_time.isoformat()
    
    # Delete old records
    cursor.execute("DELETE FROM telemetry WHERE timestamp < ?", (cutoff_str,))
    cursor.execute("DELETE FROM alerts WHERE timestamp < ?", (cutoff_str,))
    
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    
    if deleted_count > 0:
        print(f"Cleaned up {deleted_count} old records")


def main():
    print("Initializing database...")
    init_db()
    
    print("Populating database with sample data...")
    insert_telemetry_data()
    
    print("Starting real-time data population...")
    previous_minute = -1
    
    while True:
        current_minute = datetime.now().minute
        
        # Insert new data every minute
        if current_minute != previous_minute:
            try:
                insert_realtime_data()
                cleanup_old_data()
                previous_minute = current_minute
            except Exception as e:
                print(f"Error inserting data: {e}")
        
        # Wait 10 seconds before checking again
        time.sleep(10)


if __name__ == "__main__":
    main()