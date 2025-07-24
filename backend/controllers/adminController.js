const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Générer un token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login admin
exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, motDePasse } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(motDePasse))) {
    res.json({
      success: true,
      token: generateToken(admin._id, admin.role),
      admin: {
        id: admin._id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        role: admin.role,
        statut: admin.statut
      }
    });
  } else {
    // Retourne un JSON d'erreur explicite
    res.status(400).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }
});

// Créer un nouvel admin (accessible uniquement aux admins déjà authentifiés)
exports.creerAdmin = asyncHandler(async (req, res) => {
    const { email, nom, prenom, motDePasse } = req.body;
  
    // Vérifier si l'admin existe déjà
    const existe = await Admin.findOne({ email });
    if (existe) {
      res.status(400).json({
        success: false,
        message: 'Un administrateur avec cet email existe déjà'
      });
    }
  
    // Créer l'admin
    const admin = await Admin.create({ email, nom, prenom, motDePasse });
  
    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role,
        statut: admin.statut
      }
    });
  });
  
