import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: 'admin' | 'client';
}

export const ProtectedRoute = ({ children, requireAuth }: ProtectedRouteProps) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.type !== requireAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
