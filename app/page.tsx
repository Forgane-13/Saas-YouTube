import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Bienvenue sur ScriptGen AI</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Générez automatiquement des scripts de vidéos YouTube optimisés en analysant les meilleures vidéos d'une chaîne
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Notre outil utilise l'intelligence artificielle pour analyser les vidéos les plus performantes d'une chaîne YouTube
            et générer des scripts optimisés pour votre propre contenu.
          </p>
          <p className="mb-6">
            Collez simplement le lien d'une chaîne YouTube, et notre système analysera les tendances, le style et les sujets
            qui fonctionnent le mieux pour créer un script personnalisé pour votre prochaine vidéo.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/analyse">
            <Button size="lg" className="font-semibold">
              Commencer l'analyse
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
