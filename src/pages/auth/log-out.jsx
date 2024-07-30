import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Tooltip } from '@material-tailwind/react';
import { LogOutIcon } from 'lucide-react';


export function LogOut() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        // Perform any logout logic, such as clearing cookies or tokens
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('employeeId');
        Cookies.remove('userRole');

        // Navigate to the sign-in page
        navigate("/auth/sign-in");
    };
    
    return (
        <Tooltip content="Log out" className="bg-red-400">
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 px-4  normal-case"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-5 w-5 text-blue-gray-500" />
        </Button>
      </Tooltip>
    );
}
