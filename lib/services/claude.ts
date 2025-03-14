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
    views: parseInt(video.viewCount) || 0,
    likes: parseInt(video.likeCount) || 0,
    comments: parseInt(video.commentCount) || 0
  }));

  // Trier les vidéos par nombre de vues
  videoData.sort((a, b) => b.views - a.views);

  // Limiter la longueur des descriptions pour éviter les prompts trop longs
  const processedVideoData = videoData.map(video => ({
    ...video,
    description: video.description.length > 500 
      ? video.description.substring(0, 500) + '...' 
      : video.description
  }));

  // Créer un résumé des vidéos populaires
  const videoSummaries = processedVideoData
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
    if (!config.claudeApiKey) {
      throw new Error('Clé API Claude non configurée');
    }

    if (!videos || videos.length === 0) {
      throw new Error('Aucune vidéo fournie pour l\'analyse');
    }

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
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur API Claude: ${errorData.error?.message || 'Erreur inconnue'}`);
    }
    
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
    
    try {
      const scriptData = JSON.parse(jsonMatch[0]);
      
      // Vérifier que tous les champs requis sont présents
      if (!scriptData.title || !scriptData.introduction || !Array.isArray(scriptData.sections) || 
          !scriptData.conclusion || !scriptData.callToAction) {
        throw new Error('Format de script incomplet');
      }
      
      return {
        title: scriptData.title,
        introduction: scriptData.introduction,
        sections: scriptData.sections,
        conclusion: scriptData.conclusion,
        callToAction: scriptData.callToAction
      };
    } catch (parseError) {
      console.error('Erreur lors du parsing du JSON:', parseError);
      throw new Error('Format de réponse invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du script:', error);
    return null;
  }
} 