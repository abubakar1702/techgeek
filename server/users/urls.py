from django.urls import path
from .views import RegisterAPIView, LoginAPIView, LogoutAPIView, ProfileView, ChangePasswordAPIView

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', LoginAPIView.as_view(), name='login'),
    path('auth/logout/', LogoutAPIView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordAPIView.as_view(), name='change-password'),
]
