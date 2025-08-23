import { Navigate, Outlet } from 'react-router-dom';
import { useVisitorStore } from '@/store/visitorStore';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const { isAuthenticated } = useVisitorStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}