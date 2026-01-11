from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Property, Inquiry
from .serializers import PropertySerializer, InquirySerializer
from firebase_config import verify_firebase_token

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    @action(detail=False, methods=['post'])
    def upload_image(self, request):
        # Placeholder for Firebase Storage upload logic
        # This would handle image uploads to Firebase Storage
        return Response({'message': 'Image upload not implemented yet'})

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = []  # Allow unauthenticated inquiries

    def create(self, request, *args, **kwargs):
        # Check if user is authenticated via Firebase token
        id_token = request.headers.get('Authorization')
        if id_token:
            decoded_token = verify_firebase_token(id_token)
            if decoded_token:
                # Try to find or create Django user from Firebase UID
                # For now, we'll leave user as None and use name/email
                # You can implement user mapping logic here if needed
                pass
        
        # Allow guest inquiries with name and email
        return super().create(request, *args, **kwargs)
