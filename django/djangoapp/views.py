from django.http import JsonResponse
from .models import Currency
import requests
from datetime import datetime, timedelta

# Create your views here.

def get_currency(request, currency, days):
    # Ustaw liczbę dni na 4000
    total_days = 4000
    max_days_per_request = 90
    table = 'A'  # dla walut obcych

    # Pobierz dane z API NBP za ostatnie 4000 dni, uwzględniając limit 90 dni na zapytanie
    for i in range(0, total_days, max_days_per_request):
        remaining_days = min(max_days_per_request, total_days - i)
        end_date = datetime.now() - timedelta(days=i)
        start_date = end_date - timedelta(days=remaining_days)
        response = requests.get(f'http://api.nbp.pl/api/exchangerates/rates/{table}/{currency}/{start_date.strftime("%Y-%m-%d")}/{end_date.strftime("%Y-%m-%d")}/')
        data = response.json()

        # Zapisz dane do bazy danych
        for rate in data['rates']:
            # Pomijaj zapisywanie rekordów, dla których dane w bazie już są
            if not Currency.objects.filter(name=currency, date=rate['effectiveDate']).exists():
                Currency.objects.create(name=currency, rate=rate['mid'], date=rate['effectiveDate'])

    # Sprawdź, czy dane są już w bazie danych
    currency_data = Currency.objects.filter(name=currency, date__gte=datetime.now()-timedelta(days=days)).order_by('date')

    # Zwróć dane do frontendu
    return JsonResponse(list(currency_data.values()), safe=False)

def get_currency_without_update(request, currency, days):
    # Sprawdź, czy dane są już w bazie danych
    currency_data = Currency.objects.filter(name=currency, date__gte=datetime.now()-timedelta(days=days)).order_by('date')

    # Zwróć dane do frontendu
    return JsonResponse(list(currency_data.values()), safe=False)
