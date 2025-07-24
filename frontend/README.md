# Delivery Management Frontend

Une application React moderne pour la gestion des opérations de commande d'une agence de livraison.

## 🚀 Fonctionnalités

### Interface Administrateur
- **Dashboard** : Vue d'ensemble avec statistiques et graphiques
- **Gestion des clients** : CRUD complet avec recherche
- **Gestion des produits** : CRUD avec catégories et gestion du stock
- **Gestion des commandes** : Suivi des commandes avec filtres par statut, client, date
- **Gestion des livreurs** : CRUD des livreurs avec authentification

### Interface Livreur
- **Dashboard personnel** : Vue des livraisons assignées
- **Gestion des livraisons** : Mise à jour du statut des commandes
- **Navigation GPS** : Intégration avec Google Maps
- **Instructions de livraison** : Affichage des instructions spéciales

## 🛠️ Technologies Utilisées

- **React 18** avec Vite
- **React Router** pour la navigation
- **TailwindCSS** pour le styling
- **shadcn/ui** pour les composants UI
- **React Query** pour la gestion d'état et les requêtes API
- **Axios** pour les appels API
- **React Hook Form** pour la gestion des formulaires
- **Lucide React** pour les icônes
- **Recharts** pour les graphiques

## 📦 Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd delivery-management-frontend
```

2. Installer les dépendances
```bash
pnpm install
```

3. Démarrer le serveur de développement
```bash
pnpm run dev
```

4. Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend API
L'application est conçue pour se connecter à une API REST Node.js/Express avec les endpoints suivants :

#### Authentification
- `POST /api/livreurs/login` - Connexion livreur
- `POST /api/livreurs` - Créer un livreur (admin uniquement)

#### Clients
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

#### Produits
- `GET /api/produits` - Liste des produits
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/:id` - Modifier un produit
- `DELETE /api/produits/:id` - Supprimer un produit
- `GET /api/categories` - Liste des catégories

#### Commandes
- `GET /api/commandes` - Liste des commandes
- `POST /api/commandes` - Créer une commande
- `PATCH /api/commandes/:id/status` - Modifier le statut
- `PATCH /api/commandes/:id/delivery` - Modifier les infos de livraison

#### Livreurs
- `GET /api/livreurs` - Liste des livreurs
- `GET /api/livreurs/:id/deliveries` - Livraisons d'un livreur

## 👥 Comptes de Démonstration

### Administrateur
- **Email** : admin@delivery.com
- **Mot de passe** : admin123

### Livreur
- Utiliser les identifiants créés via l'interface admin

## 🎨 Structure du Projet

```
src/
├── components/
│   ├── admin/          # Composants interface admin
│   ├── livreur/        # Composants interface livreur
│   ├── common/         # Composants partagés
│   └── ui/             # Composants UI de base
├── contexts/           # Contextes React (Auth, Query)
├── hooks/              # Hooks personnalisés
├── pages/              # Pages de l'application
├── services/           # Services API
├── utils/              # Utilitaires et constantes
└── App.jsx             # Composant principal
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification avec deux rôles :
- **Admin** : Accès complet à toutes les fonctionnalités
- **Livreur** : Accès limité aux livraisons assignées

## 📱 Responsive Design

L'interface est entièrement responsive et optimisée pour :
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Déploiement

### Build de production
```bash
pnpm run build
```

### Prévisualisation du build
```bash
pnpm run preview
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🐛 Signaler un Bug

Pour signaler un bug, veuillez ouvrir une issue sur GitHub avec :
- Description détaillée du problème
- Étapes pour reproduire
- Captures d'écran si applicable
- Informations sur l'environnement (navigateur, OS, etc.)

## 📞 Support

Pour toute question ou support, contactez l'équipe de développement.

