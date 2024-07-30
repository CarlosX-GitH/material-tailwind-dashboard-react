import { AlertWithList } from "@/components/alerts";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { OctagonAlert } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { JWT_ReadData } from "./jwtdecode";
let token;
let userName;
let employeeId;

export function Assistence() {
  const currentDateTime = new Date();
  userName = Cookies.get('username')
  employeeId = Cookies.get('employeeId')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLogged(false)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Failed to login');
      } else {
        setLogged(true)
      }

      const data = await response.json();
      token = data.token

    } catch (error) {
      setError('Failed to login')
    } finally {
      JWT_ReadData(token),
        Cookies.set('token', token, { expires: 7, secure: true })
      setLoading(false)
    }
  }
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Assistence</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">{`${currentDateTime.toLocaleString('default', { weekday: 'long', })} ${currentDateTime.toLocaleString('default', { day: '2-digit', })} of ${currentDateTime.toLocaleString('default', { month: 'long' })}  |  ${currentDateTime.toLocaleTimeString()}`}</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 ">
            <Typography variant="h3" color="blue-gray" className="mb-5 font-medium">
              Hello! {userName}
            </Typography>
            <Input
              size="lg"
              type="employeeId"
              value={employeeId}
              placeholder="EMPLOYEE ID..."
              className="flex flex-col !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>
          <Button color="green" className="mt-6" fullWidth type="submit" disabled={loading}>
            {loading ? 'Registering asistence...' : 'Register assistence'}
          </Button>
          {error && <div className="flex w-full flex-col gap-2 pt-4">
            <Alert variant="gradient" color="red" icon={<OctagonAlert />}>
              <Typography className="font-medium">
                {error}
              </Typography>
              <ul className="mt-2 ml-2 list-inside list-disc">
                <p><b>Check</b></p>
                <li>Your user and password are correct</li>
                <li>Try again</li>
              </ul>
            </Alert>
          </div>}
          {logged && <div className="flex w-full flex-col gap-2 pt-4">
            <Alert variant="gradient" color="green" icon={<OctagonAlert />}>
              <Typography className="font-medium">
                Logged in successfully!
              </Typography>
              <ul className="mt-2 ml-2 list-inside list-disc">
                <p>
                  <Typography>
                    Click here to <Link color="black" className="font-bold" to={'../../dashboard/home'}>redirect</Link>
                  </Typography>
                </p>
              </ul>
            </Alert>
          </div>}
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default Assistence;
