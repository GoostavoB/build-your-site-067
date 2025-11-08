# Loading Skeleton Components

This project includes a comprehensive skeleton loading system for smooth page transitions and data fetching states.

## Available Skeleton Types

- **DashboardSkeleton** - Stats cards, charts, and activity feed
- **AnalyticsSkeleton** - Charts, tabs, and performance metrics
- **JournalSkeleton** - Grid of journal entry cards
- **TableSkeleton** - Data tables with pagination
- **SettingsSkeleton** - Settings sections with toggles
- **FormSkeleton** - Form fields and sections

## Automatic Route-Based Skeletons

The `AppShell` component automatically shows appropriate skeletons during route transitions:

```tsx
// Automatically detects route and shows correct skeleton
// /dashboard -> DashboardSkeleton
// /analytics -> AnalyticsSkeleton
// /journal -> JournalSkeleton
// /settings -> SettingsSkeleton
// /trading-plan -> FormSkeleton
```

## Using Skeletons in Pages

### 1. During Data Fetching

```tsx
import { PageSkeleton } from '@/components/PageSkeleton';
import { useQuery } from '@tanstack/react-query';

export function MyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <PageSkeleton type="dashboard" />;
  }

  return <div>{/* Your content */}</div>;
}
```

### 2. With Custom Hook

```tsx
import { usePageLoading } from '@/hooks/usePageLoading';
import { PageSkeleton } from '@/components/PageSkeleton';

export function MyPage() {
  const { isLoading, setLoading } = usePageLoading();

  useEffect(() => {
    setLoading(true);
    fetchData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) return <PageSkeleton type="analytics" />;

  return <div>{/* Your content */}</div>;
}
```

### 3. Using Specific Skeletons

```tsx
import { DashboardSkeleton, TableSkeleton } from '@/components/PageSkeleton';

// Use specific skeleton directly
if (loading) return <DashboardSkeleton />;

// Or with options
if (loading) return <TableSkeleton rows={15} columns={8} />;
```

## Async Loading Hook

For automatic loading state management:

```tsx
import { useAsyncLoading } from '@/hooks/usePageLoading';

export function MyPage() {
  const { data, isLoading, execute } = useAsyncLoading(
    async () => {
      const result = await fetchData();
      return result;
    },
    { immediate: true } // Run on mount
  );

  if (isLoading) return <PageSkeleton />;
  
  return <div>{data && renderData(data)}</div>;
}
```

## Skeleton Types

| Skeleton | Best For | Features |
|----------|----------|----------|
| DashboardSkeleton | Dashboard, overview pages | Stats cards, charts, activity |
| AnalyticsSkeleton | Analytics, reports | Tabs, charts, metrics |
| JournalSkeleton | Card grids, galleries | Card grid layout |
| TableSkeleton | Data tables, lists | Configurable rows/columns |
| SettingsSkeleton | Settings pages | Sections with toggles |
| FormSkeleton | Forms, editors | Form fields and sections |

## Route Detection

The `PageSkeleton` component automatically detects the current route and shows the appropriate skeleton:

- `/` or `/dashboard` → DashboardSkeleton
- `/analytics`, `/reports`, `/forecast` → AnalyticsSkeleton
- `/journal` → JournalSkeleton
- `/settings` → SettingsSkeleton
- `/upload`, `/trading-plan` → FormSkeleton

## Animation

All skeletons include the `animate-fade-in` class for smooth appearance.

## Customization

Each skeleton can be customized by modifying the corresponding component in `src/components/`.

## Example: Complete Page with Skeleton

```tsx
import { useState, useEffect } from 'react';
import { PageSkeleton } from '@/components/PageSkeleton';
import { supabase } from '@/integrations/supabase/client';

export function MyDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const { data } = await supabase.from('trades').select('*');
        setData(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return <PageSkeleton type="dashboard" />;
  }

  // Show actual content
  return (
    <div>
      <h1>My Dashboard</h1>
      {/* Render data */}
    </div>
  );
}
```
