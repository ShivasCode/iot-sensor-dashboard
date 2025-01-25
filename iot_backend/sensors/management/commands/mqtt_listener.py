from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json 
from sensors.models import Sensor
from django.utils import timezone

class Command(BaseCommand):
    help = 'Starts the MQTT listener'

    def handle(self, *args, **kwargs):
        # MQTT Broker settings
        mqtt_broker = '192.168.1.0' # Update this with your IP address
        mqtt_port = 1883
        mqtt_user = 'admin'
        mqtt_pass = 'admin'

        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                self.stdout.write(self.style.SUCCESS("Connected to MQTT broker successfully!"))
                client.subscribe("sensor/data/")
            else:
                self.stdout.write(self.style.ERROR(f"Connection failed with result code {rc}"))

        def on_message(client, userdata, msg):
            try:
                # Decode the incoming message payload
                message = msg.payload.decode()
                # Parse the JSON data sent by the ESP
                data = json.loads(message)

                # Extract sensor data
                temperature = data.get("temperature", 0.0)
                humidity = data.get("humidity", 0.0)
                methane = data.get("mq4_value", 0.0) 
                timestamp = data.get("time")  

                self.stdout.write(self.style.SUCCESS(f"Message received on topic {msg.topic}: {data}"))

                # Create the Sensor object
                sensor = Sensor.objects.create(
                    temperature=temperature,
                    humidity=humidity,
                    methane=methane,
                    timestamp=timestamp if timestamp else timezone.now()
                )

                self.stdout.write(self.style.SUCCESS(f"Sensor data saved: {sensor}"))

            except json.JSONDecodeError:
                self.stdout.write(self.style.ERROR("Failed to decode JSON message."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing message: {str(e)}"))

        # Initialize MQTT client
        client = mqtt.Client()

        # Set username and password for the broker 
        client.username_pw_set(mqtt_user, mqtt_pass)

        # Bind the callback functions
        client.on_connect = on_connect
        client.on_message = on_message

        try:
            # Connect to the MQTT broker
            client.connect(mqtt_broker, mqtt_port, 60)

            # Start the network loop to listen for messages
            self.stdout.write(self.style.SUCCESS("Starting MQTT loop..."))
            client.loop_forever()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))





