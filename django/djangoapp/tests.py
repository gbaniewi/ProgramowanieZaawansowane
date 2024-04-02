from django.test import TestCase
from django.urls import reverse
from .models import Currency, LastUpdate
from datetime import datetime, timedelta

class CurrencyModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        Currency.objects.create(name='USD', rateBuy=3.7824, rateSell=3.8642, rate=3.8233, date=datetime.now().date())

    def test_name_label(self):
        currency = Currency.objects.get(id=1)
        field_label = currency._meta.get_field('name').verbose_name
        self.assertEquals(field_label, 'name')

    def test_date_label(self):
        currency = Currency.objects.get(id=1)
        field_label = currency._meta.get_field('date').verbose_name
        self.assertEquals(field_label, 'date')

    def test_name_max_length(self):
        currency = Currency.objects.get(id=1)
        max_length = currency._meta.get_field('name').max_length
        self.assertEquals(max_length, 3)

class GetCurrencyViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create 13 currencies for pagination tests
        number_of_currencies = 13
        for currency_num in range(number_of_currencies):
            Currency.objects.create(name=f'USD {currency_num}', rateBuy=3.7824, rateSell=3.8642, rate=3.8233, date=datetime.now().date()-timedelta(days=currency_num))

    def test_view_url_exists_at_desired_location(self):
        resp = self.client.get('/get_currency/USD/7/')
        self.assertEqual(resp.status_code, 200)

    def test_view_url_accessible_by_name(self):
        resp = self.client.get(reverse('get_currency', args=['USD', 7]))
        self.assertEqual(resp.status_code, 200)

    def test_pagination_is_ten(self):
        resp = self.client.get(reverse('get_currency', args=['USD', 7]))
        self.assertEqual(resp.status_code, 200)
        self.assertTrue('is_paginated' in resp.json())
        self.assertTrue(resp.json()['is_paginated'] == True)
        self.assertTrue(len(resp.json()['object_list']) == 10)
