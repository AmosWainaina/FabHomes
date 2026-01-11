import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '../services/api';
import Header from '../components/header';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [inquiry, setInquiry] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`properties/${id}/`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('inquiries/', { property: id, ...inquiry });
      alert('Inquiry sent successfully.');
      setInquiry({ name: '', email: '', message: '' });
    } catch {
      alert('Failed to send inquiry.');
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading property…</p>
      </div>
    );
  }

  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : ['/placeholder.jpg'];

  const price =
    typeof property.price === 'number'
      ? `$${property.price.toLocaleString()}`
      : `$${parseFloat(property.price || 0).toLocaleString()}`;

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{property.title} – Fab Homes</title>
        <meta name="description" content={property.description} />
      </Helmet>

      <Header />

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <img
            src={images[0]}
            alt={property.title}
            className="lg:col-span-2 h-[480px] w-full object-cover rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="h-[230px] w-full object-cover rounded"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-8 mt-16 grid lg:grid-cols-3 gap-16">
        {/* MAIN */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-semibold text-gray-900">
            {property.title}
          </h1>

          <p className="mt-2 text-gray-500">{property.location}</p>

          <div className="mt-6 text-3xl font-semibold text-gray-900">
            {price}
          </div>

          <div className="mt-8 flex gap-8 text-sm text-gray-600">
            <span>{property.bedrooms || 0} Beds</span>
            <span>{property.bathrooms || 0} Baths</span>
            <span>{property.area ? `${property.area} m²` : '—'}</span>
          </div>

          <div className="mt-10 prose prose-gray max-w-none">
            <p>{property.description}</p>
          </div>

          {property.created_at && (
            <p className="mt-6 text-xs text-gray-400">
              Listed on {new Date(property.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* INQUIRY */}
        <aside className="sticky top-28 self-start border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Interested in this property?
          </h3>

          <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={inquiry.name}
              onChange={handleInquiryChange}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={inquiry.email}
              onChange={handleInquiryChange}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="I’m interested in this property…"
              value={inquiry.message}
              onChange={handleInquiryChange}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 text-sm font-medium hover:opacity-90 transition"
            >
              Send inquiry
            </button>
          </form>
        </aside>
      </section>
    </div>
  );
};

export default PropertyDetails;
