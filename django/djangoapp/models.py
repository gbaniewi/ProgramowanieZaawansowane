from django.db import models

# Create your models here.
class Currency(models.Model):
    name = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=10, decimal_places=4)
    date = models.DateField()
#    rateBuy = models.DecimalField(max_digits=10, decimal_places=4)
#    rateSell = models.DecimalField(max_digits=10, decimal_places=4)