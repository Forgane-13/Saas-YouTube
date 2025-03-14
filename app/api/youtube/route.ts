import { NextResponse } from 'next/server';

export async function GET() {
  // Cette route sera développée dans les prochaines étapes pour communiquer avec l'API YouTube
  return NextResponse.json({ status: "API fonctionnelle" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ici, nous vérifierons simplement si l'URL de la chaîne a été fournie
    if (!body.channelUrl) {
      return NextResponse.json(
        { error: "URL de la chaîne YouTube requise" },
        { status: 400 }
      );
    }
    
    // Dans les prochaines étapes, nous implémenterons la communication avec l'API YouTube
    // Pour l'instant, nous retournons simplement une réponse de test
    return NextResponse.json({
      status: "Analyse demandée",
      channelUrl: body.channelUrl,
      message: "Cette fonctionnalité sera implémentée dans les prochaines étapes"
    });
    
  } catch (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _
  ) {
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
} 
