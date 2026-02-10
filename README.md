# Formation Node.js 2026

Ce dépôt contient les exercices pratiques de la formation Node.js 2026, organisés en laboratoires progressifs pour maîtriser le développement backend avec Node.js, TypeScript et Express.

## Structure du projet

```
session2026/
├── Lab1/                           # Patterns asynchrones
├── Lab2/                           # TypeScript fondamentaux et avancés
├── Lab3/                           # API REST avec Express
├── WSL/                            # Configuration de l'environnement WSL
└── .github/                        # Instructions personnalisées pour GitHub Copilot
```

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Git
- VS Code (recommandé)
- WSL2 (pour Windows)
- MongoDB (pour Lab3 bonus)

## Installation

### Configuration de l'environnement WSL

Consultez le guide détaillé dans `WSL/requirement-0.md` pour:
- Configurer WSL2
- Installer Node.js
- Installer Git
- Installer MongoDB

### Installation des dépendances

Chaque lab a ses propres dépendances. Naviguez dans le dossier du lab et installez:

```bash
cd Lab2/lab2-exercises
npm install
```

## Labs disponibles

### Lab 1: Patterns asynchrones en Node.js

Apprentissage des patterns asynchrones essentiels de JavaScript/Node.js.

**Concepts couverts:**
- Callbacks et "callback hell"
- Promises avec `.then()` et `.catch()`
- async/await et syntaxe moderne
- Patterns de parallélisme (Promise.all, Promise.allSettled)
- Gestion d'erreurs asynchrones

**Fichier:** `Lab1/lab1-async-patterns-exercises.md`

**Exercices:**
- Lecture de fichiers séquentielle avec callbacks
- Récupération de données API avec Promises
- Refactoring vers async/await
- Exécution parallèle vs séquentielle
- Gestion centralisée des erreurs
- Challenge bonus: Client API complet

### Lab 2: TypeScript

Introduction à TypeScript avec deux niveaux: fondamentaux et avancés.

**Lab 2 Basics - Concepts couverts:**
- Types primitifs et annotations
- Interfaces et type aliases
- Fonctions et génériques
- Classes et modificateurs d'accès
- Enums et types littéraux
- Types union et intersection
- Intégration de bibliothèques externes

**Lab 2 Advanced - Concepts couverts:**
- Décorateurs (classes, méthodes, propriétés)
- Validation avec métadonnées
- Génériques avancés avec contraintes
- Mapped types et conditional types
- Template literal types
- Design patterns (Builder, Factory)
- Machine à états type-safe

**Fichiers:**
- `Lab2/lab2-typescript-basics.md`
- `Lab2/lab2-typescript-advanced.md`

**Commandes:**
```bash
cd Lab2/lab2-exercises
npm install
npm run dev          # Mode développement avec ts-node-dev
npm run build        # Compilation TypeScript
```

### Lab 3: API REST avec Express et TypeScript

Construction d'une API REST complète et type-safe avec Express.

**Concepts couverts:**
- Configuration Express avec TypeScript
- Routes CRUD (GET, POST, PUT, DELETE)
- Modèles de données avec interfaces
- Middleware personnalisés (validation, logging)
- Gestion d'erreurs centralisée
- Architecture en couches (routes, controllers, services)
- Intégration MongoDB avec Mongoose (bonus)

**Fichier:** `Lab3/lab3-express-rest-api.md`

**Ce que vous allez construire:**
Une API de gestion de tâches complète avec:
- Opérations CRUD complètes
- Validation des données
- Gestion d'erreurs robuste
- Filtrage par statut et priorité
- Persistence en base de données

## Approche pédagogique

Ces labs suivent une approche d'apprentissage par la pratique:

- Chaque exercice contient du code de démarrage avec des commentaires `TODO`
- Des indices guident vers la solution sans la donner directement
- Des questions de réflexion encouragent la compréhension approfondie
- La complexité augmente progressivement
- Les labs s'appuient les uns sur les autres

## Instructions GitHub Copilot

Ce projet inclut des instructions personnalisées pour GitHub Copilot (`.github/copilot-instructions.md`) qui configurent l'assistant pour:

- Fournir des explications théoriques plutôt que des solutions complètes
- Offrir des indices et des conseils sans donner le code directement
- Encourager l'apprentissage actif et la découverte autonome
- Ne donner les solutions complètes que si explicitement demandé

Pour obtenir une solution complète, utilisez des phrases comme:
- "donne-moi la solution"
- "montre-moi le code complet"
- "j'ai besoin de l'implémentation directe"

## Utilisation

### Workflow recommandé

1. Lire le fichier markdown du lab
2. Créer les fichiers nécessaires selon les instructions
3. Implémenter le code en suivant les TODO
4. Tester votre implémentation
5. Répondre aux questions de réflexion
6. Passer à l'exercice suivant

### Commandes utiles

**TypeScript:**
```bash
npx tsc                    # Compiler
npx ts-node file.ts        # Exécuter directement
npx tsc --watch           # Compiler en mode watch
```

**Express (Lab3):**
```bash
npm run dev               # Démarrer le serveur en mode dev
npm run build             # Compiler pour production
npm start                 # Démarrer le serveur compilé
```

## Ressources additionnelles

### Documentation officielle

- Node.js: https://nodejs.org/docs
- TypeScript: https://www.typescriptlang.org/docs
- Express: https://expressjs.com
- Mongoose: https://mongoosejs.com

### Outils recommandés

**Extensions VS Code:**
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- REST Client ou Thunder Client
- MongoDB for VS Code

**Outils de test API:**
- Postman
- Insomnia
- cURL
- REST Client (extension VS Code)

## Progression suggérée

1. Commencer par Lab1 pour maîtriser les patterns asynchrones
2. Passer à Lab2 Basics pour apprendre TypeScript
3. Approfondir avec Lab2 Advanced (optionnel)
4. Combiner tout dans Lab3 avec Express
5. Compléter les challenges bonus pour aller plus loin

## Support et aide

Pour obtenir de l'aide:

1. Relire les indices et questions de réflexion dans les labs
2. Consulter la documentation officielle
3. Utiliser GitHub Copilot avec les instructions appropriées
4. Expérimenter et déboguer avec les outils de développement

## Contribution

Ce projet est destiné à des fins éducatives. Les suggestions d'amélioration sont les bienvenues via les issues ou pull requests.

## Licence

Ce matériel de formation est fourni à des fins éducatives.

## Auteur

Formation Node.js 2026 - Session pratique
