# 🚀 Frontend-Backend Integration MVP Checklist

**Project**: Question Paper Generator  
**Backend**: FastAPI (Ready ✅)  
**Frontend**: React/Next.js (To Be Built)  
**Timeline**: 4-6 weeks

---

## 📋 Quick Start Checklist

### ✅ Backend Status (COMPLETED)
- [x] 9 API endpoints implemented
- [x] CORS enabled
- [x] Documentation at `/api/docs`
- [x] All endpoints tested
- [x] Error handling in place

### 🎯 Frontend TODO (START HERE)

#### Week 1: Setup & Connection
- [ ] **Day 1-2**: Initialize React/Next.js project
- [ ] **Day 2-3**: Install dependencies (axios, UI library, router)
- [ ] **Day 3-4**: Create API service layer (`services/api.js`)
- [ ] **Day 4-5**: Test API connection with health check

#### Week 2: Syllabus Features
- [ ] **Day 1**: Upload syllabus (text) - Form + API
- [ ] **Day 2**: Upload syllabus (PDF) - File upload + API
- [ ] **Day 3**: List all syllabi - Table/cards + API
- [ ] **Day 4**: View syllabus details - Display + API
- [ ] **Day 5**: Delete syllabus - Confirmation + API

#### Week 3: Question Paper Features
- [ ] **Day 1-2**: Question configuration form
- [ ] **Day 2-3**: Generate question paper - API call
- [ ] **Day 3-4**: View question paper - Display questions
- [ ] **Day 4-5**: List all papers + Delete

#### Week 4: Polish & Deploy
- [ ] **Day 1-2**: UI/UX improvements
- [ ] **Day 2-3**: Error handling & loading states
- [ ] **Day 3-4**: Responsive design
- [ ] **Day 4-5**: Testing & deployment

---

## 🔌 API Endpoints to Integrate

### Syllabus Endpoints (5)

| # | Method | Endpoint | Purpose | Priority |
|---|--------|----------|---------|----------|
| 1 | POST | `/api/syllabus/upload/text` | Upload text syllabus | HIGH |
| 2 | POST | `/api/syllabus/upload/file` | Upload PDF syllabus | HIGH |
| 3 | GET | `/api/syllabus/list` | List all syllabi | HIGH |
| 4 | GET | `/api/syllabus/{id}` | Get syllabus details | MEDIUM |
| 5 | DELETE | `/api/syllabus/{id}` | Delete syllabus | MEDIUM |

### Question Paper Endpoints (4)

| # | Method | Endpoint | Purpose | Priority |
|---|--------|----------|---------|----------|
| 6 | POST | `/api/question-paper/generate` | Generate questions | HIGH |
| 7 | GET | `/api/question-paper/list` | List all papers | HIGH |
| 8 | GET | `/api/question-paper/{id}` | Get paper details | HIGH |
| 9 | DELETE | `/api/question-paper/{id}` | Delete paper | LOW |

---

## 📝 Frontend Files to Create

### 1. Configuration Files
```
src/
├── .env.local
│   └── REACT_APP_API_URL=http://localhost:8000/api
```

### 2. API Service Layer
```
src/services/
├── api.js              # Base axios configuration
├── syllabus.js         # Syllabus API calls (5 functions)
└── questionPaper.js    # Question paper API calls (4 functions)
```

### 3. React Components
```
src/components/
├── Dashboard/
│   └── Dashboard.jsx
├── Syllabus/
│   ├── UploadText.jsx      # Upload text form
│   ├── UploadFile.jsx      # Upload PDF form
│   ├── SyllabusList.jsx    # List all syllabi
│   └── SyllabusDetail.jsx  # View one syllabus
├── QuestionPaper/
│   ├── GenerateForm.jsx    # Configuration form
│   ├── PaperList.jsx       # List all papers
│   └── PaperViewer.jsx     # Display questions
└── Common/
    ├── Loading.jsx         # Loading spinner
    ├── ErrorMessage.jsx    # Error display
    └── ConfirmDialog.jsx   # Delete confirmation
```

### 4. Custom Hooks
```
src/hooks/
├── useSyllabus.js          # Fetch syllabus data
├── useQuestionPaper.js     # Fetch paper data
└── useApi.js               # Generic API hook
```

### 5. Pages/Routes
```
src/pages/
├── index.jsx                   # Dashboard
├── syllabus/
│   ├── upload.jsx              # Upload page
│   ├── list.jsx                # Syllabus list
│   └── [id].jsx                # Syllabus detail
└── question-paper/
    ├── generate.jsx            # Generate form
    ├── list.jsx                # Paper list
    └── [id].jsx                # Paper viewer
```

---

## 💻 Code Snippets to Implement

### 1. API Base Configuration (COPY THIS)

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || 'An error occurred';
    throw new Error(message);
  }
);

export default api;
```

### 2. Syllabus Service (COPY THIS)

```javascript
// src/services/syllabus.js
import api from './api';

export const syllabusService = {
  uploadText: (courseName, content) =>
    api.post('/syllabus/upload/text', { course_name: courseName, content }),

  uploadFile: (file, courseName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_name', courseName);
    return api.post('/syllabus/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  list: (skip = 0, limit = 10) =>
    api.get('/syllabus/list', { params: { skip, limit } }),

  getById: (id) => api.get(`/syllabus/${id}`),

  delete: (id) => api.delete(`/syllabus/${id}`),
};
```

### 3. Question Paper Service (COPY THIS)

```javascript
// src/services/questionPaper.js
import api from './api';

export const questionPaperService = {
  generate: (config) => api.post('/question-paper/generate', config),

  list: (syllabusId = null, skip = 0, limit = 10) => {
    const params = { skip, limit };
    if (syllabusId) params.syllabus_id = syllabusId;
    return api.get('/question-paper/list', { params });
  },

  getById: (id) => api.get(`/question-paper/${id}`),

  delete: (id) => api.delete(`/question-paper/${id}`),
};
```

### 4. Upload Form Example (COPY THIS)

```javascript
// src/components/Syllabus/UploadText.jsx
import React, { useState } from 'react';
import { syllabusService } from '../../services/syllabus';

export const UploadText = () => {
  const [courseName, setCourseName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await syllabusService.uploadText(courseName, content);
      alert('Syllabus uploaded! ID: ' + result.id);
      setCourseName('');
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="Course Name"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Syllabus content..."
        rows={10}
        required
      />
      {error && <div style={{color: 'red'}}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};
```

### 5. Generate Question Paper Form (COPY THIS)

```javascript
// src/components/QuestionPaper/GenerateForm.jsx
import React, { useState } from 'react';
import { questionPaperService } from '../../services/questionPaper';

export const GenerateForm = ({ syllabusId }) => {
  const [config, setConfig] = useState({
    question_types: [
      { type: 'multiple_choice', marks: 1, count: 10 },
      { type: 'descriptive', marks: 5, count: 5 },
      { type: 'essay', marks: 8, count: 3 }
    ]
  });
  const [loading, setLoading] = useState(false);

  const totalMarks = config.question_types.reduce(
    (sum, qt) => sum + (qt.marks * qt.count), 0
  );

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await questionPaperService.generate({
        syllabus_id: syllabusId,
        total_marks: totalMarks,
        question_types: config.question_types
      });
      alert('Generated! Paper ID: ' + result.id);
      // Navigate to paper view
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate Question Paper</h2>
      <p>Total Marks: {totalMarks}</p>
      
      {/* Add inputs to modify config.question_types */}
      
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Paper'}
      </button>
    </div>
  );
};
```

---

## ✅ Testing Checklist

### Before You Start
- [ ] Backend server running at `http://localhost:8000`
- [ ] API docs accessible at `http://localhost:8000/api/docs`
- [ ] Test with `curl` or Postman first
- [ ] Check CORS is enabled

### Test Each Feature
- [ ] Upload text syllabus → Check response has `id`
- [ ] Upload PDF file → Check units are parsed
- [ ] List syllabi → Check returns array
- [ ] View syllabus → Check units and topics displayed
- [ ] Delete syllabus → Check returns success message
- [ ] Generate paper → Check returns questions array
- [ ] View paper → Check questions formatted correctly
- [ ] List papers → Check returns array
- [ ] Delete paper → Check returns success message

### Edge Cases
- [ ] Upload with missing fields → Shows error
- [ ] Upload invalid file type → Shows error
- [ ] Generate with wrong total_marks → Shows error
- [ ] View non-existent ID → Shows 404 error
- [ ] Handle network errors gracefully

---

## 🎯 MVP Definition (Minimum to Launch)

### Must Have ✅
- [ ] Upload syllabus (text OR PDF)
- [ ] View list of syllabi
- [ ] Generate question paper with basic config
- [ ] View generated paper with questions
- [ ] Basic error handling

### Should Have 🎯
- [ ] Both text and PDF upload
- [ ] Delete syllabus
- [ ] Delete paper
- [ ] Loading states
- [ ] Responsive design

### Nice to Have 🌟
- [ ] Dashboard with stats
- [ ] Export to PDF
- [ ] Search and filter
- [ ] Templates
- [ ] Print functionality

---

## 📦 Required NPM Packages

```bash
# Core
npm install react react-dom next
# or
npm install react react-dom react-router-dom

# API
npm install axios

# UI Library (choose one)
npm install @mui/material @emotion/react @emotion/styled
# or
npm install antd
# or just use Tailwind CSS

# Forms
npm install react-hook-form

# Utils
npm install classnames
npm install date-fns

# Dev Dependencies
npm install --save-dev @types/react @types/node
```

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Check backend CORS settings in `app/main.py`
```python
# Should allow your frontend origin
origins = ["http://localhost:3000"]
```

### Issue: 404 Not Found
**Solution**: Check base URL is correct
```javascript
baseURL: 'http://localhost:8000/api'  // Must include /api
```

### Issue: File Upload Fails
**Solution**: Must use FormData and correct header
```javascript
const formData = new FormData();
formData.append('file', file);
headers: { 'Content-Type': 'multipart/form-data' }
```

### Issue: Total Marks Validation Error
**Solution**: Ensure total_marks matches sum of (marks × count)
```javascript
const total = question_types.reduce((sum, qt) => sum + qt.marks * qt.count, 0);
```

---

## 📞 Quick Reference

### Backend Running?
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
# Access: http://localhost:8000/api/docs
```

### Test API
```bash
# Health check
curl http://localhost:8000/api/health

# Upload syllabus
curl -X POST http://localhost:8000/api/syllabus/upload/text \
  -H "Content-Type: application/json" \
  -d '{"course_name":"Test","content":"Unit 1: Test\n- Topic 1"}'
```

### Frontend URLs
- Development: http://localhost:3000
- API calls to: http://localhost:8000/api
- API docs: http://localhost:8000/api/docs

---

## 📚 Documentation Links

- **Complete API Docs**: `/backend/API_TODO.md`
- **Backend README**: `/backend/README.md`
- **Setup Guide**: `/backend/FINAL_SOLUTION.md`
- **Quick Start**: `/backend/QUICKSTART.md`

---

**START HERE**: 
1. Create React app: `npx create-next-app questionpaper-frontend`
2. Copy API service code from above
3. Create first component: Upload Text Form
4. Test API connection
5. Build remaining features week by week

**Good luck! 🚀**
