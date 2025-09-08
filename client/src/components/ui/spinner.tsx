// components/ui/Spinner.tsx
import React from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullscreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  message,
  fullscreen = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4", // ⚡ fixed: `border-3` isn’t valid in Tailwind
    lg: "w-12 h-12 border-4",
  };

  const spinnerElement = (
    <div
      className={cn(
        "rounded-full border-indigo-500 border-t-transparent animate-spin",
        sizeClasses[size]
      )}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
        <div className="p-3 bg-indigo-600 rounded-full mb-4">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        {spinnerElement}
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">Visitor Management System</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {spinnerElement}
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
};

export default Spinner;
