import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Analysis() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchResume(); }, [resumeId]);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/resumes/${resumeId}`);
      setResume(res.data.resume);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resume.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return { text: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Strong', badge: 'bg-emerald-100 text-emerald-700' };
    if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-500', label: 'Average', badge: 'bg-amber-100 text-amber-700' };
    return { text: 'text-rose-600', bg: 'bg-rose-500', label: 'Needs Work', badge: 'bg-rose-100 text-rose-700' };
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600" />
          </div>
          <p className="text-slate-600 font-medium">Loading analysis...</p>
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
          <button onClick={fetchResume} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const scoreColors = resume.atsScore !== null ? getScoreColor(resume.atsScore) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/history')} className="text-slate-400 hover:text-slate-600 text-sm mb-2 flex items-center gap-1">
              ← Back to History
            </button>
            <h1 className="text-2xl font-bold text-slate-900 truncate max-w-lg">{resume.originalName}</h1>
            <p className="text-slate-400 text-sm mt-1">{new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {resume.atsScore !== null && (
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${scoreColors.badge}`}>
              {scoreColors.label}
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {/* No score yet */}
        {!resume.atsScore && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Analysis pending</h2>
            <p className="text-slate-500 mb-2">This resume was uploaded but the analysis didn't complete.</p>
            <p className="text-slate-400 text-sm">Please upload again to get your ATS score.</p>
            <button onClick={() => navigate('/upload')} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              Upload Again
            </button>
          </div>
        )}

        {resume.atsScore !== null && (
          <div className="space-y-5">

            {/* Score Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-800">ATS Score</h2>
                <span className="text-slate-400 text-sm">out of 100</span>
              </div>
              <div className="flex items-center gap-6 mb-5">
                <div className={`text-6xl font-extrabold tabular-nums ${scoreColors.text}`}>
                  {resume.atsScore}
                  <span className="text-2xl text-slate-300 font-normal">/100</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>0</span><span>50</span><span>100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-700 ${scoreColors.bg}`}
                      style={{ width: `${resume.atsScore}%` }}
                    />
                  </div>
                  <div className="flex gap-3 mt-3">
                    {[
                      { label: 'Weak', color: 'bg-rose-400' },
                      { label: 'Average', color: 'bg-amber-400' },
                      { label: 'Strong', color: 'bg-emerald-400' },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} />
                        {l.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {resume.atsReasoning && (
                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{resume.atsReasoning}</p>
              )}
            </div>

            {/* Missing Skills */}
            {resume.missingSkills?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🔑</span>
                  <h3 className="text-lg font-semibold text-slate-800">Missing Keywords</h3>
                  <span className="ml-auto bg-rose-100 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{resume.missingSkills.length} missing</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">Add these keywords to improve your ATS score.</p>
                <div className="flex flex-wrap gap-2">
                  {resume.missingSkills.map((skill, i) => (
                    <span key={i} className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {resume.suggestions?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">💡</span>
                  <h3 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h3>
                  <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{resume.suggestions.length} tips</span>
                </div>
                <ul className="space-y-3">
                  {resume.suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="text-slate-600 text-sm leading-relaxed">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cover Letter */}
            {resume.coverLetter && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✉️</span>
                    <h3 className="text-lg font-semibold text-slate-800">Generated Cover Letter</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(resume.coverLetter)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 bg-indigo-50 rounded-lg transition"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 rounded-lg p-4">
                  {resume.coverLetter}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => navigate('/upload')} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                📤 Analyze Another Resume
              </button>
              <button onClick={() => navigate('/history')} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition">
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}