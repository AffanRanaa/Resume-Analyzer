import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function History() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, resumeId: null });
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes');
      setResumes(res.data.resumes || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analyses.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/resumes/${deleteModal.resumeId}`);
      setResumes(resumes.filter((r) => r._id !== deleteModal.resumeId));
      setDeleteModal({ open: false, resumeId: null });
    } catch (err) {
      setError('Failed to delete resume.');
    } finally {
      setDeleting(false);
    }
  };

  const getScoreBadge = (score, status) => {
    if (status === 'processing') return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">⏳ Analyzing</span>;
    if (status === 'failed') return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">❌ Failed</span>;
    if (score === null || score === undefined) return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">No score</span>;
    if (score >= 70) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">✅ {score}/100</span>;
    if (score >= 40) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">🟡 {score}/100</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">🔴 {score}/100</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Analyses</h1>
            <p className="text-slate-400 text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} analyzed</p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
          >
            + New Analysis
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {resumes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No analyses yet</h2>
            <p className="text-slate-400 mb-6 text-sm">Upload your first resume to get started.</p>
            <button onClick={() => navigate('/upload')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{resume.fileType === 'pdf' ? '📄' : '📝'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{resume.originalName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getScoreBadge(resume.atsScore, resume.analysisStatus)}
                    <button
                      onClick={() => navigate(`/analyze/${resume._id}`)}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, resumeId: resume._id })}
                      className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, resumeId: null })} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗑️</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Delete this analysis?</h2>
              <p className="text-sm text-slate-500">This will permanently remove the resume file and its analysis. This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, resumeId: null })}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}