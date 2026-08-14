import './SharedLayout.css';
import { Link, Outlet, Navigate } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import UpperNavbar from './UpperNavbar';
import { useAuth } from '../providers/auth.context';

export default function SharedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-bold">Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="shared-layout">
      <div className="title">
        <Link to="">
          <h1>A C A D Y F I</h1>
        </Link>
      </div>
      <div className="bg-white">
        <UpperNavbar />
      </div>
      <div className="h-full min-h-0">
        <LeftNavbar />
      </div>
      <div style={{ backgroundColor: 'rgb(203, 203, 203)' }}>
        <Outlet />
      </div>
    </div>
  );
}
