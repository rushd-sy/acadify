import { useActionState, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
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
import { useFocusFirstError } from '@/hooks/use-focus-first-error';
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
    let ignore = false;

    gradeService
      .getAllGrades()
      .then((data) => {
        if (!ignore) {
          setGrades(data);
          setGradesLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch grades:', error);
        if (!ignore) {
          setGradeFetchError('Failed to load grades. Please try again.');
          setGradesLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
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
    if (!Number.isInteger(data.gradeId) || data.gradeId <= 0) {
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

  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state.fieldErrors);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Section Name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Section A"
            defaultValue={state.values?.name ?? section?.name}
            aria-invalid={!!state.fieldErrors.name}
          />
          <FieldError>{state.fieldErrors.name}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="academicYear">Academic Year</FieldLabel>
          <Input
            id="academicYear"
            name="academicYear"
            placeholder="e.g. 2026/2027"
            defaultValue={state.values?.academicYear ?? section?.academicYear}
            aria-invalid={!!state.fieldErrors.academicYear}
          />
          <FieldError>{state.fieldErrors.academicYear}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="gradeId">Grade</FieldLabel>
          {gradesLoading && section?.gradeId != null && (
            <input type="hidden" name="gradeId" value={section.gradeId} />
          )}
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
            <SelectTrigger
              id="gradeId"
              className="w-full"
              aria-invalid={!!state.fieldErrors.gradeId}
              disabled={gradesLoading}
            >
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
          <FieldError>{state.fieldErrors.gradeId}</FieldError>
          {gradeFetchError && <FieldError>{gradeFetchError}</FieldError>}
        </Field>

        {state.formError && <FieldError>{state.formError}</FieldError>}
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

        <Button type="submit" disabled={isPending || gradesLoading}>
          {isPending ? <Spinner className="text-black" /> : 'Submit'}
        </Button>
      </DialogFooter>
    </form>
  );
}
