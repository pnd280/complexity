import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PluginCardSkeleton() {
  return (
    <Card className="x:flex x:h-full x:flex-col x:bg-secondary x:animate-in x:fade-in-50">
      <CardHeader className="x:flex x:flex-row x:items-start x:justify-between x:space-y-0">
        <Skeleton className="x:h-6 x:w-3/4" />
      </CardHeader>
      <CardContent className="x:flex x:flex-col x:gap-2">
        <Skeleton className="x:h-4 x:w-full" />
        <Skeleton className="x:h-4 x:w-3/5" />
      </CardContent>
      <CardFooter className="x:mt-auto x:flex x:justify-between">
        <Skeleton className="x:h-10 x:w-24" />
        <Skeleton className="x:h-6 x:w-12" />
      </CardFooter>
    </Card>
  );
}
