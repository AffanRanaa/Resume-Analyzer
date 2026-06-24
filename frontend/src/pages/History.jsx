import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ResumeCard from '../components/resume/ResumeCard';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function History() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, resumeId: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resumes');
      setResumes(response.data.resumes || []);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load your analyses';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = (resumeId) => {
    navigate(`/analyze/${resumeId}`);
  };

  const handleDeleteClick = (resumeId) => {
    setDeleteModal({ open: true, resumeId });
  };

  const handleConfirmDelete = async () => {
    const { resumeId } = deleteModal;
    try {
      await api.delete(`/resumes/${resumeId}`);
      setResumes(resumes.filter((r) => r._id !== resumeId));
      setDeleteModal({ open: false, resumeId: null });
      toast.success('Resume deleted successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete resume';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ open: false, resumeId: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Skeleton width={180} height={36} borderRadius={8} />
            <Skeleton width={130} height={40} borderRadius={8} />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={88} borderRadius={12} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Analyses</h1>
          <button
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + New Analysis
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No analyses yet</h2>
            <p className="text-slate-500 mb-6">Upload your first resume to get started with AI-powered analysis</p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onView={() => handleViewResume(resume._id)}
                onDelete={() => handleDeleteClick(resume._id)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteModal.open && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}