import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import api from '../services/api';

const UserDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        // Note: This endpoint requires authentication
        const response = await api.get('inquiries/');
        // Handle both paginated and non-paginated responses
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          data = response.data.results;
        }
        setInquiries(data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>My Dashboard - Fab Homes</title>
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Property Inquiries</h2>
          <p className="text-gray-600">
            View and manage all your property inquiries in one place.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">You haven't made any inquiries yet.</p>
            <a href="/properties" className="text-blue-600 hover:underline">
              Browse Properties
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <div key={inquiry.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {inquiry.property?.title || 'Property Inquiry'}
                    </h3>
                    <p className="text-gray-600 mb-2">{inquiry.message}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
