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

//Mettre à jour une commande
exports.updateCommande = asyncHandler(async (req, res) => {
  const commande = await Commande.findById(req.params.id);

  if (!commande) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  // Update fields (add more as needed)
  commande.client_id = req.body.client_id || commande.client_id;
  commande.produits = req.body.produits || commande.produits;
  commande.date_commande = req.body.date_commande || commande.date_commande;
  commande.statut = req.body.statut || commande.statut;

  // Deep merge for adresse_livraison
  if (req.body.adresse_livraison) {
    commande.adresse_livraison = {
      ...commande.adresse_livraison.toObject(),
      ...req.body.adresse_livraison,
      horairesLivraison: {
        ...(commande.adresse_livraison.horairesLivraison?.toObject?.() || commande.adresse_livraison.horairesLivraison || {}),
        ...(req.body.adresse_livraison.horairesLivraison || {})
      }
    };
  }
  // Deep merge for paiement
  if (req.body.paiement) {
    commande.paiement = {
      ...(commande.paiement?.toObject?.() || commande.paiement || {}),
      ...req.body.paiement
    };
  }
  commande.livreur_id = req.body.livreur_id || commande.livreur_id;

  const updatedCommande = await commande.save();

  // Populate for response
  await updatedCommande.populate('client_id', '-mot_de_passe');
  await updatedCommande.populate('produits.produit_id', 'nom prix');
  await updatedCommande.populate('livreur_id', 'nom prenom');

  res.json(updatedCommande);
});

// Obtenir les commandes par livreur
exports.getCommandesByLivreur = asyncHandler(async (req, res) => {
  const { livreurId } = req.params;
  const commandes = await Commande.find({ livreur_id: livreurId })
    .populate('client_id', '-mot_de_passe')
    .populate('produits.produit_id', 'nom prix')
    .populate('livreur_id', 'nom prenom');
  res.json(commandes);
});


