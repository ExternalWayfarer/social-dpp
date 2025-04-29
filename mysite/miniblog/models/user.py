from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    '''
    class Role(models.TextChoices):
        # DB = 'DB', _('NAME')
        USER = 'USER', _('User')
        BUSINESS = 'BUSINESS', _('Business account')
        TOPIC_MOD = 'TOPIC_MOD', _('Topic moderator')
        SITE_MOD = 'SITE_MOD', _('Site moderator')
        ADMIN = 'ADMIN', _('Admin')
        CHIEF_ADMIN = 'CHIEF_ADMIN', _('Chief admin')
    '''
    
    
    
    username = None
    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    '''
    role = models.CharField(
        max_length=20,         
        # roles from class Role  
        choices=Role.choices,    
        # for newcomers
        default=Role.USER,       
        verbose_name=_("Role")
    )
    '''
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    '''
    # check if user admnin
    @property
    def is_admin_or_higher(self):
         return self.role in [self.Role.ADMIN, self.Role.CHIEF_ADMIN]
    '''