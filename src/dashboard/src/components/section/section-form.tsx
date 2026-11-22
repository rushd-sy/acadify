import { useActionState, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Spinner } from '@/components/ui/spinner';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { sectionService } from '@/services/section.service';
import { gradeService } from '@/services/grade.service';
import type { GradeDto, SectionDto } from 'dtos';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';
import { DialogFooter } from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type SectionFormProps = {
  onCancel: () => void;
  onUpdateSuccess: (updateSection: SectionDto) => void;
  onCreateSuccess: (createSection: SectionDto) => void;
  section?: SectionDto;
};

type SectionFormData = {
  name: string;
  academicYear: string;
  gradeId: number;
};

const sectionFormFields = ['name', 'academicYear', 'gradeId'];

type SectionFormState = FormState<SectionFormData>;

const initialFormState = createInitialFormState<SectionFormData>();

const ACADEMIC_YEAR_PATTERN = /^(\d{4})\/(\d{4})$/;

const validateAcademicYear = (value: string) => {
  if (!value) return 'Academic year is required.';

  const match = value.match(ACADEMIC_YEAR_PATTERN);
  if (!match)
    return 'Academic year must be in the format YYYY/YYYY (e.g. 2026/2027).';

  const [, start, end] = match.map(Number);
  if (end !== start + 1)
    return 'The second year must be one year after the first year.';

  return null;
};

export function SectionForm({
  onCancel,
  onUpdateSuccess,
  onCreateSuccess,
  section,
}: SectionFormProps) {
  const [grades, setGrades] = useState<GradeDto[]>([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradeFetchError, setGradeFetchError] = useState<string | null>(null);

  useEffect(() => {
    gradeService
      .getAllGrades()
      .then((data) => {
        setGrades(data);
        setGradesLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch grades:', error);
        setGradeFetchError('Failed to load grades. Please try again.');
        setGradesLoading(false);
      });
  }, []);

  const validateSectionForm = (data: SectionFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) {
      errors.name = 'Section name is required.';
    }
    const academicYearError = validateAcademicYear(data.academicYear.trim());
    if (academicYearError) {
      errors.academicYear = academicYearError;
    }
    if (!data.gradeId || !Number.isInteger(data.gradeId) || data.gradeId <= 0) {
      errors.gradeId = 'Grade is required.';
    }
    return errors;
  };
  const sectionAction = async (
    _prevState: SectionFormState,
    formData: FormData,
  ): Promise<SectionFormState> => {
    const gradeIdValue = getFormString(formData, 'gradeId').trim();
    const gradeId = Number(gradeIdValue);

    const sectionData = {
      name: getFormString(formData, 'name'),
      academicYear: getFormString(formData, 'academicYear'),
      gradeId,
    };

    const validationErrors = validateSectionForm(sectionData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: sectionData,
      };
    }

    try {
      if (section) {
        const updatedSection = await sectionService.updateSection(
          section.id,
          sectionData,
        );

        onUpdateSuccess(updatedSection);
      } else {
        const createdSection = await sectionService.createSection(sectionData);

        onCreateSuccess(createdSection);
      }
      onCancel();

      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error('Failed to save section:', error);
      const apiFieldErrors = getApiValidationErrors(error, sectionFormFields);
      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: sectionData,
        };
      }
      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${section ? 'update' : 'create'} section. Please try again later.`,
        values: sectionData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    sectionAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Section Name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Section A"
            defaultValue={state.values?.name ?? section?.name}
          />
          {state.fieldErrors.name && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.name}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="academicYear">Academic Year</FieldLabel>
          <Input
            id="academicYear"
            name="academicYear"
            placeholder="e.g. 2026/2027"
            defaultValue={state.values?.academicYear ?? section?.academicYear}
          />
          {state.fieldErrors.academicYear && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.academicYear}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="gradeId">Grade</FieldLabel>
          <Select
            name="gradeId"
            defaultValue={
              state.values?.gradeId != null &&
              !Number.isNaN(state.values.gradeId)
                ? String(state.values.gradeId)
                : section?.gradeId != null
                  ? String(section.gradeId)
                  : ''
            }
          >
            <SelectTrigger id="gradeId" className="w-full">
              <SelectValue
                placeholder={
                  gradesLoading ? 'Loading grades...' : 'Select grade'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={String(grade.id)}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.fieldErrors.gradeId && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.gradeId}
            </p>
          )}
          {gradeFetchError && (
            <p className="text-xs text-destructive leading-tight">
              {gradeFetchError}
            </p>
          )}
        </Field>

        {state.formError && (
          <p className="text-xs text-red-600 leading-tight">
            {state.formError}
          </p>
        )}
      </FieldGroup>

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner className="text-black" /> : 'Submit'}
        </Button>
      </DialogFooter>
    </form>
  );
}
