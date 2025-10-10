import paho.mqtt.client as mqtt
import json
import time
import random
import argparse
from datetime import datetime

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with code {rc}")

def on_publish(client, userdata, mid):
    print(f"Message {mid} published")

def main():
    parser = argparse.ArgumentParser(description='Motify Car Parts Telemetry Publisher')
    parser.add_argument('--broker', default='localhost', help='MQTT broker address')
    parser.add_argument('--topic', default='sensors/part/001', help='MQTT topic to publish to')
    parser.add_argument('--hz', type=float, default=0.5, help='Publish frequency in Hz (default: 0.5)')
    parser.add_argument('--part-id', default='MOTIFY-001', help='Part ID to publish')
    args = parser.parse_args()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_publish = on_publish

    try:
        client.connect(args.broker, 1883, 60)
        client.loop_start()

        interval = 1.0 / args.hz
        while True:
            # Generate realistic car parts telemetry data
            # Temperature: normal operating range around 20-25°C, with occasional spikes
            temp = round(random.normalvariate(22, 2), 2)
            
            # Humidity: typically 30-70% for indoor storage, with occasional high values
            humidity = round(random.uniform(30.0, 70.0), 2)
            
            # Vibration: typically low, with occasional spikes during transport
            vibration = round(random.uniform(0.1, 1.5), 2)
            
            # Simulate occasional high values for alert conditions
            if random.random() < 0.05:  # 5% chance of alert condition
                if random.choice([True, False]):
                    temp = round(random.uniform(60.0, 80.0), 2)  # High temperature alert
                else:
                    vibration = round(random.uniform(4.0, 8.0), 2)  # High vibration alert
            elif random.random() < 0.02:  # 2% chance of high humidity
                humidity = round(random.uniform(80.0, 95.0), 2)

            data = {
                "part_id": args.part_id,
                "ts": datetime.utcnow().isoformat() + "Z",
                "temp": temp,
                "humidity": humidity,
                "vibration": vibration
            }

            result = client.publish(args.topic, json.dumps(data))
            print(f"Published: {data}")
            result.wait_for_publish()

            time.sleep(interval)

    except KeyboardInterrupt:
        print("\nStopping publisher...")
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()