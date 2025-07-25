const mongoose = require('mongoose');

const horairesLivraisonSchema = new mongoose.Schema({
    jours: [String], // ["lundi", "mercredi"]
    creneau: {type: String} // "12h-14h"
}, { _id: false });

const adresseSchema = new mongoose.Schema({
    alias: {type: String}, // "Maison", "Bureau"
    type: { type: String, enum: ['livraison', 'facturation', 'les deux'] },
    ligne1: { type: String, required: true },
    ligne2: {type: String},
    codePostal: { type: String, required: true },
    ville: { type: String, required: true },
    pays: { type: String, default: "Maroc" },
    instructions: {type: String},
    horairesLivraison: horairesLivraisonSchema
}, { _id: false });


module.exports = adresseSchema;