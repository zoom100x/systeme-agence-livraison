const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['carte bancaire', 'espèces', 'paypal', 'virement'],
    required: true
  },
  statut: {
    type: String,
    enum: ['payé', 'non payé', 'en attente'],
    default: 'non payé'
  }
}, { _id: false });

module.exports = paiementSchema;
