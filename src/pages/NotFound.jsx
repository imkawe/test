import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist.</p>
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
        <Link 
          to="/signup" 
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Go to Signup
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
