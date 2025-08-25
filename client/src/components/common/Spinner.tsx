import { useSpinnerStore } from "@/stores/spinnerStore";

export const Spinner = () => {
  const { isLoading } = useSpinnerStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/20 z-[9999] pointer-events-none">
      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin shadow-lg"></div>

      {/* Optional Loading Text */}
      <span className="mt-4 text-white font-medium text-sm select-none pointer-events-none">
        Loading...
      </span>
    </div>
  );
};
