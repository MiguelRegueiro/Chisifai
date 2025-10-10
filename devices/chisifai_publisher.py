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
    parser = argparse.ArgumentParser(description='Chisifai Cheese Cake Delivery Telemetry Publisher')
    parser.add_argument('--broker', default='localhost', help='MQTT broker address')
    parser.add_argument('--topic', default='sensors/cheesecake/CHISIFAI-001', help='MQTT topic to publish to')
    parser.add_argument('--hz', type=float, default=0.5, help='Publish frequency in Hz (default: 0.5)')
    parser.add_argument('--cheesecake-id', default='CHISIFAI-001', help='Cheese cake ID to publish')
    args = parser.parse_args()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_publish = on_publish

    try:
        client.connect(args.broker, 1883, 60)
        client.loop_start()

        interval = 1.0 / args.hz
        while True:
            # Generate realistic cheese cake delivery telemetry data
            # Temperature: normal range around 2-8°C for refrigerated transport, with occasional spikes
            temp = round(random.normalvariate(4, 1), 2)
            
            # Humidity: typically 40-70% during transport, with occasional high values
            humidity = round(random.uniform(40.0, 70.0), 2)
            
            # Vibration: typically low during smooth transport, with occasional spikes during bumpy roads
            vibration = round(random.uniform(0.1, 1.2), 2)
            
            # Simulate occasional high values for alert conditions
            # 5% chance of alert condition during transport
            if random.random() < 0.05:  
                if random.choice([True, False]):
                    # High temperature alert - critical for cheese cake quality
                    temp = round(random.uniform(10.0, 20.0), 2) 
                else:
                    # High vibration alert - affects presentation of the cake
                    vibration = round(random.uniform(3.5, 7.0), 2) 
            elif random.random() < 0.02:  # 2% chance of high humidity
                humidity = round(random.uniform(80.0, 95.0), 2)

            data = {
                "part_id": args.cheesecake_id,
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