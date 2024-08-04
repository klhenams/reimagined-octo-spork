from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer, 
    TokenVerifySerializer,
)
from rest_framework.response import Response

from .models import CustomUser
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout

import json

User = get_user_model()

@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            password = data.get('password')

            if not email or not first_name or not last_name or not password:
                return JsonResponse({'error': 'All fields are required'}, status=400)

            user = CustomUser.objects.create_user(
                email=email, 
                first_name=first_name, 
                last_name=last_name, 
                password=password
                )
            
            return JsonResponse({'message': 'User created successfully'}, status=201)
        
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    
# @api_view(['POST'])
# def admin_login(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
#     user = authenticate(request, email=email, password=password)
    
#     if user is not None:
#         if user.is_staff:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }, status=200)
#         else:
#             return Response({'error': 'Not an admin user'}, status=403)
#     else:
#         return Response({'error': 'Invalid credentials'}, status=401)
    
class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not user.is_staff:
            raise ValidationError("You do not have permission to access this resource.")
        data.update({'is_admin': user.is_staff})
        return data

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


class CustomTokenVerifySerializer(TokenVerifySerializer):
    def validate(self, attrs):
        token = attrs['token']

        try:
            validated_token = UntypedToken(token)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user_id = validated_token.get('user_id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise InvalidToken('User not found.')

        if user.is_staff:
            raise InvalidToken('User is an admin.')

        return {}
    
class UserTokenVerifyView(TokenVerifyView):
    serializer_class = CustomTokenVerifySerializer

class CustomAdminTokenVerifySerializer(TokenVerifySerializer):
    def validate(self, attrs):
        token = attrs['token']

        try:
            validated_token = UntypedToken(token)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user_id = validated_token.get('user_id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise InvalidToken('User not found.')

        if not user.is_staff:
            raise InvalidToken('User is not an admin.')

        return {}
class AdminTokenVerifyView(TokenVerifyView):
    serializer_class = CustomAdminTokenVerifySerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)