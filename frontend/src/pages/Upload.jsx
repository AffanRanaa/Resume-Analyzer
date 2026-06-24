import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await api.post('/resumes', form, {
        onUploadProgress: (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      navigate(`/analyze/${res.data.resume._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Resume</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.docx" onChange={handleChange} />
        {progress > 0 && <div>Uploading: {progress}%</div>}
        {error && <div className="error">{error}</div>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
