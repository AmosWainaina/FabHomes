import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>About Us - Fab Homes</title>
        <meta name="description" content="Learn more about Fab Homes and our mission to help you find your perfect property." />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About Fab Homes</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At Fab Homes, we are dedicated to making the property search process seamless and enjoyable. 
              We understand that finding the perfect home or investment property is one of life's most important decisions.
            </p>
            <p className="text-gray-700">
              Our platform serves as your high-converting digital salesperson, providing comprehensive property 
              information, virtual tours, and expert guidance to help you make informed decisions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Extensive property listings for sale and rent</li>
              <li>Detailed property information with high-quality images</li>
              <li>Expert real estate guidance and support</li>
              <li>Easy inquiry and contact system</li>
              <li>User-friendly search and filter capabilities</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Trusted Platform</h3>
                <p className="text-gray-700">
                  We've helped thousands of clients find their dream properties with our reliable and efficient platform.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Expert Team</h3>
                <p className="text-gray-700">
                  Our experienced real estate professionals are here to guide you through every step of your journey.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Comprehensive Listings</h3>
                <p className="text-gray-700">
                  Browse through a wide selection of properties with detailed information and high-quality visuals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">24/7 Support</h3>
                <p className="text-gray-700">
                  Our platform is available around the clock, allowing you to search and inquire at your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
