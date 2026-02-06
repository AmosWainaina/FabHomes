import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Ruler, Eye } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const {
    id,
    title,
    price,
    location,
    city,
    bedrooms,
    bathrooms,
    total_area,
    featured_image_url,
    property_type,
    listing_type,
    monthly_rent,
    is_featured,
    views_count,
  } = property;

  const displayPrice = listing_type === 'rent' ? monthly_rent : price;
  const priceLabel = listing_type === 'rent' ? '/month' : '';
  const priceFormatted = displayPrice ? displayPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }) : 'POA';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-gray-200">
        <img
          src={featured_image_url || '/default-property.jpg'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badge Overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          {is_featured && (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Featured
            </span>
          )}
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full capitalize shadow-md">
            {listing_type}
          </span>
        </div>

        {/* Views Count */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{views_count || 0}</span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-red-50 transition-colors shadow-md hover:shadow-lg"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Type */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            {property_type}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-4 text-sm">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="truncate">
            {location || 'N/A'}, {city || 'N/A'}
          </span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-t border-b border-gray-200">
          <div className="text-center">
            <Bed className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900">{bedrooms || 0}</p>
            <p className="text-xs text-gray-500">Beds</p>
          </div>
          <div className="text-center">
            <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900">{bathrooms || 0}</p>
            <p className="text-xs text-gray-500">Baths</p>
          </div>
          <div className="text-center">
            <Ruler className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900">{total_area || 0}</p>
            <p className="text-xs text-gray-500">sqft</p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {priceFormatted}
            </p>
            {priceLabel && <p className="text-xs text-gray-500">{priceLabel}</p>}
          </div>
          <Link
            to={`/property/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all text-sm whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
