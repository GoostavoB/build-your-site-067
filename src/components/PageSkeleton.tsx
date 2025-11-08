import { DashboardSkeleton } from './DashboardSkeleton';
import { AnalyticsSkeleton } from './AnalyticsSkeleton';
import { JournalSkeleton } from './JournalSkeleton';
import { TableSkeleton } from './TableSkeleton';
import { SettingsSkeleton } from './SettingsSkeleton';
import { FormSkeleton } from './FormSkeleton';

/**
 * PageSkeleton - Route-aware skeleton loader
 * Displays appropriate skeleton based on current route
 */
export function PageSkeleton({ type }: { type?: string }) {
  // Auto-detect skeleton type from route if not provided
  const pathname = window.location.pathname;
  
  const skeletonType = type || getSkeletonTypeFromPath(pathname);
  
  switch (skeletonType) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'analytics':
    case 'advanced-analytics':
    case 'reports':
    case 'forecast':
      return <AnalyticsSkeleton />;
    case 'journal':
      return <JournalSkeleton />;
    case 'settings':
      return <SettingsSkeleton />;
    case 'upload':
    case 'trading-plan':
      return <FormSkeleton />;
    case 'table':
      return <TableSkeleton />;
    default:
      return <DashboardSkeleton />;
  }
}

/**
 * Determine skeleton type from pathname
 */
function getSkeletonTypeFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/journal')) return 'journal';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/upload')) return 'upload';
  if (pathname.includes('/trading-plan')) return 'trading-plan';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/forecast')) return 'forecast';
  
  // Default to dashboard skeleton
  return 'dashboard';
}

// Export individual skeletons for direct use
export {
  DashboardSkeleton,
  AnalyticsSkeleton,
  JournalSkeleton,
  TableSkeleton,
  SettingsSkeleton,
  FormSkeleton,
};
