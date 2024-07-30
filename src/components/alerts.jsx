import { Alert, Typography } from "@material-tailwind/react";
import { OctagonAlert } from "lucide-react";


export function AlertWithList() {
    return (
      <div className="flex w-full flex-col gap-2">
        <Alert variant="gradient" icon={<OctagonAlert />}>
          <Typography className="font-medium">
            Ensure that these requirements are met:
          </Typography>
          <ul className="mt-2 ml-2 list-inside list-disc">
            <li>At least 10 characters (and up to 100 characters)</li>
            <li>At least one lowercase character</li>
            <li>Inclusion of at least one special character, e.g., ! @ # ?</li>
          </ul>
        </Alert>
      </div>
    );
  }