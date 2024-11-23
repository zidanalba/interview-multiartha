import { Alert } from "@material-tailwind/react";

function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AlertCustomStyles({ message, type }) {
  const typeStyles = {
    success: "border-green-500 bg-green-500/10 text-green-500",
    error: "border-red-500 bg-red-500/10 text-red-500",
    info: "border-blue-500 bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <Alert icon={<Icon />} className={`rounded-none border-l-4 ${typeStyles[type]} font-medium`}>
        {message}
      </Alert>
    </div>
  );
}
