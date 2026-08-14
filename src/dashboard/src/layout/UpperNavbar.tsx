import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ButtonGroup } from '../components/ui/button-group';
import { useAuth } from '../providers/auth.context';

export default function UpperNav() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <ButtonGroup className="p-4 ml-10 mt-7">
        <Button className="text-3xl p-5">Number</Button>
        <Button className="text-3xl p-5">Email</Button>
      </ButtonGroup>

      <Button className="text-3xl p-5" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}
