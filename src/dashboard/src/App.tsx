import { Routes, Route, Navigate } from 'react-router-dom';
import StudentsPage from '@/pages/students-page';
import StudentsDetailsPage from '@/pages/students-details-page';
import ErrorPage from './pages/error-page';
import SharedLayout from './layout/SharedLayout';
import LoginPage from './pages/login-page';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirect root to students */}
      <Route path="/" element={<Navigate to="/students" replace />} />

      {/* Layout Routes */}
      <Route element={<SharedLayout />}>
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentsDetailsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
