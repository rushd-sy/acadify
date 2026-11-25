import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useActionState, useEffect, useRef, useState } from 'react';
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
import { curriculumService } from '@/services/curriculum.service';
import type { CurriculumDto } from 'dtos';
import { useFocusFirstError } from '@/hooks/use-focus-first-error';
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
  onUpdateSuccess?: (updatedExam: ExamDto) => void;
  onCreateSuccess?: (createdExam: ExamDto) => void;
};

type ExamFormData = {
  title: string;
  date: Date;
  documentUrl?: string | null;
  curriculumId?: number | null;
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
    const rawCurriculumId = getOptionalNumber(formData, 'curriculumId');
    const curriculumId = rawCurriculumId !== undefined ? rawCurriculumId : null;
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
        onUpdateSuccess?.(updatedExam);
      } else {
        const createdExam = await examService.createExam({
          ...payload,
          documentUrl: payload.documentUrl ?? undefined,
          curriculumId: payload.curriculumId ?? undefined,
        });
        onCreateSuccess?.(createdExam);
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

  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state.fieldErrors);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Mathematics - Midterm Exam"
            defaultValue={state.values?.title ?? exam?.title}
            aria-invalid={!!state.fieldErrors.title}
          />
          <FieldError>{state.fieldErrors.title}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={formatDateForInput(state.values?.date ?? exam?.date)}
            aria-invalid={!!state.fieldErrors.date}
          />
          <FieldError>{state.fieldErrors.date}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="curriculumId">Curriculum</FieldLabel>
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
            <SelectTrigger
              id="curriculumId"
              className="w-full"
              aria-invalid={!!state.fieldErrors.curriculumId}
            >
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
          <FieldError>{state.fieldErrors.curriculumId}</FieldError>
          {curriculumError && <FieldError>{curriculumError}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="documentUrl">Document URL</FieldLabel>
          <Input
            id="documentUrl"
            name="documentUrl"
            placeholder="https://example.com/exam.pdf"
            defaultValue={state.values?.documentUrl ?? exam?.documentUrl}
            aria-invalid={!!state.fieldErrors.documentUrl}
          />
          <FieldError>{state.fieldErrors.documentUrl}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="minScore">Min Score</FieldLabel>
          <Input
            id="minScore"
            name="minScore"
            type="number"
            placeholder="e.g. 20"
            defaultValue={state.values?.minScore ?? exam?.minScore}
            aria-invalid={!!state.fieldErrors.minScore}
          />
          <FieldError>{state.fieldErrors.minScore}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="maxScore">Max Score</FieldLabel>
          <Input
            id="maxScore"
            name="maxScore"
            type="number"
            placeholder="e.g. 100"
            defaultValue={state.values?.maxScore ?? exam?.maxScore}
            aria-invalid={!!state.fieldErrors.maxScore}
          />
          <FieldError>{state.fieldErrors.maxScore}</FieldError>
        </Field>

        {state.formError && <FieldError>{state.formError}</FieldError>}
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
