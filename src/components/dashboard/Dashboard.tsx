import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { syllabusService } from '../../services/syllabus';
import { questionPaperService } from '../../services/questionPaper';
import { ErrorMessage } from '../common/ErrorMessage';
import '../styles/Dashboard.css';

interface DashboardStats {
  totalSyllabi: number;
  totalPapers: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ totalSyllabi: 0, totalPapers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [syllabiResponse, papersResponse] = await Promise.all([
          syllabusService.list(0, 1),
          questionPaperService.list(undefined, 0, 1),
        ]);
        setStats({
          totalSyllabi: syllabiResponse.total,
          totalPapers: papersResponse.total,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📚 Question Paper Generator</h1>
        <p className="dashboard-subtitle">Create professional question papers from your syllabus</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalSyllabi}</h3>
            <p className="stat-label">Total Syllabi</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalPapers}</h3>
            <p className="stat-label">Question Papers</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button
            className="action-card"
            onClick={() => navigate('/syllabus/upload')}
          >
            <div className="action-icon">📤</div>
            <h3>Upload Syllabus</h3>
            <p>Upload a new syllabus from text or PDF</p>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/syllabus')}
          >
            <div className="action-icon">📚</div>
            <h3>View Syllabi</h3>
            <p>Browse and manage your syllabi</p>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/question-paper/generate')}
          >
            <div className="action-icon">✨</div>
            <h3>Generate Paper</h3>
            <p>Create a new question paper</p>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/question-paper')}
          >
            <div className="action-icon">📋</div>
            <h3>View Papers</h3>
            <p>Browse all generated papers</p>
          </button>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Upload Syllabus</h3>
            <p>Upload your course syllabus as text or PDF. The system will extract units and topics.</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Configure Paper</h3>
            <p>Select question types, marks distribution, and number of questions.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Generate & Download</h3>
            <p>AI generates questions and creates a professional question paper ready to print.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
