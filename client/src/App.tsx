// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "@/components/layout/AppLayout";
import AppRoutes from "@/routes/AppRoutes";

const queryClient = new QueryClient();

// In App.tsx, add more debug logs:
console.log("All env vars:", import.meta.env);
console.log("VITE_BASE_API_URL:", import.meta.env.VITE_BASE_API_URL);
console.log("NODE_ENV:", import.meta.env.NODE_ENV);
// ---------------- App ----------------
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
              <ToastContainer position="bottom-right" autoClose={3000} />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
