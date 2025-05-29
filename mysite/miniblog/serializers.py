from rest_framework import serializers
from .models import Post, Comment, CustomUser, Profile, Topic
#from django.contrib.auth.hashers import make_password



    
'''
---------------USER REGISTRATION---------------
'''
class UserRegistrationSerializer(serializers.ModelSerializer):
    
    nickname = serializers.CharField(
        max_length=50, 
        required=True,
        write_only=True 
    )
    
    password2 = serializers.CharField(
        style={'input_type': 'password'}, 
        write_only=True,
        required=True
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'nickname', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True, 'style': {'input_type': 'password'}},
            'email': {'required': True}
        }

    def validate(self, data):

        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password don't match."})


        if Profile.objects.filter(nickname=data['nickname']).exists():
            raise serializers.ValidationError({"nickname": "Nickname already in use."})

        
        return data

    def create(self, validated_data):
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )

        try:
            Profile.objects.create(user=user, nickname=validated_data['nickname'])
        except Exception as e:
             print(f"Warning: Could not create profile for {user.email}: {e}")
             user.delete()
             raise serializers.ValidationError("Could not create profile.") # И вернуть ошибку

        return user
'''
------------------------------
'''

'''
---------------PROFILE---------------
'''

class ProfileSerializerForUser(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nickname', 'user_bio', 'user_avatar']
'''
------------------------------
'''

'''
---------------USER---------------
'''

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializerForUser(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'is_staff', 
            'is_superuser', 
            'date_joined',
            'profile', # inline prof
            #'primary_role',
        ]
        read_only_fields = [
            'id',
            'email',
            'is_staff', 
            'is_superuser', 
            'date_joined',
            'profile', 
            #'primary_role',
        ]
    
    def get_primary_role(self, obj):
        groups = obj.groups.all()
        if groups.filter(name='Главный администратор').exists(): return 'Главный администратор'
        if groups.filter(name='Администратор').exists(): return 'Администратор'
        if groups.filter(name='Модератор сайта').exists(): return 'Модератор сайта'
        if groups.filter(name='Пользователь').exists(): return 'Пользователь'
        return None 

'''
------------------------------
'''
  
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only = True)
    topic = serializers.StringRelatedField(allow_null=True) 
    comments_count = serializers.IntegerField(
        source='total_comments', 
        read_only=True
    )
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'body', # snippet maybe for homepage
            'author',
            'topic',
            'status',
            'published_date',
            'time_created_at', 
            'time_updated_at', 
            'rating',          
            'comments_count', 
        ]
        read_only_fields = ['status', 'published_date', 'time_created_at', 'time_updated_at', 'comments_count', 'rating']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    class Meta:
        model = Comment
        fields = "__all__"
        
        
class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"