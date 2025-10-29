import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionPaperService } from '../../services/questionPaper';
import type { QuestionPaper } from '../../types';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import { ConfirmDialog } from '../common/ConfirmDialog';
import '../styles/QuestionPaper.css';

export const PaperList: React.FC = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionPaperService.list(undefined, 0, 100);
      setPapers(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch question papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;

    setDeleting(true);
    try {
      await questionPaperService.delete(deleteId);
      setPapers(papers.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question paper');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadPDF = async (paperId: string) => {
    try {
      // Download PDF without answers (include_answers = false)
      const blob = await questionPaperService.downloadPDF(paperId, false);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `question-paper-${paperId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading message="Loading question papers..." />;
  }

  return (
    <div className="paper-list-container">
      <div className="list-header">
        <h2>📝 Question Papers</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/question-paper/generate')}
        >
          ✨ Generate New Paper
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {papers?.length === 0 ? (
        <div className="empty-state">
          <p>📭 No question papers found</p>
          <p className="empty-subtitle">Generate your first question paper!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/question-paper/generate')}
          >
            Generate Paper
          </button>
        </div>
      ) : (
        <div className="paper-grid">
          {papers?.map((paper) => (
            <div key={paper.id} className="paper-card">
              <div className="card-header">
                <h3 className="card-title">Question Paper #{paper.id}</h3>
                <span className="card-badge">{paper.total_marks} Marks</span>
              </div>

              <div className="card-body">
                <div className="paper-info">
                  <div className="info-item">
                    <span className="info-label">Questions:</span>
                    <span className="info-value">{paper.questions.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Syllabus ID:</span>
                    <span className="info-value">#{paper.syllabus_id}</span>
                  </div>
                </div>

                <div className="card-meta">
                  <span className="meta-date">🕒 {formatDate(paper.generated_at || paper.created_at || '')}</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/question-paper/${paper.id}`)}
                >
                  👁️ View Paper
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownloadPDF(paper.id)}
                >
                  📥 Download PDF
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteId(paper.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Question Paper"
        message="Are you sure you want to delete this question paper? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};
