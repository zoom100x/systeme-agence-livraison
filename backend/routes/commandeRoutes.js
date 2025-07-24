const express = require('express');
const router = express.Router();
const {
  creerCommande,
  getCommandes,
  getCommandeById,
  updateStatutCommande,
  deleteCommande
} = require('../controllers/commandeController');

// Créer une commande
router.post('/', creerCommande);

// Obtenir toutes les commandes
router.get('/', getCommandes);

// Obtenir une commande par ID
router.get('/:id', getCommandeById);

// Mettre à jour le statut d'une commande
router.put('/:id', updateStatutCommande);

// Supprimer une commande
router.delete('/:id', deleteCommande);

module.exports = router;
