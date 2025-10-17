import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { syllabusService } from '../../services/syllabus';
import type { Syllabus } from '../../types';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import { ConfirmDialog } from '../common/ConfirmDialog';
import '../styles/SyllabusList.css';

export const SyllabusList: React.FC = () => {
  const navigate = useNavigate();
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSyllabi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await syllabusService.list(0, 100);
      setSyllabi(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch syllabi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    
    setDeleting(true);
    try {
      await syllabusService.delete(deleteId);
      setSyllabi(syllabi.filter(s => s.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete syllabus');
    } finally {
      setDeleting(false);
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
    return <Loading message="Loading syllabi..." />;
  }

  return (
    <div className="syllabus-list-container">
      <div className="list-header">
        <h2>📚 All Syllabi</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/syllabus/upload')}
        >
          ➕ Upload New Syllabus
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {syllabi?.length === 0 ? (
        <div className="empty-state">
          <p>📭 No syllabi found</p>
          <p className="empty-subtitle">Upload your first syllabus to get started!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/syllabus/upload')}
          >
            Upload Syllabus
          </button>
        </div>
      ) : (
        <div className="syllabus-grid">
          {syllabi?.map((syllabus) => (
            <div key={syllabus.id} className="syllabus-card">
              <div className="card-header">
                <h3 className="card-title">{syllabus.course_name}</h3>
                <span className="card-badge">{syllabus.units.length} Units</span>
              </div>
              
              <div className="card-body">
                <div className="units-preview">
                  {syllabus.units.slice(0, 3).map((unit) => (
                    <div key={unit.unit_number} className="unit-preview">
                      <strong>Unit {unit.unit_number}:</strong> {unit.unit_name}
                    </div>
                  ))}
                  {syllabus.units.length > 3 && (
                    <div className="more-units">
                      +{syllabus.units.length - 3} more units
                    </div>
                  )}
                </div>
                
                <div className="card-meta">
                  <span className="meta-date">
                    🕒 {formatDate(syllabus.created_at)}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/syllabus/${syllabus.id}`)}
                >
                  👁️ View Details
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/question-paper/generate?syllabus=${syllabus.id}`)}
                >
                  ✨ Generate Paper
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteId(syllabus.id)}
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
        title="Delete Syllabus"
        message="Are you sure you want to delete this syllabus? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};
