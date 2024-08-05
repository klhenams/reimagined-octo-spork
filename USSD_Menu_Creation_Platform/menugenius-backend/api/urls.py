from django.urls import path

from .views import *

urlpatterns = [
    # """Menu Endpoints"""
    path('user-menus/', UserMenuList.as_view(), name='user-menus'),
    path('create-menu/', MenuCreateView.as_view(), name='create-menu'),
    path('menu/<int:pk>/', MenuDetail.as_view(), name='menu-detail'),
    path('edit-menu/<int:pk>/', EditMenu.as_view(), name='edit-menu'),
    path('delete-menu/<int:pk>/', DeleteMenu.as_view(), name='delete-menu'),

    # """MenuOptions Endpoints"""
    path('menu-options/<int:menu_id>/', MenuOptionListView.as_view(), name='menu-option-list'),
    path('create-menu-option/<int:menu_id>/', MenuOptionCreateView.as_view(), name='create-menu-option'),
    path('menu-option/<int:menu_id>/<int:pk>/', MenuOptionDetail.as_view(), name='menu-option-detail'),
    path('edit-menu-option/<int:menu_id>/<int:pk>/', EditMenuOption.as_view(), name='edit-menu-option'),
    path('delete-menu-option/<int:menu_id>/<int:pk>/', DeleteMenuOption.as_view(), name='delete-menu-option'),

    #userlist
    path('users/', UserList.as_view(), name='user-list'),
    #menulist
    path('menus/', MenuList.as_view(), name='menu-list'),

    #userdetail
    path('user/', UserDetailView.as_view(), name='user-detail'),

    #Session
    path('sessions/<int:menu_id>/', SessionDataListView.as_view(), name='session-response-list'),
    
]