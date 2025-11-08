import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * PublicOnlyGuard - Redirects authenticated users to /dashboard
 * Used for public pages (/, /blog, /contact, etc.) that logged-in users shouldn't access
 */
export const PublicOnlyGuard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  // Allow access to public routes
  return <Outlet />;
};
