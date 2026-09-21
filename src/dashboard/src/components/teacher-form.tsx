import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { teacherService } from '@/services/teacher.service';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';

type TeacherFormProps = {
  onCancel: () => void;
  teacher?: TeacherDetailsDto;
  onUpdateSuccess: (updatedTeacher: TeacherDetailsDto) => void;
  onCreateSuccess: (createdTeacher: TeacherDto) => void;
};

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
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        setFormError(null);
        setIsSubmitting(true);

        if (teacher) {
          teacherService
            .updateTeacherById(teacher.userId, teacherData)
            .then((updatedTeacher) => {
              setIsSubmitting(false);
              onUpdateSuccess(updatedTeacher);
              onCancel();
            })
            .catch((error) => {
              setIsSubmitting(false);
              console.log('Failed to update teacher:', error);

              if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message;

                if (Array.isArray(message)) {
                  setFormError(message.join(', '));
                  return;
                }

                if (typeof message === 'string') {
                  setFormError(message);
                  return;
                }
              }

              setFormError('Failed to update teacher. Please try again later.');
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
            setIsSubmitting(false);
            console.log('Failed to create teacher:', error);

            if (axios.isAxiosError(error)) {
              const message = error.response?.data?.message;

              if (Array.isArray(message)) {
                setFormError(message.join(', '));
                return;
              }

              if (typeof message === 'string') {
                setFormError(message);
                return;
              }
            }

            setFormError('Failed to create teacher. Please try again later.');
          });
      }}
    >
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>
            First Name
            <Input
              className="firstName"
              placeholder="Adel"
              value={teacherData.firstName}
              onChange={(data) =>
                setTeacherData({ ...teacherData, firstName: data.target.value })
              }
            />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Last Name
            <Input
              className="lastName"
              placeholder="Obaji"
              value={teacherData.lastName}
              onChange={(data) =>
                setTeacherData({ ...teacherData, lastName: data.target.value })
              }
            />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Email
            <Input
              className="email"
              placeholder="adelobaji@gmail.com"
              value={teacherData.email}
              onChange={(data) =>
                setTeacherData({ ...teacherData, email: data.target.value })
              }
            />
            <FieldDescription>
              The primary email used for academic notifications.
            </FieldDescription>
          </FieldLabel>
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
        </Field>

        <Field>
          <FieldLabel>
            Degree
            <Input
              className="degree"
              placeholder="Bachelor's in Computer Science"
              value={teacherData.degree}
              onChange={(data) =>
                setTeacherData({ ...teacherData, degree: data.target.value })
              }
            />
            <FieldDescription>
              The degree or qualification of the teacher.
            </FieldDescription>
          </FieldLabel>
        </Field>

        {!teacher && (
          <Field>
            <FieldLabel>
              Password
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
            </FieldLabel>
          </Field>
        )}

        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
