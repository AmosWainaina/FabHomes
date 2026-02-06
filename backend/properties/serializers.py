from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Agency, UserProfile, Property, Inquiry, 
    Favorite, Review, Transaction
)


class UserProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'user_email', 'user_name', 'phone', 'profile_image_url',
            'bio', 'role', 'is_verified', 'is_agent', 'agency'
        ]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile']


class AgencySerializer(serializers.ModelSerializer):
    agents_count = serializers.SerializerMethodField()
    properties_count = serializers.SerializerMethodField()

    class Meta:
        model = Agency
        fields = [
            'id', 'name', 'email', 'phone', 'logo_url', 'description',
            'address', 'website', 'verification_status', 'agents_count',
            'properties_count', 'created_at', 'updated_at'
        ]

    def get_agents_count(self, obj):
        return obj.agents.count()

    def get_properties_count(self, obj):
        return obj.properties.count()


class PropertyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for property listings"""
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)
    agent_name = serializers.CharField(source='agent.get_full_name', read_only=True, allow_null=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True, allow_null=True)
    favorites_count = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'property_type', 'listing_type', 'price',
            'location', 'city', 'bedrooms', 'bathrooms', 'total_area',
            'featured_image_url', 'seller_name', 'agent_name', 'agency_name',
            'views_count', 'favorites_count', 'status', 'created_at'
        ]

    def get_favorites_count(self, obj):
        return obj.favorited_by.count()


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for property details"""
    seller = UserSerializer(read_only=True)
    agent = UserSerializer(read_only=True)
    agency = AgencySerializer(read_only=True)
    inquiries_count = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'property_type', 'listing_type',
            'price', 'monthly_rent', 'security_deposit', 'lease_term',
            'location', 'city', 'state', 'zip_code', 'country',
            'latitude', 'longitude', 'bedrooms', 'bathrooms', 'total_area',
            'garage_spaces', 'year_built', 'furnishing', 'property_features',
            'utilities', 'featured_image_url', 'image_urls', 'status',
            'seller', 'agent', 'agency', 'views_count', 'favorites_count',
            'inquiries_count', 'reviews', 'created_at', 'updated_at', 'listed_at'
        ]

    def get_inquiries_count(self, obj):
        return obj.inquiries.filter(status='new').count()

    def get_favorites_count(self, obj):
        return obj.favorited_by.count()

    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:5]
        return ReviewSerializer(reviews, many=True).data


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating properties"""
    class Meta:
        model = Property
        fields = [
            'title', 'description', 'property_type', 'listing_type', 'price',
            'monthly_rent', 'security_deposit', 'lease_term', 'location', 'city',
            'state', 'zip_code', 'country', 'latitude', 'longitude',
            'bedrooms', 'bathrooms', 'total_area', 'garage_spaces', 'year_built',
            'furnishing', 'property_features', 'utilities', 'featured_image_url',
            'image_urls'
        ]


class InquiryListSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'property', 'property_title', 'name', 'email', 'phone',
            'inquiry_type', 'status', 'created_at', 'updated_at'
        ]


class InquiryDetailSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'property', 'user', 'name', 'email', 'phone',
            'message', 'inquiry_type', 'status', 'created_at', 'updated_at'
        ]


class InquiryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ['property', 'name', 'email', 'phone', 'message', 'inquiry_type']


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'property', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'reviewer_name', 'rating', 'comment', 'created_at'
        ]


class TransactionSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    buyer_name = serializers.CharField(source='buyer.get_full_name', read_only=True)
    seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'property', 'property_title', 'buyer_name', 'seller_name',
            'transaction_type', 'offer_price', 'final_price', 'status',
            'transaction_date', 'closing_date', 'notes', 'created_at', 'updated_at'
        ]

