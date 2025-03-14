"use client";

export const dynamic = "force-dynamic"; // ✅ Empêche le rendu statique (SSG)

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export default function ResultatsPage() {
  const searchParams = useSearchParams();
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResultData | null>(null);

  // ✅ Utiliser `useEffect` pour récupérer les paramètres après le rendu initial
  useEffect(() => {
    const url = searchParams.get("channelUrl");
    if (url) setChannelUrl(url);
  }, [searchParams]);

  useEffect(() => {
    if (!channelUrl) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/youtube/route?channelUrl=${encodeURIComponent(channelUrl)}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des données.");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Erreur lors du chargement des résultats.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [channelUrl]);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error} />;
  if (!data) return <NoResultsComponent />;

  return <ResultsDisplay data={data} />;
}

// ✅ Composant de chargement
function LoadingComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Chargement...</h1>
      <Skeleton className="w-full h-32 mt-4" />
      <Skeleton className="w-full h-6 mt-2" />
      <Skeleton className="w-full h-6 mt-2" />
    </div>
  );
}

// ✅ Composant d'erreur
function ErrorComponent({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-red-600">Erreur</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Une erreur est survenue lors de l&apos;analyse
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-red-500">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/analyse">
            <Button variant="outline" className="font-semibold">
              Retour à l&apos;analyse
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

// ✅ Composant si aucun résultat n'est trouvé
function NoResultsComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Aucun résultat</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Aucun résultat n&apos;a été trouvé
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">Veuillez réessayer avec une autre chaîne YouTube</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/analyse">
            <Button variant="outline" className="font-semibold">
              Retour à l&apos;analyse
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

// ✅ Composant principal qui affiche les résultats
function ResultsDisplay({ data }: { data: ResultData }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24">
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Script généré pour {data.channelInfo.title}</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Basé sur l&apos;analyse de {data.videoCount} vidéos populaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{data.script.title}</h2>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Introduction</h3>
              <p className="whitespace-pre-line">{data.script.introduction}</p>
            </div>
          </div>

          {data.script.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <p className="whitespace-pre-line">{section.content}</p>
              </div>
            </div>
          ))}

          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Conclusion</h3>
              <p className="whitespace-pre-line">{data.script.conclusion}</p>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Appel à l&apos;action</h3>
              <p className="whitespace-pre-line">{data.script.callToAction}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
