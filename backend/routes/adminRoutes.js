const express = require('express');
const router = express.Router();
const { loginAdmin, creerAdmin } = require('../controllers/adminController');
const protect = require('../middlewares/protect');
const adminOnly = require('../middlewares/adminOnly');

// Login admin (publique)
router.post('/login', loginAdmin);

// Créer un admin (protégée, admin uniquement)
router.post('/', protect, adminOnly, creerAdmin);

module.exports = router;
