import { Card, CardContent } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex w-full items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
        </div>

        <div className="mt-3">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="mt-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
      </CardContent>
    </Card>
  );
}
