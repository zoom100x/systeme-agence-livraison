import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formatage des dates
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, formatString, { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return '';
  }
};

// Formatage des dates avec heure
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

// Formatage des prix
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '0,00 €';
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

// Capitaliser la première lettre
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Générer un ID unique simple
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Valider un email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valider un numéro de téléphone français
export const isValidPhone = (phone) => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

// Tronquer un texte
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Filtrer les objets par propriété
export const filterByProperty = (array, property, value) => {
  if (!array || !Array.isArray(array)) return [];
  if (!value) return array;
  
  return array.filter(item => 
    item[property]?.toString().toLowerCase().includes(value.toLowerCase())
  );
};

// Trier les objets par propriété
export const sortByProperty = (array, property, direction = 'asc') => {
  if (!array || !Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Gérer les erreurs API
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 400:
        return 'Données invalides';
      case 401:
        return 'Accès non autorisé';
      case 403:
        return 'Action non autorisée';
      case 404:
        return 'Ressource non trouvée';
      case 500:
        return 'Erreur serveur interne';
      default:
        return message || 'Une erreur est survenue';
    }
  } else if (error.request) {
    // Erreur de réseau
    return 'Erreur de connexion au serveur';
  } else {
    // Autre erreur
    return error.message || 'Une erreur est survenue';
  }
};

// Calculer le total d'une commande
export const calculateOrderTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    const price = item.prix || item.product?.prix || 0;
    const quantity = item.quantite || item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

