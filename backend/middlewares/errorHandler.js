const errorHandler = (err, req, res, next) => {
    console.error(`[Client Error]`, err); // Tu peux le remplacer par un logger type winston plus tard

    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || 'Erreur serveur interne';

    // Erreurs de validation Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    // ID mal formé (ex: mauvaise syntaxe ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID invalide';
    }

    // Erreur de duplication MongoDB
    if (err.code === 11000) {
        const champ = Object.keys(err.keyValue);
        message = `Duplication : ${champ} existe déjà.`;
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
