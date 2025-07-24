// Statuts des commandes
export const ORDER_STATUS = {
  PENDING: 'en_attente',
  SHIPPED: 'expediee',
  DELIVERED: 'livree',
  CANCELLED: 'annulee',
};

// Labels des statuts en français
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'En attente',
  [ORDER_STATUS.SHIPPED]: 'Expédiée',
  [ORDER_STATUS.DELIVERED]: 'Livrée',
  [ORDER_STATUS.CANCELLED]: 'Annulée',
};

// Couleurs des statuts
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.SHIPPED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
};

// Rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'admin',
  LIVREUR: 'livreur',
};

// Routes de l'application
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin',
    CLIENTS: '/admin/clients',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    LIVREURS: '/admin/livreurs',
  },
  LIVREUR: {
    DASHBOARD: '/livreur',
    DELIVERIES: '/livreur/deliveries',
  },
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Action non autorisée',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Données invalides',
  GENERIC_ERROR: 'Une erreur est survenue',
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  CREATE_SUCCESS: 'Élément créé avec succès',
  UPDATE_SUCCESS: 'Élément mis à jour avec succès',
  DELETE_SUCCESS: 'Élément supprimé avec succès',
};

