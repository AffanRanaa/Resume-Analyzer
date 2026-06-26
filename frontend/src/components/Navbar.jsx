import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition ${
        isActive(to)
          ? 'text-indigo-600'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  );

  // Hide navbar on landing page
  if (location.pathname === '/') return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="text-lg font-bold text-indigo-600 tracking-tight">
          📄 ResumeAI
        </Link>

        {user ? (
          <>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/upload', 'Upload')}
              {navLink('/history', 'History')}
              {navLink('/pricing', 'Pricing')}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 hidden lg:block">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Logout
              </button>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Login</Link>
            <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">Sign Up</Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-3 bg-white">
          {['/dashboard', '/upload', '/history', '/pricing'].map((path) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium py-1 ${isActive(path) ? 'text-indigo-600' : 'text-slate-600'}`}
            >
              {path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
          <button onClick={logout} className="text-sm text-rose-600 font-medium">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;