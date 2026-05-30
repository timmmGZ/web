from django.db import models


class User(models.Model):
    name = models.CharField(max_length=50)
    account = models.CharField(primary_key=True,max_length=50)
    password = models.CharField(max_length=50)
    login_token= models.CharField(max_length=32,null=True)