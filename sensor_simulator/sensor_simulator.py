#!/usr/bin/env python3
"""
Chisifai IoT Sensor Simulator

This script simulates an IoT device that generates and sends telemetry data
for cheese cake shipment monitoring including temperature, g-force, and GPS location.
"""

import json
import time
import random
import uuid
from datetime import datetime
import paho.mqtt.client as mqtt
import argparse
import sys
import os

# Configuration
DEFAULT_BROKER = "test.mosquitto.org"  # Public MQTT broker for testing
DEFAULT_PORT = 1883
DEFAULT_TOPIC = "chisifai/trackers/telemetry"
DEFAULT_INTERVAL = 2  # seconds between readings

class SensorSimulator:
    def __init__(self, broker=DEFAULT_BROKER, port=DEFAULT_PORT, topic=DEFAULT_TOPIC, interval=DEFAULT_INTERVAL):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.interval = interval
        self.client_id = f"chisifai_sensor_{uuid.uuid4().hex[:8]}"
        self.package_id = f"PKG-{random.randint(100, 999)}"
        
        # Starting location (Madrid, Spain)
        self.current_lat = 40.4168 + (random.random() - 0.5) * 0.1  # Small variance around Madrid
        self.current_lng = -3.7038 + (random.random() - 0.5) * 0.1
        self.moving = True
        
        # Initialize MQTT client
        self.client = mqtt.Client(client_id=self.client_id)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.client.on_publish = self.on_publish
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"✓ Connected to MQTT broker at {self.broker}:{self.port}")
            print(f"✓ Client ID: {self.client_id}")
            print(f"✓ Publishing to topic: {self.topic}")
        else:
            print(f"✗ Failed to connect to MQTT broker. Error code: {rc}")
    
    def on_disconnect(self, client, userdata, rc):
        print(f"✗ Disconnected from MQTT broker. Reason: {rc}")
    
    def on_publish(self, client, userdata, mid):
        print(f"✓ Message {mid} published successfully")
    
    def generate_telemetry_data(self):
        """Generate realistic telemetry data for cheese cake shipment monitoring."""
        
        # Simulate realistic temperature variation (should be 2-8°C for cheese cake)
        # Add some variation based on time, location, and potential issues
        base_temp = 4.0  # Optimal temperature
        temp_variation = (random.random() - 0.5) * 2.0  # ±1°C variation
        
        # Occasionally simulate temperature issues (10% of the time)
        if random.random() < 0.1:
            temp_variation = random.random() * 8.0  # Could go up to 12°C
            
        temperature = max(0.0, min(15.0, base_temp + temp_variation))  # Clamp between 0-15°C
        
        # Simulate realistic G-force (should normally be close to 1.0G)
        base_gforce = 1.0
        gforce_variation = (random.random() - 0.5) * 0.5  # ±0.25G variation
        
        # Occasionally simulate impact events (5% of the time)
        if random.random() < 0.05:
            gforce_variation = 1.5 + random.random() * 2.0  # Could go up to 4G+
            
        g_force = max(0.1, base_gforce + gforce_variation)  # Don't go below 0.1G
        
        # Simulate movement
        if self.moving:
            # Move the sensor slightly (simulating delivery vehicle movement)
            lat_change = (random.random() - 0.5) * 0.001  # Small change in latitude
            lng_change = (random.random() - 0.5) * 0.001  # Small change in longitude
            self.current_lat += lat_change
            self.current_lng += lng_change
        
        # Create the telemetry data packet
        telemetry_data = {
            "id": str(uuid.uuid4()),
            "packageId": self.package_id,
            "temperature": round(temperature, 2),
            "gForce": round(g_force, 2),
            "latitude": round(self.current_lat, 6),
            "longitude": round(self.current_lng, 6),
            "timestamp": datetime.now().isoformat(),
            "batteryLevel": round(100 - (random.random() * 5), 2),  # Simulate slight battery drain
            "signalStrength": random.randint(-80, -40)  # dBm signal strength
        }
        
        return telemetry_data
    
    def connect(self):
        """Connect to the MQTT broker."""
        try:
            print(f"Connecting to MQTT broker at {self.broker}:{self.port}...")
            self.client.connect(self.broker, self.port, 60)
            return True
        except Exception as e:
            print(f"✗ Error connecting to MQTT broker: {e}")
            return False
    
    def publish_telemetry(self):
        """Publish a single telemetry reading to the MQTT topic."""
        data = self.generate_telemetry_data()
        
        try:
            # Convert to JSON string
            json_payload = json.dumps(data)
            
            # Publish to MQTT topic
            result = self.client.publish(self.topic, json_payload, qos=1)
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f"Published: {json_payload}")
                return True
            else:
                print(f"✗ Failed to publish message. Error code: {result.rc}")
                return False
        except Exception as e:
            print(f"✗ Error publishing telemetry: {e}")
            return False
    
    def run(self, max_messages=None):
        """Run the sensor simulator continuously."""
        if not self.connect():
            print("✗ Could not connect to MQTT broker. Exiting...")
            return
        
        # Start the network loop
        self.client.loop_start()
        
        print(f"✓ Sensor simulator started!")
        print(f"✓ Package ID: {self.package_id}")
        print(f"✓ Publishing interval: {self.interval} seconds")
        print(f"✓ Location: {self.current_lat:.6f}, {self.current_lng:.6f}")
        print("Press Ctrl+C to stop the simulator...")
        print("-" * 60)
        
        message_count = 0
        try:
            while True:
                # Publish telemetry data
                if self.publish_telemetry():
                    message_count += 1
                    if max_messages and message_count >= max_messages:
                        print(f"\n✓ Reached maximum message count ({max_messages}). Stopping...")
                        break
                
                # Wait for the specified interval
                time.sleep(self.interval)
                
        except KeyboardInterrupt:
            print(f"\n⚠ Simulator interrupted by user.")
        except Exception as e:
            print(f"\n✗ Error in simulator loop: {e}")
        finally:
            # Stop the network loop and disconnect
            print("Disconnecting from MQTT broker...")
            self.client.loop_stop()
            self.client.disconnect()
            print("✓ Simulator stopped.")

def main():
    parser = argparse.ArgumentParser(description='Chisifai IoT Sensor Simulator')
    parser.add_argument('--broker', default=DEFAULT_BROKER, 
                        help=f'MQTT broker address (default: {DEFAULT_BROKER})')
    parser.add_argument('--port', type=int, default=DEFAULT_PORT,
                        help=f'MQTT broker port (default: {DEFAULT_PORT})')
    parser.add_argument('--topic', default=DEFAULT_TOPIC,
                        help=f'MQTT topic to publish to (default: {DEFAULT_TOPIC})')
    parser.add_argument('--interval', type=float, default=DEFAULT_INTERVAL,
                        help=f'Interval between readings in seconds (default: {DEFAULT_INTERVAL})')
    parser.add_argument('--count', type=int, default=None,
                        help='Number of messages to send (default: infinite)')
    parser.add_argument('--package-id', 
                        help='Specific package ID to use (default: auto-generated)')
    
    args = parser.parse_args()
    
    # Create and run the simulator
    simulator = SensorSimulator(
        broker=args.broker,
        port=args.port,
        topic=args.topic,
        interval=args.interval
    )
    
    # Override package ID if specified
    if args.package_id:
        simulator.package_id = args.package_id
    
    simulator.run(max_messages=args.count)

if __name__ == "__main__":
    main()