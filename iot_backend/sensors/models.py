from django.db import models
from django.utils import timezone

class Sensor(models.Model):
    temperature = models.FloatField(blank=True,null=True, default=0.0)
    humidity = models.FloatField(blank=True,null=True, default=0.0)
    methane = models.FloatField(blank=True,null=True, default=0.0)
    timestamp = models.DateTimeField(default=timezone.now)  

