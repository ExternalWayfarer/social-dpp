from django.contrib import admin
from .models import Post




class MiniblogAdmin(admin.ModelAdmin):
    
    list_display = ["title","author", "published_date"]

admin.site.register(Post, MiniblogAdmin)
#<form action="{% url 'search_results' %}" method="get">