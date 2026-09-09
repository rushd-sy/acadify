import './SharedLayout.css';
import { Navigate, Outlet } from 'react-router-dom';
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
      <aside className="shared-layout__sidebar">
        <LeftNavbar />
      </aside>

      <div className="shared-layout__main">
        <header className="shared-layout__topbar">
          <UpperNavbar />
        </header>

        <main className="shared-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
