import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { syllabusService } from '../../services/syllabus';
import type { Syllabus } from '../../types';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import '../styles/SyllabusDetail.css';

export const SyllabusDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await syllabusService.getById(id);
        setSyllabus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch syllabus');
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [id]);

  if (loading) {
    return <Loading message="Loading syllabus details..." />;
  }

  if (error || !syllabus) {
    return (
      <div className="detail-container">
        {error && <ErrorMessage message={error} />}
        <button className="btn btn-secondary" onClick={() => navigate('/syllabus')}>
          ← Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={() => navigate('/syllabus')}>
          ← Back to List
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/question-paper/generate?syllabus=${syllabus.id}`)}
        >
          ✨ Generate Question Paper
        </button>
      </div>

      <div className="detail-card">
        <h1 className="detail-title">{syllabus.course_name}</h1>
        <div className="detail-meta">
          <span>📅 Created: {new Date(syllabus.created_at).toLocaleString()}</span>
          <span>📚 {syllabus.units.length} Units</span>
        </div>

        <div className="units-section">
          {syllabus.units.map((unit) => (
            <div key={unit.id} className="unit-card">
              <h3 className="unit-title">
                Unit {unit.order}: {unit.title}
              </h3>
              <ul className="topics-list">
                {unit.topics.map((topic, index) => (
                  <li key={index} className="topic-item">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
