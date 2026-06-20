import { Button } from '../components/ui/button';
import { ButtonGroup } from '../components/ui/button-group';
export default function UpperNav() {
  return (
    <>
      <ButtonGroup className="p-4 ml-10 mt-7">
        <ButtonGroup>
          <Button className="text-3xl p-5">First Name</Button>
          <Button className="text-3xl p-5">Second Name</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button className="text-3xl p-5">Number</Button>
          <Button className="text-3xl p-5">Email</Button>
        </ButtonGroup>
      </ButtonGroup>
    </>
  );
}
