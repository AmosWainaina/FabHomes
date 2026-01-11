from django.db import models
from django.contrib.auth.models import User

class Property(models.Model):
    PROPERTY_TYPES = [
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    property_type = models.CharField(max_length=10, choices=PROPERTY_TYPES)
    location = models.CharField(max_length=200)
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    area = models.PositiveIntegerField()  # in square feet
    images = models.JSONField(default=list)  # List of Firebase Storage URLs
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Inquiry(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # Optional for guest inquiries
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)  # For guest inquiries
    email = models.EmailField()  # For guest inquiries
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            return f"Inquiry by {self.user.username} for {self.property.title}"
        return f"Inquiry by {self.name} ({self.email}) for {self.property.title}"
