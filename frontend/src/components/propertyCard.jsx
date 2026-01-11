import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const imageUrl =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : '/placeholder.jpg';

  const priceValue =
    typeof property.price === 'number'
      ? property.price
      : parseFloat(property.price || 0);

  const price =
    priceValue >= 1_000_000
      ? `$${(priceValue / 1_000_000).toFixed(1)}M`
      : `$${priceValue.toLocaleString()}`;

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition"
    >
      {/* IMAGE */}
      <div className="relative h-64 bg-gray-100">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {property.featured && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase tracking-wide px-2 py-1">
            Featured
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* PRICE */}
        <div className="text-lg font-semibold text-gray-900">
          {price}
        </div>

        {/* TITLE */}
        <h3 className="mt-1 text-sm font-medium text-gray-800 line-clamp-1">
          {property.title || 'Modern Property'}
        </h3>

        {/* LOCATION */}
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
          {property.location || 'Location not specified'}
        </p>

        {/* META */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span>{property.bedrooms || 0} Beds</span>
          <span>{property.bathrooms || 0} Baths</span>
          <span>{property.area ? `${property.area} m²` : '—'}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
