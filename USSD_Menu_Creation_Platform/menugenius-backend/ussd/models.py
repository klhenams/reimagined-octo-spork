from django.db import models
from django.utils import timezone

from datetime import datetime

from user.models import CustomUser

class Menu(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100, default='')

    def __str__(self) -> str:
        return self.name

class MenuOption(models.Model):
    menu = models.ForeignKey('Menu', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100, null=False, blank=True)
    parent_option = models.ForeignKey('self', on_delete=models.CASCADE, 
                                      null=True, blank=True, related_name='child_options')
    expects_input = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name
    
class SessionData(models.Model):
    session_id = models.CharField(primary_key=True, unique=True, null=False, max_length=100)
    menu_id = models.IntegerField(null=False)
    phone_number = models.CharField(max_length=100, null=False)
    user_responses = models.TextField(default='N/A')
    date = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f" Session {self.session_id} for {self.phone_number}"