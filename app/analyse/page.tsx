"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AnalysePage() {
  const [channelUrl, setChannelUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cette fonction sera implémentée dans les prochaines étapes
    alert("Fonctionnalité d'analyse en cours de développement");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Analyse de Chaîne YouTube</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Entrez l'URL d'une chaîne YouTube pour analyser son contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="channel-url" className="text-sm font-medium">
                URL de la chaîne YouTube
              </label>
              <Input
                id="channel-url"
                type="url"
                placeholder="https://www.youtube.com/c/nomchaîne"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Exemple: https://www.youtube.com/c/nomchaîne
              </p>
            </div>
            <Button type="submit" className="w-full font-semibold">
              Lancer l'analyse
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="font-semibold">
              Retour à l'accueil
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
} 