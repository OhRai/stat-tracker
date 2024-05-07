from django.db import models

# Create your models here.
class User(models.Model):
    player_id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=100)
    pfp = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    joined = models.DateTimeField()
    rank = models.IntegerField()
    pp = models.FloatField()
    playcount = models.IntegerField()
    level = models.FloatField()
    playstyle = models.IntegerField()
    location = models.CharField(max_length=100)
    occupation = models.CharField(max_length=100)
    interests = models.CharField(max_length=100)
    twitter = models.CharField(max_length=100)
    discord = models.CharField(max_length=100)

class UserInfoHistory(models.Model):
    player_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now=True)
    rank = models.IntegerField()
    pp = models.FloatField()
    playcount = models.IntegerField()
    ssh_count = models.IntegerField()
    ss_count = models.IntegerField()
    sh_count = models.IntegerField()
    s_count = models.IntegerField()