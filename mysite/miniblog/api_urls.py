# miniblog/api_urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello_world
from .viewsets import PostViewSet, CommentViewSet, TopicViewSet, ReactionViewSet


router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post_api')
router.register(r'comments', CommentViewSet, basename='comment_api')
router.register(r'topics', TopicViewSet, basename='topic_api')
router.register(r'reactions', ReactionViewSet, basename='reaction_api')



urlpatterns = [
    path('', include(router.urls)), 
    path('test/hello/', hello_world, name='hello_world_api'),
    # another endpointys
]