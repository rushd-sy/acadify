import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpperNavbar() {
  return (
    <div className="flex h-full items-center justify-between gap-4 px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" className="size-9 p-0">
          <Bell className="size-4" />
        </Button>
      </div>
    </div>
  );
}
