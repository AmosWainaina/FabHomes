from django.db import models
from django.contrib.auth.models import User
import uuid

class Agency(models.Model):
    """Real Estate Agency Model"""
    VERIFICATION_STATUS = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    logo_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=300, blank=True)
    website = models.URLField(blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Agencies"

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    """Extended User Profile"""
    ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
        ('agent', 'Real Estate Agent'),
        ('admin', 'Administrator'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    firebase_uid = models.CharField(max_length=128, unique=True)
    phone = models.CharField(max_length=20, blank=True)
    profile_image_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    is_verified = models.BooleanField(default=False)
    is_agent = models.BooleanField(default=False)
    agency = models.ForeignKey(Agency, on_delete=models.SET_NULL, null=True, blank=True, related_name='agents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Property(models.Model):
    """Property Listing Model"""
    PROPERTY_TYPE_CHOICES = [
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
        ('land', 'Land'),
    ]
    
    LISTING_TYPE_CHOICES = [
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('pending', 'Pending'),
        ('rented', 'Rented'),
    ]
    
    FURNISHING_CHOICES = [
        ('unfurnished', 'Unfurnished'),
        ('partially_furnished', 'Partially Furnished'),
        ('fully_furnished', 'Fully Furnished'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Info
    title = models.CharField(max_length=200)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Pricing
    price = models.DecimalField(max_digits=12, decimal_places=2)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lease_term = models.CharField(max_length=100, blank=True, help_text="e.g., '12 months'")
    
    # Location
    location = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    # Property Details
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    total_area = models.PositiveIntegerField(help_text="Total area in sqft")
    garage_spaces = models.PositiveIntegerField(default=0)
    year_built = models.IntegerField(null=True, blank=True)
    furnishing = models.CharField(max_length=20, choices=FURNISHING_CHOICES, default='unfurnished')
    
    # Features (JSON)
    property_features = models.JSONField(default=list, blank=True, help_text="e.g., ['swimming_pool', 'gym', 'garden']")
    utilities = models.JSONField(default=list, blank=True, help_text="e.g., ['water', 'electricity', 'gas']")
    
    # Media
    featured_image_url = models.URLField(blank=True, null=True)
    image_urls = models.JSONField(default=list, blank=True, help_text="Array of Firebase Storage URLs")
    
    # Relations
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties_sold')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='properties_managed')
    agency = models.ForeignKey(Agency, on_delete=models.SET_NULL, null=True, blank=True, related_name='properties')
    
    # Engagement
    views_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    listed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['listing_type', 'status']),
            models.Index(fields=['city', 'price']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['-views_count']),
        ]

    def __str__(self):
        return f"{self.title} - {self.get_listing_type_display()}"

    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])


class Inquiry(models.Model):
    """Property Inquiry/Lead Model"""
    INQUIRY_TYPE_CHOICES = [
        ('general', 'General Inquiry'),
        ('viewing_request', 'Viewing Request'),
        ('offer', 'Make Offer'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='inquiries')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    
    # Guest info (for non-authenticated inquiries)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    message = models.TextField()
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPE_CHOICES, default='general')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['property', 'status']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"Inquiry for {self.property.title} by {self.name}"


class Favorite(models.Model):
    """User Favorite Properties"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'property']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.property.title}"


class Review(models.Model):
    """Reviews for Agents, Agencies, or Properties"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    agent = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews_received')
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        target = self.agent or self.agency or self.property
        return f"Review by {self.reviewer.username} for {target}"


class Transaction(models.Model):
    """Property Transaction Record"""
    TRANSACTION_TYPE_CHOICES = [
        ('sale', 'Sale'),
        ('rental', 'Rental'),
    ]
    
    STATUS_CHOICES = [
        ('negotiating', 'Negotiating'),
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='transactions')
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='purchases')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions_handled')
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    offer_price = models.DecimalField(max_digits=12, decimal_places=2)
    final_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='negotiating')
    
    transaction_date = models.DateTimeField(null=True, blank=True)
    closing_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['property', 'status']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.property.title}"

