from django.shortcuts import render, redirect, get_object_or_404
from .models import Jogador
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.views import LoginView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib import messages

def menu(request):
    return render(request, 'menu.html')

@login_required
def jogo_memoria(request):
    jogador = Jogador.objects.filter(usuario=request.user).first()
    if not jogador:
        jogador = Jogador.objects.create(usuario=request.user)
    
    return render(request, 'index.html', {'jogador': jogador})

@csrf_exempt
def finalizar_partida(request):
    if request.method == 'POST':
        jogador_id = request.POST.get('jogador_id')
        jogador = get_object_or_404(Jogador, pk=jogador_id)
        tentativas = request.POST.get('tentativas')
        jogador.tentativas = tentativas
        jogador.save()
        return JsonResponse({'status': 'success'})

def ranking_view(request):
    rankings = Jogador.objects.all().order_by('tentativas', '-data_hora_partida')
    return render(request, 'ranking.html', {'rankings': rankings})

class CustomLoginView(LoginView):
    template_name = 'login.html'
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = User.objects.filter(username=username).first()
        if not user:
            user = User.objects.create_user(username=username, password=password)

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('jogo_memoria')
        else:
            messages.error(request, 'Usuário ou senha incorretos. Tente novamente.')
            return self.form_invalid(self.get_form())