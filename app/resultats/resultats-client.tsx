"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Définition des interfaces pour le typage
interface Section {
  title: string;
  content: string;
}

interface Script {
  title: string;
  introduction: string;
  sections: Section[];
  conclusion: string;
  callToAction: string;
}

interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  videoCount: string;
}

interface ResultData {
  status: string;
  channelInfo: ChannelInfo;
  videoCount: number;
  script: Script;
}

export default function ResultatsClient() {
  const searchParams = useSearchParams();
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    const url = searchParams.get("channelUrl");
    if (url) {
      setChannelUrl(url);
    } else {
      setError("URL de la chaîne manquante");
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!channelUrl) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        console.log("Envoi de la requête avec l'URL:", channelUrl);
        
        const response = await fetch("/api/youtube", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ channelUrl }),
        });

        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          // Si la réponse n'est pas du JSON, récupérer le texte brut
          const textError = await response.text();
          console.error("Réponse non-JSON reçue:", textError);
          throw new Error(`Erreur serveur: ${response.status} ${response.statusText}. Vérifiez les variables d'environnement sur Vercel.`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur API:", errorData);
          throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
        }

        const resultData = await response.json();
        console.log("Données reçues:", resultData);
        setData(resultData);
      } catch (err) {
        console.error("Erreur complète:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la communication avec l'API");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [channelUrl]);

  if (isLoading) {
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
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-left text-sm">
              <h3 className="font-semibold mb-2">Conseils de dépannage :</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vérifiez que les variables d&apos;environnement YOUTUBE_API_KEY et CLAUDE_API_KEY sont correctement configurées sur Vercel</li>
                <li>Assurez-vous que l&apos;URL de la chaîne YouTube est valide</li>
                <li>Vérifiez que votre quota d&apos;API YouTube n&apos;est pas épuisé</li>
                <li>Essayez avec une autre chaîne YouTube</li>
              </ul>
            </div>
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

          {data.script.sections.map((section: Section, index: number) => (
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

${data.script.sections.map((section: Section) => `## ${section.title}
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