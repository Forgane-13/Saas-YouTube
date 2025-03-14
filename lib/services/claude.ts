import config from '../config';
import { YouTubeVideo, YouTubeChannel } from './youtube';

// Interface pour le script généré
export interface GeneratedScript {
  title: string;
  introduction: string;
  sections: {
    title: string;
    content: string;
  }[];
  conclusion: string;
  callToAction: string;
}

// Fonction pour générer un prompt pour Claude basé sur les vidéos analysées
function generatePrompt(channel: YouTubeChannel, videos: YouTubeVideo[]): string {
  // Extraire les titres et descriptions des vidéos populaires
  const videoData = videos.map(video => ({
    title: video.title,
    description: video.description,
    views: parseInt(video.viewCount),
    likes: parseInt(video.likeCount),
    comments: parseInt(video.commentCount)
  }));

  // Trier les vidéos par nombre de vues
  videoData.sort((a, b) => b.views - a.views);

  // Créer un résumé des vidéos populaires
  const videoSummaries = videoData
    .map(video => `Titre: ${video.title}\nDescription: ${video.description}\nVues: ${video.views}\nLikes: ${video.likes}`)
    .join('\n\n');

  // Construire le prompt pour Claude
  return `
Tu es un expert en création de contenu YouTube. Analyse les données suivantes des vidéos les plus populaires de la chaîne "${channel.title}" et génère un script optimisé pour une nouvelle vidéo dans un style similaire.

INFORMATIONS SUR LA CHAÎNE:
Nom: ${channel.title}
Description: ${channel.description}
Nombre d'abonnés: ${channel.subscriberCount}

VIDÉOS POPULAIRES:
${videoSummaries}

En te basant sur ces données, génère un script complet pour une nouvelle vidéo YouTube qui:
1. Suit le style et le ton de cette chaîne
2. Aborde un sujet similaire mais original
3. Utilise une structure qui a fait ses preuves dans les vidéos populaires
4. Inclut une introduction accrocheuse, un corps bien structuré et une conclusion avec appel à l'action

FORMAT DE RÉPONSE:
Réponds uniquement au format JSON suivant:
{
  "title": "Titre accrocheur de la vidéo",
  "introduction": "Script de l'introduction (1-2 paragraphes)",
  "sections": [
    {
      "title": "Titre de la section 1",
      "content": "Contenu détaillé de la section 1"
    },
    {
      "title": "Titre de la section 2",
      "content": "Contenu détaillé de la section 2"
    }
  ],
  "conclusion": "Script de la conclusion",
  "callToAction": "Appel à l'action final"
}
`;
}

// Fonction pour générer un script avec Claude
export async function generateScript(channel: YouTubeChannel, videos: YouTubeVideo[]): Promise<GeneratedScript | null> {
  try {
    const prompt = generatePrompt(channel, videos);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Réponse invalide de Claude');
    }
    
    // Extraire le JSON de la réponse
    const responseText = data.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Impossible d\'extraire le JSON de la réponse');
    }
    
    const scriptData = JSON.parse(jsonMatch[0]);
    
    return {
      title: scriptData.title,
      introduction: scriptData.introduction,
      sections: scriptData.sections,
      conclusion: scriptData.conclusion,
      callToAction: scriptData.callToAction
    };
  } catch (error) {
    console.error('Erreur lors de la génération du script:', error);
    return null;
  }
} 