const express = require('express');
const router = express.Router();
const {
  loginLivreur,
  creerLivreur,
  getLivreurs,
  getLivreurById,
  updateLivreur,
  deleteLivreur
} = require('../controllers/livreurController');
const protect= require('../middlewares/protect');
const adminOnly = require('../middlewares/adminOnly');


// Route de login (publique)
router.post('/login', loginLivreur);

// Route de création (protégée, admin seulement)
router.post('/create', protect, adminOnly, creerLivreur);

// Obtenir tous les livreurs (admin uniquement)
router.get('/', protect, adminOnly, getLivreurs);

// Obtenir un livreur par ID (admin ou le livreur lui-même)
router.get('/:id', protect, getLivreurById);

// Mettre à jour un livreur (admin ou le livreur lui-même)
router.put('/:id', protect, updateLivreur);

// Supprimer un livreur (admin uniquement)
router.delete('/:id', protect, adminOnly, deleteLivreur);

module.exports = router;
