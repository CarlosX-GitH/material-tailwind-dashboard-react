
import {  UserPlusIcon } from "@heroicons/react/24/solid";
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
import {  CircleAlertIcon, CopyIcon,  SquarePen, TrashIcon, TriangleAlertIcon, X } from "lucide-react";
import React, { useState, useEffect } from 'react';


export function MessageDialogEmployee(employeeId) {
    const [employee, setEmployee] = useState([]);
    const [open, setOpen] = React.useState(false);
    const fetchOneEmployee = async (id) => {
        id = employeeId.employeeId
        const token = Cookies.get('token')
        const res = await fetch(`http://localhost:3001/api/employees/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'GET'
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setEmployee(data.data);
    }

    const handleOpen = async () => {
        setOpen(true);
        await fetchOneEmployee(employeeId);
    };
    return (
        <>
            <Tooltip content="More Info">
                <IconButton onClick={handleOpen} variant="text">
                    <CircleAlertIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} size="lg" handler={handleOpen}>
                {employee && (
                    <div>
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
                        <DialogBody >
                            <div className="grid grid-cols-4 gap-6 ">
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">ID:</Typography> {employee.ID}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">User assigned:</Typography> {employee.USER_ID}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Name:</Typography> {employee.NAME}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Lastname:</Typography> {employee.LASTNAME}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Department:</Typography> {`${employee.DEPARTMENT_ID}`}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Gender:</Typography> {employee.GENDER}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Manager:</Typography> {`${employee.IS_MANAGER}`}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Status:</Typography> {employee.STATUS}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Cedula:</Typography> {employee.CEDULA}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Bank account:</Typography> {employee.BANK_ACCOUNT}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Position:</Typography> {employee.POSITION}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">City:</Typography> {employee.CITY}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Address:</Typography> {employee.ADDRESS}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Phone number:</Typography> {employee.PHONE_NUMBER}</Typography>
                                <Typography color="gray" variant="lead"><Typography color="black" className="font-bold">Civil status:</Typography> {employee.CIVIL_STATUS}</Typography>
                            </div>
                        </DialogBody>

                        <DialogFooter className="space-x-2">
                            <Button variant="gradient" color="black" onClick={() => setOpen(false)}>
                                Exit
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </Dialog>
        </>
    )
}

export function AddDialogEmployee({onEmployeeUpdate}) {
    const [open, setOpen] = React.useState(false);
    const [department, setDepartmentData] = React.useState(null);
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [department_id, setDepartmentId] = useState('');
    const [gender, setGender] = useState('');
    const [is_manager, setManager] = useState('');
    const [status, setStatus] = useState('');
    const [cedula, setCedula] = useState('');
    const [bank_account, setBankAccount] = useState('');
    const [nationality, setNationality] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [position, setPosition] = useState('');
    const [civil_status, setCivilStatus] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchAlldata = async () => {
        const token = Cookies.get('token')
        const urls = ['http://localhost:3001/api/department'];
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        Promise.all(urls.map(url =>
            fetch(url, { headers }).then(response =>
                response.ok ? response.json() : Promise.reject(new Error('Failed to load'))
            )
        ))
            .then(([departmentResponse]) => { // Update the employee data state
                setDepartmentData(departmentResponse.data); // Update the department data state // Log the received data
            })
            .catch(error => console.error('Error:', error));
    }

    const handleOpen = async () => {
        await fetchAlldata();
        setOpen(true);
    };

    async function addEmployee(addData) {
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:3001/api/employees/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(addData),
        });
        if (!res.ok) {
            throw new Error('Failed to add employee');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const addData = {
                "name": `${name}`,
                "lastname": `${lastname}`,
                "department_id": `${department_id}`,
                "gender": `${gender}`,
                "is_manager": is_manager,
                "status": `${status}`,
                "cedula": `${cedula}`,
                "bank_account": `${bank_account}`,
                "nationality": `${nationality}`,
                "city": `${city}`,
                "address": `${address}`,
                "phone_number": `${phone_number}`,
                "position": `${position}`,
                "civil_status": `${civil_status}`,
                // Add other fields as needed
            };

            // Call the updateEmployee function with the employee ID and add data
            await addEmployee(addData);
            onEmployeeUpdate('Employee added to database successfully','info');
            // setOpen(false);
        } catch (error) {
            setError(error.message);
            onEmployeeUpdate(error, 'error');
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };
    return (
        <>
            <Tooltip content="Add member">
                <Button className="flex items-center gap-3" onClick={handleOpen} size="sm">
                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
                </Button>
            </Tooltip>
            {department &&
                <Dialog open={open} size="lg" handler={handleOpen}>
                    <>
                        <div className="flex items-center justify-between ">
                            <DialogHeader className="flex flex-col items-start ">
                                <Typography className="mb-1 p-4" variant="h2" color="blue-gray" textGradient={true}>
                                    Add employee
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
                                    <div><Input required color="black" className="font-bold" label="Name" type="name" value={name} onChange={(value) => setName(value.target.value)} ></Input> </div>
                                    <div><Input required color="black" className="font-bold" label="Lastname" type="lastname" value={lastname} onChange={(value) => setLastname(value.target.value)} ></Input> </div>
                                    <div>
                                        <Select className="font-bold" label="Department" value={department_id} onChange={(value) => setDepartmentId(value)}>
                                            {department.map(({ ID, NAME }) => (
                                                <Option value={ID}>
                                                    {`${NAME} (${ID})`}
                                                </Option>
                                            )
                                            )}
                                        </Select>
                                    </div>
                                    <div>
                                        <Select className="font-bold" label="Gender" type="gender" value={gender} onChange={(value) => setGender(value)}>
                                            <Option value="MALE">MALE</Option>
                                            <Option value="FEMALE">FEMALE</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select className="font-bold" label="Status" type="status" value={status} onChange={(value) => setStatus(value)}>
                                            <Option value="CURRENT">Current</Option>
                                            <Option value="DISMISSED">Dismissed</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select className="font-bold" label="Manager" type="is_manager" value={is_manager} onChange={(value) => setManager(value)}>
                                            <Option value="true">Yes</Option>
                                            <Option value="false">No</Option>
                                        </Select>
                                    </div>

                                    <div><Input required color="black" className="font-bold" label="Cedula" type="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input required color="black" className="font-bold" label="Bank account" type="bank_account" value={bank_account} onChange={(e) => setBankAccount(e.target.value)} /></div>
                                    <div><Input required color="black" className="font-bold" label="Nationality" type="nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} /></div>
                                    <div><Input required color="black" className="font-bold" label="City" type="city" value={city} onChange={(e) => setCity(e.target.value)} /></div>
                                    <div><Input required color="black" className="font-bold" label="Address" type="address" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                                    <div><Input required color="black" className="font-bold" label="Phone Number" type="phone_number" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
                                    <div><Input color="black" className="font-bold" label="Civil Status" type="civil_status" value={civil_status} onChange={(e) => setCivilStatus(e.target.value)} /></div>
                                    <div><Input required color="black" className="font-bold" label="Position" type="positiion" value={position} onChange={(e) => setPosition(e.target.value)} /></div>
                                    <div></div>
                                    <div className="grid grid-cols-2 space-x-4 pb-4">
                                        <Button fullWidth className="flex flex-col justify-end" variant="gradient" type="submit" color="green" disabled={loading}>
                                            {loading ? 'Updating...' : `Add`}
                                        </Button>
                                        <Button className="flex flex-col justify-end" variant="gradient" color="red" onClick={() => setOpen(false)}>
                                            close
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogBody>
                    </>
                </Dialog >
            }
        </>
    )
}


export function EditDialogEmployee({employeeId, onEmployeeUpdate}) {

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
            setUserId(employee.USER_ID || '');
        }
    }, [employee]);

    const fetchAlldata = async (id) => {
        id = employeeId
        const token = Cookies.get('token')
        const urls = [`http://localhost:3001/api/employees/${id}`, 'http://localhost:3001/api/department', 'http://localhost:3001/api/user'];
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
        const id = employeeId
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
                name: `${name}`,
                lastname: `${lastname}`,
                department_id: `${department_id}`,
                gender: `${gender}`,
                is_manage: is_manager,
                satus: `${status}`,
                cedula: `${cedula}`,
                bank_account: `${bank_account}`,
                nationality: `${nationality}`,
                city: `${city}`,
                address: `${address}`,
                phone_number: `${phone_number}`,
                position: `${position}`,
                civil_status: `${civil_status}`,
                user_id: `${user_id}`
                // Add other fields as needed
            };

            // Call the updateEmployee function with the employee ID and updated data
            await updateEmployee(employeeId, updatedData);
            // setOpen(false);
           onEmployeeUpdate('Employee updated successfully!', 'success');
        } catch (error) {
            setError(error.message);
            onEmployeeUpdate(error, 'error');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };
    return (
        <>
            <Tooltip content="Edit User">
                <IconButton onClick={handleOpen} variant="text">
                <SquarePen className="h-4 w-4" />
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
                                    <div><Input variant="static" color="black" className="font-bold" label="Name" onChange={(value) => setName(value.target.value)} defaultValue={employee.NAME}></Input> </div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Lastname" onChange={(value) => setLastname(value.target.value)} defaultValue={employee.LASTNAME}></Input> </div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Bank account" placeholder={employee.BANK_ACCOUNT} type="employee.BANK_ACCOUNT" defaultValue={employee.BANK_ACCOUNT} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Cedula" placeholder={employee.CEDULA} type="employee.CEDULA" defaultValue={employee.CEDULA} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div>
                                        <Select variant="static" className="font-bold" label="Department" value={employee?.Department.ID || department_id} onChange={(value) => setDepartmentId(value)}>
                                            {department && department.map(({ ID, NAME }, index) => (
                                                <Option key={index} value={ID}>
                                                    {NAME}
                                                </Option>
                                            )
                                            )}
                                        </Select>
                                    </div>
                                    <div>
                                        <Select variant="static" className="font-bold" label="User Assigned" value={employee?.USER_ID || user_id} onChange={(value) => setUserId(value)}>
                                            {user && user.map(({ ID, NAME }, index) => (
                                                <Option key={index} value={ID}>
                                                    {NAME}
                                                </Option>
                                            )
                                            )}
                                        </Select>
                                    </div>
                                    <div>
                                        <Select variant="static" className="font-bold" label="Gender" value={employee.GENDER} onChange={(value) => setGender(value)}>
                                            <Option value="MALE">MALE</Option>
                                            <Option value="FEMALE">FEMALE</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select variant="static" className="font-bold" label="Status" value={employee.STATUS} onChange={(value) => setStatus(value)}>
                                            <Option value="CURRENT">Current</Option>
                                            <Option value="DISMISSED">Dismissed</Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select variant="static" required className="font-bold" label="Manager" value={employee?.IS_MANAGER.toString() || is_manager} onChange={(value) => setManager(value)}>
                                            <Option value="true">Yes</Option>
                                            <Option value="false">No</Option>
                                        </Select>
                                    </div>

                                    <div><Input variant="static" color="black" className="font-bold" label="Nationality" placeholder={employee.NATIONALITY} type="employee.NATIONALITY" defaultValue={employee.NATIONALITY} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input variant="static" color="black" className="font-bold" label="City" placeholder={employee.CITY} type="employee.CITY" defaultValue={employee.CITY} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Address" placeholder={employee.ADDRESS} type="employee.ADDRESS" defaultValue={employee.ADDRESS} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Phone Number" placeholder={employee.PHONE_NUMBER} type="employee.PHONE_NUMBER" defaultValue={employee.PHONE_NUMBER} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Civil Status" placeholder={employee.CIVIL_STATUS} type="employee.CIVIL_STATUS" defaultValue={employee.CIVIL_STATUS} onChange={(e) => setCedula(e.target.value)} /></div>
                                    <div><Input variant="static" color="black" className="font-bold" label="Position" placeholder={employee.POSITION} type="employee.POSITION" defaultValue={employee.POSITION} onChange={(e) => setCedula(e.target.value)} /></div>

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
export function DeleteDialogEmployee({employeeId, onEmployeeUpdate}) {
    const [loading, setLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = React.useState(false);
    const id = employeeId

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
            onEmployeeUpdate('Employee deleted from database successfully');
        } catch (error) {
            console.log(error)
            setError(error.message);
            onEmployeeUpdate(error, 'error');
        } finally {
            setLoading(false);
            setOpen(false);
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
                    <TriangleAlertIcon color="#E94441" size={256} />
                </DialogBody>
                <DialogFooter className="grid grid-cols-2 space-x-5">
                <Button className="flex items-center gap-12" onClick={handleOpen} color="red" size="md">
                    <X strokeWidth={3} className="h-4 w-4" /> Cancel
                </Button>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit" className="flex items-center gap-12 " size="md" fullWidth variant="filled" disabled={loading}>
                        <CircleAlertIcon strokeWidth={3} className="h-4 w-4" />{loading ? 'Deleting...' : 'Ok, Got it'}
                        </Button>
                    </form>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export function CopyID(id) {
    const [tooltipContent, setTooltipContent] = useState('');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id.id)
            .then(() => {
                setTooltipContent('ID copied correctly!');
                setTimeout(() => setTooltipContent(`Copy ID (${id.id})`), 2000);
            })
            .catch(err => {
                setTooltipContent('Could not copy id: ');
                setTimeout(() => setTooltipContent(`Copy ID (${id.id})`), 2000);
            });
    };

    return (
        <>
            <Tooltip content={tooltipContent || `Copy ID (${id.id})`}>
                <IconButton onClick={copyToClipboard} variant="text">
                    <CopyIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
        </>
    )
}