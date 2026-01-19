import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-6 card-shadow">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const SkeletonPhoto = () => (
  <div className="aspect-square rounded-xl overflow-hidden">
    <Skeleton className="w-full h-full" />
  </div>
);

export const SkeletonTeacherCard = () => (
  <div className="glass-card rounded-2xl p-6 card-shadow">
    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
    <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
    <Skeleton className="h-3 w-1/2 mx-auto" />
  </div>
);

export const SkeletonGroupCard = () => (
  <div className="bg-card rounded-2xl overflow-hidden card-shadow">
    <Skeleton className="h-48 w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);
