import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          📄 Resume Analyzer
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-700 hover:text-indigo-600 transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/upload"
                className="text-slate-700 hover:text-indigo-600 transition font-medium"
              >
                Upload
              </Link>
              <Link
                to="/history"
                className="text-slate-700 hover:text-indigo-600 transition font-medium"
              >
                History
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">{user.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-indigo-600 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
