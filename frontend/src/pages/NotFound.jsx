import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="not-found-page">
      <span className="not-found-code">404</span>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-desc">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-return-home">
        <ArrowLeft size={16} />
        <span>Return to Overview</span>
      </Link>
    </div>
  );
};

export default NotFound;
