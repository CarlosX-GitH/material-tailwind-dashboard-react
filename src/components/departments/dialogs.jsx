import { Notifications } from "@/pages/dashboard";
import { CheckBadgeIcon, PencilIcon, ShareIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
    Option,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Textarea
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { CircleAlertIcon, CopyIcon, Square, SquarePen, TrashIcon, TriangleAlertIcon, X } from "lucide-react";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function MessageDialogDepartment(departmentId) {
    const [department, setDepartment] = useState([]);
    const [open, setOpen] = React.useState(false);
    const fetchOneDepartment = async (id) => {
        id = departmentId.departmentId
        const token = Cookies.get('token')
        const res = await fetch(`http://localhost:3001/api/department/${id}`, {
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
        setDepartment(data.data);
    }

    const handleOpen = async () => {
        setOpen(true);
        await fetchOneDepartment(departmentId);
    };
    return (
        <>
            <Tooltip content="More Info">
                <IconButton onClick={handleOpen} variant="text">

                    <CircleAlertIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} size="xs" className="bg-transparent shadow-none ml-20" handler={handleOpen}>
                {department && (
                    <Card>
                        <div className="flex items-center justify-between">
                            <CardHeader color="gray" className="">
                                <Typography className="mb-0 p-4" variant="h4" color="white">
                                    {`${department.NAME} Department`}
                                </Typography>
                            </CardHeader>
                            <X
                                color="black"
                                className="mr-3 mt-5 h-5 w-10 cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                            </X>
                        </div>
                        <CardBody className=" divide-y divide-gray-300">
                            <Typography variant="h3" color="gray">Information</Typography>
                            <div className="grid grid-cols-2 justify-between divide-x divide-gray-300">
                                <Typography variant="lead" color="gray" className="flex ml-4 font-normal justify-start">Department ID</Typography>
                                <Typography variant="lead" color="black" className="flex font-normal justify-center">{department.ID}</Typography>
                            </div>
                            <div className="grid grid-cols-2 justify-between divide-x divide-gray-300">
                                <Typography variant="lead" color="gray" className="flex p-4 font-normal">Description</Typography>
                                <Typography variant="paragraph" color="black" className="flex p-4 justify-center">{department.DESCRIPTION}</Typography>
                            </div>
                            <div className="grid grid-cols-2 justify-between divide-x divide-gray-300">
                                <Typography variant="lead" color="gray" className="flex ml-4 font-normal justify-start">Status</Typography>
                                <Typography variant="lead" color="black" className="flex font-normal justify-center">{department.STATUS}</Typography>
                            </div>
                        </CardBody>

                        <DialogFooter>
                            <Button variant="gradient" color="black" onClick={() => setOpen(false)}>
                                Exit
                            </Button>
                        </DialogFooter>
                    </Card>
                )}
            </Dialog>
        </>
    )
}

export function AddDialogDepartment({ onDepartmentUpdate }) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpen = async () => {
        setOpen(true);
    };

    async function addDepartment(addData) {
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:3001/api/department/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(addData),
        });
        if (!res.ok) {
            throw new Error('Failed to add department');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const addData = {
                name: `${name}`,
                description: `${description}`,
                status: `${status}`,
            };

            // Call the updateDepartment function with the department ID and add data
            await addDepartment(addData);
            onDepartmentUpdate('Department added to database successfully', 'success');
            // setOpen(false);
        } catch (error) {
            setError(error.message);
            onDepartmentUpdate(error, 'error');
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };
    return (
        <>
            <Tooltip content="Add department">
                <Button className="flex items-center gap-3" onClick={handleOpen} size="sm">
                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add department
                </Button>
            </Tooltip>
            <Dialog open={open} size="sm" handler={handleOpen}>
                <>
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center justify-between ">
                            <CardHeader color="gray" className="flex flex-col items-start ">
                                <Typography className="mb-1 p-4" variant="h4" color="white">
                                    Add / Department
                                </Typography>
                            </CardHeader>
                            <X
                                className="mr-3 h-5 w-10 cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                            </X>
                        </div>
                        <CardBody>
                            <div className="flex flex-col gap-6 ">
                                <div>
                                    <Typography className="font-normal text-gray-800" >
                                        Name
                                    </Typography>
                                    <Input
                                        required
                                        name="name"
                                        variant="outlined"
                                        color="gray"
                                        onChange={(value) => setName(value.target.value)}
                                        value={name}
                                        className="text-gray-800 !border-[1.5px] !border-gray-400 !border-t-gray-400 focus:!border-gray-800 focus:!border-t-gray-800"
                                        labelProps={{ className: "hidden" }}
                                    />
                                </div>
                                <div>
                                    <Typography className="font-normal text-gray-800" >
                                        Description
                                    </Typography>
                                    <Textarea
                                        rows={7}
                                        name="description"
                                        variant="outlined"
                                        color="gray"
                                        value={description}
                                        onChange={(value) => setDescription(value.target.value)}
                                        className="text-gray-800 !border-[1.5px] !border-gray-400 !border-t-gray-400 focus:!border-gray-800 focus:!border-t-gray-800"
                                        labelProps={{ className: "hidden" }}
                                    />
                                </div>
                                <div>
                                    <Typography className="font-normal text-gray-800">
                                        Status
                                    </Typography>
                                    <Select
                                        required
                                        name="status"
                                        variant="outlined"
                                        value={status ? status : "CURRENT"}
                                        onChange={(value) => setStatus(value)}
                                        className="text-gray-800 !border-[1.5px] !border-gray-400 !border-t-gray-400 focus:!border-gray-800 focus:!border-t-gray-800"
                                        labelProps={{ className: "hidden" }}
                                    >
                                        <Option value="CURRENT">Current</Option>
                                        <Option value="TERMINATED">Terminated</Option>
                                    </Select>
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <div className="grid grid-cols-2 space-x-4 pb-4">
                                <Button fullWidth className="flex flex-col justify-end" variant="gradient" type="submit" color="gray" disabled={loading}>
                                    {loading ? 'Adding...' : `Add`}
                                </Button>
                                <Button className="flex flex-col justify-end" variant="gradient" color="red" onClick={() => setOpen(false)}>
                                    close
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </>
            </Dialog >
        </>
    )
}


export function EditDialogDepartment({ departmentId, onDepartmentUpdate }) {

    const [open, setOpen] = React.useState(false);
    const [department, setDepartmentData] = React.useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (department) {
            setName(department.NAME || '');
            setDescription(department.DESCRIPTION || '');
            setStatus(department.STATUS || '');
        }
    }, [department]);

    const fetchAlldata = async (id) => {
        id = departmentId
        const token = Cookies.get('token')
        const urls = [`http://localhost:3001/api/department/${id}`];
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        Promise.all(urls.map(url =>
            fetch(url, { headers }).then(response =>
                response.ok ? response.json() : Promise.reject(new Error('Failed to load'))
            )
        ))
            .then(([departmentResponse]) => {
                setDepartmentData(departmentResponse.data);
            })
            .catch(error => console.error('Error:', error));
    }

    const handleOpen = async () => {
        setOpen(true);
        await fetchAlldata(departmentId);
    };

    async function updateDepartment(departmentId, updatedData) {
        const id = departmentId
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:3001/api/department/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) {
            throw new Error('Failed to update department');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const updatedData = {
                "name": `${name}`,
                "description": `${description}`,
                "status": `${status}`
            };

            // Call the updateDepartment function with the department ID and updated data
            await updateDepartment(departmentId, updatedData);
            // setOpen(false);
            onDepartmentUpdate('Department updated successfully!', 'success');
        } catch (error) {
            setError(error.message);
            onDepartmentUpdate(error, 'error');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };
    return (
        <>
            <Tooltip content="Edit Department">
                <IconButton onClick={handleOpen} variant="text">
                    <SquarePen className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} size="sm" handler={handleOpen}>
                {department && (
                    <>
                        <div className="flex items-center justify-between">
                            <CardHeader color="gray">
                                    <Typography className="w-50 p-4" variant="h4" color="white">
                                        {`Editing / ${department.NAME}`}
                                    </Typography>
                            </CardHeader>
                            <X
                                color="black"
                                className="mr-3 h-5 w-10 cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                            </X>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <CardBody>
                                <div className="grid grid-cols-1 gap-6 ">
                                    <div>
                                        <Typography className="font-normal text-gray-800" >
                                            Name
                                        </Typography>
                                        <Input
                                            name="name"
                                            variant="outlined"
                                            color="gray"
                                            onChange={(value) => setName(value.target.value)}
                                            defaultValue={department.NAME}
                                            className="text-gray-800 !border-[1.5px] !border-gray-400 !border-t-gray-400 focus:!border-gray-800 focus:!border-t-gray-800"
                                            labelProps={{ className: "hidden" }}
                                        />
                                    </div>
                                    <div>
                                        <Typography className="font-normal text-gray-800">
                                            Description
                                        </Typography>
                                        <Textarea
                                            name="description"
                                            rows={7}
                                            onChange={(value) => setDescription(value.target.value)}
                                            defaultValue={department.DESCRIPTION}
                                            className="text-gray-800 !border-[1.5px] !border-gray-400 !border-t-gray-400 focus:!border-gray-800 focus:!border-t-gray-800"
                                            labelProps={{ className: "hidden" }}
                                        />
                                    </div>
                                    <div>
                                        <Typography className="font-normal text-gray-800">
                                            Description
                                        </Typography>
                                        <Select
                                            name="status"
                                            variant="outlined"
                                            value={department.STATUS}
                                            onChange={(value) => setStatus(value)}
                                            className="text-gray-800 !border-[1.5px] !border-gray-400 !border-t-gray-400 focus:!border-gray-800 focus:!border-t-gray-800"
                                            labelProps={{ className: "hidden" }}
                                        >
                                            <Option value="CURRENT">Current</Option>
                                            <Option value="TERMINATED">Terminated</Option>
                                        </Select>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter className="flex space-x-2 justify-end">
                                <Button variant="filled" color="red" onClick={() => setOpen(false)}>
                                    Exit
                                </Button>
                                <Button variant="gradient" type="submit" color="gray" disabled={loading}>
                                    {loading ? 'Updating...' : 'Continue'}
                                </Button>
                            </CardFooter>
                        </form>
                    </>
                )}
            </Dialog>
        </>
    )
}
export function DeleteDialogDepartment({ departmentId, onDepartmentUpdate }) {
    const [loading, setLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = React.useState(false);
    const id = departmentId

    const handleOpen = () => setOpen(!open);

    async function deleteDepartment(id) {
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:3001/api/department/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error('Failed to delete department');
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await deleteDepartment(id);

            onDepartmentUpdate('Department deleted from database successfully', 'success');
        } catch (error) {
            console.log(error)
            setError(error.message);
            onDepartmentUpdate(error, 'error');
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
                    <Typography variant="h4" className="p-4 font-normal" color="black" >
                        Are you sure you want to delete this registry?
                    </Typography>
                </DialogHeader>
                <DialogBody className="grid place-items-center gap-4">
                    <TriangleAlertIcon color="#E94441" size={256} />
                </DialogBody>
                <CardFooter className="grid grid-cols-2 space-x-5">
                    <Button className="flex" onClick={handleOpen} color="red" size="md">
                        <X strokeWidth={3} className="h-4 w-4" /> <p className="text-center ml-16">Cancel</p>
                    </Button>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit" className="flex" size="md" fullWidth variant="filled" disabled={loading}>
                            <CircleAlertIcon strokeWidth={3} className="h-4 w-4 mr-16" />{loading ? 'Deleting...' : 'Continue'}
                        </Button>
                    </form>
                </CardFooter>
            </Dialog>
        </>
    );
}