import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '../../services/api';
import PropertyCard from '../../components/propertyCard';
import { Heart, Home, MessageSquare, Settings, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');

      // Fetch user properties
      const propertiesRes = await api.get('/properties/', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        params: { owner_only: true }
      });
      setUserProperties(propertiesRes.data.results || []);

      // Fetch user favorites
      const favoritesRes = await api.get('/favorites/', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setFavorites(favoritesRes.data.results || []);

      // Fetch user inquiries
      const inquiriesRes = await api.get('/inquiries/', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setInquiries(inquiriesRes.data.results || []);

      setUser({
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName') || 'User',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const authToken = localStorage.getItem('authToken');
        await api.delete(`/properties/${propertyId}/`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setUserProperties(userProperties.filter(p => p.id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Fab Homes</title>
        <meta name="description" content="Manage your properties, favorites, and inquiries on Fab Homes." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/properties/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  List Property
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{userProperties.length}</p>
                </div>
                <Home className="w-12 h-12 text-blue-600/20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Saved Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{favorites.length}</p>
                </div>
                <Heart className="w-12 h-12 text-red-600/20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{inquiries.length}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-green-600/20" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Account</p>
                  <p className="text-lg font-bold text-gray-900">{user?.email?.split('@')[0]}</p>
                </div>
                <Settings className="w-12 h-12 text-purple-600/20" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'properties'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  My Properties
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'favorites'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Saved Properties
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'inquiries'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Inquiries
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* My Properties Tab */}
              {activeTab === 'properties' && (
                <div>
                  {userProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg mb-4">No properties listed yet</p>
                      <Link
                        to="/properties/create"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-block"
                      >
                        Create Your First Listing
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProperties.map(property => (
                        <div key={property.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={property.featured_image_url}
                              alt={property.title}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-bold text-gray-900">{property.title}</h3>
                              <p className="text-sm text-gray-600">{property.location}</p>
                              <p className="text-lg font-semibold text-blue-600 mt-1">
                                {property.price?.toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: 'KES',
                                  minimumFractionDigits: 0,
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/property/${property.id}`}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            >
                              <Edit2 className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Properties Tab */}
              {activeTab === 'favorites' && (
                <div>
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg mb-4">No saved properties yet</p>
                      <Link
                        to="/properties"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-block"
                      >
                        Browse Properties
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map(fav => (
                        <PropertyCard key={fav.id} property={fav.property} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                <div>
                  {inquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No inquiries yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map(inquiry => (
                        <div key={inquiry.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900">{inquiry.property_title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{inquiry.message}</p>
                              <div className="flex gap-4 mt-3 text-sm">
                                <span className="text-gray-700"><strong>From:</strong> {inquiry.name}</span>
                                <span className="text-gray-700"><strong>Email:</strong> {inquiry.email}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              inquiry.status === 'contacted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {inquiry.status?.charAt(0).toUpperCase() + inquiry.status?.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
