import { Suspense } from "react";
import ResultatsClient from "./resultats-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// Page côté serveur qui utilise Suspense pour envelopper le composant client
export default function ResultatsPage() {
  return (
    <Suspense fallback={<ResultatsLoading />}>
      <ResultatsClient />
    </Suspense>
  );
}

// Composant de chargement pour Suspense
function ResultatsLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/4 mx-auto" />
        </CardFooter>
      </Card>
    </main>
  );
}
