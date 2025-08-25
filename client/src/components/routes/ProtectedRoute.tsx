import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  //  console.log("ProtectedRoute check:", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
