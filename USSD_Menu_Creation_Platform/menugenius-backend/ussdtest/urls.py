from django.urls import path
from .views import ussd_endpoint

urlpatterns = [
    path('<int:menu_id>/',ussd_endpoint , name='test'), 
]