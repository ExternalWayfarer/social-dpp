from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers 
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        # Create and save a simple user with given email and password.
    

        # simple email presence check
        if not email:
            raise ValueError(_("The Email must be set"))
        
        # normalize for consistency
        email = self.normalize_email(email)
        
        # create user instance using email and password
        user = self.model(email=email, **extra_fields)
        # set_password for hashing
        if password:
            user.set_password(password)

        user.save(using=self._db)
        
        
        try:
            default_group = Group.objects.get(name='User')
            user.groups.add(default_group)
        except Group.DoesNotExist:
            print("Warning: Default group 'User' not found.")
            pass
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        # create user with extra fields for superiority
        return self.create_user(email, password=password, **extra_fields)