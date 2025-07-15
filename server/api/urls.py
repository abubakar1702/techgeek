from django.urls import path
from . import views
from .views import BlogPostAPIView, BlogPostSlugAPIView, BlogPostDetailAPIView, FilteredBlogPostAPIView, LikePostAPIView, BookmarkPostAPIView, UserDraftPostsAPIView, UserBookmarksAPIView, UserInfoAPIView, BlogPostUpdateAPIView, BlogPostDeleteAPIView, TopStoriesAPIView, PublicUserInfoAPIView, BlogPostSearchAPIView, CommentCreateAPIView, CommentUpdateAPIView, CommentDeleteAPIView, CommentLikeAPIView, NotificationViewSet
from rest_framework.routers import DefaultRouter
from django.urls import include

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('blogs/', views.BlogPostAPIView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', views.BlogPostDetailAPIView.as_view(), name='blog-details'),
    path('blogs/slug/<slug:slug>/', views.BlogPostSlugAPIView.as_view(), name='blog-slug-details'),
    path('blogs/filter/', views.FilteredBlogPostAPIView.as_view(), name='blog-filtered'),
    path('blogs/<int:pk>/like/', views.LikePostAPIView.as_view(), name='blog-like'),
    path('blogs/<int:pk>/bookmark/', views.BookmarkPostAPIView.as_view(), name='blog-bookmark'),
    path('blogs/<int:pk>/update/', views.BlogPostUpdateAPIView.as_view(), name='blog-update'),
    path('blogs/<int:pk>/delete/', views.BlogPostDeleteAPIView.as_view(), name='blog-delete'),
    path('user/drafts/', views.UserDraftPostsAPIView.as_view(), name='user-draft-posts'),
    path('user/bookmarks/', views.UserBookmarksAPIView.as_view(), name='user-bookmarks'),
    path('user/info/', views.UserInfoAPIView.as_view(), name='user-info'),
    path('user/public/<int:user_id>/', views.PublicUserInfoAPIView.as_view(), name='user-public-info'),
    path('blogs/top-stories/', views.TopStoriesAPIView.as_view(), name='blog-top-stories'),
    path('blogs/search/', views.BlogPostSearchAPIView.as_view(), name='blog-search'),
    path('comments/create/', views.CommentCreateAPIView.as_view(), name='comment-create'),
    path('comments/<int:pk>/update/', views.CommentUpdateAPIView.as_view(), name='comment-update'),
    path('comments/<int:pk>/delete/', views.CommentDeleteAPIView.as_view(), name='comment-delete'),
    path('comments/<int:pk>/like/', CommentLikeAPIView.as_view(), name='comment-like'),
    path('', include(router.urls)),
]
