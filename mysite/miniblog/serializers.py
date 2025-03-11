from rest_framework import serializers
from .models import Post, Comment, CustomUser

#connect serializer to viewset in views.py
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

