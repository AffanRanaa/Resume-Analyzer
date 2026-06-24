export default function ResumeCard({ resume, onView, onDelete }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreBadgeColor = (score) => {
    if (score === null || score === undefined) return 'bg-slate-100 text-slate-700';
    if (score >= 71) return 'bg-emerald-100 text-emerald-700';
    if (score >= 41) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  const getScoreBadgeEmoji = (score) => {
    if (score === null || score === undefined) return '⏳';
    if (score >= 71) return '✅';
    if (score >= 41) return '🟡';
    return '🔴';
  };

  const hasScore = resume.atsScore !== null && resume.atsScore !== undefined;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {resume.originalName}
            </h3>

            {hasScore && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(resume.atsScore)}`}>
                {getScoreBadgeEmoji(resume.atsScore)} ATS: {resume.atsScore}/100
              </span>
            )}

            {!hasScore && resume.analysisStatus === 'processing' && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                ⏳ Analyzing...
              </span>
            )}

            {resume.analysisStatus === 'failed' && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                ❌ Failed
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">
            {formatDate(resume.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            View
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}