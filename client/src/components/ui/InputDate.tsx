import * as React from "react";
import { cn } from "@/lib/utils";

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputDate = React.forwardRef<HTMLInputElement, InputDateProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <input
          type="date"
          ref={ref}
          className={cn(
            // 🔹 base styles
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10",
            "text-base md:text-sm text-foreground ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",

            // 🔹 tell browser to respect dark/light system colors
            "[color-scheme:light] dark:[color-scheme:dark]",

            // 🔹 calendar icon positioning
            "bg-no-repeat bg-[center_right_0.75rem] bg-[length:1.25rem_1.25rem]",

            // 🔹 light mode calendar icon (black)
            "[background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='hsl(0,0%25,0%25)' viewBox='0 0 24 24'%3E%3Cpath d='M7 11h5v5H7zm-2 8h14V7H5zm0-16h2V2h2v1h6V2h2v1h2c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z'/%3E%3C/svg%3E\")]",

            // 🔹 dark mode calendar icon (white)
            "dark:[background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='hsl(0,0%25,100%25)' viewBox='0 0 24 24'%3E%3Cpath d='M7 11h5v5H7zm-2 8h14V7H5zm0-16h2V2h2v1h6V2h2v1h2c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z'/%3E%3C/svg%3E\")]",

            // 🔹 hide native WebKit icon (keep area clickable)
            "[&::-webkit-calendar-picker-indicator]:opacity-0",

            className
          )}
          {...props}
        />
      </div>
    );
  }
);

InputDate.displayName = "InputDate";
export { InputDate };
