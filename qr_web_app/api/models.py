from django.db import models
import random
import string

# Create your models here.
def generate_event_code():
    length = 8
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Event.objects.filter(code=code).count() == 0:
            break
    return code

class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    date = models.DateTimeField()
    location = models.CharField(max_length=100)
    link = models.CharField(max_length=100)
    code = models.CharField(max_length=8, default=generate_event_code, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Guest(models.Model):
    event = models.ForeignKey(Event, related_name='guests', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    ticketChecked = models.BooleanField(null=False,default=False)

    def __str__(self):
        return f"{self.name} - {self.event.name} Guest"