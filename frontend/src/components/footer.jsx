import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <p className="text-sm font-medium text-gray-900">
          Fab Homes
        </p>

        {/* Legal */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Fab Homes. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
