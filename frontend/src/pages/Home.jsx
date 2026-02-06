import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
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
      <section className="px-6 lg:px-12 pt-16 pb-20 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[100vh] lg:min-h-auto">

          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-950 mb-8">
              Find a place you will call home
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-12 max-w-md">
              With us you will find not just accommodation, but a place where your new life begins, full of cosiness and possibilities.
            </p>

            <div className="flex items-center gap-4">
              <button className="bg-gray-900 text-white px-8 py-3 text-sm font-semibold hover:bg-gray-800 transition duration-200 rounded">
                Book a call
              </button>
              <Link 
                to="/properties"
                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition flex items-center gap-2"
              >
                Browse properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[500px] md:h-[600px]">
            <img
              src={heroImage}
              alt="Luxury modern home"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </div>

        </div>
      </section>

    
    </div>
  );
};

export default Home;
