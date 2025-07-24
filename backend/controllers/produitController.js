const Produit = require('../models/Produit');

// Créer un produit
exports.createProduit = async (req, res, next) => {
  try {
    const newProduit = new Produit(req.body);
    await newProduit.save();
    res.status(201).json(newProduit);
  } catch (error) {
    next(error);
  }
};

// Obtenir tous les produits
exports.getAllProduits = async (req, res, next) => {
  try {
    const produits = await Produit.find().populate('categories');
    res.status(200).json(produits);
  } catch (error) {
    next(error);
  }
};

// Obtenir un produit par ID
exports.getProduitById = async (req, res, next) => {
  try {
    const produit = await Produit.findById(req.params.id).populate('categories');
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
    }
    res.status(200).json(produit);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res, next) => {
  try {
    const updatedProduit = await Produit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedProduit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
    }
    res.status(200).json(updatedProduit);
  } catch (error) {
    next(error);
  }
};

// Supprimer un produit
exports.deleteProduit = async (req, res, next) => {
  try {
    const deletedProduit = await Produit.findByIdAndDelete(req.params.id);
    if (!deletedProduit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};
