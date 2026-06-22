import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LeftNavbar() {
  return (
    <nav className="h-full bg-sidebar p-2 text-sidebar-foreground">
      <Link to="students">
        <Button className="text-3xl w-full justify-start">Students</Button>
      </Link>
    </nav>
  );
}
