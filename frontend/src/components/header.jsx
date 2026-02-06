import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/src/assets/Fab Homes.jpeg" alt="Fab Homes" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-xl font-bold text-gray-800">Fab Homes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-gray-700">
          <Link to="/properties" className="hover:text-blue-600">Properties</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
        </nav>

        <div className="md:hidden">
          <button aria-label="Open menu" className="text-gray-700">☰</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
