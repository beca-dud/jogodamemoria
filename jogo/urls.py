from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from django.contrib import admin
from .views import CustomLoginView

urlpatterns = [
    path('', views.menu, name='menu'),
    path('jogo/', views.jogo_memoria, name='jogo_memoria'),
    path('finalizar_partida/', views.finalizar_partida, name='finalizar_partida'),
    path('ranking/', views.ranking_view, name='ranking'),
    path('login/', CustomLoginView.as_view(), name='login'),    
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)