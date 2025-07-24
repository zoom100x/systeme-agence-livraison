const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true, text: true },
  description: { type: String, text: true },
  prix: { type: Number, required: true },
  stock: { type: Number, required: true },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie'
  }],
  media: {
    image: [String] // URLs ou noms de fichiers
  }
}, {
  timestamps: true // Pour createdAt, updatedAt automatiques
});

module.exports = mongoose.model('Produit', produitSchema);
