from django.urls import path
from . import views

urlpatterns = [
    path('get_currency/<str:currency>/<int:days>/', views.get_currency, name='get_currency'),
    path('get_currency_without_update/<str:currency>/<int:days>/', views.get_currency_without_update, name='get_currency_without_update'),
    path('get_currency_update_date/<str:currency>/', views.get_currency_update_date, name='get_currency_update_date'),
]