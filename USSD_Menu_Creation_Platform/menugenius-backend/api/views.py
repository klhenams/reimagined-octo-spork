from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView, 
    CreateAPIView, 
    RetrieveAPIView, 
    RetrieveUpdateAPIView, 
    DestroyAPIView
    )
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError

from ussd.models import Menu, MenuOption, SessionData
from user.models import CustomUser
from .serializers import (
    MenuSerializer, 
    MenuOptionSerializer, 
    UserSerializer, 
    MenuListSerializer, 
    UserListSerializer,
    SessionListSerializer,
    )

class UserMenuList(ListAPIView):
    """List Menus associated with the user"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuSerializer

    def get_queryset(self):
        authenticated_user = self.request.user
        return Menu.objects.filter(user=authenticated_user)

class MenuCreateView(CreateAPIView):
    """Create a new Menu"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MenuDetail(RetrieveAPIView):
    """Retrieve a Menu"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuSerializer

    def get_queryset(self):
        authenticated_user = self.request.user
        return Menu.objects.filter(user=authenticated_user)
    
class EditMenu(RetrieveUpdateAPIView):
    """Edit a Menu"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuSerializer

    def get_queryset(self):
        authenticated_user = self.request.user
        return Menu.objects.filter(user=authenticated_user)
    
class DeleteMenu(DestroyAPIView):
    """Delete a Menu"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuSerializer
    
    def get_queryset(self):
        authenticated_user = self.request.user
        return Menu.objects.filter(user=authenticated_user)



class MenuOptionListView(ListAPIView):
    """List Menu Options associated with user"""
    serializer_class = MenuOptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        menu_id = self.kwargs['menu_id']

        menu = Menu.objects.filter(id=menu_id, user=self.request.user).first()
        if menu:
            return MenuOption.objects.filter(menu=menu)
        else:
            raise ValidationError("You do not have permission to view options of this menu.")
        
class MenuOptionCreateView(CreateAPIView):
    """Create Menu OPtions"""
    serializer_class = MenuOptionSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        menu_id = self.kwargs['menu_id']
        menu = Menu.objects.filter(id=menu_id, user=self.request.user).first()
        if not menu:
            raise ValidationError("You do not have permission to add options to this menu.")
        context['menu'] = menu
        return context

    def perform_create(self, serializer):
        serializer.save()

class MenuOptionDetail(RetrieveAPIView):
    """Retrive a Menu Option"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuOptionSerializer

    def get_queryset(self):
        menu_id = self.kwargs['menu_id']

        menu = Menu.objects.filter(id=menu_id, user=self.request.user).first()
        if not menu:
            raise ValidationError("You do not have permission to view options from this menu.")
        else:
            return MenuOption.objects.filter(menu=menu)

class EditMenuOption(RetrieveUpdateAPIView):
    """Edit a MenuOption"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuOptionSerializer

    def get_queryset(self):
        menu_id = self.kwargs['menu_id']

        menu = Menu.objects.filter(id=menu_id, user=self.request.user).first()
        if not menu:
            raise ValidationError("You do not have permission to edit options of this menu.")
        else:
            return MenuOption.objects.filter(menu=menu)
        
        
class DeleteMenuOption(DestroyAPIView):
    """Delete Menu Option"""
    permission_classes = [IsAuthenticated]
    serializer_class = MenuOptionSerializer

    def get_queryset(self):
        menu_id = self.kwargs['menu_id']

        menu = Menu.objects.filter(id=menu_id, user=self.request.user).first()
        if not menu:
            raise ValidationError("You do not have permission to delete options from this menu.")
        else:
            return MenuOption.objects.filter(menu=menu)
            
# Admin 

class UserList(ListAPIView):
    """List All Users"""
    permission_classes = [IsAdminUser]
    serializer_class = UserListSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(is_staff=False)

class MenuList(ListAPIView):
    """List all Menus"""
    permission_classes = [IsAdminUser]
    serializer_class = MenuListSerializer

    def get_queryset(self):
        return Menu.objects.all()

#user details
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#Session
class SessionDataListView(ListAPIView):
    """List Session Data from a Menu"""
    permission_classes=[IsAuthenticated]
    serializer_class = SessionListSerializer

    def get_queryset(self):
        menu_id = self.kwargs['menu_id']
        menu = Menu.objects.filter(id=menu_id, user=self.request.user).first()
        if not menu:
            raise ValidationError("You do not have permission to view options from this menu.")
        else:
            return SessionData.objects.filter(menu_id=menu_id).order_by('-date')

        

