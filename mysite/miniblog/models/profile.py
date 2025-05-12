from django.db import models
from django.conf import settings



class Profile(models.Model):
    #this class extends standard user model by adding bio, avatar, subscribitions and blacklist


    # user field
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    nickname = models.CharField(
        max_length=50,
        unique=True,
        blank=True,  
        null=True,   
        verbose_name="nickname"
    )
    # bio field
    user_bio = models.TextField(
        blank=True,
        null=True,  
        verbose_name="About me" 
    )

    user_avatar = models.ImageField(
        # models.ImageField used for downloading images from MEDIA_ROOT (settings.py),
        # for example MEDIA_ROOT/avatars/filename.jpg
        upload_to='avatars/',

        # if no avatar
        null=True, 
        # blank field in database
        blank=True, 
        verbose_name="Avatar" 
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

    #magic method (string view)
    def __str__(self):
       
        return f"User {self.user.username} profile"

    # meta for settings
    class Meta:
        # inner class for one model
        verbose_name = "Profile"        
        # plural name
        verbose_name_plural = "Profiles" 