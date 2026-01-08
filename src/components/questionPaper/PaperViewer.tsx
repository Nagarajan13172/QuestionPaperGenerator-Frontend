import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionPaperService } from '../../services/questionPaper';
import type { QuestionPaper, Question, AnswerKey } from '../../types';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import { AnswerKeyView } from './AnswerKeyView';
import '../styles/PaperViewer.css';
import '../styles/AnswerKeyView.css';

export const PaperViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [answerKey, setAnswerKey] = useState<AnswerKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);
  const [evaluationMode, setEvaluationMode] = useState(false);

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

  useEffect(() => {
    // Fetch answer key when evaluation mode is enabled for the first time
    if (evaluationMode && !answerKey && id) {
      const fetchAnswerKey = async () => {
        try {
          const data = await questionPaperService.getAnswerKey(id);
          setAnswerKey(data);
        } catch (err) {
          console.error('Failed to load answer key for evaluation mode', err);
        }
      };
      fetchAnswerKey();
    }
  }, [evaluationMode, answerKey, id]);

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

  const getAnswerForQuestion = (qId: string) => {
    return answerKey?.answers.find(a => a.question_id === qId);
  };

  return (
    <div className="viewer-container">
      <div className="viewer-header no-print">
        <div className="viewer-controls">
          <button className="btn btn-secondary" onClick={() => navigate('/question-paper')}>
            ← Back to Papers
          </button>

          <button className="btn btn-secondary" onClick={() => setShowAnswerKeyModal(true)}>
            📝 View Answer Key
          </button>

          <div
            className={`evaluation-toggle ${evaluationMode ? 'active' : ''}`}
            onClick={() => setEvaluationMode(!evaluationMode)}
            title="Toggle Evaluation Mode to see answers inline"
          >
            <div className="toggle-switch">
              <div className="toggle-knob"></div>
            </div>
            <span>Evaluation Mode</span>
          </div>
        </div>

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
                  {questions.map((question, qIndex) => {
                    const answer = evaluationMode ? getAnswerForQuestion(question.id) : null;

                    return (
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

                          {/* Evaluator View */}
                          {evaluationMode && answer && (
                            <div className="evaluator-panel">
                              <h4 className="evaluator-title">✅ Correct Answer:</h4>
                              <p className="evaluator-answer">{answer.correct_answer}</p>

                              {answer.explanation && (
                                <div className="evaluator-explanation">
                                  <span className="evaluator-explanation-label">Explanation:</span>
                                  <p className="evaluator-explanation-text">{answer.explanation}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="course-outcome">{question.course_outcome || '-'}</td>
                        <td className="blooms-level">{question.blooms_level || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="paper-footer">
          <p>End of Question Paper</p>
        </div>
      </div>

      <AnswerKeyView
        paperId={id || ''}
        isOpen={showAnswerKeyModal}
        onClose={() => setShowAnswerKeyModal(false)}
      />
    </div>
  );
};
