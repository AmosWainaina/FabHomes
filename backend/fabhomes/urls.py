from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    """Root endpoint that provides API information"""
    return JsonResponse({
        'message': 'Fab Homes API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'api': {
                'properties': '/api/properties/',
                'inquiries': '/api/inquiries/',
            }
        },
        'documentation': 'This is the backend API for Fab Homes. Use the frontend application to interact with the API.'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('properties.urls')),
]
