from django.contrib import admin
from .models import (
    Agency, UserProfile, Property, Inquiry,
    Favorite, Review, Transaction
)


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'verification_status', 'created_at']
    list_filter = ['verification_status', 'created_at']
    search_fields = ['name', 'email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'is_agent', 'is_verified', 'created_at']
    list_filter = ['role', 'is_agent', 'is_verified']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['firebase_uid', 'created_at', 'updated_at']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'property_type', 'listing_type', 'price', 'city', 'status', 'views_count', 'created_at']
    list_filter = ['property_type', 'listing_type', 'status', 'city', 'created_at']
    search_fields = ['title', 'description', 'location', 'city']
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'listed_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'property_type', 'listing_type', 'status')
        }),
        ('Pricing', {
            'fields': ('price', 'monthly_rent', 'security_deposit', 'lease_term')
        }),
        ('Location', {
            'fields': ('location', 'city', 'state', 'zip_code', 'country', 'latitude', 'longitude')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'total_area', 'garage_spaces', 'year_built', 'furnishing')
        }),
        ('Features & Utilities', {
            'fields': ('property_features', 'utilities')
        }),
        ('Media', {
            'fields': ('featured_image_url', 'image_urls')
        }),
        ('Relations', {
            'fields': ('seller', 'agent', 'agency')
        }),
        ('Engagement', {
            'fields': ('views_count',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'listed_at')
        }),
    )


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'property', 'inquiry_type', 'status', 'created_at']
    list_filter = ['inquiry_type', 'status', 'created_at']
    search_fields = ['name', 'email', 'property__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'property', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'property__title']
    readonly_fields = ['created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['reviewer__email', 'comment']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['property', 'buyer', 'seller', 'transaction_type', 'status', 'final_price', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at']
    search_fields = ['property__title', 'buyer__email', 'seller__email']
    readonly_fields = ['created_at', 'updated_at']

