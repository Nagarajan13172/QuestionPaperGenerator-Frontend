import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { syllabusService } from '../../services/syllabus';
import { questionPaperService } from '../../services/questionPaper';
import type { Syllabus, QuestionType } from '../../types';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import '../styles/QuestionPaper.css';

export const GenerateForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const syllabusIdParam = searchParams.get('syllabus');

  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string | null>(
    syllabusIdParam || null
  );
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { type: 'multiple_choice', marks: 1, count: 10 },
    { type: 'short_answer', marks: 2, count: 5 },
    { type: 'descriptive', marks: 5, count: 4 },
    { type: 'essay', marks: 10, count: 2 },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [loadingSyllabi, setLoadingSyllabi] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        const response = await syllabusService.list(0, 100);
        setSyllabi(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch syllabi');
      } finally {
        setLoadingSyllabi(false);
      }
    };
    fetchSyllabi();
  }, []);

  const calculateTotalMarks = () => {
    return questionTypes.reduce((sum, qt) => sum + qt.marks * qt.count, 0);
  };

  const updateQuestionType = (index: number, field: keyof QuestionType, value: number) => {
    const updated = [...questionTypes];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionTypes(updated);
  };

  const addQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      { type: 'short_answer', marks: 2, count: 1 },
    ]);
  };

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSyllabusId) {
      setError('Please select a syllabus');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        syllabus_id: selectedSyllabusId,
        total_marks: calculateTotalMarks(),
        generation_rules: {
          question_types: questionTypes,
          difficulty_distribution: {
            easy: 33,
            medium: 34,
            hard: 33,
          },
          unit_distribution: 'equal' as const,
          include_answers: true,
          randomize_options: true,
        },
      };

      const result = await questionPaperService.generate(config);
      navigate(`/question-paper/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question paper');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSyllabi) {
    return <Loading message="Loading syllabi..." />;
  }

  return (
    <div className="generate-container">
      <h2>✨ Generate Question Paper</h2>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {syllabi?.length === 0 ? (
        <div className="empty-state">
          <p>📭 No syllabi available</p>
          <p className="empty-subtitle">Please upload a syllabus first to generate question papers.</p>
          <button className="btn btn-primary" onClick={() => navigate('/syllabus/upload')}>
            Upload Syllabus
          </button>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="generate-form">
          <div className="form-group">
            <label htmlFor="syllabus">Select Syllabus *</label>
            <select
              id="syllabus"
              value={selectedSyllabusId || ''}
              onChange={(e) => setSelectedSyllabusId(e.target.value)}
              required
              disabled={loading}
              className="form-select"
            >
              <option value="">-- Select a syllabus --</option>
              {syllabi?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.course_name} ({s.units.length} units)
                </option>
              ))}
            </select>
          </div>

          <div className="question-types-section">
            <div className="section-header">
              <h3>Question Types Configuration</h3>
              <button
                type="button"
                onClick={addQuestionType}
                className="btn btn-secondary btn-sm"
              >
                ➕ Add Type
              </button>
            </div>

            <div className="question-types-list">
              {questionTypes.map((qt, index) => (
                <div key={index} className="question-type-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={qt.type}
                        onChange={(e) =>
                          updateQuestionType(index, 'type', e.target.value as any)
                        }
                        disabled={loading}
                        className="form-select"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="descriptive">Descriptive</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Marks per Question</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={qt.marks}
                        onChange={(e) =>
                          updateQuestionType(index, 'marks', parseInt(e.target.value))
                        }
                        disabled={loading}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Number of Questions</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={qt.count}
                        onChange={(e) =>
                          updateQuestionType(index, 'count', parseInt(e.target.value))
                        }
                        disabled={loading}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Subtotal</label>
                      <div className="subtotal">{qt.marks * qt.count} marks</div>
                    </div>

                    {questionTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestionType(index)}
                        className="btn btn-danger btn-sm"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="total-marks">
              <strong>Total Marks:</strong> {calculateTotalMarks()}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/syllabus')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedSyllabusId}
              className="btn btn-primary"
            >
              {loading ? 'Generating...' : '✨ Generate Question Paper'}
            </button>
          </div>
        </form>
      )}

      {loading && <Loading message="Generating question paper..." />}
    </div>
  );
};
