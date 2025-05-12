from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin # Для CustomUser


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

class ProfileInline(admin.StackedInline): # Или admin.TabularInline для более компактного вида
    model = Profile
    can_delete = False # Обычно профиль не удаляют отдельно от пользователя
    verbose_name_plural = 'Profiles'
    fk_name = 'user' # Имя поля в Profile, которое ссылается на CustomUser

    # Указываем поля из Profile, которые хотим видеть/редактировать на странице CustomUser
    # Используем ваши имена полей: nickname, user_bio, user_avatar
    fields = ('nickname', 'user_bio', 'user_avatar')
    # Если какие-то поля Profile должны быть только для чтения:
    # readonly_fields = ('некоторое_поле_профиля',)
    
    
@admin.register(CustomUser) # Регистрируем CustomUser с кастомными настройками
class CustomUserAdmin(BaseUserAdmin):
    # Добавляем ProfileInline
    inlines = (ProfileInline,)


    list_display = ('email', 'get_profile_nickname', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups') # Стандартные фильтры
    search_fields = ('email', 'profile__nickname') # Поиск по email и никнейму из профиля
    ordering = ('email',)

    # BaseUserAdmin.fieldsets включает 'username'. Нам нужно его убрать.
    # Также здесь можно добавить поле 'role', если оно у вас было бы в CustomUser.
    # Если используете Django Groups, то поле 'groups' уже есть.
    fieldsets = (
        (None, {'fields': ('email', 'password')}), # Для существующего пользователя
                                               # Профиль редактируется через inline
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # Для формы создания нового пользователя (убираем username)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # Поля, которые будут на форме создания пользователя.
            # Менеджер CustomUserManager должен уметь обрабатывать их (особенно password2)
            'fields': ('email', 'password', 'password2'),
        }),
    )

    # Метод для отображения никнейма в list_display
    def get_profile_nickname(self, instance):
        # hasattr проверяет, есть ли у instance атрибут 'profile' (т.е. создана ли запись Profile)
        if hasattr(instance, 'profile') and instance.profile:
            return instance.profile.nickname
        return "N/A" # Или None, или '-'
    get_profile_nickname.short_description = 'Nickname' # Название колонки



@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # Используем ваши имена полей (например, time_created_at)
    list_display = ('title', 'author', 'topic', 'status', 'published_date', 'time_created_at')
    list_filter = ('status', 'topic', 'author', 'time_created_at', 'published_date')
    search_fields = ('title', 'body', 'author__email', 'topic__name') # Поиск по email автора и названию темы
    raw_id_fields = ('author', 'topic') # Удобно для выбора автора и темы, если их много
    date_hierarchy = 'published_date' # Навигация по дате публикации
    ordering = ('-status', '-published_date', '-time_created_at') # Сортировка по умолчанию

    # Если у вас есть поле slug, которое автоматически заполняется из title:
    # prepopulated_fields = {'slug': ('title',)}

    # Настройка формы редактирования
    fieldsets = (
        (None, {
            'fields': ('title', 'body', 'topic') # Автор будет установлен автоматически
        }),
        ('Status & Publication', {
            'fields': ('status', 'published_date')
        }),
    )
    # Примечание: поле author лучше устанавливать автоматически в методе save_model
    # или в perform_create во ViewSet, если посты создаются через API.
    # Если посты создаются только через админку, можно добавить 'author' в fieldsets.

    # def save_model(self, request, obj, form, change):
    #     if not obj.pk: # Если объект новый (не редактирование)
    #         obj.author = request.user # Установить текущего пользователя админки как автора
    #     super().save_model(request, obj, form, change)

# --- Админка для Comment ---
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post_title', 'author', 'short_body', 'time_created_at') # is_active_comment - пример, если есть такое поле
    list_filter = ('time_created_at', 'author') # 'post' - если постов много, лучше raw_id_fields
    search_fields = ('body', 'author__email', 'post__title')
    raw_id_fields = ('post', 'author') # Для удобного выбора поста и автора
    ordering = ('-time_created_at',)

    # Поля для формы редактирования
    fields = ('post', 'author', 'body') # Добавьте 'parent' если нужно управлять вложенностью в админке
    # readonly_fields = ('created_at', 'updated_at') # Даты обычно не редактируют

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = 'Post'

    def short_body(self, obj):
        return (obj.body[:75] + '...') if len(obj.body) > 75 else obj.body
    short_body.short_description = 'Comment text'

    # Пример, если у вас есть поле is_active в модели Comment
    # def is_active_comment(self, obj):
    #     return obj.is_active
    # is_active_comment.boolean = True # Отобразит как галочку
    # is_active_comment.short_description = 'Активен'

# --- Админка для Topic ---
@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'topic_slug', 'description_preview')
    search_fields = ('name', 'topic_description')
    prepopulated_fields = {'topic_slug': ('name',)} # Автоматически заполнять slug из name

    def description_preview(self, obj):
        if obj.description:
            return (obj.description[:75] + '...') if len(obj.description) > 75 else obj.description
        return '-'
    description_preview.short_description = 'Description'

# Важно: Profile НЕ нужно регистрировать отдельно, если он уже добавлен как inline в CustomUserAdmin
# Если вы хотите И отдельную страницу для Profile И inline, тогда раскомментируйте,
# но обычно это избыточно.
# admin.site.register(Profile, ProfileAdmin) # ProfileAdmin нужно будет определить выше
