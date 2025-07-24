const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Livreur = require('../models/Livreur');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Récupérer token
            token = req.headers.authorization.split(' ')[1];

            // Vérifier token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Charger l’utilisateur (livreur ou admin selon le rôle)
            if (decoded.role === 'livreur') {
                req.user = await Livreur.findById(decoded.id).select('-motDePasse');
            } else if (decoded.role === 'admin') {
                req.user = await Admin.findById(decoded.id).select('-motDePasse');
            } else {
                res.status(401);
                throw new Error('Rôle non reconnu');
            }

            if (!req.user) {
                res.status(401);
                throw new Error('Utilisateur non trouvé');
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Non autorisé, token invalide');
        }
    } else {
        res.status(401);
        throw new Error('Non autorisé, token manquant');
    }
});

module.exports = protect;
