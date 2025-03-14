import config from '../config';

// Types pour les données YouTube
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  videoCount: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

// Fonction pour extraire l'ID de la chaîne à partir de l'URL
export function extractChannelId(url: string): string | null {
  // Formats possibles:
  // - https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw
  // - https://www.youtube.com/c/GoogleDevelopers
  // - https://www.youtube.com/user/GoogleDevelopers
  // - https://www.youtube.com/@GoogleDevelopers

  try {
    const urlObj = new URL(url);
    
    // Format /channel/ID
    if (urlObj.pathname.includes('/channel/')) {
      const parts = urlObj.pathname.split('/');
      const index = parts.indexOf('channel');
      if (index !== -1 && parts[index + 1]) {
        return parts[index + 1];
      }
    }
    
    // Pour les autres formats, nous devrons faire une requête supplémentaire
    // pour obtenir l'ID de la chaîne
    return url;
  } catch (error) {
    console.error('URL invalide:', error);
    return null;
  }
}

// Fonction pour obtenir les informations d'une chaîne YouTube
export async function getChannelInfo(channelUrl: string): Promise<YouTubeChannel | null> {
  try {
    const channelId = extractChannelId(channelUrl);
    
    if (!channelId) {
      throw new Error('Impossible d\'extraire l\'ID de la chaîne');
    }
    
    // Si l'URL n'est pas au format /channel/ID, nous devons d'abord obtenir l'ID
    let actualChannelId = channelId;
    
    if (!channelUrl.includes('/channel/')) {
      // Déterminer le paramètre à utiliser en fonction du format de l'URL
      let paramName = 'forUsername';
      
      if (channelUrl.includes('/c/')) {
        paramName = 'forHandle';
      } else if (channelUrl.includes('/@')) {
        paramName = 'forHandle';
        actualChannelId = channelUrl.split('/@')[1];
      }
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&${paramName}=${actualChannelId}&key=${config.youtubeApiKey}`
      );
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Chaîne non trouvée');
      }
      
      actualChannelId = data.items[0].id;
    }
    
    // Maintenant que nous avons l'ID, obtenons les informations de la chaîne
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${actualChannelId}&key=${config.youtubeApiKey}`
    );
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Chaîne non trouvée');
    }
    
    const channel = data.items[0];
    
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails.default.url,
      subscriberCount: channel.statistics.subscriberCount,
      videoCount: channel.statistics.videoCount
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de la chaîne:', error);
    return null;
  }
}

// Fonction pour obtenir les vidéos les plus populaires d'une chaîne
export async function getPopularVideos(channelId: string, maxResults = config.maxVideosToAnalyze): Promise<YouTubeVideo[]> {
  try {
    // D'abord, obtenons les IDs des vidéos de la chaîne
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=50&order=viewCount&type=video&key=${config.youtubeApiKey}`
    );
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Aucune vidéo trouvée');
    }
    
    // Limitons le nombre de vidéos à analyser
    const videoIds = data.items.slice(0, maxResults).map((item: { id: { videoId: string } }) => item.id.videoId);
    
    // Maintenant, obtenons les détails de ces vidéos
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${config.youtubeApiKey}`
    );
    
    const detailsData = await detailsResponse.json();
    
    if (!detailsData.items || detailsData.items.length === 0) {
      throw new Error('Impossible d\'obtenir les détails des vidéos');
    }
    
    return detailsData.items.map((video: { id: { videoId: string }, snippet: { title: string, description: string, thumbnails: string } }) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.default.url,
      publishedAt: video.snippet.publishedAt,
      viewCount: video.statistics.viewCount || '0',
      likeCount: video.statistics.likeCount || '0',
      commentCount: video.statistics.commentCount || '0'
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos populaires:', error);
    return [];
  }
} 