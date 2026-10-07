import {
  GraduationCap,
  Layers3,
  LogOut,
  Users,
  BookOpen,
  Home,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '../providers/auth.context';

const NAVBAR_ELEMENTS = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Teachers', path: '/teachers', icon: Users },
  { name: 'Curriculums', path: '/curriculums', icon: BookOpen },
  { name: 'Sections', path: '/sections', icon: Layers3 },
  { name: 'Grades', path: '/grades', icon: BookOpen },
];

export default function LeftNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap className="size-5" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">Acadify</span>
          <span className="text-xs text-sidebar-foreground/60">
            Academic Management
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-3">
        <div>
          <p className="mb-2 px-3 text-xs font-medium text-sidebar-foreground/60">
            Platform
          </p>

          <div className="space-y-1">
            {NAVBAR_ELEMENTS.map(({ name, path, icon: Icon }, index) => (
              <NavLink key={path} to={path} end={path === '/home'}>
                {({ isActive }) => (
                  <Button
                    variant="secondary"
                    className={`${
                      index > 0 ? 'mt-2 ' : ''
                    }w-full justify-start gap-3 ${
                      !isActive
                        ? 'bg-transparent hover:bg-sidebar-accent'
                        : '!bg-black/10 hover:!bg-black/10'
                    }`}
                  >
                    <Icon className="size-4" />
                    {name}
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="secondary"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
