from rest_framework import serializers
from .models import Post, Comment, CustomUser

# model from models.py, this serializers will used in views.py
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "password"]
        extra_kwargs = {'password':{'write_only': True}}
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            password = validated_data['password']
        )
        return user