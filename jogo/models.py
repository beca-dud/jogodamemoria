from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Jogador(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    tentativas = models.IntegerField(default=0)
    data_hora_partida = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.usuario.username