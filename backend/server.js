require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const clientRoutes = require('./routes/clientRoutes');
const produitRoutes = require('./routes/produitRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const livreurRoutes = require('./routes/livreurRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: 'API Agence de Livraison' });
});

//client route
app.use('/api/clients', clientRoutes);

//produit route
app.use('/api/produits', produitRoutes);

//categorie route
app.use('/api/categories', categorieRoutes);

//commande route
app.use('/api/commandes', commandeRoutes);

//livreur route
app.use('/api/livreurs', livreurRoutes);

//admin route
app.use('/api/admin', adminRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware d’erreur (à la fin toujours)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Serveur démarré sur le port ${PORT}`));