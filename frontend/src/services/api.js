import axios from 'axios';

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:5100/api';

// Instance axios avec configuration par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  // Connexion livreur
  loginLivreur: (credentials) => api.post('/livreurs/login', credentials),
  
  // Connexion admin
  loginAdmin: (credentials) => api.post('/admin/login', credentials),
  
  // Créer un livreur (admin uniquement)
  createLivreur: (livreurData) => api.post('/livreurs', livreurData),
};

// Services clients
export const clientService = {
  // CRUD clients
  getClients: (params = {}) => api.get('/clients', { params }),
  getClient: (id) => api.get(`/clients/${id}`),
  createClient: (clientData) => api.post('/clients', clientData),
  updateClient: (id, clientData) => api.put(`/clients/${id}`, clientData),
  deleteClient: (id) => api.delete(`/clients/${id}`),
  
  // Rechercher un client
  searchClients: (query) => api.get(`/clients/search?q=${query}`),
};

// Services produits
export const productService = {
  // CRUD produits
  getProducts: (params = {}) => api.get('/produits', { params }),
  getProduct: (id) => api.get(`/produits/${id}`),
  createProduct: (productData) => api.post('/produits', productData),
  updateProduct: (id, productData) => api.put(`/produits/${id}`, productData),
  deleteProduct: (id) => api.delete(`/produits/${id}`),
  
  // Catégories
  getCategories: () => api.get('/categories'),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Services commandes
export const orderService = {
  // Créer commande
  createOrder: (orderData) => api.post('/commandes', orderData),
  
  // Voir toutes les commandes (admin)
  getAllOrders: (params = {}) => api.get('/commandes', { params }),
  
  // Voir commandes par client
  getOrdersByClient: (clientId) => api.get(`/commandes/client/${clientId}`),
  
  // Voir commandes par statut
  getOrdersByStatus: (status) => api.get(`/commandes/status/${status}`),
  
  // Voir commandes par date
  getOrdersByDate: (startDate, endDate) => api.get(`/commandes/date`, {
    params: { startDate, endDate }
  }),
  
  // Modifier statut
  updateOrderStatus: (id, status) => api.patch(`/commandes/${id}/status`, { status }),
  
  // Ajouter instructions et adresse de livraison
  updateOrderDelivery: (id, deliveryData) => api.patch(`/commandes/${id}/delivery`, deliveryData),
  
  // Obtenir une commande spécifique
  getOrder: (id) => api.get(`/commandes/${id}`),
  
  // Supprimer une commande
  deleteOrder: (id) => api.delete(`/commandes/${id}`),
};

// Services livreurs
export const livreurService = {
  // CRUD livreurs
  getLivreurs: () => api.get('/livreurs/'),
  createLivreur: (data) => api.post('/livreurs/create', data),
  getLivreur: (id) => api.get(`/livreurs/${id}`),
  updateLivreur: (id, livreurData) => api.put(`/livreurs/${id}`, livreurData),
  deleteLivreur: (id) => api.delete(`/livreurs/${id}`),
  
  // Obtenir les livraisons assignées à un livreur
  getDeliveries: (livreurId) => api.get(`/livreurs/${livreurId}/deliveries`),
};

export default api;

