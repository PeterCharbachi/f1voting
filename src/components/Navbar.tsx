import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  console.log("Navbar: currentUser", currentUser, "isAuthenticated", isAuthenticated, "loading", loading);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = "text-text-light hover:text-primary transition duration-200 uppercase font-semibold tracking-wide";
  const activeLinkClasses = "text-primary";

  if (loading) {
    return null; // Render nothing while authentication is loading
  }

  return (
    <header className="bg-background-dark border-b border-background-light shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8"> {/* Adjusted spacing for mobile */}
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
                <span className="text-sm text-text-muted hidden sm:block">Welcome, <span className="font-semibold text-text-light">{currentUser?.email}</span>!</span>
                <Button onClick={handleLogout} variant="secondary" className="w-auto px-3 py-1 text-sm md:px-4 md:py-2">Logout</Button> {/* Adjusted padding for mobile */}
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Login</NavLink>
            )}
          </div>
          {/* Mobile Menu Icon (Placeholder) */}
          <div className="md:hidden">
            {/* This is where a hamburger icon would go to toggle a mobile menu */}
            {/* For now, navigation links are just hidden on small screens */}
          </div>
        </div>
      </nav>
    </header>
  );
}