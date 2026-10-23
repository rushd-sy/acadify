import {
  BookOpen,
  FileText,
  GraduationCap,
  Home,
  Layers3,
  LogOut,
  Users,
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
  { name: 'Exams', path: '/exams', icon: FileText },
];

export default function LeftNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="flex h-full flex-col bg-[#55504A] text-[#F7F3EC]">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-[#DCD2C0]/30 px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#B5603A] text-white">
          <GraduationCap className="size-5" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#F7F3EC]">Acadify</span>
          <span className="text-xs text-[#F7F3EC]/70">Academic Management</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-6 p-3">
        <div>
          <p className="mb-3 px-3 text-xs font-medium text-[#DCD2C0]">
            Platform
          </p>

          <div className="space-y-1">
            {NAVBAR_ELEMENTS.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/home'}
                className="block"
              >
                {({ isActive }) => (
                  <Button
                    variant="secondary"
                    className={`w-full justify-start gap-3 border-0 transition-colors ${
                      isActive
                        ? 'bg-[#3A3631] font-semibold text-[#F7F3EC] hover:bg-[#3A3631] hover:text-[#F7F3EC]'
                        : 'bg-transparent text-[#F7F3EC]/80 hover:bg-[#3A3631] hover:text-[#F7F3EC]'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{name}</span>
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-[#DCD2C0]/30 p-3">
        <Button
          variant="secondary"
          className="w-full justify-start gap-3 border-0 bg-transparent text-[#F7F3EC] hover:bg-[#3A3631] hover:text-[#F7F3EC]"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
}
