const mongoose = require('mongoose');
const adresseSchema = require('./adresseSchema');
const paiementSchema = require('./paiementSchema');

const commandeSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  produits: [{
    produit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    quantite: {type: Number}
  }],
  date_commande: { type: Date, default: Date.now },
  statut: { type: String, enum: ['en_attente', 'expediee', 'livree', 'annulee'], default: 'en_attente' },
  adresse_livraison: { type: adresseSchema, required: true },
  paiement: paiementSchema,
  livreur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livreur' }
});

module.exports = mongoose.model('Commande', commandeSchema);