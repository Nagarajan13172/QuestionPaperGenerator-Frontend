# 📚 Question Paper Generator - Frontend

A modern React + TypeScript frontend application for generating professional question papers from course syllabi. Built with Vite, React Router, and Axios.

## ✨ Features

### 📤 Syllabus Management
- **Upload Syllabus as Text**: Paste syllabus content with units and topics
- **Upload Syllabus as PDF**: Upload PDF files for automatic parsing
- **View All Syllabi**: Browse and manage uploaded syllabi
- **Syllabus Details**: View detailed unit and topic breakdowns

### ✨ Question Paper Generation
- **Configure Paper**: Select question types, marks distribution, and question counts
- **Multiple Question Types**: 
  - Multiple Choice Questions (MCQ)
  - Short Answer Questions
  - Descriptive Questions
  - Essay Questions
- **Auto-generation**: AI-powered question generation based on syllabus
- **Professional Layout**: Print-ready question paper format

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Clean Interface**: Modern gradient design with intuitive navigation
- **Real-time Feedback**: Loading states, error handling, and success messages
- **Print Support**: Optimized print layouts for question papers

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0 or higher recommended)
- npm or yarn
- Backend API running (default: http://localhost:8000/api)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   
   Create/update `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Loading.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ConfirmDialog.tsx
│   ├── dashboard/           # Dashboard components
│   │   └── Dashboard.tsx
│   ├── syllabus/            # Syllabus management
│   │   ├── UploadText.tsx
│   │   ├── UploadFile.tsx
│   │   ├── UploadPage.tsx
│   │   ├── SyllabusList.tsx
│   │   └── SyllabusDetail.tsx
│   ├── questionPaper/       # Question paper features
│   │   ├── GenerateForm.tsx
│   │   ├── PaperList.tsx
│   │   └── PaperViewer.tsx
│   └── styles/              # Component-specific CSS
├── services/                # API services
│   ├── api.ts              # Axios configuration
│   ├── syllabus.ts         # Syllabus API calls
│   └── questionPaper.ts    # Question paper API calls
├── types/                   # TypeScript type definitions
│   └── index.ts
├── App.tsx                  # Main app with routing
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## 📡 API Integration

The frontend connects to the FastAPI backend with the following endpoints:

### Syllabus Endpoints
- `POST /api/syllabus/upload/text` - Upload syllabus as text
- `POST /api/syllabus/upload/file` - Upload syllabus as PDF
- `GET /api/syllabus/list` - Get all syllabi
- `GET /api/syllabus/{id}` - Get syllabus by ID
- `DELETE /api/syllabus/{id}` - Delete syllabus

### Question Paper Endpoints
- `POST /api/question-paper/generate` - Generate question paper
- `GET /api/question-paper/list` - Get all question papers
- `GET /api/question-paper/{id}` - Get question paper by ID
- `DELETE /api/question-paper/{id}` - Delete question paper

## 🎨 Design Features

### Color Scheme
- Primary: `#667eea` (Purple-Blue)
- Secondary: `#764ba2` (Purple)
- Background: Gradient from `#667eea` to `#764ba2`
- Cards: White with shadow elevation

### Responsive Breakpoints
- Desktop: > 768px
- Tablet/Mobile: ≤ 768px

### Key UI Components
- **Navigation Bar**: Sticky header with active route highlighting
- **Cards**: Hover effects with elevation changes
- **Forms**: Focused states with validation
- **Buttons**: Gradient backgrounds with hover animations
- **Loading States**: Spinner with custom animations

## 🔧 Configuration

### Environment Variables
- `VITE_API_URL`: Backend API base URL (default: http://localhost:8000/api)

### API Timeout
- Default: 30 seconds
- Configurable in `src/services/api.ts`

## 📝 Usage Guide

### 1. Upload Syllabus
1. Click "Upload Syllabus" from dashboard
2. Choose text or PDF upload
3. Enter course name
4. Paste content or select PDF file
5. Click upload

### 2. Generate Question Paper
1. Navigate to "Generate Paper"
2. Select a syllabus
3. Configure question types and marks
4. Click "Generate Question Paper"
5. View and print the generated paper

### 3. Manage Content
- View all syllabi in the Syllabi page
- View all papers in the Papers page
- Delete items with confirmation dialogs
- View detailed breakdowns

## 🖨️ Print Support

Question papers are optimized for printing:
- Clean, professional layout
- No UI elements in print
- Proper page breaks
- Answer lines for written questions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of the Question Paper Generator system.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on http://localhost:8000
   - Check VITE_API_URL in .env.local
   - Verify CORS settings on backend

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear cache: `npm run dev -- --force`

3. **Type Errors**
   - Run type check: `npm run tsc`
   - Check TypeScript version compatibility

## 📞 Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using React + TypeScript + Vite
