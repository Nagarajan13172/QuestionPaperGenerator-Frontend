import React, { useState } from 'react';
import { UploadText } from './UploadText';
import { UploadFile } from './UploadFile';
import '../styles/UploadPage.css';

export const UploadPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  return (
    <div className="upload-page-container">
      <div className="upload-tabs">
        <button
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          📝 Upload Text
        </button>
        <button
          className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          📄 Upload PDF
        </button>
      </div>

      <div className="upload-content">
        {activeTab === 'text' ? <UploadText /> : <UploadFile />}
      </div>
    </div>
  );
};
