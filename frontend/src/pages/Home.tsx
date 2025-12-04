import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero">
        <h1>📚 Welcome to Library System</h1>
        <p>Manage books, authors, and borrowings with ease</p>
        {!isAuthenticated && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Login
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <p className="welcome-text">Welcome back, {user?.name}!</p>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <span className="feature-icon">📖</span>
          <h3>Manage Books</h3>
          <p>Add, edit, and organize your book collection with powerful filtering options</p>
          <Link to="/books" className="btn btn-outline">
            View Books
          </Link>
        </div>

        <div className="feature-card">
          <span className="feature-icon">✍️</span>
          <h3>Track Authors</h3>
          <p>Keep track of all authors and their published works</p>
          <Link to="/authors" className="btn btn-outline">
            View Authors
          </Link>
        </div>

        {isAuthenticated && (
          <>
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Manage Users</h3>
              <p>Create and manage library users</p>
              <Link to="/users" className="btn btn-outline">
                View Users
              </Link>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🔄</span>
              <h3>Borrowing System</h3>
              <p>Track book borrowings and returns</p>
              <Link to="/borrows" className="btn btn-outline">
                View Borrowings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
