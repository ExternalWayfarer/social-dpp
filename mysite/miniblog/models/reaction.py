from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Reaction(models.Model):
    
    class ReactionType(models.TextChoices):
        # VAR = 'DB VIEW', 'GRAPHIC VIEW'
        LIKE = 'LIKE', '👍' 
        DISLIKE = 'DISLIKE', '👎'
        HEART = 'HEART', '❤️'
        LOL = 'LOL', '😂'
        CLOWN = 'CLOWN', '🤡'          
        SHIT = 'SHIT', '💩'            
        NEUTRAL = 'NEUTRAL', '😐'
        TEARS = 'TEARS', '😭'         
        FEAR = 'FEAR', '😱'            
        ANGRY = 'ANGRY', '😡'          
        FIRE = 'FIRE', '🔥'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reactions',
        verbose_name="User"
    )
    reaction_type = models.CharField(
        #
        max_length = 10,
        choices=ReactionType.choices,
        verbose_name="Reaction type"
    )

    # Generic Foreign Key for connection TO (Post, Comment)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=False,)
    object_id = models.PositiveIntegerField(null=False,)
    
    content_object = GenericForeignKey('content_type', 'object_id')

    time_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} reacted {self.get_reaction_type_display()}  on {self.content_object} at {self.time_created_at}"

    class Meta:
        verbose_name = "Reaction"
        verbose_name_plural = "Reactions"
        #one user - one reaction per object
        unique_together = ('user', 'content_type', 'object_id')
        ordering = ['-time_created_at']