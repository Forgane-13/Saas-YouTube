import { NextResponse } from 'next/server';
import { getChannelInfo, getPopularVideos } from '@/lib/services/youtube';
import { generateScript } from '@/lib/services/claude';

export async function GET() {
  // Cette route est utilisée pour vérifier que l'API est fonctionnelle
  return NextResponse.json({ status: "API fonctionnelle" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Vérifier si l'URL de la chaîne a été fournie
    if (!body.channelUrl) {
      return NextResponse.json(
        { error: "URL de la chaîne YouTube requise" },
        { status: 400 }
      );
    }
    
    // Étape 1: Obtenir les informations de la chaîne
    const channelInfo = await getChannelInfo(body.channelUrl);
    
    if (!channelInfo) {
      return NextResponse.json(
        { error: "Impossible de récupérer les informations de la chaîne" },
        { status: 404 }
      );
    }
    
    // Étape 2: Obtenir les vidéos populaires de la chaîne
    const popularVideos = await getPopularVideos(channelInfo.id);
    
    if (popularVideos.length === 0) {
      return NextResponse.json(
        { error: "Aucune vidéo trouvée pour cette chaîne" },
        { status: 404 }
      );
    }
    
    // Étape 3: Générer un script avec Claude
    const script = await generateScript(channelInfo, popularVideos);
    
    if (!script) {
      return NextResponse.json(
        { error: "Impossible de générer un script" },
        { status: 500 }
      );
    }
    
    // Retourner les résultats
    return NextResponse.json({
      status: "success",
      channelInfo,
      videoCount: popularVideos.length,
      script
    });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la demande:', error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
} 
