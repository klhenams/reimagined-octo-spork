from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, 
    TokenVerifyView,
    TokenBlacklistView
)

from .views import (
    create_user, 
    AdminTokenObtainPairView, 
    AdminTokenVerifyView, 
    UserTokenVerifyView,
    LogoutView,
)

urlpatterns = [
    path('create-user/', create_user, name='create-user'), 
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin/login/', AdminTokenObtainPairView.as_view(), name='admin-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', UserTokenVerifyView.as_view(), name='verify-token'),
    path('token/verify/admin/', AdminTokenVerifyView.as_view(), name='verify-token-admin'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='blacklist-token'),
    path('logout/', LogoutView.as_view(), name='logout'),
]