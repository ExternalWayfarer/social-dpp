'''
# miniblog/web_urls.py
from django.urls import path
from . import views # или from .views import post_list, user, ...


urlpatterns = [
    path('', views.post_list, name='post_list'),
    path("users/<int:pk>/", views.user, name='user_profile'),
    path('search/', views.search_results, name='search_results'), 
    path('posts/<int:pk>/', views.post_detail, name='post_detail'),
    path('posts/new/', views.post_new, name='post_new'),
    path('posts/<int:pk>/edit/', views.post_edit, name='post_edit'),
]'''