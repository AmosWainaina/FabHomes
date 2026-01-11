import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/propertyCard';
import api from '../services/api';

const PropertyListing = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    property_type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.property_type) params.property_type = filters.property_type;
        if (filters.location) params.location = filters.location;
        
        const response = await api.get('properties/', { params });
        // Handle both paginated and non-paginated responses
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          data = response.data.results;
        }
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>Properties - Fab Homes</title>
        <meta name="description" content="Browse our extensive collection of properties for sale and rent." />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Browse Properties</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                id="property_type"
                name="property_type"
                value={filters.property_type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ property_type: '', location: '' })}
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyListing;
