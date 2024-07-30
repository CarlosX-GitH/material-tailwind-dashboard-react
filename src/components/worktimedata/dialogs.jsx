import { PencilIcon, ShareIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Typography,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { CircleAlertIcon, CopyIcon, FileWarning, TrashIcon, TriangleAlertIcon } from "lucide-react";
import React, { useState, useEffect } from 'react';


export function EditDialogWorkTimeData(worktimeId) {
    const [open, setOpen] = React.useState(false);
    const [employee, setEmployeeData] = React.useState(null);
    const [user, setUserData] = React.useState(null);
    const [department, setDepartmentData] = React.useState(null);
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [department_id, setDepartmentId] = useState('');
    const [user_id, setUserId] = useState('');
    const [gender, setGender] = useState('');
    const [is_manager, setManager] = useState('');
    const [status, setStatus] = useState('');
    const [cedula, setCedula] = useState('');
    const [bank_account, setBankAccount] = useState('');
    const [nationality, setNacionality] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [position, setPosition] = useState('');
    const [civil_status, setCivilStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (employee) {
            setName(employee.NAME || '');
            setLastname(employee.LASTNAME || '');
            setDepartmentId(employee.DEPARTMENT_ID || '');
            setGender(employee.GENDER || '');
            setManager(employee.IS_MANAGER || '');
            setStatus(employee.STATUS || '');
            setCedula(employee.CEDULA || '');
            setBankAccount(employee.BANK_ACCOUNT || '');
            setNacionality(employee.NATIONALITY || '');
            setCity(employee.CITY || '');
            setAddress(employee.ADDRESS || '');
            setPhoneNumber(employee.PHONE_NUMBER || '');
            setPosition(employee.POSITION || '');
            setCivilStatus(employee.CIVIL_STATUS || '');
            setCivilStatus(employee.USER_ID || '');
        }
    }, [employee]);

    const fetchAlldata = async (id) => {
        id = employeeId.employeeId
        const token = Cookies.get('token')
        const urls = [`http://localhost:3001/api/employees/${id}`, 'http://localhost:3001/api/worktimedata'];
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        Promise.all(urls.map(url =>
            fetch(url, { headers }).then(response =>
                response.ok ? response.json() : Promise.reject(new Error('Failed to load'))
            )
        ))
            .then(([employeeResponse, departmentResponse, userResponse]) => {
                setEmployeeData(employeeResponse.data); // Update the employee data state
                setDepartmentData(departmentResponse.data);
                setUserData(userResponse.data);// Update the department data state // Log the received data
                // Update the department data state // Log the received data
            })
            .catch(error => console.error('Error:', error));
    }

    const handleOpen = async () => {
        setOpen(true);
        await fetchAlldata(employeeId);
    };

    async function updateEmployee(employeeId, updatedData) {
        const id = employeeId.employeeId
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:3001/api/employees/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) {
            throw new Error('Failed to update employee');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const updatedData = {
                NAME: `${name}`,
                LASTNAME: `${lastname}`,
                DEPARTMENT_ID: `${department_id}`,
                GENDER: `${gender}`,
                IS_MANAGER: is_manager,
                STATUS: `${status}`,
                CEDULA: `${cedula}`,
                BANK_ACCOUNT: `${bank_account}`,
                NATIONALITY: `${nationality}`,
                CITY: `${city}`,
                ADDRESS: `${address}`,
                PHONE_NUMBER: `${phone_number}`,
                POSITION: `${position}`,
                CIVIL_STATUS: `${civil_status}`,
                USER_ID: `${user_id}`
                // Add other fields as needed
            };

            // Call the updateEmployee function with the employee ID and updated data
            await updateEmployee(employeeId, updatedData);
            // setOpen(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Tooltip content="Edit User">
                <IconButton onClick={handleOpen} variant="text">
                    <PencilIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} size="lg" handler={handleOpen}>
                {employee && (
                    <>
                        <div className="flex items-center justify-between ">
                            <DialogHeader className="flex flex-col items-start ">
                                <Typography className="mb-1 p-4" variant="h4" color="blue-gray" textGradient={true}>
                                    {`${employee.NAME} ${employee.LASTNAME}`}
                                </Typography>
                            </DialogHeader>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mr-3 h-5 w-10 cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <DialogBody>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-4 gap-6 ">
                                    <div><Input color="black" className="font-bold" label="Name" onChange={(value) => setName(value.target.value)} defaultValue={employee.NAME}></Input> </div>
                                    <div><Input color="black" className="font-bold" label="Lastname" onChange={(value) => setLastname(value.target.value)} defaultValue={employee.LASTNAME}></Input> </div>
                                    <div><Input color="black" className="font-bold" label="Bank account" placeholder={employee.BANK_ACCOUNT} type="employee.BANK_ACCOUNT" defaultValue={employee.BANK_ACCOUNT} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="Cedula" placeholder={employee.CEDULA} type="employee.CEDULA" defaultValue={employee.CEDULA} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div>
                                        <Select className="font-bold" label="Department" value={employee?.Department.ID || department_id} onChange={(value) => setDepartmentId(value)}>
                                            {department && department.map(({ ID, NAME }, index) => (
                                                <Option key={index} value={ID}>
                                                    {NAME}
                                                </Option>
                                            )
                                            )}
                                        </Select>
                                    </div>
                                    <div>
                                        <Select className="font-bold" label="User Assigned" value={employee?.USER_ID || user_id} onChange={(value) => setUserId(value)}>
                                            {user && user.map(({ ID, NAME }, index) => (
                                                <Option key={index} value={ID}>
                                                    {NAME}
                                                </Option>
                                            )
                                            )}
                                        </Select>
                                    </div>
                                    <div>
                                        <Select className="font-bold" label="Gender" value={employee.GENDER} onChange={(value) => setGender(value)}>
                                            <Option value="MALE">MALE</Option>
                                            <Option value="FEMALE">FEMALE</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select className="font-bold" label="Status" value={employee.STATUS} onChange={(value) => setStatus(value)}>
                                            <Option value="CURRENT">Current</Option>
                                            <Option value="DISMISSED">Dismissed</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select requiredclassName="font-bold" label="Manager" value={employee?.IS_MANAGER.toString() || is_manager} onChange={(value) => setManager(value)}>
                                            <Option value="true">Yes</Option>
                                            <Option value="false">No</Option>
                                        </Select>
                                    </div>

                                    <div><Input color="black" className="font-bold" label="Nationality" placeholder={employee.NATIONALITY} type="employee.NATIONALITY" defaultValue={employee.NATIONALITY} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="City" placeholder={employee.CITY} type="employee.CITY" defaultValue={employee.CITY} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="Address" placeholder={employee.ADDRESS} type="employee.ADDRESS" defaultValue={employee.ADDRESS} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="Phone Number" placeholder={employee.PHONE_NUMBER} type="employee.PHONE_NUMBER" defaultValue={employee.PHONE_NUMBER} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="Civil Status" placeholder={employee.CIVIL_STATUS} type="employee.CIVIL_STATUS" defaultValue={employee.CIVIL_STATUS} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="Position" placeholder={employee.POSITION} type="employee.POSITION" defaultValue={employee.POSITION} onChange={(e) => setCedula(e.target.value)} /></div>

                                    <Button className="" variant="gradient" type="submit" color="gray" disabled={loading}>
                                        {loading ? 'Updating...' : 'Continue'}
                                    </Button>
                                </div>
                            </form>
                        </DialogBody>

                        <DialogFooter className="space-x-2">
                            <Button variant="filled" color="red" onClick={() => setOpen(false)}>
                                Exit
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </Dialog>
        </>
    )
}

export function DeleteDialog(employeeId) {
    const [loading, setLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = React.useState(false);
    const id = employeeId.employeeId

    const handleOpen = () => setOpen(!open);

    async function deleteEmployee(id) {
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:3001/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error('Failed to delete employee');
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await deleteEmployee(id);
            // setOpen(false);
        } catch (error) {
            console.log(error)
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip content="Delete">
                <IconButton onClick={handleOpen} variant="text">
                    <TrashIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog size="xs" open={open} handler={handleOpen}>
                <DialogHeader className="grid justify-center">
                    <Typography variant="h4" color="blue-gray" textGradient>
                        Are you sure you want to delete this registry?
                    </Typography>
                </DialogHeader>
                <DialogBody className="grid place-items-center gap-4">
                    <TriangleAlertIcon size={256} />
                </DialogBody>
                <DialogFooter className="grid grid-cols-2 space-x-5">
                    <Button className="flex flex-col justify-start" fullWidth variant="gradient" color="red" onClick={handleOpen}>
                        close
                    </Button>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit" className="flex flex-col justify-end " fullWidth variant="gradient" disabled={loading}>
                            {loading ? 'Deleting...' : 'Ok, Got it'}
                        </Button>
                    </form>
                </DialogFooter>
            </Dialog>
        </>
    );
}
