import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MemberDetailsSkeleton() {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Profile header skeleton */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-24 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Separator />
              <div className="pt-2">
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Discipleship Card Skeleton */}
          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="pl-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="pl-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs with skeleton details */}
        <div className="md:w-2/3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
              <TabsTrigger value="church">Igreja</TabsTrigger>
              <TabsTrigger value="leadership">Liderança</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab Skeleton */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={`personal-${index}`} className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`contact-${index}`} className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={`professional-${index}`} className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Church Information Tab Skeleton */}
            <TabsContent value="church" className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`church-${index}`} className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                          key={`school-${index}`}
                          className="h-6 w-24"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <Skeleton
                          key={`encounter-${index}`}
                          className="h-6 w-24"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="pl-6">
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leadership Tab Skeleton */}
            <TabsContent value="leadership" className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-full" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="pl-6">
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <Skeleton
                          key={`school-lead-${index}`}
                          className="h-6 w-32"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="pl-6 flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="pl-6">
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="pl-6">
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
