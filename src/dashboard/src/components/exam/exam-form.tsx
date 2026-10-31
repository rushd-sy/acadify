import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useActionState } from 'react';
import { examService } from '@/services/exam.service';
import type { ExamDto } from 'dtos';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from '../ui/spinner';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';
import { DialogFooter } from '../ui/dialog';

type ExamFormProps = {
  onCancel: () => void;
  onCreateSuccess: (createExam: ExamDto) => void;
  exam?: ExamDto;
};

type ExamFormData = {
  examTemplateId?: number;
  title: string;
  date: Date;
  documentUrl?: string;
  curriculumId?: number;
  minScore: number;
  maxScore: number;
};

const examFormFields = [
  'examTemplateId',
  'title',
  'date',
  'documentUrl',
  'curriculumId',
  'minScore',
  'maxScore',
];

type ExamFormState = FormState<ExamFormData>;

const initialFormState = createInitialFormState<ExamFormData>();

type ScoreRangeErrors = {
  minScore?: string;
  maxScore?: string;
};

const formatDate = (date?: Date) => {
  if (!date || !Number.isFinite(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const validateScoreRange = (min: number, max: number): ScoreRangeErrors => {
  const errors: ScoreRangeErrors = {};

  if (!Number.isFinite(min)) {
    errors.minScore = 'Min score must be a valid number';
  } else if (min <= 0) {
    errors.minScore = 'Min score must be bigger than 0';
  }

  if (!Number.isFinite(max)) {
    errors.maxScore = 'Max score must be a valid number';
  } else if (max <= 0) {
    errors.maxScore = 'Max score must be bigger than 0';
  }

  if (Number.isFinite(min) && Number.isFinite(max) && min >= max) {
    errors.minScore = 'Min score cannot be greater than max score';
  }

  return errors;
};

export function ExamForm({ onCancel, onCreateSuccess, exam }: ExamFormProps) {
  const validateExamForm = (data: ExamFormData) => {
    const errors: Record<string, string> = {};
    if (!data.title.trim()) {
      errors.title = 'Title is required';
    }
    if (isNaN(data.date.getTime())) {
      errors.date = 'Date is required';
    }
    if (data.documentUrl && !isValidUrl(data.documentUrl)) {
      errors.documentUrl = 'Please enter a valid URL';
    }
    const scoreErrors = validateScoreRange(data.minScore, data.maxScore);
    Object.assign(errors, scoreErrors);

    return errors;
  };
  const examAction = async (
    _prevState: ExamFormState,
    formData: FormData,
  ): Promise<ExamFormState> => {
    const examTemplateIdValue = getFormString(
      formData,
      'examTemplateId',
    ).trim();
    const examTemplateId = examTemplateIdValue
      ? Number(examTemplateIdValue)
      : undefined;

    const curriculumIdValue = getFormString(formData, 'curriculumId').trim();
    const curriculumId = curriculumIdValue
      ? Number(curriculumIdValue)
      : undefined;

    const documentUrlValue = getFormString(formData, 'documentUrl').trim();

    const documentUrl = documentUrlValue ? documentUrlValue : undefined;

    const dateValue = getFormString(formData, 'date').trim();
    const date = new Date(dateValue);

    const maxScoreValue = getFormString(formData, 'maxScore').trim();
    const maxScore = Number(maxScoreValue);

    const minScoreValue = getFormString(formData, 'minScore').trim();
    const minScore = Number(minScoreValue);

    const examData = {
      examTemplateId,
      title: getFormString(formData, 'title').trim(),
      date,
      curriculumId,
      documentUrl,
      minScore,
      maxScore,
    };

    const validationErrors = validateExamForm(examData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: examData,
      };
    }

    try {
      if (exam) {
        // Update Exam
      } else {
        const createExam = await examService.createExam({
          ...examData,
          date: examData.date.toISOString(),
        });
        onCreateSuccess(createExam);
      }
      onCancel();
      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error('Failed to save exam:', error);
      const apiFieldErrors = getApiValidationErrors(error, examFormFields);
      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: examData,
        };
      }
      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to create exam. Please try again later.`,
        values: examData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    examAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Exam Template Id</FieldLabel>
          <Input
            name="examTemplateId"
            type="number"
            defaultValue={state.values?.examTemplateId ?? exam?.examTemplateId}
          />
          {state.fieldErrors.examTemplateId && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.examTemplateId}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            name="title"
            type="text"
            placeholder="e.g. Mathematics - Midterm Exam"
            defaultValue={state.values?.title ?? exam?.title}
          />
          {state.fieldErrors.title && (
            <p className="text-sm text-red-600">{state.fieldErrors.title}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Date</FieldLabel>
          <Input
            name="date"
            type="date"
            defaultValue={formatDate(state.values?.date ?? exam?.date)}
          />
          {state.fieldErrors.date && (
            <p className="text-sm text-red-600">{state.fieldErrors.date}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Curriculum Id</FieldLabel>
          <Input
            name="curriculumId"
            type="number"
            defaultValue={state.values?.curriculumId ?? exam?.curriculumId}
          />
          {state.fieldErrors.curriculumId && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.curriculumId}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Document URL</FieldLabel>
          <Input
            name="documentUrl"
            placeholder="https://example.com/exam.pdf"
            defaultValue={state.values?.documentUrl ?? exam?.documentUrl}
          />
          {state.fieldErrors.documentUrl && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.documentUrl}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Min Score</FieldLabel>
          <Input
            name="minScore"
            type="number"
            placeholder="e.g. 20"
            defaultValue={state.values?.minScore ?? exam?.minScore}
          />
          {state.fieldErrors.minScore && (
            <p className="text-sm text-red-600">{state.fieldErrors.minScore}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Max Score</FieldLabel>
          <Input
            name="maxScore"
            type="number"
            placeholder="e.g. 100"
            defaultValue={state.values?.maxScore ?? exam?.maxScore}
          />
          {state.fieldErrors.maxScore && (
            <p className="text-sm text-red-600">{state.fieldErrors.maxScore}</p>
          )}
        </Field>

        {state.formError && (
          <p className="text-sm text-red-600">{state.formError}</p>
        )}
      </FieldGroup>

      <DialogFooter className="pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner className="text-black" /> : 'Submit'}
        </Button>
      </DialogFooter>
    </form>
  );
}
