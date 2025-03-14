import { NextResponse } from 'next/server';
import { getChannelInfo, getPopularVideos } from '@/lib/services/youtube';
import { generateScript } from '@/lib/services/claude';
import config from '@/lib/config';

export async function GET() {
  // Cette route est utilisée pour vérifier que l'API est fonctionnelle
  return NextResponse.json({ status: "API fonctionnelle" });
}

export async function POST(request: Request) {
  // Vérifier d'abord si les clés API sont configurées
  if (!config.youtubeApiKey) {
    console.error("Clé API YouTube manquante");
    return NextResponse.json(
      { error: "Configuration du serveur incomplète: Clé API YouTube manquante" },
      { status: 500 }
    );
  }

  if (!config.claudeApiKey) {
    console.error("Clé API Claude manquante");
    return NextResponse.json(
      { error: "Configuration du serveur incomplète: Clé API Claude manquante" },
      { status: 500 }
    );
  }

  try {
    // Vérifier si la requête est valide
    if (!request || !request.body) {
      return NextResponse.json(
        { error: "Requête invalide" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Vérifier si l'URL de la chaîne a été fournie
    if (!body.channelUrl) {
      return NextResponse.json(
        { error: "URL de la chaîne YouTube requise" },
        { status: 400 }
      );
    }

    console.log("Traitement de la requête pour l'URL:", body.channelUrl);
    
    // Étape 1: Obtenir les informations de la chaîne
    const channelInfo = await getChannelInfo(body.channelUrl);
    
    if (!channelInfo) {
      return NextResponse.json(
        { error: "Impossible de récupérer les informations de la chaîne. Vérifiez que l'URL est valide." },
        { status: 404 }
      );
    }

    console.log("Informations de la chaîne récupérées:", channelInfo.title);
    
    // Étape 2: Obtenir les vidéos populaires de la chaîne
    const popularVideos = await getPopularVideos(channelInfo.id);
    
    if (popularVideos.length === 0) {
      return NextResponse.json(
        { error: "Aucune vidéo trouvée pour cette chaîne" },
        { status: 404 }
      );
    }

    console.log(`${popularVideos.length} vidéos populaires récupérées`);
    
    // Étape 3: Générer un script avec Claude
    const script = await generateScript(channelInfo, popularVideos);
    
    if (!script) {
      return NextResponse.json(
        { error: "Impossible de générer un script. Vérifiez la configuration de l'API Claude." },
        { status: 500 }
      );
    }

    console.log("Script généré avec succès");
    
    // Retourner les résultats
    return NextResponse.json({
      status: "success",
      channelInfo,
      videoCount: popularVideos.length,
      script
    });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la demande:', error);
    
    // S'assurer que nous renvoyons toujours une réponse JSON valide
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Erreur lors du traitement de la demande",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 
