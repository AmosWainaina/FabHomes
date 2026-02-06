from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'properties', views.PropertyViewSet, basename='property')
router.register(r'inquiries', views.InquiryViewSet, basename='inquiry')
router.register(r'favorites', views.FavoriteViewSet, basename='favorite')
router.register(r'agencies', views.AgencyViewSet, basename='agency')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', views.analytics, name='analytics'),
]
