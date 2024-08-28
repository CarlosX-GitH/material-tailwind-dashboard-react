import {
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Profile, Notifications, Employees, Departments } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import { Assistence } from "./pages/auth/assistence";
import { Layers3, UserCircle } from "lucide-react";

const icon = {
  className: "w-5 h-5 text-inherit",
};


export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <UserCircle {...icon} />,
        name: "employees",
        path: "/employees",
        element: <Employees />,
      },
      {
        icon: <Layers3 {...icon} />,
        name: "departments",
        path: "/departments",
        element: <Departments/>,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "assistence",
        path: "/assistence",
        element: <Assistence />,
      },
    ],
  },
];

export default routes;
