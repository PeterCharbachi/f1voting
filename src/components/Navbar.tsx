import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  console.log("Navbar: currentUser", currentUser, "isAuthenticated", isAuthenticated, "loading", loading);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const linkClasses = "text-text-light hover:text-primary transition duration-200 uppercase font-semibold tracking-wide block py-2 md:inline md:py-0";
  const activeLinkClasses = "text-primary";

  if (loading) {
    return null; // Render nothing while authentication is loading
  }

  return (
    <header className="bg-background-dark border-b border-background-light shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            <NavLink to="/home" className="text-3xl font-extrabold text-white tracking-tight">
              F1<span className="text-primary">VOTE</span>
            </NavLink>
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8">
              {isAuthenticated && (
                <>
                  <NavLink to="/home" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
                  <NavLink to="/scoreboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Scoreboard</NavLink>
                  <NavLink to="/info" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Info</NavLink>
                  {currentUser?.role === 'admin' && (
                    <NavLink to="/admin" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Admin</NavLink>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-text-muted">Welcome,</span>
                  <span className="text-sm font-semibold text-text-light">{currentUser?.username || currentUser?.email}</span>
                </div>
                <Button onClick={handleLogout} variant="secondary" className="hidden md:block w-auto px-4 py-2 text-sm">Logout</Button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Login</NavLink>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-text-light focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 pt-2 border-t border-background-light animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-2">
              <NavLink to="/home" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
              <NavLink to="/scoreboard" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Scoreboard</NavLink>
              <NavLink to="/info" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Info</NavLink>
              {currentUser?.role === 'admin' && (
                <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Admin</NavLink>
              )}
              <div className="pt-4 border-t border-background-light flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">Logged in as</span>
                  <span className="text-sm font-semibold text-text-light">{currentUser?.username || currentUser?.email}</span>
                </div>
                <Button onClick={handleLogout} variant="secondary" className="w-auto px-4 py-2 text-sm">Logout</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}