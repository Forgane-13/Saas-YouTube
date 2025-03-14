# ScriptGen AI - Générateur de Scripts YouTube

ScriptGen AI est une application SaaS conçue pour aider les créateurs de contenu à générer automatiquement des scripts de vidéos YouTube en analysant les meilleures performances d'une chaîne spécifique. L'application utilise les API YouTube et Claude.ai pour analyser le contenu existant et générer du nouveau contenu optimisé pour YouTube.

## Fonctionnalités (Phase 1)

- **Page d'accueil** : Une page simple avec une description du SaaS et un bouton "Commencer l'analyse".
- **Page d'analyse** : Une page contenant un champ permettant à l'utilisateur de coller un lien vers une chaîne YouTube, avec un bouton clair pour lancer l'analyse.
- **API de base** : Une route API simple dans Next.js qui sera utilisée pour communiquer avec l'API YouTube (actuellement retourne un JSON de test).

## Technologies utilisées

- **Next.js** : Framework React pour le développement web
- **TypeScript** : Pour un typage statique et une meilleure expérience de développement
- **Tailwind CSS** : Pour le styling et la mise en page
- **shadcn/ui** : Composants UI réutilisables basés sur Radix UI et Tailwind CSS

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

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Déploiement

Ce projet est configuré pour être déployé sur Vercel. Pour déployer votre propre instance :

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas déjà un.
2. Connectez votre dépôt GitHub à Vercel.
3. Configurez les variables d'environnement nécessaires (à venir dans les phases futures).
4. Déployez !

## Prochaines étapes

- Intégration de l'API YouTube pour récupérer les données des chaînes
- Analyse des vidéos les plus performantes
- Intégration de Claude.ai pour la génération de scripts
- Interface utilisateur pour afficher et modifier les scripts générés

## Licence

Ce projet est sous licence MIT.
