import React, { useEffect, useState } from 'react';
import { questionPaperService } from '../../services/questionPaper';
import type { AnswerKey } from '../../types';
import '../styles/AnswerKeyView.css';

interface AnswerKeyViewProps {
    paperId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const AnswerKeyView: React.FC<AnswerKeyViewProps> = ({ paperId, isOpen, onClose }) => {
    const [answerKey, setAnswerKey] = useState<AnswerKey | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && paperId) {
            const fetchAnswerKey = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await questionPaperService.getAnswerKey(paperId);
                    setAnswerKey(data);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to load answer key');
                } finally {
                    setLoading(false);
                }
            };

            fetchAnswerKey();
        }
    }, [isOpen, paperId]);

    if (!isOpen) return null;

    return (
        <div className="answer-key-modal-overlay" onClick={onClose}>
            <div className="answer-key-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="answer-key-header">
                    <h2>Answer Key</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <div className="answer-key-body">
                    {loading && (
                        <div className="answer-key-loading">
                            <div className="loading-spinner"></div>
                            <span>Loading answer key...</span>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                            <button className="btn btn-secondary mt-2" onClick={onClose}>Close</button>
                        </div>
                    )}

                    {answerKey && !loading && (
                        <>
                            <div className="answer-key-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Course</span>
                                    <span className="meta-value">{answerKey.course_name}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Paper ID</span>
                                    <span className="meta-value">{answerKey.paper_id}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Total Marks</span>
                                    <span className="meta-value">{answerKey.total_marks}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Generated On</span>
                                    <span className="meta-value">{new Date(answerKey.generated_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="answers-list">
                                {answerKey.answers.map((item) => (
                                    <div key={item.question_id} className="answer-item">
                                        <div className="answer-question-header">
                                            <span className="answer-q-number">Q{item.question_number}.</span>
                                            <span className="answer-marks">{item.marks} Marks</span>
                                        </div>

                                        <p className="answer-q-text">{item.question_text}</p>

                                        <div className="answer-box">
                                            <span className="answer-label">Correct Answer:</span>
                                            <div className="answer-content">{item.correct_answer}</div>

                                            {item.explanation && (
                                                <div className="explanation-box">
                                                    <span className="explanation-label">Explanation:</span>
                                                    <span className="explanation-content">{item.explanation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
