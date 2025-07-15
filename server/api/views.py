from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import BlogPost, Like, Bookmark, Comment, CommentLike, Notification
from .serializers import BlogPostSerializer, BookmarkSerializer, UserFullInfoSerializer, PublicUserInfoSerializer, CommentSerializer, NotificationSerializer
from users.models import User
from rest_framework.permissions import IsAuthenticated
from users.serializers import UserSerializer
from django.utils import timezone
from django.db.models import Count, Q
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets
from rest_framework.decorators import action


class BlogPostAPIView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogPostSlugAPIView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class BlogPostDetailAPIView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer


class FilteredBlogPostAPIView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = BlogPost.objects.all()
        slug = self.request.query_params.get('slug')
        filter_type = self.request.query_params.get('filter')
        limit = self.request.query_params.get('limit')

        if slug:
            queryset = queryset.filter(category__slug__iexact=slug)

        if filter_type == 'recent':
            queryset = queryset.order_by('-created_at')

        # Apply distinct BEFORE slicing
        queryset = queryset.distinct()

        if limit and limit.isdigit():
            queryset = queryset[:int(limit)]

        return queryset


class LikePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = BlogPost.objects.get(pk=pk)
        except BlogPost.DoesNotExist:
            print(f"[DEBUG] Post with pk={pk} not found.")
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        print(f"[DEBUG] Like attempt: user={user}, post author={post.author}, post id={post.id}")
        like = Like.objects.filter(post=post, user=user).first()
        if like:
            like.delete()
            print(f"[DEBUG] Like removed for user={user} on post id={post.id}")
            return Response({
                'liked': False,
                'total_likes': post.likes.count(),
                'message': 'Post unliked.'
            }, status=status.HTTP_200_OK)
        else:
            Like.objects.create(post=post, user=user)
            # Notification for post like
            if post.author != user:
                Notification.objects.create(
                    recipient=post.author,
                    actor=user,
                    verb=Notification.Verb.LIKE,
                    post=post
                )
                print(f"[DEBUG] Notification created: {user} liked post by {post.author}")
            else:
                print(f"[DEBUG] No notification: user liked their own post.")
            return Response({
                'liked': True,
                'total_likes': post.likes.count(),
                'message': 'Post liked.'
            }, status=status.HTTP_201_CREATED)


class BookmarkPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = BlogPost.objects.get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        bookmark, created = Bookmark.objects.get_or_create(post=post, user=user)
        if not created:
            # Already bookmarked, so unbookmark
            bookmark.delete()
            bookmarked = False
        else:
            bookmarked = True
        total_bookmarks = Bookmark.objects.filter(post=post).count()
        return Response({
            'bookmarked': bookmarked,
            'total_bookmarks': total_bookmarks,
            'message': 'Post bookmarked.' if bookmarked else 'Bookmark removed.'
        }, status=status.HTTP_200_OK)


class UserDraftPostsAPIView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user, status=BlogPost.Status.DRAFT)

class UserBookmarksAPIView(generics.ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('post')


class UserInfoAPIView(generics.RetrieveAPIView):
    serializer_class = UserFullInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class IsAuthorOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow authors of a blog post to edit it."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class BlogPostUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

class BlogPostDeleteAPIView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]


class TopStoriesAPIView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        today = timezone.now().date()
        # Only published posts
        posts = BlogPost.objects.filter(
            status=BlogPost.Status.PUBLISHED,
            created_at__date__lte=today
        )
        # Annotate with today's like count
        posts = posts.annotate(
            likes_today=Count('likes', filter=Q(likes__created_at__date=today))
        ).order_by('-likes_today', '-created_at')
        return posts[:3]


class PublicUserInfoAPIView(generics.RetrieveAPIView):
    serializer_class = PublicUserInfoSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = 'user_id'

    def get_object(self):
        user_id = self.kwargs.get(self.lookup_url_kwarg)
        return User.objects.get(pk=user_id)


class BlogPostSearchAPIView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED)
        query = self.request.query_params.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | Q(content__icontains=query)
            )
        return queryset.distinct()


class CommentCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        slug = request.data.get('slug')
        if not slug:
            return Response({'detail': 'Blog post slug is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            post = BlogPost.objects.get(slug=slug)
        except BlogPost.DoesNotExist:
            return Response({'detail': 'Blog post not found.'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['post'] = post.id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            comment = serializer.save(author=request.user)
            # Notification for comment or reply
            parent_id = data.get('parent')
            if parent_id:
                try:
                    parent_comment = Comment.objects.get(id=parent_id)
                    if parent_comment.author != request.user:
                        Notification.objects.create(
                            recipient=parent_comment.author,
                            actor=request.user,
                            verb=Notification.Verb.REPLY,
                            post=post,
                            comment=comment
                        )
                        print(f"[DEBUG] Notification created: {request.user} replied to comment by {parent_comment.author}")
                    else:
                        print(f"[DEBUG] No notification: user replied to their own comment.")
                except Comment.DoesNotExist:
                    print(f"[DEBUG] Parent comment not found for reply notification.")
            else:
                if post.author != request.user:
                    Notification.objects.create(
                        recipient=post.author,
                        actor=request.user,
                        verb=Notification.Verb.COMMENT,
                        post=post,
                        comment=comment
                    )
                    print(f"[DEBUG] Notification created: {request.user} commented on post by {post.author}")
                else:
                    print(f"[DEBUG] No notification: user commented on their own post.")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentUpdateAPIView(UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        # Only allow update if user is author
        if self.get_object().author != self.request.user:
            raise PermissionDenied('You do not have permission to edit this comment.')
        serializer.save()

class CommentDeleteAPIView(DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        # Only allow delete if user is author
        if instance.author != self.request.user:
            raise PermissionDenied('You do not have permission to delete this comment.')
        instance.delete()

class CommentLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({'detail': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        like = CommentLike.objects.filter(comment=comment, user=user).first()
        if like:
            like.delete()
            comment.refresh_from_db()
            return Response({
                'liked': False,
                'total_likes': comment.total_likes,
                'message': 'Comment unliked.'
            }, status=status.HTTP_200_OK)
        else:
            CommentLike.objects.create(comment=comment, user=user)
            comment.refresh_from_db()
            # Notification for comment like (optional, not required by your spec)
            # if comment.author != user:
            #     Notification.objects.create(
            #         recipient=comment.author,
            #         actor=user,
            #         verb=Notification.Verb.LIKE,
            #         post=comment.post,
            #         comment=comment
            #     )
            return Response({
                'liked': True,
                'total_likes': comment.total_likes,
                'message': 'Comment liked.'
            }, status=status.HTTP_201_CREATED)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
