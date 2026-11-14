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
import { getFormString, getOptionalNumber } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';
import { DialogFooter } from '../ui/dialog';
import { formatDateForInput } from '@/utils/date.util';
import { isValidUrl } from '@/utils/url.util';
import { useEffect, useState } from 'react';
import { curriculumService } from '@/services/curriculum.service';
import type { CurriculumDto } from 'dtos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type ExamFormProps = {
  onCancel: () => void;
  exam?: ExamDto;
  onUpdateSuccess: (updatedExam: ExamDto) => void;
  onCreateSuccess: (createdExam: ExamDto) => void;
};

type ExamFormData = {
  title: string;
  date: Date;
  documentUrl?: string | null;
  curriculumId?: number;
  minScore: number;
  maxScore: number;
};

const examFormFields = [
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

const validateScoreRange = (min: number, max: number): ScoreRangeErrors => {
  const errors: ScoreRangeErrors = {};

  if (!Number.isFinite(min)) {
    errors.minScore = 'Min score is required';
  } else if (min < 0) {
    errors.minScore = 'Min score cannot be negative';
  }

  if (!Number.isFinite(max)) {
    errors.maxScore = 'Max score is required';
  } else if (max <= 0) {
    errors.maxScore = 'Max score must be bigger than 0';
  }

  if (Number.isFinite(min) && Number.isFinite(max) && min >= max) {
    errors.minScore = 'Min score must be less than max score';
  }

  return errors;
};

const validateExamForm = (data: ExamFormData) => {
  const errors: Record<string, string> = {};
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!Number.isFinite(data.date.getTime())) {
    errors.date = 'Date is required';
  }
  if (data.documentUrl && !isValidUrl(data.documentUrl)) {
    errors.documentUrl = 'Please enter a valid URL';
  }
  const scoreErrors = validateScoreRange(data.minScore, data.maxScore);
  Object.assign(errors, scoreErrors);

  return errors;
};

export function ExamForm({
  onCancel,
  exam,
  onUpdateSuccess,
  onCreateSuccess,
}: ExamFormProps) {
  const [curriculums, setCurriculums] = useState<CurriculumDto[]>([]);
  const [curriculumError, setCurriculumError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchCurriculums = async () => {
      try {
        const data = await curriculumService.getAllCurriculums();

        if (isMounted) {
          setCurriculums(data);
        }
      } catch (error) {
        console.error('Failed to fetch curriculums:', error);

        if (isMounted) {
          setCurriculumError('Failed to load curriculums.');
        }
      }
    };

    fetchCurriculums();

    return () => {
      isMounted = false;
    };
  }, []);

  const examAction = async (
    _prevState: ExamFormState,
    formData: FormData,
  ): Promise<ExamFormState> => {
    const curriculumId = getOptionalNumber(formData, 'curriculumId');
    const documentUrlValue = getFormString(formData, 'documentUrl').trim();
    const documentUrl = documentUrlValue ? documentUrlValue : null;
    const dateValue = getFormString(formData, 'date').trim();
    const date = new Date(dateValue);

    const maxScoreValue = getFormString(formData, 'maxScore').trim();
    const maxScore = maxScoreValue ? Number(maxScoreValue) : NaN;

    const minScoreValue = getFormString(formData, 'minScore').trim();
    const minScore = minScoreValue ? Number(minScoreValue) : NaN;

    const examData = {
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

    const action = exam ? 'update' : 'create';

    try {
      const payload = {
        ...examData,
        date: examData.date.toISOString(),
      };

      if (exam) {
        const updatedExam = await examService.updateExamById(exam.id, payload);
        onUpdateSuccess(updatedExam);
      } else {
        const createdExam = await examService.createExam({
          ...payload,
          documentUrl: payload.documentUrl ?? undefined,
        });
        onCreateSuccess(createdExam);
      }

      onCancel();
      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error(`Failed to ${action} exam:`, error);
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
          `Failed to ${action} exam. Please try again later.`,
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
            defaultValue={formatDateForInput(state.values?.date ?? exam?.date)}
          />
          {state.fieldErrors.date && (
            <p className="text-sm text-red-600">{state.fieldErrors.date}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Curriculum</FieldLabel>
          <Select
            name="curriculumId"
            defaultValue={
              state.values?.curriculumId != null
                ? String(state.values.curriculumId)
                : exam?.curriculumId != null
                  ? String(exam.curriculumId)
                  : ''
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select curriculum" />
            </SelectTrigger>

            <SelectContent>
              {curriculums.map((curriculum) => (
                <SelectItem key={curriculum.id} value={String(curriculum.id)}>
                  {curriculum.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {curriculumError && (
            <p className="text-sm text-destructive">{curriculumError}</p>
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
