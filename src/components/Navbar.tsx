import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const linkClasses = "text-text-muted hover:text-white transition-all duration-300 uppercase font-black italic tracking-widest text-[10px] md:text-xs relative py-1 group";
  const activeLinkClasses = "text-white !not-italic";

  if (loading) {
    return null; 
  }

  return (
    <header className="glass-card rounded-none border-x-0 border-t-0 border-b border-white/5 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6 sm:space-x-12">
            <NavLink to="/home" className="text-xl md:text-2xl font-black italic tracking-tighter text-white group flex items-center">
              F1<span className="text-primary group-hover:drop-shadow-[0_0_8px_#E10600] transition-all">VOTE</span>
            </NavLink>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8 items-center">
              {isAuthenticated && (
                <>
                  {[
                    { to: '/home', label: 'Hem' },
                    { to: '/scoreboard', label: 'Poängtavla' },
                    { to: '/info', label: 'Info' },
                    ...(currentUser?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : [])
                  ].map((link) => (
                    <NavLink 
                      key={link.to}
                      to={link.to} 
                      className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </NavLink>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex flex-col items-end border-r border-white/10 pr-6">
                  <span className="text-[8px] font-black uppercase text-primary tracking-[0.2em] leading-none mb-1">Status: Active</span>
                  <span className="text-[10px] font-bold text-text-light uppercase tracking-tighter">{currentUser?.username || currentUser?.email}</span>
                </div>
                <Button onClick={handleLogout} variant="secondary" className="hidden md:block !py-1 !px-3 text-[9px] !italic">Logga ut</Button>
              </>
            ) : (
              <NavLink to="/login" className={linkClasses}>Logga in</NavLink>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-text-light focus:outline-none p-2 hover:bg-white/5 transition-colors rounded"
              aria-label="Öppna meny"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
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
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-4 border-t border-white/5 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <NavLink to="/home" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Hem</NavLink>
                  <NavLink to="/scoreboard" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Poängtavla</NavLink>
                  <NavLink to="/info" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Info</NavLink>
                  {currentUser?.role === 'admin' && (
                    <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Admin</NavLink>
                  )}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-primary tracking-[0.2em] mb-1">Användare</span>
                      <span className="text-[10px] font-bold text-text-light truncate max-w-[150px]">{currentUser?.username || currentUser?.email}</span>
                    </div>
                    <Button onClick={handleLogout} variant="secondary" className="!py-1.5 !px-4 text-[10px]">Logga ut</Button>
                  </div>
                </>
              ) : (
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Logga in</NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Decorative red glowing line at the very bottom of navbar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 shadow-[0_0_10px_rgba(225,6,0,0.5)]"></div>
    </header>
  );
}
