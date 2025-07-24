const mongoose = require('mongoose');
const adresseSchema = require('./adresseSchema');
const paiementSchema = require('./paiementSchema'); 

const telephoneSchema = new mongoose.Schema({
    type: { type: String, enum: ['mobile', 'fixe', 'professionnel'] },
    numero: { type: String, required: true },
    estPrincipal: Boolean
  }, { _id: false });
  
  const notificationSchema = new mongoose.Schema({
    sms: Boolean,
    email: Boolean,
    push: Boolean
  }, { _id: false });


  const clientSchema = new mongoose.Schema({
    identite: {
      civilite: { type: String, enum: ['M', 'Mme'] },
      nom: { type: String, required: true, index: true },
      prenom: { type: String, required: true, index: true },
      dateNaissance: Date
    },
    contact: {
      email: { type: String, required: true, unique: true, index: true },
      telephones: [telephoneSchema],
      notification: notificationSchema
    },
    adresses: [adresseSchema],
    paiement: paiementSchema,
    compte: {
      dateCreation: { type: Date, default: Date.now },
      statut: { type: String, enum: ['actif', 'inactif', 'suspendu'], default: 'actif' },
      dernierAcces: Date,
      preferences: {
        langue: { type: String, default: "fr" },
        devise: { type: String, default: "EUR" }
      }
    },
    metadata: mongoose.Schema.Types.Mixed
  });

module.exports = mongoose.model('Client', clientSchema);