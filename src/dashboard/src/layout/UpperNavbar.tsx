import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UpperNavbar() {
  return (
    <div className="flex h-full items-center justify-between gap-4 px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search..." className="pl-9" />
        </div>

        <Button variant="secondary" className="size-9 p-0">
          <Bell className="size-4" />
        </Button>
      </div>
    </div>
  );
}
