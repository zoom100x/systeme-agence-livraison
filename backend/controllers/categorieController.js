const Categorie = require('../models/Categorie');

// Créer une catégorie
exports.createCategorie = async (req, res, next) => {
  try {
    const newCategorie = new Categorie(req.body);
    await newCategorie.save();
    res.status(201).json(newCategorie);
  } catch (error) {
    next(error);
  }
};

// Obtenir toutes les catégories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Obtenir une catégorie par ID
exports.getCategorieById = async (req, res, next) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) {
      return res.status(404).json({ success: false, message: 'Catégorie non trouvée.' });
    }
    res.status(200).json(categorie);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une catégorie
exports.updateCategorie = async (req, res, next) => {
  try {
    const updatedCategorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedCategorie) {
      return res.status(404).json({ success: false, message: 'Catégorie non trouvée.' });
    }
    res.status(200).json(updatedCategorie);
  } catch (error) {
    next(error);
  }
};

// Supprimer une catégorie
exports.deleteCategorie = async (req, res, next) => {
  try {
    const deletedCategorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!deletedCategorie) {
      return res.status(404).json({ success: false, message: 'Catégorie non trouvée.' });
    }
    res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
  } catch (error) {
    next(error);
  }
};
