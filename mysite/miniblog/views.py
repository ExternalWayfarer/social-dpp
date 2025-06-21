from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
#from django.http import HttpResponse
from django.utils import timezone
from .models import Post, Comment, CustomUser, Reaction
from .serializers import UserSerializer, UserRegistrationSerializer, ReactionSerializer
from rest_framework import viewsets, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView

from .forms import PostForm, CommentForm
from django.db.models import Q
#from django.core.paginator import Paginator
  



class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user contains CustomUser instance
        user = request.user
        content = {
            'message': f'Hello, {user.email}! This is a protected view.',
            'user_id': user.id,
            # 'profile_data': ProfileSerializer(user.profile).data 
        }
        return Response(content)


@api_view(['GET'])
def hello_world(request):
    permission_classes = [AllowAny]
    return Response({'message': 'Hello World!'})

''''''
def user(request, pk):
    user= get_object_or_404(Post, pk=pk)
    return render(request, 'miniblog/user_profile.html', {'user': user})

def post_list(request):
    posts = Post.objects.filter(time_created_at__lte=timezone.now()).order_by('time_created_at')
    return render(request, 'miniblog/post_list.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    comments = post.comments.all
    new_comment = None    # Comment posted
    if request.method == 'POST':
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
            # Create Comment object but don't save to database yet
            new_comment = comment_form.save(commit=False)
            # Assign the current post to the comment
            new_comment.post = post
            # Save the comment to the database
            new_comment.save()
            return redirect('post_detail', pk=post.pk)
    else: comment_form=CommentForm()
    return render(request, 'miniblog/post_detail.html', {'post': post,
                                                        'comments': comments,
                                                        'new_comment': new_comment,
                                                        'comment_form': comment_form})

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'miniblog/post_edit.html', {'form': form})

def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.time_updated_at = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'miniblog/post_edit.html', {'form': form})


def search_results(request):
    search_query = request.GET.get("search", "")

    if search_query:
        post_object=Post.objects.filter(Q(title__icontains = search_query) |Q(body__icontains = search_query))
    else:
        post_object= Post.objects.all()
    print(post_object)

    return render(request, 'miniblog/search_results.html', {'post_object':post_object})




#class UserViewSet(viewsets.ModelViewSet):
#    queryset = CustomUser.objects.all()
#    serializer_class = UserSerializer



    
class UserRegistrationView(generics.CreateAPIView):

    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny] # allow everyone to sign up
    serializer_class = UserRegistrationSerializer 
'''
class ReactionView(generics.CreateAPIView):

    queryset = Reaction.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ReactionSerializer 
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
'''

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)
        return Response(serializer.data) 