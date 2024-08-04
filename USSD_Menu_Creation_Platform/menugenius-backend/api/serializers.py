from rest_framework import serializers
from ussd.models import Menu, MenuOption, SessionData
from user.models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()
class MenuOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuOption
        fields = ['id', 'menu', 'name', 'value', 'parent_option', 'expects_input']
        read_only_fields = ['menu']

    def create(self, validated_data):
        # The menu is added in the view
        menu = self.context['menu']
        return MenuOption.objects.create(menu=menu, **validated_data)
    
class MenuSerializer(serializers.ModelSerializer):
    menu_options = MenuOptionSerializer(many=True, read_only=True)
    class Meta:
        model = Menu
        fields = ('id', 'user', 'name', 'description', 'menu_options')
        read_only_fields = ['user']
    
    def create(self, validated_data):
        # The user field will be set in the view, not from the request data
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined']

class MenuListSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    class Meta:
        model = Menu
        fields = ('id', 'name', 'user_email')
    
    def get_user_email(self, obj):
        return obj.user.email

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
    
class SessionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionData
        fields = ['session_id', 'phone_number', 'user_responses', 'date' ]