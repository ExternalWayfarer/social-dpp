from django import forms

from .models import Post


class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = ('title', 'text' ,'author')



#class SearchForm(forms.Form):
#    query = forms.CharField()

