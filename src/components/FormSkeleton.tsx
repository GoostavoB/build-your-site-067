import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function FormSkeleton({ sections = 3 }: { sections?: number }) {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Form Sections */}
      {[...Array(sections)].map((_, sectionIndex) => (
        <Card key={sectionIndex} className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-6 w-40" />
            
            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
