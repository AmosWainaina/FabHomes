from django.shortcuts import render
from django.db.models import Q, Count, Avg
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Agency, UserProfile, Property, Inquiry,
    Favorite, Review, Transaction
)
from .serializers import (
    AgencySerializer, UserProfileSerializer, PropertyListSerializer,
    PropertyDetailSerializer, PropertyCreateUpdateSerializer,
    InquiryListSerializer, InquiryDetailSerializer, InquiryCreateSerializer,
    FavoriteSerializer, ReviewSerializer, TransactionSerializer
)
from firebase_config import verify_firebase_token


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class PropertyViewSet(viewsets.ModelViewSet):
    """
    Property listing viewset with search, filter, and sorting capabilities
    """
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = {
        'property_type': ['exact'],
        'listing_type': ['exact'],
        'status': ['exact'],
        'bedrooms': ['gte', 'lte'],
        'bathrooms': ['gte', 'lte'],
        'total_area': ['gte', 'lte'],
        'city': ['iexact'],
        'price': ['gte', 'lte'],
        'monthly_rent': ['gte', 'lte'],
    }
    
    search_fields = ['title', 'description', 'location', 'city', 'state']
    ordering_fields = ['created_at', 'price', 'views_count', '-created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Property.objects.select_related(
            'seller', 'agent', 'agency'
        ).prefetch_related('inquiries', 'favorited_by', 'reviews')
        
        # Filter by featured if requested
        if self.request.query_params.get('featured') == 'true':
            queryset = queryset.filter(status='available').order_by('-views_count')[:10]
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PropertyDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return PropertyCreateUpdateSerializer
        return PropertyListSerializer

    def create(self, request, *args, **kwargs):
        """Create a new property listing"""
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seller=request.user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        """Update property - only seller or agent can update"""
        property_obj = self.get_object()
        if (self.request.user != property_obj.seller and
            self.request.user != property_obj.agent):
            raise PermissionError("You can only edit your own properties")
        serializer.save()

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Increment property view count"""
        property_obj = self.get_object()
        property_obj.increment_views()
        return Response({'views_count': property_obj.views_count})

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search endpoint"""
        query = request.query_params.get('q', '')
        property_type = request.query_params.get('type')
        listing_type = request.query_params.get('listing')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        city = request.query_params.get('city')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(location__icontains=query)
            )
        
        if property_type:
            queryset = queryset.filter(property_type=property_type)
        if listing_type:
            queryset = queryset.filter(listing_type=listing_type)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if city:
            queryset = queryset.filter(city__iexact=city)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """Get similar properties"""
        property_obj = self.get_object()
        similar = Property.objects.filter(
            property_type=property_obj.property_type,
            city=property_obj.city,
            listing_type=property_obj.listing_type,
            status='available'
        ).exclude(id=property_obj.id)[:5]
        
        serializer = PropertyListSerializer(similar, many=True)
        return Response(serializer.data)


class InquiryViewSet(viewsets.ModelViewSet):
    """
    Inquiry/Lead management viewset
    """
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['property', 'status', 'inquiry_type']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Inquiry.objects.filter(
                Q(user=self.request.user) |
                Q(property__seller=self.request.user)
            )
        return Inquiry.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return InquiryDetailSerializer
        elif self.action == 'create':
            return InquiryCreateSerializer
        return InquiryListSerializer

    def create(self, request, *args, **kwargs):
        """Create inquiry - get token from header if user is authenticated"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            decoded_token = verify_firebase_token(auth_header)
            if decoded_token:
                try:
                    user_profile = UserProfile.objects.get(firebase_uid=decoded_token['uid'])
                    user = user_profile.user
                except UserProfile.DoesNotExist:
                    pass
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update inquiry status"""
        inquiry = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Inquiry.STATUS_CHOICES):
            return Response(
                {'detail': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        inquiry.status = new_status
        inquiry.save()
        
        serializer = InquiryDetailSerializer(inquiry)
        return Response(serializer.data)


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    User favorites management
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle favorite status for a property"""
        property_id = request.data.get('property_id')
        
        if not property_id:
            return Response(
                {'detail': 'property_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            property_obj = Property.objects.get(id=property_id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user,
                property=property_obj
            )
            
            if not created:
                favorite.delete()
                return Response(
                    {'detail': 'Property removed from favorites', 'is_favorite': False}
                )
            
            return Response(
                {'detail': 'Property added to favorites', 'is_favorite': True},
                status=status.HTTP_201_CREATED
            )
        except Property.DoesNotExist:
            return Response(
                {'detail': 'Property not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AgencyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Agency listing and details
    """
    queryset = Agency.objects.filter(verification_status='verified')
    serializer_class = AgencySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'state']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def properties(self, request, pk=None):
        """Get all properties listed by an agency"""
        agency = self.get_object()
        properties = agency.properties.filter(status='available')
        serializer = PropertyListSerializer(properties, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def agents(self, request, pk=None):
        """Get all agents in an agency"""
        agency = self.get_object()
        agents = agency.agents.all()
        serializer = UserProfileSerializer(agents, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def analytics(request):
    """Get platform analytics"""
    return Response({
        'total_properties': Property.objects.count(),
        'total_inquiries': Inquiry.objects.count(),
        'available_properties': Property.objects.filter(status='available').count(),
        'for_sale': Property.objects.filter(listing_type='sale', status='available').count(),
        'for_rent': Property.objects.filter(listing_type='rent', status='available').count(),
        'total_users': UserProfile.objects.count(),
        'verified_agencies': Agency.objects.filter(verification_status='verified').count(),
        'total_reviews': Review.objects.count(),
        'completed_transactions': Transaction.objects.filter(status='completed').count(),
    })

