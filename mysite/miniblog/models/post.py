from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from .topic import Topic
from django.utils import timezone

class Post(models.Model):
    # status of THE POST for flexibility 
    class Status(models.TextChoices):
            DRAFT = 'DF', 'Draft'
            PUBLISHED = 'PB', 'Published'
            ARCHIVED = 'AR', 'Archived'
    
    
    
    
    title = models.CharField(
        max_length=150,     
        verbose_name="Post title"
    )

    body = models.TextField(

        # Markdown or HTML.
        verbose_name="Post body" 
    )

    author = models.ForeignKey(
        #many-to-one , one author can create many different posts
        settings.AUTH_USER_MODEL, 
        null=True,  
        on_delete=models.SET_NULL, 
        # user.posts.all()
        related_name='posts',    
        verbose_name="Author"
    )

    topic = models.ForeignKey(
        # many to one, many posts - one topic
        
        Topic,                    
        # if topic removed - 
        on_delete=models.SET_NULL,            
        null=True,        
        # for off topic
        blank=True,   
        # for topic.posts.all() 
        related_name='posts',     
        verbose_name="Related topic"
    )

    rating = models.IntegerField(
        # IntegerField  for rating amount
        default=0,            
        db_index=True,        
                              
        verbose_name="Rating" 
    )

    reactions = GenericRelation(
        # relation for generic foreign field
        'Reaction',
        related_query_name='post' 
        
    )
    
    
    
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name="Status"
    )
    published_date = models.DateTimeField(
        null=True, blank=True, db_index=True, verbose_name="Published date"
    )
    
    time_created_at = models.DateTimeField(
        auto_now_add=True,
        #index for sorting acceleration
        db_index=True,
        verbose_name="Creation date"      
    )
    
    
    time_updated_at = models.DateTimeField(
    # auto update when save the post
    auto_now=True,
    verbose_name="Update date"
    )

    def publish(self):
        
        if self.status == self.Status.DRAFT:
            self.status = self.Status.PUBLISHED
            self.published_date = timezone.now()
            self.save(update_fields=['status', 'published_date', 'time_updated_at'])

    def unpublish(self):
        if self.status == self.Status.PUBLISHED:
            self.status = self.Status.DRAFT
            self.save(update_fields=['status', 'time_updated_at'])

    def archive(self):
        if self.status == self.Status.PUBLISHED:
            self.status = self.Status.ARCHIVED
            self.save(update_fields=['status', 'time_updated_at'])

    def is_published(self):
        return self.status == self.Status.PUBLISHED


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Post"            
        verbose_name_plural = "Posts"    
        ordering = ['-time_created_at']
