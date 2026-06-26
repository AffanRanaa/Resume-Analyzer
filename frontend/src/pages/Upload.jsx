import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) return setError('Only PDF and DOCX files are supported.');
    if (f.size > 5 * 1024 * 1024) return setError('File must be under 5MB.');
    setFile(f);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return setError('Please select a file first.');
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/resumes', form, {
        onUploadProgress: (evt) => setProgress(Math.round((evt.loaded / evt.total) * 100)),
      });
      navigate(`/analyze/${res.data.resume._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Resume</h1>
          <p className="text-slate-500">Get your ATS score and AI feedback in seconds.</p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer mb-6 ${
            dragging ? 'border-indigo-400 bg-indigo-50' :
            file ? 'border-emerald-400 bg-emerald-50' :
            'border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {file ? (
            <div>
              <div className="text-5xl mb-3">📄</div>
              <p className="font-semibold text-slate-900 mb-1">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setProgress(0); }}
                className="mt-3 text-sm text-rose-500 hover:text-rose-700 font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4">📂</div>
              <p className="text-slate-700 font-semibold mb-1">Drop your resume here</p>
              <p className="text-slate-400 text-sm">or click to browse</p>
              <p className="text-slate-400 text-xs mt-3">PDF & DOCX only · Max 5MB</p>
            </div>
          )}
        </div>

        {/* Progress */}
        {uploading && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Uploading & analyzing...</span>
              <span className="text-sm text-indigo-600 font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {uploading ? 'Analyzing your resume...' : '✨ Analyze Resume'}
        </button>

        {/* Tips */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">💡 Tips for better results</p>
          <ul className="space-y-2">
            {[
              'Use a text-based PDF, not a scanned image',
              'Include relevant keywords from the job description',
              'Keep formatting clean and ATS-friendly',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-slate-500">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}