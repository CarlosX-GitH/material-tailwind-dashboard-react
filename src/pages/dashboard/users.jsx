import { Pagination } from "@/components/pagination";
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
    Spinner,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import { AddDialogDepartment, EditDialogDepartment, DeleteDialogDepartment, MessageDialogDepartment, CopyID } from "@/components";
import { CheckCircle, ChevronDown, ChevronUp, InfoIcon, OctagonXIcon, RefreshCcw, TriangleAlert } from "lucide-react";
import { Notifications } from ".";


export function Departments() {

    // TABS
    const TABS = [
        {
            label: "All",
            value: 0,
        },
        {
            label: "Current",
            value: 1,
        },
        {
            label: "Terminated",
            value: 2,
        },
    ];
    const TABLE_HEAD = ["Name", "Description", "STATUS",  ""];
    const [activeTab, setActiveTab] = useState(0);

    // ITEMS
    const [departments, setDepartments] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // SORTING
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSort = (column) => {
        const getNestedValue = (obj, path) => path.split('.').reduce((value, key) => value[key], obj);
        const sortedDepartments = [...departments].sort((a, b) => {
            const aValue = getNestedValue(a, column);
            const bValue = getNestedValue(b, column);
            if (aValue === undefined) return sortOrder === 'desc' ? 1 : -1;
            if (bValue === undefined) return sortOrder === 'desc' ? -1 : 1;
            if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
            if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
            return 0;
        });
        setSortColumn(column);
        setDepartments(sortedDepartments);
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    }

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = departments ? departments.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = departments ? Math.ceil(departments.length / itemsPerPage) : 0;


    // STATES
    const [loading, setLoading] = useState(false);
    const [maxretries, setMaxRetries] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        fetchDepartments();
    }, [searchQuery, activeTab]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeTab]);


    // FUNCTIONS
    const fetchWithTimeout = (url, options, timeout, retries) => {
        setMaxRetries(false)
        return new Promise((resolve, reject) => {
            const attemptFetch = (retryCount) => {
                const timer = setTimeout(() => {
                    if (retryCount > 0) {
                        attemptFetch(retryCount - 1);
                    } else {
                        setLoading(false);
                        setMaxRetries(true);
                        reject(new Error('Request timed out'));
                    }
                }, timeout);

                fetch(url, options)
                    .then(response => {
                        clearTimeout(timer);
                        if (!response.ok) {
                            reject(new Error('Network response was not ok'));
                        } else {
                            resolve(response);
                        }
                    })
                    .catch(err => {
                        clearTimeout(timer);
                        if (retryCount > 0) {
                            attemptFetch(retryCount - 1);
                        } else {
                            reject(err);
                        }
                    });
            };

            attemptFetch(retries);
        });
    };

    const fetchDepartments = async () => {
        setLoading(true);
        const token = Cookies.get('token')
        try {
            const res = await fetchWithTimeout('http://localhost:3001/api/department', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }, 10000, 3);
            if (!res.ok) {
                setLoading(false);
                throw new Error('Network response was not ok'); 
            }
            const data = await res.json();
            const filteredDepartments = data.data.filter(department => {
                const matchesSearchQuery = department.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    department.DESCRIPTION.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    department.ID.toString() === searchQuery;
                const matchesTab = (activeTab === 0) ||
                    (activeTab === 1 && department.STATUS === "CURRENT") ||
                    (activeTab === 2 && department.STATUS === "DISMISSED");
                return matchesSearchQuery && matchesTab;
            });
            setDepartments(filteredDepartments);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setTimeout(() => showMessage(error.message, 'error'), 1000);
        }
    }

    const getIconByMessageType = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle />;
            case 'error':
                return <OctagonXIcon />;
            case 'info':
                return <InfoIcon />;
            case 'warning':
                return <TriangleAlert />;
            default:
                return null;
        }
    };
    const getColorByMessageType = (type) => {
        switch (type) {
            case 'error':
                return 'red';
            case 'success':
                return 'green';
            case 'warning':
                return 'yellow';
            case 'info':
                return 'gray';
            default:
                return 'gray';
        }
    };

    // HANDLERS
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type)
        setShowAlert(true)
        setTimeout(() => setMessage(null), 15000);
    }
    const handleDepartmentUpdate = async (msg, type) => {
        showMessage(msg, type);
        await fetchDepartments();
    };


    return (
        <>
            {message && (
                <Notifications
                    open={showAlert}
                    className="z-50"
                    icon={getIconByMessageType(messageType)}
                    color={getColorByMessageType(messageType)}
                    message={message}
                />
            )}
            <Card className="h-full w-full mt-6">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Department list
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                See information about all departments
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <AddDialogDepartment onDepartmentUpdate={handleDepartmentUpdate} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <Tabs value={activeTab}>
                            <TabsHeader
                                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                                indicatorProps={{
                                    className:
                                        "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                                }}
                            >
                                {TABS.map(({ label, value }) => (
                                    <Tab
                                        key={value}
                                        value={value}
                                        onClick={() => setActiveTab(value) && fetchDepartments()}
                                        className={activeTab === value ? "text-gray-900" : ""}
                                    >
                                        {label}
                                    </Tab>
                                ))}
                            </TabsHeader>
                        </Tabs>
                        <div className="w-full md:w-72">
                            <Input
                                label="Search"
                                onChange={(e) => handleSearch(e.target.value)}
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-hidden px-0 relative">
                    {maxretries ?
                        <div className="flex justify-center">
                            <Tooltip content="Try again">
                                <Button className="flex items-center gap-3" variant="outlined" size="lg" onClick={fetchDepartments}>Retry <RefreshCcw strokeWidth={3} className="h-4 w-4" /></Button>
                            </Tooltip>
                        </div> :
                        loading ? <div className="flex justify-center items-center">
                            <Spinner className="h-24 w-24 " />
                            <Typography className="z-50 absolute select-none">Loading...</Typography>
                        </div>
                            :
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head, index) => (
                                            <>
                                                {TABLE_HEAD.length - 1 !== index ?
                                                    <th
                                                        key={index} onClick={() => handleSort(head.toUpperCase() === 'DEPARTMENT' ? 'Department.NAME' : head.toUpperCase())}
                                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                                    >
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                                        >
                                                            {head.toUpperCase()}{" "}
                                                            {sortColumn === (head.toUpperCase()) ? (
                                                                sortOrder === 'asc' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />
                                                            ) : (
                                                                <ChevronUpDownIcon className="h-4 w-4" />
                                                            )}

                                                        </Typography>
                                                    </th>
                                                    : <th className=" border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"> </th>
                                                }
                                            </>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* TAB 1 */}
                                    {activeTab === 0 && currentItems.map(
                                        ({ ID, NAME, DESCRIPTION, STATUS}, index) => {
                                            const isLast = index === currentItems.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            return (
                                                <tr key={ID}>
                                                    {/* Render table data */}
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal"
                                                                >
                                                                    {NAME}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {DESCRIPTION}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={STATUS}
                                                                color={STATUS === "CURRENT" ? "green" : "blue-gray"}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex justify-center">
                                                            <CopyID id={ID} />
                                                            <MessageDialogDepartment departmentId={ID} />
                                                            <EditDialogDepartment departmentId={ID} onDepartmentUpdate={handleDepartmentUpdate} />
                                                            <DeleteDialogDepartment departmentId={ID} onDepartmentUpdate={handleDepartmentUpdate} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}

                                    {/* TAB 2 */}
                                    {activeTab === 1 && currentItems
                                        .filter(({ STATUS }) => STATUS === "CURRENT")
                                        .map(({ ID, NAME, DESCRIPTION, STATUS }, index) => {
                                            const isLast = index === currentItems.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            return (
                                                <tr key={ID}>
                                                {/* Render table data */}
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {NAME}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {DESCRIPTION}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={STATUS}
                                                            color={STATUS === "CURRENT" ? "green" : "blue-gray"}
                                                        />
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex justify-center">
                                                        <CopyID id={ID} />
                                                        <MessageDialogDepartment departmentId={ID} />
                                                        <EditDialogDepartment departmentId={ID} onDepartmentUpdate={handleDepartmentUpdate} />
                                                        <DeleteDialogDepartment departmentId={ID} onDepartmentUpdate={handleDepartmentUpdate} />
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        },
                                        )}
                                    {/* TAB 3 */}
                                    {activeTab === 2 && currentItems
                                        .filter(({ STATUS }) => STATUS === "DISMISSED")
                                        .map(({ ID, NAME, DESCRIPTION, STATUS }, index) => {
                                            const isLast = index === currentItems.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            return (
                                                <tr key={ID}>
                                                {/* Render table data */}
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {NAME}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {DESCRIPTION}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={STATUS}
                                                            color={STATUS === "CURRENT" ? "green" : "blue-gray"}
                                                        />
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex justify-center">
                                                        <CopyID id={ID} />
                                                        <MessageDialogDepartment departmentId={ID} />
                                                        <EditDialogDepartment departmentId={ID} onDepartmentUpdate={handleDepartmentUpdate} />
                                                        <DeleteDialogDepartment departmentId={ID} onDepartmentUpdate={handleDepartmentUpdate} />
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        },
                                        )}
                                </tbody>
                            </table>
                    }
                </CardBody>
                {!loading && departments &&
                    <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
                        <Pagination
                            active={currentPage}
                            totalPages={totalPages}
                            onNext={handleNextPage}
                            onPrev={handlePreviousPage}
                        />
                    </CardFooter>
                }
            </Card>
        </>
    );
}


export default Departments