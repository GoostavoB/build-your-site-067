import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function TableSkeleton({ rows = 10, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-28" />
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="p-6 space-y-4">
          {/* Table Header */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(rows)].map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid gap-4 py-3 border-t border-border/50"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
