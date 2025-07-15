from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.conf import settings


class Category(models.Model):
    class CategoryType(models.TextChoices):
        ARTIFICIAL_INTELLIGENCE = 'artificial_intelligence', 'Artificial Intelligence'
        HARDWARE = 'hardware', 'Hardware'
        SMARTPHONE = 'smartphone', 'Smartphone'
        GAMING = 'gaming', 'Gaming'
        HOW_TO = 'how_to', 'How To'
        NEWS = 'news', 'News'
        OTHER = 'other', 'Other'

    type = models.CharField(
        max_length=30,
        choices=CategoryType.choices,
        default=CategoryType.OTHER,
        unique=True
    )
    name = models.CharField(max_length=50, editable=False)
    slug = models.SlugField(unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.name = self.get_type_display()
        self.slug = self.type
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name    

class BlogPost(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    
    # Categorization
    category = models.ManyToManyField(Category, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Relationships
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts')
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog:post_detail', kwargs={'slug': self.slug})

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

    @property
    def total_likes(self):
        return self.likes.count()

    @property
    def total_comments(self):
        return self.comments.count()

    @property
    def is_published(self):
        return self.status == self.Status.PUBLISHED

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['slug']),
        ]


class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')
    content = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_reply(self):
        return self.parent is not None

    def get_replies(self):
        return Comment.objects.filter(parent=self, is_approved=True).order_by('created_at')

    @property
    def total_likes(self):
        return self.likes.count()

    def __str__(self):
        return f'Comment by {self.author.email} on {self.post.title}'

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['is_approved']),
        ]


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comment_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('comment', 'user')
        indexes = [
            models.Index(fields=['comment']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f'Like by {self.user.email} on comment {self.comment.id}'


class Like(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f'Like by {self.user.email} on {self.post.title}'


class Bookmark(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f'Bookmark by {self.user.email} on {self.post.title}'


class BlogPostView(models.Model):
    """Track individual page views for analytics"""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='post_views')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['ip_address']),
        ]

    def __str__(self):
        return f'View of {self.post.title} at {self.created_at}'


class Notification(models.Model):
    class Verb(models.TextChoices):
        LIKE = 'like', 'Like'
        COMMENT = 'comment', 'Comment'
        REPLY = 'reply', 'Reply'

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications_sent')
    verb = models.CharField(max_length=20, choices=Verb.choices)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
        ]

    def __str__(self):
        return f'Notification for {self.recipient} - {self.verb} by {self.actor}'

# NOTE: After adding Notification model, run `python manage.py makemigrations` and `python manage.py migrate` to apply changes.
