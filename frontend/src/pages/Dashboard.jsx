import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageAtsScore: 0,
    recentAnalyses: [],
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('upgrade') === 'success') {
      setToast('🎉 Welcome to Premium! Your plan has been upgraded.');
      // Remove query param from URL without reload
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(() => setToast(null), 5000);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data.user);

        const resumesResponse = await api.get('/resumes');
        const allResumes = resumesResponse.data.resumes || [];

        const completedResumes = allResumes.filter(
          (r) => r.analysisStatus === 'completed' && r.atsScore !== null
        );
        const totalAnalyses = completedResumes.length;
        const averageAtsScore =
          totalAnalyses > 0
            ? Math.round(
                completedResumes.reduce((sum, r) => sum + r.atsScore, 0) / totalAnalyses
              )
            : 0;

        setStats({
          totalAnalyses,
          averageAtsScore,
          recentAnalyses: allResumes.slice(0, 3),
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAnalysis = (resumeId) => {
    navigate(`/analyze/${resumeId}`);
  };

  const getPlanBadge = () => {
    if (!user) return null;
    return user.plan === 'premium' ? (
      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
        ⭐ Premium
      </span>
    ) : (
      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
        Free
      </span>
    );
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 71) return 'text-emerald-600';
    if (score >= 41) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium transition-all">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {user && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">{user.email}</span>
              {getPlanBadge()}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-slate-600 text-sm mb-2">Total Analyses</p>
                <p className="text-4xl font-bold text-indigo-600">{stats.totalAnalyses}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-slate-600 text-sm mb-2">Average ATS Score</p>
                <p className={`text-4xl font-bold ${getScoreBadgeColor(stats.averageAtsScore)}`}>
                  {stats.averageAtsScore}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-slate-600 text-sm mb-2">Your Plan</p>
                <p className="text-2xl font-bold">
                  {user?.plan === 'premium' ? (
                    <span className="text-emerald-600">Premium</span>
                  ) : (
                    <span className="text-slate-600">Free (3/day)</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Recent Analyses</h2>
                <button
                  onClick={() => navigate('/history')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              {stats.recentAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">No analyses yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentAnalyses.map((resume) => (
                    <div
                      key={resume._id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition"
                      onClick={() => handleViewAnalysis(resume._id)}
                    >
                      <div>
                        <p className="font-medium text-slate-900">{resume.originalName}</p>
                        <p className="text-xs text-slate-600">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {resume.atsScore !== null && resume.atsScore !== undefined && (
                        <div className={`text-lg font-bold ${getScoreBadgeColor(resume.atsScore)}`}>
                          {resume.atsScore}/100
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/upload')}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                📤 Upload Resume
              </button>
              {user?.plan === 'free' && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex-1 bg-slate-200 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition"
                >
                  💳 Upgrade to Premium
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;