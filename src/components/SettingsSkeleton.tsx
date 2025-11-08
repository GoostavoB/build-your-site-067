import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {[...Array(3)].map((_, sectionIndex) => (
            <Card key={sectionIndex} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-72" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
