import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import type { StudentDetailsDto } from 'dtos';
import { studentService } from '@/services/student.service';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from '../ui/spinner';

type StudentFormProps = {
  onCancel: () => void;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
  onCreateSuccess: (createdStudent: StudentDetailsDto) => void;
};

const studentFormFields = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'password',
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StudentForm({
  onCancel,
  student,
  onUpdateSuccess,
  onCreateSuccess,
}: StudentFormProps) {
  const [studentData, setStudentData] = useState({
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    email: student?.email ?? '',
    phoneNumber: student?.phoneNumber ?? '',
    password: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateStudentForm = (data: typeof studentData) => {
    const errors: Record<string, string> = {};
    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!data.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(data.email)) {
      errors.email = 'Email must be a valid email address.';
    }
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    }
    if (!student && !data.password.trim()) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const handleFormError = (error: unknown, fallbackMessage: string) => {
    setIsSubmitting(false);

    const validationErrors = getApiValidationErrors(error, studentFormFields);

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
        setFieldErrors({});

        const validationErrors = validateStudentForm(studentData);

        if (Object.keys(validationErrors).length > 0) {
          setFieldErrors(validationErrors);
          return;
        }
        setIsSubmitting(true);

        if (student) {
          studentService
            .updateStudentById(student.userId, studentData)
            .then((updatedStudent) => {
              setIsSubmitting(false);
              onUpdateSuccess(updatedStudent);
              onCancel();
            })
            .catch((error) => {
              console.error('Failed to update student:', error);

              handleFormError(
                error,
                'Failed to update student. Please try again later.',
              );
            });

          return;
        }

        studentService
          .createStudent({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            phoneNumber: studentData.phoneNumber,
            hashedPassword: studentData.password,
          })
          .then((createdStudent) => {
            setIsSubmitting(false);
            onCreateSuccess(createdStudent);
            onCancel();
          })
          .catch((error) => {
            console.error('Failed to create student:', error);

            handleFormError(
              error,
              'Failed to create student. Please try again later.',
            );
          });
      }}
    >
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input
            className="firstName"
            placeholder="Mohammad"
            value={studentData.firstName}
            onChange={(data) =>
              setStudentData({ ...studentData, firstName: data.target.value })
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
            placeholder="Arrata"
            value={studentData.lastName}
            onChange={(data) =>
              setStudentData({ ...studentData, lastName: data.target.value })
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
            placeholder="mohammadarrata@gmail.com"
            value={studentData.email}
            onChange={(data) =>
              setStudentData({ ...studentData, email: data.target.value })
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
            placeholder="+963 954 220 986"
            value={studentData.phoneNumber}
            onChange={(data) =>
              setStudentData({ ...studentData, phoneNumber: data.target.value })
            }
          />
          {fieldErrors.phoneNumber && (
            <p className="text-sm text-red-600">{fieldErrors.phoneNumber}</p>
          )}
        </Field>

        {!student && (
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter password"
              value={studentData.password}
              onChange={(data) =>
                setStudentData({
                  ...studentData,
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
