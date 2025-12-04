import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">📚 Library System</Link>
        </div>
        <div className="nav-links">
          <Link to="/books">Books</Link>
          <Link to="/authors">Authors</Link>
          {isAuthenticated && (
            <>
              <Link to="/users">Users</Link>
              <Link to="/borrows">Borrowings</Link>
            </>
          )}
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-name">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
