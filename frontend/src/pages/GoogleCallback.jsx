import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      navigate('/login?error=google_auth_failed');
      return;
    }

    // Store token first so api calls work
    localStorage.setItem('token', token);

    // Fetch full user info
    api.get('/auth/me').then((res) => {
      login(res.data.user, token);
      navigate('/dashboard');
    }).catch(() => {
      navigate('/login?error=google_auth_failed');
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Signing you in with Google...</p>
      </div>
    </div>
  );
}