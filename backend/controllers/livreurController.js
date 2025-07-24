const Livreur = require('../models/Livreur');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Générer un token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login livreur
exports.loginLivreur = asyncHandler(async (req, res) => {
  const { email, motDePasse } = req.body;

  const livreur = await Livreur.findOne({ email });

  if (livreur && (await livreur.matchPassword(motDePasse))) {
    res.json({
      success: true,
      token: generateToken(livreur._id, livreur.role),
      livreur: {
        id: livreur._id,
        nom: livreur.nom,
        prenom: livreur.prenom,
        email: livreur.email,
        role: livreur.role,
        statut: livreur.statut
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }
});

// Créer un nouveau livreur (Admin uniquement)
exports.creerLivreur = asyncHandler(async (req, res) => {
  const { email, nom, prenom, telephone, motDePasse } = req.body;

  const existe = await Livreur.findOne({ email });
  if (existe) {
    res.status(400).json({
      success: false,
      message: 'Livreur déjà existant avec cet email'
    });
  }

  const livreur = await Livreur.create({ email, nom, prenom, telephone, motDePasse });

  res.status(201).json({
    success: true,
    livreur: {
      id: livreur._id,
      email: livreur.email,
      nom: livreur.nom,
      prenom: livreur.prenom,
      telephone: livreur.telephone,
      statut: livreur.statut
    }
  });
});

//Récupérer tous les livreurs
exports.getLivreurs = asyncHandler(async (req, res) => {
  const livreurs = await Livreur.find({});
  res.json({ success: true, livreurs });
});

//Récupérer un seul livreur par id
exports.getLivreurById = asyncHandler(async (req, res) => {
  const livreur = await Livreur.findById(req.params.id);

  if (!livreur) {
    res.status(404).json({
      success: false,
      message: 'Livreur non trouvé'
    });
  }

  res.json({ success: true, livreur });
});

//Mettre a jour les informations d'un livreur
exports.updateLivreur = asyncHandler(async (req, res) => {
  const livreur = await Livreur.findById(req.params.id);

  if (!livreur) {
    res.status(404);
    throw new Error('Livreur non trouvé');
  }

  const { nom, prenom, telephone, email, motDePasse } = req.body;

  livreur.nom = nom || livreur.nom;
  livreur.prenom = prenom || livreur.prenom;
  livreur.telephone = telephone || livreur.telephone;
  livreur.email = email || livreur.email;

  if (motDePasse) {
    livreur.motDePasse = motDePasse;
  }

  const updated = await livreur.save();

  res.json({
    success: true,
    livreur: {
      id: updated._id,
      nom: updated.nom,
      prenom: updated.prenom,
      telephone: updated.telephone,
      email: updated.email
    }
  });
});

//Suprimer un livreur
exports.deleteLivreur = asyncHandler(async (req, res) => {
  const livreur = await Livreur.findById(req.params.id);

  if (!livreur) {
    res.status(404);
    throw new Error('Livreur non trouvé');
  }

  await livreur.deleteOne();

  res.json({ success: true, message: 'Livreur supprimé avec succès' });
});