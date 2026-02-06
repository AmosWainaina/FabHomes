import React from 'react';
import { Helmet } from 'react-helmet';
import { Target, Users, Award, TrendingUp, Shield, Heart, CheckCircle } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize the real estate experience by connecting people with their perfect properties through innovation and trust.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Every decision we make is centered around providing the best experience for our clients and partners.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We prioritize security and transparency in every transaction, ensuring peace of mind for all parties.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from property listings to customer service.'
    }
  ];

  const stats = [
    { label: 'Properties Listed', value: '1,200+', icon: TrendingUp },
    { label: 'Happy Clients', value: '850+', icon: Heart },
    { label: 'Expert Agents', value: '50+', icon: Users },
    { label: 'Years Experience', value: '10+', icon: Award },
  ];

  const benefits = [
    'Verified property listings',
    'Expert market insights',
    'Transparent pricing',
    'Personalized recommendations',
    'Secure transactions',
    '24/7 customer support',
    'Virtual property tours',
    'Legal assistance'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>About Us - Fab Homes</title>
        <meta name="description" content="Learn about Fab Homes' mission to help you find your perfect property. Trusted by thousands of clients across Kenya." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Fab Homes</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property. We're committed to making your real estate journey seamless and successful.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Making Real Estate Simple & Accessible
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Founded in 2014, Fab Homes began with a simple vision: to transform how people find and buy properties in Kenya. We recognized the challenges buyers and sellers faced and set out to create a platform that eliminates confusion and builds trust.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we're proud to be one of Kenya's leading real estate platforms, helping thousands of families find their dream homes and investors discover lucrative opportunities.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-8">
                <div className="w-full h-full bg-white rounded-xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">10+</div>
                    <div className="text-xl text-gray-600">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape the experience we deliver
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Clients Choose Us
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We go beyond just listing properties. Our comprehensive platform provides everything you need for a successful real estate journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-8">
                Join thousands of satisfied clients who found their dream properties with Fab Homes.
              </p>
              <div className="space-y-4">
                <a
                  href="/properties"
                  className="block w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg text-center hover:bg-gray-100 transition-all"
                >
                  Browse Properties
                </a>
                <a
                  href="/contact"
                  className="block w-full px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg text-center hover:bg-blue-800 transition-all border-2 border-white/20"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
