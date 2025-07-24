const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Accès réservé aux administrateurs');
    }
};

module.exports = adminOnly;
