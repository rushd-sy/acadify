import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { teacherService } from '@/services/teacher.service';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from './ui/spinner';

type TeacherFormProps = {
  onCancel: () => void;
  teacher?: TeacherDetailsDto;
  onUpdateSuccess: (updatedTeacher: TeacherDetailsDto) => void;
  onCreateSuccess: (createdTeacher: TeacherDto) => void;
};

const teacherFormFields = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'password',
  'degree',
];

export function TeacherForm({
  onCancel,
  teacher,
  onUpdateSuccess,
  onCreateSuccess,
}: TeacherFormProps) {
  const [teacherData, setTeacherData] = useState({
    firstName: teacher?.firstName ?? '',
    lastName: teacher?.lastName ?? '',
    email: teacher?.email ?? '',
    phoneNumber: teacher?.phoneNumber ?? '',
    degree: teacher?.degree ?? '',
    password: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFormError = (error: unknown, fallbackMessage: string) => {
    setIsSubmitting(false);

    const validationErrors = getApiValidationErrors(error, teacherFormFields);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
    } else {
      const message = getApiErrorMessage(error);
      setFormError(message ?? fallbackMessage);
    }
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        setFormError(null);
        setIsSubmitting(true);
        setFieldErrors({});

        if (teacher) {
          teacherService
            .updateTeacherById(teacher.userId, teacherData)
            .then((updatedTeacher) => {
              setIsSubmitting(false);
              onUpdateSuccess(updatedTeacher);
              onCancel();
            })
            .catch((error) => {
              console.log('Failed to update teacher:', error);
              handleFormError(
                error,
                'Failed to update teacher. Please try again later.',
              );
            });

          return;
        }

        teacherService
          .createTeacher({
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            email: teacherData.email,
            phoneNumber: teacherData.phoneNumber,
            hashedPassword: teacherData.password,
            degree: teacherData.degree,
          })
          .then((createdTeacher) => {
            setIsSubmitting(false);
            onCreateSuccess(createdTeacher);
            onCancel();
          })
          .catch((error) => {
            console.log('Failed to create teacher:', error);
            handleFormError(
              error,
              'Failed to create teacher. Please try again later.',
            );
          });
      }}
    >
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input
            className="firstName"
            placeholder="Adel"
            value={teacherData.firstName}
            onChange={(data) =>
              setTeacherData({ ...teacherData, firstName: data.target.value })
            }
          />
          {fieldErrors.firstName && (
            <p className="text-sm text-red-600">{fieldErrors.firstName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input
            className="lastName"
            placeholder="Obaji"
            value={teacherData.lastName}
            onChange={(data) =>
              setTeacherData({ ...teacherData, lastName: data.target.value })
            }
          />
          {fieldErrors.lastName && (
            <p className="text-sm text-red-600">{fieldErrors.lastName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>
            The primary email used for academic notifications.
          </FieldDescription>
          <Input
            className="email"
            placeholder="adelobaji@gmail.com"
            value={teacherData.email}
            onChange={(data) =>
              setTeacherData({ ...teacherData, email: data.target.value })
            }
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-600">{fieldErrors.email}</p>
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
            value={teacherData.phoneNumber}
            onChange={(data) =>
              setTeacherData({ ...teacherData, phoneNumber: data.target.value })
            }
          />
          {fieldErrors.phoneNumber && (
            <p className="text-sm text-red-600">{fieldErrors.phoneNumber}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Degree</FieldLabel>
          <FieldDescription>
            The degree or qualification of the teacher.
          </FieldDescription>
          <Input
            className="degree"
            placeholder="Bachelor's in Computer Science"
            value={teacherData.degree}
            onChange={(data) =>
              setTeacherData({ ...teacherData, degree: data.target.value })
            }
          />
          {fieldErrors.degree && (
            <p className="text-sm text-red-600">{fieldErrors.degree}</p>
          )}
        </Field>

        {!teacher && (
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter password"
              value={teacherData.password}
              onChange={(data) =>
                setTeacherData({
                  ...teacherData,
                  password: data.target.value,
                })
              }
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </Field>
        )}

        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="text-white" /> : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
