from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
# from django.utils.text import slugify # Понадобится для автоматической генерации slug
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def update(self):
        self.updated_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.TextField()
    published_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(blank=True, null=True)
    
    def publish(self):
        self.published_date = timezone.now()
        self.save()
        
    def update(self):
        self.updated_date = timezone.now()
        self.save()

    def __str__(self):
        return 'Comment {} by {}'.format(self.body, self.author)
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    


    # user profile class
class Profile(models.Model):
    #this class extends standard user model by adding bio, avatar, subscribitions and blacklist


    # user field
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    # bio field
    user_bio = models.TextField(
        blank=True,
        null=True,  
        verbose_name="About me" 
    )

    user_avatar = models.ImageField(
        # models.ImageField used for downloading images from MEDIA_ROOT (settings.py),
        # куда будут сохраняться загруженные аватары.
        # Например, 'avatars/' сохранит файл как MEDIA_ROOT/avatars/имя_файла.jpg
        upload_to='avatars/',

        null=True,  # Разрешает значение NULL в БД (если аватар не загружен).
        blank=True, # Разрешает оставлять поле пустым в формах.
        verbose_name="Avatar" # Человекочитаемое имя.
    )

    # socials
    user_follows = models.ManyToManyField(
        # user can sub to many and many can sub to user
        'self',

        # wee can see who folloewd user
        related_name='followed_by',

        # asymmetrical subscribitions
        symmetrical=False,

        # blank profile( without subs)
        blank=True,
        verbose_name="Subscribitions"
    )

    user_blocks = models.ManyToManyField(
        # like follows but for blacklist
        'self',
        # wee can see who blocked user
        related_name='blocked_by', 
        # asymmetrical blacklist
        symmetrical=False,
        # you can  have no one in blacklist
        blank=True,
        # 
        verbose_name="Blacklist"
    )

    # extra fields
    # rating = models.IntegerField(default=0, verbose_name="Rating")

    # date and time methods
    time_created_at = models.DateTimeField(
        
        # auto_now_add=True for automatic save current time
        # ONLY on create! After Field becomes immutable
        auto_now_add=True
    )
    time_updated_at = models.DateTimeField(
        # auto_now_add=True for automatic update current time
        # every time when save() calling
        auto_now=True
    )

    # --- Методы модели ---
    def __str__(self):
        #magic method (string view)
        return f"Профиль пользователя {self.user.username}"

    # meta for settings
    class Meta:
        # inner class for one model
        # model name in single
        verbose_name = "Profile"        
        # plural name
        verbose_name_plural = "Profiles" 







# Topic
class Topic(models.Model):
    """
    modle
    """

    
    name = models.CharField(
        # CharField 
        max_length=100,       
        unique=True,          
                              
        verbose_name="Название темы" 
    )

    slug = models.SlugField(
        
        max_length=110,     
        unique=True,         
        blank=True           
    )

    description = models.TextField(
        
        blank=True,         
        null=True,         
        verbose_name="Описание" 
    )


    # creator = models.ForeignKey(
    #     settings.AUTH_USER_MODEL, 
    #     on_delete=models.SET_NULL, 
    #     null=True,                 
    #     blank=True                 
    # )

    created_at = models.DateTimeField(
        auto_now_add=True    
    )
    updated_at = models.DateTimeField(
        
        auto_now=True    
    )

    # --- Методы модели ---
    def __str__(self):
       
        return self.name

    # def save(self, *args, **kwargs):
    #     if not self.slug and self.name:
    #         from django.utils.text import slugify 
    #         self.slug = slugify(self.name)
    #       
    #     super().save(*args, **kwargs) 

    class Meta:
        verbose_name = "Тема"           
        verbose_name_plural = "Темы"    
        ordering = ['name']            
