// Configuration des variables d'environnement
const config = {
  // YouTube API
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  
  // Claude API
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  
  // URL de base de l'API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // Nombre maximum de vidéos à analyser
  maxVideosToAnalyze: 10,
};

// Vérification des variables d'environnement requises en mode développement
if (process.env.NODE_ENV === 'development') {
  const missingKeys = Object.entries(config)
    .filter(([key, value]) => !value && key !== 'apiUrl')
    .map(([key]) => key);
  
  if (missingKeys.length > 0) {
    console.warn(`⚠️ Variables d'environnement manquantes : ${missingKeys.join(', ')}`);
  }
}

export default config; 