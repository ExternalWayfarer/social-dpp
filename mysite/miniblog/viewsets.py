from .serializers import PostSerializer, CommentSerializer, UserSerializer, TopicSerializer
from django.db.models import Count
from django.utils import timezone
from .models import Post, Comment, CustomUser, Topic
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny



class UserCreateViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class PostViewSet(viewsets.ModelViewSet):
    #queryset = Post.objects.select_related('author__profile').all()
    #queryset = Post.objects.filter(status=Post.Status.PUBLISHED, published_date__lte=timezone.now()).select_related('author__profile', 'topic')

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    def get_queryset(self):
        queryset = Post.objects.select_related('author__profile').all()
        # annotation
        # 'comments' - related_name from  Comment.post to Post
        # if !related_name , then  'comment_set'
        queryset = queryset.annotate(total_comments=Count('comments')).order_by('-time_created_at') 
        return queryset

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    def get_queryset(self):
        queryset = Comment.objects.select_related('author__profile').all()
        post_id = self.request.query_params.get('post', None)
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
        else:
            return Comment.objects.none()
        return queryset.order_by('time_created_at')
        
    
class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 