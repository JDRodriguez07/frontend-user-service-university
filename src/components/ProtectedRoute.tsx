import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type NormalizedRole = 'ADMIN' | 'STUDENT' | 'TEACHER';
type AllowedRole = NormalizedRole | `ROLE_${NormalizedRole}`;

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
}

const normalizeRole = (role?: AllowedRole): NormalizedRole | undefined => {
  if (!role) return undefined;
  return role.startsWith('ROLE_')
    ? (role.replace('ROLE_', '') as NormalizedRole)
    : role;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const normalizedUserRole = normalizeRole(user?.role as AllowedRole | undefined);
  const normalizedAllowedRoles = allowedRoles?.map((role) => normalizeRole(role));

  if (normalizedAllowedRoles && normalizedUserRole && !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
