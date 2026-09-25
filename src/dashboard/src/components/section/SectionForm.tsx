import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sectionService } from '@/services/section.service';
import type { CreateSectionDto } from 'dtos';

type SectionFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export function SectionForm({ onCancel, onSuccess }: SectionFormProps) {
  const [formData, setFormData] = useState<CreateSectionDto>({
    name: '',
    academicYear: '',
    gradeId: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sectionService.createSection(formData);
      onSuccess();
    } catch {
      setError('Failed to create section.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Section Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Section A"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="academicYear">Academic Year</Label>
        <Input
          id="academicYear"
          value={formData.academicYear}
          onChange={(e) =>
            setFormData({ ...formData, academicYear: e.target.value })
          }
          placeholder="e.g. 2026-2027"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gradeId">Grade ID</Label>
        <Input
          id="gradeId"
          type="number"
          value={formData.gradeId || ''}
          onChange={(e) =>
            setFormData({ ...formData, gradeId: parseInt(e.target.value) || 0 })
          }
          placeholder="Enter Grade ID"
          required
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
