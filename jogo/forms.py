from django import forms
from .models import Jogador

class JogadorForm(forms.ModelForm):
    class Meta:
        model = Jogador
        fields = []