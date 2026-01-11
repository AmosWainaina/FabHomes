import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Properties', path: '/properties' },
    { name: 'Mortgage', path: '/mortgage', badge: 'New' },
    { name: 'Company', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-xl font-semibold tracking-wide text-gray-900"
          >
            FAB HOMES
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wide bg-black text-white px-1.5 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex">
            <button className="border border-gray-900 px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition">
              Post a property
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-900"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden mt-6 border-t border-gray-200 pt-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            <button className="mt-4 w-full border border-gray-900 py-2 text-sm font-medium">
              Post a property
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
