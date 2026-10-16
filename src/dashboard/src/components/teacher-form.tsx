import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { teacherService } from '@/services/teacher.service';
import { useActionState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from './ui/spinner';
import { emailRegex } from '@/lib/validation.util';

type TeacherFormProps = {
  onCancel: () => void;
  teacher?: TeacherDetailsDto;
  onUpdateSuccess: (updatedTeacher: TeacherDetailsDto) => void;
  onCreateSuccess: (createdTeacher: TeacherDto) => void;
};

type TeacherFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  degree: string;
  password: string;
};

type OptionalTeacherFormData = Partial<TeacherFormData>;

type TeacherUpdateFormData = Omit<TeacherFormData, 'password'>;

const getFormString = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === 'string' ? value : undefined;
};

const isTeacherCreateFormData = (
  data: OptionalTeacherFormData,
): data is TeacherFormData => {
  return (
    typeof data.firstName === 'string' &&
    typeof data.lastName === 'string' &&
    typeof data.email === 'string' &&
    typeof data.phoneNumber === 'string' &&
    typeof data.degree === 'string' &&
    typeof data.password === 'string'
  );
};

const isTeacherUpdateFormData = (
  data: OptionalTeacherFormData,
): data is TeacherUpdateFormData => {
  return (
    typeof data.firstName === 'string' &&
    typeof data.lastName === 'string' &&
    typeof data.email === 'string' &&
    typeof data.phoneNumber === 'string' &&
    typeof data.degree === 'string'
  );
};

type TeacherFormState = {
  success: boolean;
  fieldErrors: Record<string, string>;
  formError: string | null;
  values?: OptionalTeacherFormData;
};

const teacherFormFields = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'password',
  'degree',
];

const initialFormState: TeacherFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

export function TeacherForm({
  onCancel,
  teacher,
  onUpdateSuccess,
  onCreateSuccess,
}: TeacherFormProps) {
  const validateTeacherForm = (data: OptionalTeacherFormData) => {
    const errors = {} as Record<string, string>;
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!data.email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(data.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!data.phoneNumber?.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    }
    if (!data.degree?.trim()) {
      errors.degree = 'Degree is required.';
    }
    if (!teacher && !data.password?.trim()) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const teacherAction = async (
    _prevState: TeacherFormState,
    formData: FormData,
  ): Promise<TeacherFormState> => {
    const teacherData: OptionalTeacherFormData = {
      firstName: getFormString(formData, 'firstName'),
      lastName: getFormString(formData, 'lastName'),
      email: getFormString(formData, 'email'),
      phoneNumber: getFormString(formData, 'phoneNumber'),
      degree: getFormString(formData, 'degree'),
      password: getFormString(formData, 'password'),
    };

    const validationErrors = validateTeacherForm(teacherData);

    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: teacherData,
      };
    }

    try {
      if (teacher) {
        if (!isTeacherUpdateFormData(teacherData)) {
          return {
            success: false,
            fieldErrors: {},
            formError: 'Please fill in all required fields.',
            values: teacherData,
          };
        }

        const updatedTeacher = await teacherService.updateTeacherById(
          teacher.userId,
          {
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            email: teacherData.email,
            phoneNumber: teacherData.phoneNumber,
            degree: teacherData.degree,
          },
        );

        onUpdateSuccess(updatedTeacher);
      } else {
        if (!isTeacherCreateFormData(teacherData)) {
          return {
            success: false,
            fieldErrors: {},
            formError: 'Please fill in all required fields.',
            values: teacherData,
          };
        }

        const createdTeacher = await teacherService.createTeacher({
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          phoneNumber: teacherData.phoneNumber,
          degree: teacherData.degree,
          hashedPassword: teacherData.password,
        });

        onCreateSuccess(createdTeacher);
      }

      onCancel();

      return {
        success: true,
        fieldErrors: {},
        formError: null,
      };
    } catch (error: unknown) {
      console.error('Failed to save teacher:', error);

      const apiFieldErrors = getApiValidationErrors(error, teacherFormFields);

      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: teacherData,
        };
      }

      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${teacher ? 'update' : 'create'} teacher. Please try again later.`,
        values: teacherData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    teacherAction,
    initialFormState,
  );
  return (
    <form action={formAction}>
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input
            name="firstName"
            placeholder="Adel"
            defaultValue={state.values?.firstName ?? teacher?.firstName}
          />
          {state.fieldErrors.firstName && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.firstName}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input
            name="lastName"
            placeholder="Obaji"
            defaultValue={state.values?.lastName ?? teacher?.lastName}
          />
          {state.fieldErrors.lastName && (
            <p className="text-sm text-red-600">{state.fieldErrors.lastName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>
            The primary email used for academic notifications.
          </FieldDescription>
          <Input
            name="email"
            placeholder="adelobaji@gmail.com"
            defaultValue={state.values?.email ?? teacher?.email}
          />
          {state.fieldErrors.email && (
            <p className="text-sm text-red-600">{state.fieldErrors.email}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Phone Number</FieldLabel>
          <FieldDescription>
            Include country code if applicable.
          </FieldDescription>
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="+963 123 456 789"
            defaultValue={state.values?.phoneNumber ?? teacher?.phoneNumber}
          />
          {state.fieldErrors.phoneNumber && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.phoneNumber}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Degree</FieldLabel>
          <FieldDescription>
            The degree or qualification of the teacher.
          </FieldDescription>
          <Input
            name="degree"
            placeholder="Bachelor's in Computer Science"
            defaultValue={state.values?.degree ?? teacher?.degree}
          />
          {state.fieldErrors.degree && (
            <p className="text-sm text-red-600">{state.fieldErrors.degree}</p>
          )}
        </Field>

        {!teacher && (
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              defaultValue={state.values?.password ?? ''}
            />
            {state.fieldErrors.password && (
              <p className="text-sm text-red-600">
                {state.fieldErrors.password}
              </p>
            )}
          </Field>
        )}

        {state.formError && (
          <p className="text-sm text-red-600">{state.formError}</p>
        )}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner className="text-black" /> : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
