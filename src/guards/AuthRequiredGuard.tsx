import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * AuthRequiredGuard - Redirects unauthenticated users to /auth
 * Used for all authenticated app routes (/dashboard, /upload, etc.)
 */
export const AuthRequiredGuard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Allow access to protected routes
  return <Outlet />;
};
