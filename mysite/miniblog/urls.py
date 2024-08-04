from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.post_list, name='post_list'),
    path("user/", views.user),
    path("user/<str:name>", views.user),
    path('search_results/', views.search_results, name='search_results'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
    path('post/new/', views.post_new, name='post_new'),
    path('post/<int:pk>/edit/', views.post_edit, name='post_edit'),

]