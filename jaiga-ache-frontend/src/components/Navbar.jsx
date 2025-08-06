import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Jaiga Ache 🚍</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/routes" className="hover:text-yellow-400">Routes</Link>
          <Link to="/search" className="hover:text-yellow-400">Search</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
