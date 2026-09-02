import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';

type StudentUpdateFormProps = {
  onCancel: () => void;
};

export function StudentUpdateForm({ onCancel }: StudentUpdateFormProps) {
  return (
    <form>
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>
            First Name
            <Input className="firstName" placeholder="Mohammad" />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Last Name
            <Input className="lastName" placeholder="Arrata" />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Email
            <Input className="email" placeholder="mohammadarrata@gmail.com" />
            <FieldDescription>
              The primary email used for academic notifications.
            </FieldDescription>
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>Phone Number</FieldLabel>
          <FieldDescription>
            Include country code if appilcable.
          </FieldDescription>
          <Input type="tel" name="phoneNumber" placeholder="+963 954 220 986" />
        </Field>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
