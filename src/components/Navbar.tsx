
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Barton Ping-Pong</span>
            </div>
            <div className="ml-6 flex space-x-6 items-center">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">
                Home
              </Link>
              <Link to="/software" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">
                Software
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
