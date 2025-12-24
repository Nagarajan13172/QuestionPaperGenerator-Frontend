import React, { useState } from 'react';
import { syllabusService } from '../../services/syllabus';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import '../styles/SyllabusUpload.css';

interface UploadTextProps {
  onSuccess?: (syllabusId: number) => void;
}

export const UploadText: React.FC<UploadTextProps> = ({ onSuccess }) => {
  const [courseName, setCourseName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await syllabusService.uploadText(courseName, content);
      setSuccess(true);
      setCourseName('');
      setContent('');
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.(Number(result.id));
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload syllabus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📝 Upload Syllabus (Text)</h2>
      <p className="upload-description">
        Paste your syllabus content below. Make sure to format it with units and topics.
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
          <label htmlFor="content">Syllabus Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Example format:
Unit 1: Introduction to Data Structures
- Arrays and Linked Lists
- Stacks and Queues
- Trees and Graphs

Unit 2: Algorithms
- Sorting Algorithms
- Searching Algorithms
- Dynamic Programming`}
            rows={15}
            required
            disabled={loading}
            className="form-textarea"
          />
          <small className="form-hint">
            Format: Unit X: Title, followed by topics with bullet points (-)
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading || !courseName || !content}
          className="btn btn-primary"
        >
          {loading ? 'Uploading...' : '📤 Upload Syllabus'}
        </button>
      </form>

      {loading && <Loading message="Uploading syllabus..." />}
    </div>
  );
};
