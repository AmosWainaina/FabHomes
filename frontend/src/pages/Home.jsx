import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import PropertyCard from '../components/propertyCard';
import api from '../services/api';

import heroImage from '../assets/lux home.jpg';

const Home = () => {
  const [_featuredProperties, setFeaturedProperties] = useState([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get('properties/');
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];
        setFeaturedProperties(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProperties();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Fab Homes – Find a place you will call home</title>
        <meta
          name="description"
          content="Discover carefully curated properties designed for modern living."
        />
      </Helmet>

      <Header />

      {/* HERO SECTION */}
      <section className="px-8 lg:px-16 pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-gray-900">
              Find a place <br /> you will call home
            </h1>

            <p className="mt-6 text-gray-500 text-lg leading-relaxed">
              With us you will find not just accommodation, but a place where your
              new life begins, full of cosiness and possibilities.
            </p>

            <button className="mt-10 bg-black text-white px-7 py-3 text-sm font-medium hover:opacity-90 transition">
              Book a call
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <img
              src={heroImage}
              alt="Luxury modern home"
              className="w-full h-[520px] object-cover rounded-lg"
            />
          </div>

        </div>
      </section>

      {/* FEATURED PROPERTIES (keep your logic, just visual alignment later) */}
      <section className="px-8 lg:px-16 mt-24">
        <h2 className="text-3xl font-semibold text-gray-900 mb-10">
          Featured Properties
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {_featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
