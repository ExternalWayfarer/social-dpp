from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from .post import Post

class Comment(models.Model):
    # model for a comment, supports nested trees 

    post = models.ForeignKey(
        # ForeignKey: connection between post and comment
        Post,           
        # if you delete a post, all comments must be also deleted
        on_delete=models.CASCADE,
        # [post].comments.all() will return all comments related to this post
        related_name='comments',  
        verbose_name="Post"
    )
    # user who posted the comment
    author = models.ForeignKey(
        # comment and author must be connected
        settings.AUTH_USER_MODEL,
        # if author was removed, his comments will stay
        on_delete=models.SET_NULL, 
        null=True,
        # some_user.comments.all() should return all comments of this user
        related_name='comments',  
        verbose_name="Author"      
    )

    body = models.TextField(
        verbose_name="Comment body"
    )
    # nesting
    parent = models.ForeignKey(
        # ForeignKey referring to this model
        'self',
        # if parent was deleted, other comments will stay
        on_delete=models.SET_NULL, 
        # top level comments have no parents
        null=True,                
        blank=True,
        #parent_comment.replies.all()               
        related_name='replies',   
        verbose_name="Parent comment" 
        # django-mptt maybe?
    )

    #simple rating field
    rating = models.IntegerField(
        # int for comment rating
        default=0,    
        # for sorting acceleration        
        db_index=True,        
        verbose_name="Rating"
    )

    #
    reactions = GenericRelation(
        # name of the reaction model
        'Reaction',     
        # some_comment.reactions.all(), Reaction.objects.filter(comment=...)
        related_query_name='comment' 
        
    )

    time_created_at = models.DateTimeField(
        auto_now_add=True, 
        # sorting by creation timee
        db_index=True     
    )
    time_updated_at = models.DateTimeField(
        
        auto_now=True      
    )

    # short comment preview with exception
    def __str__(self):

        body_preview = (self.body[:30] + '...') if len(self.body) > 30 else self.body
        try:
            post_title = self.post.title
        # if post was deleted
        except Post.DoesNotExist:
             post_title = "[deleted post]"
        return f"Comment from {self.author} to the post '{post_title}': '{body_preview}'"


    class Meta:
        verbose_name = "Comment"         
        verbose_name_plural = "Comments"  
        ordering = ['time_created_at']