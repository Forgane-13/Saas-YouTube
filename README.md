# ScriptGen AI - Générateur de Scripts YouTube

ScriptGen AI est une application SaaS conçue pour aider les créateurs de contenu à générer automatiquement des scripts de vidéos YouTube en analysant les meilleures performances d'une chaîne spécifique. L'application utilise les API YouTube et Claude.ai pour analyser le contenu existant et générer du nouveau contenu optimisé pour YouTube.

## Fonctionnalités

- **Page d'accueil** : Une page simple avec une description du SaaS et un bouton "Commencer l'analyse".
- **Page d'analyse** : Une page contenant un champ permettant à l'utilisateur de coller un lien vers une chaîne YouTube, avec un bouton pour lancer l'analyse.
- **API YouTube** : Intégration avec l'API YouTube Data v3 pour récupérer les informations de la chaîne et les vidéos les plus populaires.
- **Génération de scripts** : Utilisation de l'API Claude d'Anthropic pour générer des scripts optimisés basés sur l'analyse des vidéos populaires.
- **Page de résultats** : Affichage du script généré avec possibilité de le copier.

## Technologies utilisées

- **Next.js** : Framework React pour le développement web
- **TypeScript** : Pour un typage statique et une meilleure expérience de développement
- **Tailwind CSS** : Pour le styling et la mise en page
- **shadcn/ui** : Composants UI réutilisables basés sur Radix UI et Tailwind CSS
- **API YouTube Data v3** : Pour récupérer les données des chaînes YouTube
- **API Claude d'Anthropic** : Pour la génération de scripts avec l'IA

## Installation et exécution

1. Clonez ce dépôt :
   ```bash
   git clone <URL_DU_REPO>
   cd projetsaas
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   - Copiez le fichier `.env.example` en `.env.local`
   - Obtenez une clé API YouTube Data v3 sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Obtenez une clé API Claude sur [Anthropic Console](https://console.anthropic.com/)
   - Remplissez les valeurs dans le fichier `.env.local`

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Configuration des variables d'environnement

Pour que l'application fonctionne correctement, vous devez configurer les variables d'environnement suivantes dans un fichier `.env.local` :

```
# YouTube Data API v3
YOUTUBE_API_KEY=votre_clé_youtube_api_ici

# Anthropic Claude API
CLAUDE_API_KEY=votre_clé_claude_api_ici

# URL de base de l'API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Pour le déploiement sur Vercel, configurez ces mêmes variables d'environnement dans les paramètres du projet.

## Déploiement

Ce projet est configuré pour être déployé sur Vercel. Pour déployer votre propre instance :

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un.
2. Connectez votre dépôt GitHub à Vercel.
3. Configurez les variables d'environnement nécessaires dans les paramètres du projet Vercel.
4. Déployez !

## Utilisation

1. Accédez à la page d'accueil et cliquez sur "Commencer l'analyse".
2. Sur la page d'analyse, entrez l'URL d'une chaîne YouTube (par exemple, https://www.youtube.com/c/nomchaîne).
3. Cliquez sur "Lancer l'analyse" et attendez que le système analyse la chaîne et génère un script.
4. Sur la page de résultats, vous verrez le script généré avec un titre, une introduction, des sections, une conclusion et un appel à l'action.
5. Vous pouvez copier le script complet en cliquant sur le bouton "Copier le script".

## Licence

Ce projet est sous licence MIT.
