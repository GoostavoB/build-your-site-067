import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>

        {/* Performance Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </Card>
          ))}
        </div>

        {/* Large Chart */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </Card>

        {/* Two Column Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-[280px] w-full" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-[280px] w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
