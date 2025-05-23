from django.db import models
from django.conf import settings

# Topic - model for topics, thematic section


class Topic(models.Model):


    # CharField for short strings

    name = models.CharField(
        # 100 characters for theme - more than enough
        max_length=100,       
        # name should be unique, database will prevent from creating a duplicate
        unique=True,          
        
        verbose_name="Topic name" 
    )

    # slug for URL
    topic_slug = models.SlugField(
        
        max_length=110,     
        unique=True,         
        blank=True           
    )
    # Textfield for long description
    topic_description = models.TextField(
        
        blank=True,         
        null=True,         
        verbose_name="Description" 
    )

    # optional field
    # creator = models.ForeignKey(
    #     settings.AUTH_USER_MODEL, 
    #     on_delete=models.SET_NULL, 
    #     null=True,                 
    #     blank=True                 
    # )

    #time methods
    time_created_at = models.DateTimeField(
        # auto_now_add=True for automatic save current time
        auto_now_add=True    
    )
    time_updated_at = models.DateTimeField(
        # auto_now_add=True for automatic update current time
        # every time when save() calling
        auto_now=True    
    )
    # magic string view
    def __str__(self):
       
        return self.name

    # def save(self, *args, **kwargs):
    #     if not self.slug and self.name:
    #         from django.utils.text import slugify 
    #         self.slug = slugify(self.name)
    #       
    #     super().save(*args, **kwargs) 

    class Meta:
        verbose_name = "Topic"           
        verbose_name_plural = "Topics"    
        ordering = ['name']
    