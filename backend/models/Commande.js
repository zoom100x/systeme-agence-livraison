const mongoose = require('mongoose');
const adresseSchema = require('./adresseSchema');
const paiementSchema = require('./paiementSchema');

const commandeSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  produits: [{
    produit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    quantite: Number
  }],
  date_commande: { type: Date, default: Date.now },
  statut: { type: String, enum: ['en attente', 'expédiée', 'livrée', 'annulée'], default: 'en attente' },
  adresse_livraison: { type: adresseSchema, required: true },
  paiement: paiementSchema,
  livreur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livreur' }
});

module.exports = mongoose.model('Commande', commandeSchema);