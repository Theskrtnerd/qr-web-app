"""
URL configuration for qr_web_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import EventView, CreateEventView, GetEvent, GuestView, CreateGuestView, GetGuestList, UpdateGuestListView, SendEmailToGuestList, CheckGuestView

urlpatterns = [
    path('', EventView.as_view()),
    path('create-event/', CreateEventView.as_view(), name='create-event'),
    path('get-event/', GetEvent.as_view(), name='get-event'),
    path('create-guest/', CreateGuestView.as_view(), name='create-guest'),
    path('get-guest-list/', GetGuestList.as_view(), name='get-guest-list'),
    path('update-guest-list/', UpdateGuestListView.as_view(), name='update-guest-list'),
    path('send-emails/', SendEmailToGuestList.as_view(), name='send-emails'),
    path('check-guest/', CheckGuestView.as_view(), name='check-guest'),
]
