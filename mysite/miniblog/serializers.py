from rest_framework import serializers
from .models import Post, Comment, CustomUser, Profile
#from django.contrib.auth.hashers import make_password



'''
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", 'password']
        extra_kwargs = {'password':{'write_only': True, 'required': True} }
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            password = validated_data['password']
        )
        return user
'''  
    
'''
**********USER REGISTRATION************
'''
class UserRegistrationSerializer(serializers.ModelSerializer):
    
    # Добавляем поле для никнейма
    nickname = serializers.CharField(
        max_length=50, # Должно совпадать с max_length в модели Profile
        required=True,
        write_only=True # Обычно никнейм не нужно возвращать в ответе о регистрации
    )
    # Добавляем поле для подтверждения пароля
    password2 = serializers.CharField(
        style={'input_type': 'password'}, # Скрыть ввод пароля в Browsable API DRF
        write_only=True, # Только на запись, не возвращается в ответе
        required=True
    )

    class Meta:
        model = CustomUser
        # Указываем все поля, которые принимает сериализатор
        fields = ('email', 'nickname', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True, 'style': {'input_type': 'password'}},
            'email': {'required': True}
        }

    def validate(self, data):

        # 1. Проверка совпадения паролей
        if data['password'] != data['password2']:
            # Если пароли не совпадают, вызываем ошибку валидации для поля password2
            # Ключ словаря 'password' соответствует имени поля, на которое вешается ошибка
            raise serializers.ValidationError({"password2": "Password don't match."})

        # 2. Проверка уникальности никнейма (если поле nickname уникально в модели Profile)
        # Это предотвратит ошибку IntegrityError на уровне базы данных и даст понятный ответ API
        if Profile.objects.filter(nickname=data['nickname']).exists():
            raise serializers.ValidationError({"nickname": "Nickname already in use."})

        
        return data

    def create(self, validated_data):
        
        # password2 нам больше не нужен, он использовался только для валидации
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )

        try:
            Profile.objects.create(user=user, nickname=validated_data['nickname'])
        except Exception as e:
             print(f"Warning: Could not create profile for {user.email}: {e}")
             # Возможно, здесь стоит удалить созданного user, если создание профиля критично
             user.delete()
             raise serializers.ValidationError("Could not create profile.") # И вернуть ошибку

        return user


'''
**********PROFILE************
'''

class ProfileSerializerForUser(serializers.ModelSerializer):
    class Meta:
        model = Profile
        # Укажите поля профиля, которые хотите включить
        fields = ['nickname', 'bio', 'avatar']


'''
**********USER************
'''

class UserSerializer(serializers.ModelSerializer):
    # Добавляем вложенный сериализатор профиля
    # read only  - you can't modify profile using this serializer
    profile = ProfileSerializerForUser(read_only=True)

    class Meta:
        model = CustomUser
        # Перечислите поля CustomUser, которые хотите возвращать
        fields = [
            'id',
            'email',
            'is_staff', # Может быть полезно на фронтенде
            'is_superuser', # Оставляем, это стандартное поле Django
            'date_joined',
            'profile', # <-- Наше вложенное поле профиля
            'primary_role',
        ]
        # Поля только для чтения (например, email нельзя менять через этот сериализатор)
        read_only_fields = [
            'id',
            'email',
            'is_staff', # Может быть полезно на фронтенде
            'is_superuser', # Оставляем, это стандартное поле Django
            'date_joined',
            'profile', # <-- Наше вложенное поле профиля
            'primary_role',
        ]
    
    def get_primary_role(self, obj):
        # Ваша логика определения основной роли по группам obj.groups.all()
        # Например, вернуть самую "высокую" роль или первую найденную
        groups = obj.groups.all()
        if groups.filter(name='Главный администратор').exists(): return 'Главный администратор'
        if groups.filter(name='Администратор').exists(): return 'Администратор'
        if groups.filter(name='Модератор сайта').exists(): return 'Модератор сайта'
        # ... и т.д. ...
        if groups.filter(name='Пользователь').exists(): return 'Пользователь'
        return None # Или 'Пользователь' по умолчанию
        
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    class Meta:
        model = Post
        fields = "__all__"
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"