from rest_framework import serializers
from .models import Post, Comment, CustomUser, Profile, Topic, Reaction
from django.contrib.contenttypes.models import ContentType

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
             raise serializers.ValidationError("Could not create profile.") 

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
    
'''   def get_primary_role(self, obj):
    groups = obj.groups.all()
    if groups.filter(name='Admin').exists(): return 'Admin'
    if groups.filter(name='Moder').exists(): return 'Moder'
    if groups.filter(name='Moder').exists(): return 'Moder'
    if groups.filter(name='User').exists(): return 'User'
    return None '''

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
    #short_body = serializers.CharField(source = 'body')
    content_type_id = serializers.SerializerMethodField()
    class Meta:
        model = Post
    
        fields = [
            'id',
            'title',
            'body', 
            #'short_body',
            'author',
            'topic',
            'status',
            'published_date',
            'time_created_at', 
            'time_updated_at', 
            'rating',          
            'comments_count', 
            'content_type_id'
        ]
        read_only_fields = [ 'time_created_at', 'time_updated_at', 'comments_count', 'rating','content_type_id']
    
    def get_content_type_id(self, obj):
        return ContentType.objects.get_for_model(obj).pk
    
    
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    content_type_id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'body', 
            'parent',
            'author',
            'time_created_at', 
            'time_updated_at', 
            'rating',          
            'content_type_id'
        ]
    def get_content_type_id(self, obj):
        return ContentType.objects.get_for_model(obj).pk  
    def get_content_object_str(self, obj): 
        if hasattr(obj, 'content_object') and obj.content_object: 
            return str(obj.content_object)
        return None
  
        
class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"
        
class ReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 
    reaction_type_display = serializers.CharField(source='get_reaction_type_display', read_only=True)
    content_object_str = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Reaction


        fields = "__all__"
        #read_only_fields = ['content_type','object_id', 'content_object']
        
    def get_content_object_str(self, obj):
        if obj.content_object:
            return f"{obj.content_type.model}: {obj.content_object}"
        else:
            return None