const Commande = require('../models/Commande');
const Client = require('../models/Client');
const Produit = require('../models/Produit');
const asyncHandler = require('express-async-handler');

// Créer une commande
exports.creerCommande = asyncHandler(async (req, res) => {
  const commande = new Commande(req.body);
  const savedCommande = await commande.save();
  res.status(201).json(savedCommande);
});

// Obtenir toutes les commandes
exports.getCommandes = asyncHandler(async (req, res) => {
  const commandes = await Commande.find()
    .populate('client_id', '-mot_de_passe')
    .populate('produits.produit_id', 'nom prix')
    .populate('livreur_id', 'nom prenom');
  res.json(commandes);
});

// Obtenir une commande par ID
exports.getCommandeById = asyncHandler(async (req, res) => {
  const commande = await Commande.findById(req.params.id)
    .populate('client_id', '-mot_de_passe')
    .populate('produits.produit_id', 'nom prix')
    .populate('livreur_id', 'nom prenom');

  if (!commande) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  res.json(commande);
});

// Mettre à jour le statut d'une commande
exports.updateStatutCommande = asyncHandler(async (req, res) => {
  const { statut } = req.body;
  const commande = await Commande.findById(req.params.id);

  if (!commande) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  commande.statut = statut;
  const updatedCommande = await commande.save();

  res.json(updatedCommande);
});

// Supprimer une commande
exports.deleteCommande = asyncHandler(async (req, res) => {
  const commande = await Commande.findById(req.params.id);

  if (!commande) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  await commande.deleteOne();
  res.json({ message: 'Commande supprimée avec succès' });
});
