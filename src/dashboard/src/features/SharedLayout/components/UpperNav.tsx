import { Button } from '../../../components/ui/button';
import { ButtonGroup } from '../../../components/ui/button-group';

export default function UpperNav() {
  return (
    <ButtonGroup className="p-4 mr-5 mt-7">
      <ButtonGroup>
        <Button className="text-3xl p-5 " variant="outline">
          First Name
        </Button>
        <Button className="text-3xl p-5 " variant="outline">
          Second Name
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button className="text-3xl p-5  " variant="outline">
          Number
        </Button>
        <Button className="text-3xl p-5 " variant="outline">
          Email
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
