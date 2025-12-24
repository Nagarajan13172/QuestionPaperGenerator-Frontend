import React, { useState } from 'react';
import { syllabusService } from '../../services/syllabus';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import '../styles/SyllabusUpload.css';

interface UploadFileProps {
  onSuccess?: (syllabusId: number) => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({ onSuccess }) => {
  const [courseName, setCourseName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        setFile(null);
        return;
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await syllabusService.uploadFile(file, courseName);
      setSuccess(true);
      setCourseName('');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.(Number(result.id));
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📄 Upload Syllabus (PDF)</h2>
      <p className="upload-description">
        Upload a PDF file containing your syllabus. The system will automatically extract units and topics.
      </p>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      {success && (
        <div className="success-message">
          ✅ Syllabus uploaded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="courseName">Course Name *</label>
          <input
            id="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g., Data Structures and Algorithms"
            required
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file-input">Syllabus PDF *</label>
          <div className="file-input-wrapper">
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              disabled={loading}
              className="file-input"
            />
            {file && (
              <div className="file-info">
                <span className="file-icon">📎</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>
          <small className="form-hint">
            Maximum file size: 10MB. Only PDF files are supported.
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading || !courseName || !file}
          className="btn btn-primary"
        >
          {loading ? 'Uploading...' : '📤 Upload PDF'}
        </button>
      </form>

      {loading && <Loading message="Uploading and processing PDF..." />}
    </div>
  );
};
