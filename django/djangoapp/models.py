from django.db import models

# Create your models here.
class Currency(models.Model):
    name = models.CharField(max_length=3)
    rateBuy = models.DecimalField(max_digits=10, decimal_places=4, null=True)
    rateSell = models.DecimalField(max_digits=10, decimal_places=4, null=True)
    rate = models.DecimalField(max_digits=10, decimal_places=4, null=True)
    date = models.DateField()

class LastUpdate(models.Model):
    currency = models.OneToOneField(Currency, on_delete=models.CASCADE)
    last_update = models.DateField()