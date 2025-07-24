const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
}, {
  timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model('Categorie', categorieSchema);
