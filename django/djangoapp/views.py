from django.http import JsonResponse
from .models import Currency, LastUpdate
import requests
from datetime import datetime, timedelta

def get_currency(request, currency, days):
    total_days = 4000
    max_days_per_request = 90
    tables = ['A', 'C']

    last_update = LastUpdate.objects.get(currency__name=currency).last_update if LastUpdate.objects.filter(currency__name=currency).exists() else datetime.now() - timedelta(days=total_days)
    if isinstance(last_update, datetime):
        last_update = last_update.date()

    # Create a dictionary to store the data
    data_dict = {}

    for table in tables:
        start_date = last_update
        while (datetime.now().date() - start_date).days > 1:  # Fetch data from the day before the last update
            end_date = start_date + timedelta(days=min((datetime.now().date() - start_date).days, max_days_per_request))
            response = requests.get(f'http://api.nbp.pl/api/exchangerates/rates/{table}/{currency}/{start_date.strftime("%Y-%m-%d")}/{end_date.strftime("%Y-%m-%d")}/')
            data = response.json()

            for rate in data['rates']:
                date = rate['effectiveDate']
                if date not in data_dict:
                    data_dict[date] = {'name': currency, 'date': date}
                if table == 'A':
                    data_dict[date]['rate'] = rate['mid']
                elif table == 'C':
                    data_dict[date]['rateBuy'] = rate['bid']
                    data_dict[date]['rateSell'] = rate['ask']

            start_date = end_date

    # Insert the data into the database
    for date, data in data_dict.items():
        Currency.objects.update_or_create(name=currency, date=date, defaults=data)

    if LastUpdate.objects.filter(currency__name=currency).exists():
        LastUpdate.objects.filter(currency__name=currency).update(last_update=datetime.now())
    else:
        # Use filter() and first() instead of get()
        LastUpdate.objects.create(currency=Currency.objects.filter(name=currency).first(), last_update=datetime.now())

    currency_data = Currency.objects.filter(name=currency, date__gte=datetime.now()-timedelta(days=days)).order_by('date')

    return JsonResponse(list(currency_data.values()), safe=False)

def get_currency_without_update(request, currency, days):
    currency_data = Currency.objects.filter(name=currency, date__gte=datetime.now()-timedelta(days=days)).order_by('date')

    return JsonResponse(list(currency_data.values()), safe=False)

def get_currency_update_date(request, currency):
    # Get the last update date for the given currency
    last_update = LastUpdate.objects.get(currency__name=currency).last_update if LastUpdate.objects.filter(currency__name=currency).exists() else None

    # Return the last update date as a JSON response
    return JsonResponse({'last_update': last_update})
