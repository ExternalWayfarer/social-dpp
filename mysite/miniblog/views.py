from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.utils import timezone
from .models import Post
from .forms import PostForm


  
def index(request):
    

    return HttpResponse(f'''
                        <p>Path: {request.path}</p>
                        <a href="http://localhost:8000/contacts/">В контакты</a>
                        
                        <br><a href="http://localhost:8000/about/">в "о сайте"</a>
                        <a href="http://localhost:8000">в "nahuy"</a>
                        
                        ''')
 
def about(request):
    return HttpResponse(f'''
                        <p>Path: {request.path}</p>
                        <a href="http://localhost:8000/index/">Назад</a>''')
 
def contacts(request):
    host = request.META["HTTP_HOST"] # получаем адрес сервера
    user_agent = request.META["HTTP_USER_AGENT"]    # получаем данные браузера
    path = request.path     # запрошенный путь


    return HttpResponse(f'''<p>Host: {host}</p>
                        <p>Path: {path}</p>
                        <p>User-agent: {user_agent}</p>
                        <a href="http://localhost:8000/index/">Назад</a>''')

def user(request, name="Undefined"):
    return HttpResponse(f"<h2>Имя: {name}</h2>")


def post_list(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'miniblog/post_list.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'miniblog/post_detail.html', {'post': post})

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
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
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'miniblog/post_edit.html', {'form': form})

#def search_detail(request, pk=None):
#    post_object = None
#    if pk is not None:
#        post_object=Post.objects.get(pk=pk)
#    context = {
#        'object':post_object,
#    }
#    return render(request, 'miniblog/search_results.html', context=context)

def search_results(request):
    query = request.GET.get("q")
    print(query)
    post_object = None
    if query is not None:
        post_object=Post.objects.get(pk=query)
    

    context={'object':post_object}
    return render(request, 'miniblog/search_results.html', context=context)



#def post_search(request):
