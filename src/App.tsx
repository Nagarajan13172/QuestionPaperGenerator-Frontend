import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { UploadPage } from './components/syllabus/UploadPage';
import { SyllabusList } from './components/syllabus/SyllabusList';
import { SyllabusDetail } from './components/syllabus/SyllabusDetail';
import { GenerateForm } from './components/questionPaper/GenerateForm';
import { PaperList } from './components/questionPaper/PaperList';
import { PaperViewer } from './components/questionPaper/PaperViewer';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📚 Question Paper Generator
        </Link>
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
            🏠 Home
          </Link>
          <Link to="/syllabus" className={`nav-link ${isActive('/syllabus') ? 'active' : ''}`}>
            📚 Syllabi
          </Link>
          <Link to="/question-paper" className={`nav-link ${isActive('/question-paper') ? 'active' : ''}`}>
            📝 Papers
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/syllabus" element={<SyllabusList />} />
            <Route path="/syllabus/upload" element={<UploadPage />} />
            <Route path="/syllabus/:id" element={<SyllabusDetail />} />
            <Route path="/question-paper" element={<PaperList />} />
            <Route path="/question-paper/generate" element={<GenerateForm />} />
            <Route path="/question-paper/:id" element={<PaperViewer />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2025 Question Paper Generator. Built with React + FastAPI</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
