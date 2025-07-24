const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const livreurSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  motDePasse: { type: String, required: true },
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif'
  },
  role: {
    type: String,
    enum: ['livreur'],
    default: 'livreur'
  }
}, { timestamps: true });

// Avant sauvegarde, hasher le mot de passe si modifié
livreurSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// Méthode pour comparer mot de passe
livreurSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.motDePasse);
};

module.exports = mongoose.model('Livreur', livreurSchema);
