import { Routes, Route, Navigate } from 'react-router-dom';
import StudentsPage from '@/pages/students-page';
import StudentsDetailsPage from '@/pages/students-details-page';
import ErrorPage from './pages/error-page';
import SharedLayout from './layout/SharedLayout';
import LoginPage from './pages/login-page';
import AuthLayout from './layout/AuthLayout';

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/students" replace />} />

      <Route element={<SharedLayout />}>
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentsDetailsPage />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
