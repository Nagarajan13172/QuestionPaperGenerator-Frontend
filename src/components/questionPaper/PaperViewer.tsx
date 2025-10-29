import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionPaperService } from '../../services/questionPaper';
import type { QuestionPaper, Question } from '../../types';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import '../styles/PaperViewer.css';

export const PaperViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await questionPaperService.getById(id);
        setPaper(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch question paper');
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  const groupQuestionsByType = (questions: Question[]) => {
    const grouped: Record<string, Question[]> = {};
    questions.forEach((q) => {
      if (!grouped[q.type]) {
        grouped[q.type] = [];
      }
      grouped[q.type].push(q);
    });
    return grouped;
  };

  const formatQuestionType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loading message="Loading question paper..." />;
  }

  if (error || !paper) {
    return (
      <div className="viewer-container">
        {error && <ErrorMessage message={error} />}
        <button className="btn btn-secondary" onClick={() => navigate('/question-paper')}>
          ← Back to Papers
        </button>
      </div>
    );
  }

  const groupedQuestions = groupQuestionsByType(paper.questions);

  return (
    <div className="viewer-container">
      <div className="viewer-header no-print">
        <button className="btn btn-secondary" onClick={() => navigate('/question-paper')}>
          ← Back to Papers
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          🖨️ Print Paper
        </button>
      </div>

      <div className="paper-sheet">
        <div className="paper-header">
          <h1 className="paper-title">Question Paper</h1>
          <div className="paper-meta">
            <div>
              <strong>Course:</strong> {paper.course_name}
            </div>
            <div>
              <strong>Paper ID:</strong> #{paper.id}
            </div>
            <div>
              <strong>Total Marks:</strong> {paper.total_marks}
            </div>
            <div>
              <strong>Total Questions:</strong> {paper.total_questions}
            </div>
            <div>
              <strong>Date:</strong> {new Date(paper.generated_at || paper.created_at || '').toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Answer all questions</li>
            <li>Total marks: {paper.total_marks}</li>
            <li>Write your answers clearly and concisely</li>
          </ul>
        </div>

        <div className="questions-section">
          {Object.entries(groupedQuestions).map(([type, questions], sectionIndex) => (
            <div key={type} className="question-section">
              <h2 className="section-title">
                Section {String.fromCharCode(65 + sectionIndex)}: {formatQuestionType(type)}
              </h2>
              <p className="section-info">
                ({questions.length} question{questions.length > 1 ? 's' : ''} × {questions[0].marks} marks each = {questions.length * questions[0].marks} marks)
              </p>

              {questions.map((question, qIndex) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Q{qIndex + 1}.</span>
                    <span className="question-marks">[{question.marks} marks]</span>
                  </div>
                  <div className="question-content">
                    <p className="question-text">{question.question_text}</p>
                    
                    {question.unit_name && (
                      <div className="question-meta-info">
                        <span className="unit-badge">📚 {question.unit_name}</span>
                  
                      </div>
                    )}

                    {question.options && question.options.length > 0 && (
                      <div className="question-options">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="option-item">
                            <span className="option-text">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {type !== 'multiple_choice' && (
                      <div className="answer-space">
                        <div className="answer-lines">
                          {Array.from({ length: type === 'essay' ? 15 : type === 'descriptive' ? 10 : 5 }).map((_, i) => (
                            <div key={i} className="answer-line"></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="paper-footer">
          <p>End of Question Paper</p>
        </div>
      </div>
    </div>
  );
};
