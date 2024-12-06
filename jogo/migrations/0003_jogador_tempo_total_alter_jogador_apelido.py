# Generated by Django 5.1 on 2024-09-01 00:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jogo', '0002_jogador_data_hora_partida_jogador_tentativas'),
    ]

    operations = [
        migrations.AddField(
            model_name='jogador',
            name='tempo_total',
            field=models.DurationField(default=datetime.timedelta),
        ),
        migrations.AlterField(
            model_name='jogador',
            name='apelido',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]