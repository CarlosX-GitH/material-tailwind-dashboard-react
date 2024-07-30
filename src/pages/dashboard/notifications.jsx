import React from "react";
import {
  Typography,
  Alert
} from "@material-tailwind/react";
export function Notifications({ message, icon, color}) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className=" flex flex-col gap-8 p-4 absolute z-50 top-0 ml-96">
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
        icon={icon}
        color={color}
      >
        <Typography variant="h5">
          {message}
        </Typography>
      </Alert>
    </div>
  );
}