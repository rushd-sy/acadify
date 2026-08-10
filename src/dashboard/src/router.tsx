import { createBrowserRouter } from 'react-router-dom';
import StudentsPage from '@/pages/students-page';
import StudentsDetailsPage from '@/pages/students-details-page';
import ErrorPage from './pages/error-page';
import SharedLayout from './layout/SharedLayout';
import LoginPage from './pages/login-page';
import AuthLayout from './layout/AuthLayout';
import { requireAuthLoader } from './lib/auth-loader';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <SharedLayout />,
    loader: requireAuthLoader,
    children: [
      { path: '/', element: null },
      { path: '/students', element: <StudentsPage /> },
      { path: '/students/:id', element: <StudentsDetailsPage /> },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
