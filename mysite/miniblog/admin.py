from django.contrib import admin
from .models import Post, Comment




#class MiniblogAdmin(admin.ModelAdmin):
#    
#    list_display = ["title","author", "published_date"]
#    list_display = ["body","author", "published_date"]

#admin.site.register(Post, MiniblogAdmin)
#admin.site.register(Comment, MiniblogAdmin)
admin.site.register(Post)
admin.site.register(Comment)