// src/components/ui/FullPageSpinner.tsx
import React from "react";
import { useSpinnerStore } from "@/stores/spinnerStore";

export const FullPageSpinner: React.FC = () => {
  const loading = useSpinnerStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};
