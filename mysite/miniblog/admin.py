from django.contrib import admin
#from .models import Post, Comment, CustomUser
from .models.user import CustomUser as User
from .models.comment import Comment
from .models.post import Post
from .models.topic import Topic




#class MiniblogAdmin(admin.ModelAdmin):
#    
#    list_display = ["title","author", "published_date"]
#    list_display = ["body","author", "published_date"]


admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(User)
admin.site.register(Topic)


