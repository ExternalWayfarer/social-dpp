from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


from .models.user import CustomUser
from .models.comment import Comment
from .models.post import Post
from .models.topic import Topic
from .models.profile import Profile
'''
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(CustomUser)
admin.site.register(Topic)
#admin.site.register(Profile)
'''

### ********** INLINES **************####
class ProfileInline(admin.StackedInline): 
    model = Profile
    can_delete = False 
    verbose_name_plural = 'Profiles'
    fk_name = 'user'
    # fields from model
    fields = ('nickname', 'user_bio', 'user_avatar', 'rating', 'user_follows', 'user_blocks')
    readonly_fields = ('user_follows', 'user_blocks')
   
'''
class CommentInline(admin.StackedInline):
    model = Comment
    can_delete = True 
    verbose_name_plural = 'Comments'
    fk_name = 'author'
    # fields from model
    fields = ('body',)
    readonly_fields = ('time_created_at', 'time_updated_at')
    extra = 0
'''
class CommentInline(admin.TabularInline):
    model = Comment
    can_delete = True 
    verbose_name_plural = 'Comments'
    fk_name = 'author'
    # fields from model
    fields = ('body',)
    readonly_fields = ('time_created_at', 'time_updated_at')
    extra = 0
    
    
class PostInlineTopic(admin.StackedInline):
    model = Post
    can_delete = True 
    verbose_name_plural = 'Posts'
    fk_name = 'topic'
    # fields from model
    fields = ('body','author', 'rating')
    readonly_fields = ('time_created_at', 'time_updated_at')
    extra = 0 
    
class PostInlineUser(admin.StackedInline):
    model = Post
    can_delete = True 
    verbose_name_plural = 'Posts'
    fk_name = 'author'
    # fields from model
    fields = ('body','author', 'rating')
    readonly_fields = ('time_created_at', 'time_updated_at')
    extra = 0 
    
### ****** ADMIN MODELS ********** ###


@admin.register(CustomUser) 
class CustomUserAdmin(BaseUserAdmin):
   
    inlines = (ProfileInline, PostInlineUser, CommentInline)


    list_display = ('email', 'get_profile_nickname', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups') 
    search_fields = ('email', 'profile__nickname') # email and nickname search
    
    ordering = ('email',)


    fieldsets = (
        (None, {'fields': ('email', 'password')}),                     
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('last_login', 'date_joined')}),
    )
    readonly_fields = ('last_login', 'date_joined')
    # for new user -username
    add_fieldsets = ((None, {'classes': ('wide'), 'fields': ('email', 'password', 'password2')}))

    def get_profile_nickname(self, instance):
        # has attribute profile
        if hasattr(instance, 'profile') and instance.profile:
            return instance.profile.nickname
        return "N/A" 
    get_profile_nickname.short_description = 'Nickname'



@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    

    list_display = ('title', 'author', 'topic', 'rating','status', 'published_date', 'time_created_at')
    list_filter = ('status', 'topic', 'author', 'time_created_at', 'published_date')
    search_fields = ('title', 'body', 'author__email', 'topic__name') 
    raw_id_fields = ('author', 'topic')
    date_hierarchy = 'published_date' 
    ordering = ('-status', '-published_date', '-time_created_at') 

    # prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        (None, {'fields': ('author','title', 'body', 'topic')}), 
        ('Info', {'fields': ('status', 'rating', 'published_date','time_created_at', 'time_updated_at')}),
    )
    readonly_fields=( 'published_date','time_created_at', 'time_updated_at')



'''
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post_title', 'author', 'short_body', 'time_created_at') 
    list_filter = ('time_created_at', 'author') 
    search_fields = ('body', 'author__email', 'post__title')
    raw_id_fields = ('post', 'author') 
    ordering = ('-time_created_at',)

    fields = ('post', 'author', 'body') 
    # readonly_fields = ('time_created_at', 'updated_at') 

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = 'Post'

    def short_body(self, obj):
        return (obj.body[:75] + '...') if len(obj.body) > 75 else obj.body
    short_body.short_description = 'Comment text'

   
    # def is_active_comment(self, obj):
    #     return obj.is_active
    # is_active_comment.boolean = True 
    # is_active_comment.short_description = 'Active'
'''

# --- tipic admne ---
@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    
    inlines = (PostInlineTopic,)
    
    list_display = ('name', 'topic_slug', 'description_preview')
    search_fields = ('name', 'topic_description')
    prepopulated_fields = {'topic_slug': ('name',)} 

    def description_preview(self, obj):
        if obj.topic_description:
            return (obj.topic_description[:75] + '...') if len(obj.topic_description) > 75 else obj.topic_description
        return '-'
    description_preview.short_description = 'Topic Description'


