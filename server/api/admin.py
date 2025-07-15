from django.contrib import admin
from .models import Category, BlogPost, Comment, Like, Bookmark, CommentLike
from users.models import User


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'created_at']
    list_filter = ['type']
    readonly_fields = ['name', 'slug', 'created_at']
    ordering = ['name']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'category_list', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    filter_horizontal = ['category']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'content', 'image', 'author', 'status')
        }),
        ('Categorization', {
            'fields': ('category',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def category_list(self, obj):
        return ", ".join([cat.name for cat in obj.category.all()])
    category_list.short_description = 'Categories'
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('category')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'is_approved', 'is_reply', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['content', 'author__email', 'post__title']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Comment Details', {
            'fields': ('post', 'author', 'parent', 'content', 'is_approved')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def is_reply(self, obj):
        return obj.parent is not None
    is_reply.boolean = True
    is_reply.short_description = 'Is Reply'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['post__title', 'user__email']
    readonly_fields = ['created_at']


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['post__title', 'user__email']
    readonly_fields = ['created_at']


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ['comment', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['comment__id', 'user__email']
    readonly_fields = ['created_at']
