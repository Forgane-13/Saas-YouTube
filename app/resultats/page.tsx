"use client"; // ✅ Indique que ce fichier est côté client

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultatsPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ResultatsContent />
    </Suspense>
  );
}

// ✅ Composant séparé pour gérer `useSearchParams()`
function ResultatsContent() {
  const searchParams = useSearchParams();
  const channelUrl = searchParams.get("channelUrl");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    if (!channelUrl) {
      setError("Aucune URL de chaîne fournie.");
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
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
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Résultats d'analyse</h1>
      <p>Chaîne analysée : {channelUrl}</p>

      {data && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Analyse des vidéos populaires</CardTitle>
            <CardDescription>Voici les vidéos les plus performantes de cette chaîne.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.videos.map((video: any) => (
              <div key={video.id} className="border p-4 my-2">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
                <h3 className="text-lg font-bold mt-2">{video.title}</h3>
                <p>{video.description}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Retour</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
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


  if (error) {
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
            <p className="mb-6 text-red-500">{error}</p>
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

  if (!data) {
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
            <p className="mb-6">
              Veuillez réessayer avec une autre chaîne YouTube
            </p>
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
        <CardFooter className="flex justify-center gap-4">
          <Link href="/analyse">
            <Button variant="outline" className="font-semibold">
              Nouvelle analyse
            </Button>
          </Link>
          <Button 
            className="font-semibold"
            onClick={() => {
              const scriptText = `
# ${data.script.title}

## Introduction
${data.script.introduction}

${data.script.sections.map(section => `## ${section.title}
${section.content}`).join('\n\n')}

## Conclusion
${data.script.conclusion}

## Appel à l'action
${data.script.callToAction}
              `;
              
              navigator.clipboard.writeText(scriptText);
              alert("Script copié dans le presse-papiers !");
            }}
          >
            Copier le script
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
} 