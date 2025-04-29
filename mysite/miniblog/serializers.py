from rest_framework import serializers
from .models import Post, Comment, CustomUser
#from django.contrib.auth.hashers import make_password


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", 'password']
        extra_kwargs = {'password':{'write_only': True}, 'required': True }
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            password = validated_data['password']
        )
        return user
    
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    class Meta:
        model = Post
        fields = "__all__"