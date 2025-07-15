from rest_framework import serializers
from .models import BlogPost, Comment, Like, Bookmark, Category, CommentLike, Notification
from users.models import User
from users.serializers import UserSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'profile_picture', 'is_active']
        read_only_fields = ['id', 'email', 'is_active']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['id', 'created_at']
        
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    total_likes = serializers.IntegerField(read_only=True)
    liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'parent', 'content', 'is_approved', 'created_at', 'updated_at', 'replies', 'total_likes', 'liked']
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_likes', 'liked']

    def get_replies(self, obj):
        return CommentSerializer(obj.get_replies(), many=True, context=self.context).data

    def get_total_likes(self, obj):
        return obj.total_likes

    def get_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return CommentLike.objects.filter(comment=obj, user=request.user).exists()
        return False

class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(many=True, read_only=True)
    # Accept category slugs for write operations
    category_slugs = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        many=True,
        slug_field='slug',
        write_only=True,
        source='category'
    )
    comments = serializers.SerializerMethodField(read_only=True)
    image = serializers.ImageField(required=False)
    total_likes = serializers.IntegerField(read_only=True)
    total_comments = serializers.IntegerField(read_only=True)
    liked = serializers.SerializerMethodField(read_only=True)
    bookmarked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'image', 'slug', 'status',
            'created_at', 'updated_at', 'author', 'comments', 'category', 'category_slugs',
            'total_likes', 'total_comments', 'liked', 'bookmarked'
        ]
        read_only_fields = [
            'id', 'slug', 'created_at', 'updated_at',
            'author', 'comments', 'category', 'total_likes', 'total_comments', 'liked', 'bookmarked'
        ]

    def get_comments(self, obj):
        # Only top-level comments
        top_level_comments = obj.comments.filter(parent__isnull=True)
        return CommentSerializer(top_level_comments, many=True, context=self.context).data
    
    def get_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_bookmarked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return Bookmark.objects.filter(post=obj, user=request.user).exists()
        return False
        

class BookmarkSerializer(serializers.ModelSerializer):
    post = BlogPostSerializer(read_only=True)
    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'created_at']
        read_only_fields = ['id', 'post', 'created_at']
        

class UserFullInfoSerializer(serializers.ModelSerializer):
    drafts = serializers.SerializerMethodField()
    blog_posts = serializers.SerializerMethodField()
    bookmarks = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'profile_picture', 'drafts', 'blog_posts', 'bookmarks']
        read_only_fields = ['id', 'email', 'drafts', 'blog_posts', 'bookmarks']

    def get_drafts(self, obj):
        from .models import BlogPost
        drafts = BlogPost.objects.filter(author=obj, status=BlogPost.Status.DRAFT)
        return BlogPostSerializer(drafts, many=True).data

    def get_blog_posts(self, obj):
        from .models import BlogPost
        posts = BlogPost.objects.filter(author=obj)
        return BlogPostSerializer(posts, many=True).data

    def get_bookmarks(self, obj):
        from .models import Bookmark
        bookmarks = Bookmark.objects.filter(user=obj).select_related('post')
        return BookmarkSerializer(bookmarks, many=True).data
        

class PublicUserInfoSerializer(serializers.ModelSerializer):
    published_blogs = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'profile_picture', 'published_blogs']
        read_only_fields = ['id', 'email', 'full_name', 'profile_picture', 'published_blogs']

    def get_published_blogs(self, obj):
        from .models import BlogPost
        posts = BlogPost.objects.filter(author=obj, status=BlogPost.Status.PUBLISHED)
        return BlogPostSerializer(posts, many=True).data
        

class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ['id', 'comment', 'user', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']
        

class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)
    comment_content = serializers.CharField(source='comment.content', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'actor', 'verb', 'post', 'post_title', 'comment', 'comment_content', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'actor', 'post_title', 'comment_content', 'created_at']
        
