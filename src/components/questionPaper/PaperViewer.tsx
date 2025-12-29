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
                Part {String.fromCharCode(65 + sectionIndex)} – ({questions.length} × {questions[0].marks} = {questions.length * questions[0].marks} Marks)
              </h2>

              <table className="questions-table">
                <thead>
                  <tr>
                    <th className="col-qno">Q. No.</th>
                    <th className="col-question">Questions</th>
                    <th className="col-co">CO</th>
                    <th className="col-bl">BL</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, qIndex) => (
                    <tr key={question.id} className="question-row">
                      <td className="question-number">{qIndex + 1}.</td>
                      <td className="question-content">
                        <p className="question-text">{question.question_text}</p>
                        
                        {question.options && question.options.length > 0 && (
                          <div className="question-options">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="option-item">
                                {String.fromCharCode(97 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="course-outcome">{question.course_outcome || '-'}</td>
                      <td className="blooms-level">{question.blooms_level || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
