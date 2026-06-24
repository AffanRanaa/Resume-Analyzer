import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Analysis() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/resumes/${resumeId}`);
      setResume(res.data.resume);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load resume. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const toastId = toast.loading('Analyzing your resume...');
    try {
      const res = await api.post(`/analyze/${resumeId}`);
      setResume(res.data.resume);
      setError(null);
      toast.success('Analysis complete!', { id: toastId });
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed. Please try again.';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <Skeleton height={36} width={300} borderRadius={8} />
          <Skeleton height={120} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-slate-700 text-lg mb-4">{error || 'Resume not found'}</p>
          <button
            onClick={fetchResume}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 truncate">{resume.originalName}</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!resume.atsScore && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Ready to analyze</h2>
            <p className="text-slate-500 mb-6">Get your ATS score, missing skills, and improvement suggestions</p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {analyzing ? 'Analyzing...' : '✨ Analyze Resume'}
            </button>
          </div>
        )}

        {resume.atsScore !== null && (
          <>
            {/* ATS Score */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-700 mb-4">ATS Score</h2>
              <div className="flex items-center gap-6">
                <div className={`text-5xl font-bold ${
                  resume.atsScore >= 70 ? 'text-emerald-500' :
                  resume.atsScore >= 40 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {resume.atsScore}
                  <span className="text-2xl text-slate-400">/100</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        resume.atsScore >= 70 ? 'bg-emerald-500' :
                        resume.atsScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${resume.atsScore}%` }}
                    />
                  </div>
                </div>
              </div>
              {resume.atsReasoning && (
                <p className="text-slate-600 mt-4 text-sm leading-relaxed">{resume.atsReasoning}</p>
              )}
            </div>

            {/* Missing Skills */}
            {resume.missingSkills?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resume.missingSkills.map((skill, i) => (
                    <span key={i} className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {resume.suggestions?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Suggestions</h3>
                <ul className="space-y-2">
                  {resume.suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-2 text-slate-600 text-sm">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cover Letter */}
            {resume.coverLetter && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-700">Generated Cover Letter</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resume.coverLetter);
                      toast.success('Copied to clipboard!');
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{resume.coverLetter}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}