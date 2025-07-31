from .serializers import PostSerializer, CommentSerializer, UserSerializer, TopicSerializer, ReactionSerializer
from django.db.models import Count
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from .models import Post, Comment, CustomUser, Topic, Reaction
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.decorators import action


# ------- USER CREATE --------

class UserCreateViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    
    

#--------- POSTS -- ------------


class PostViewSet(viewsets.ModelViewSet):
    #queryset = Post.objects.select_related('author__profile').all()
    #queryset = Post.objects.filter(status=Post.Status.PUBLISHED, published_date__lte=timezone.now()).select_related('author__profile', 'topic')

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    def get_queryset(self):
        queryset = Post.objects.filter(status=Post.Status.PUBLISHED, published_date__isnull=False, ).select_related('author__profile').all().order_by('-time_created_at','-published_date') 
        # annotation
        # 'comments' - related_name from  Comment.post to Post
        # if !related_name , then  'comment_set'
        queryset = queryset.annotate(total_comments=Count('comments'),total_rating=Count('reactions')).order_by('-time_created_at') 
        return queryset
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
#--------- Commenyts -- ------------



class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    def get_queryset(self):
        queryset = Comment.objects.select_related('author__profile').all()
        post_id = self.request.query_params.get('post', None)
        if post_id is not None:
            get_object_or_404(Post,pk=post_id)
            queryset = queryset.filter(post_id=post_id)
        else:
            return Comment.objects.none()
        return queryset.order_by('time_created_at')
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    
#-------- topics-----------------    
class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    
    
    
#--------- Reactions -- ------------
    
class ReactionViewSet(viewsets.ModelViewSet):
    #queryset = Reaction.objects.all()
    #queryset = Reaction.objects.all().select_related('user__profile', 'content_type')
    permission_classes = [AllowAny]
    serializer_class = ReactionSerializer 
    
    
    def get_queryset(self):
        queryset = Reaction.objects.all().select_related('user__profile', 'content_type')
        content_type_id = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
    
        if content_type_id and object_id:
            return queryset.filter(
                content_type_id=content_type_id,
                object_id=object_id
            )
        else:
            return Reaction.objects.none()
    
    def create(self, request, *args, **kwargs):
        user = self.request.user
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        content_type = data["content_type"]
        object_id = data["object_id"]
        new_type = data["reaction_type"]

        existing = Reaction.objects.filter(
            user=user,
            content_type=content_type,
            object_id=object_id
        ).first()

        if existing:
            if existing.reaction_type == new_type:
                existing.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

            else:
                existing.reaction_type = new_type
                existing.save()
                return Response(
                    self.get_serializer(existing).data,
                    status=status.HTTP_200_OK
                )
        else:
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

            
            
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            return Response(
                {"detail" : "you have no right."},status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()
        
    