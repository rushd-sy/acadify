import { Navigate, Route, Routes } from 'react-router-dom';
import StudentsPage from '@/pages/students-page';
import StudentsDetailsPage from '@/pages/students-details-page';
import ErrorPage from './pages/error-page';
import SharedLayout from './layout/SharedLayout';
import LoginPage from './pages/login-page';
import AuthLayout from './layout/AuthLayout';
import { AuthProvider } from './providers/auth-provider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<SharedLayout />}>
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/:id" element={<StudentsDetailsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
