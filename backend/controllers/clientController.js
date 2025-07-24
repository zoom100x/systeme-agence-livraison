const Client = require('../models/Client');

// @desc    Créer un nouveau client
// @route   POST /api/clients
exports.createClient = async (req, res, next) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer tous les clients
// @route   GET /api/clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un client par ID
// @route   GET /api/clients/:id
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un client
// @route   PUT /api/clients/:id
exports.updateClient = async (req, res, next) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un client par ID
// @route   DELETE /api/clients/:id
exports.deleteClient = async (req, res, next) => {  
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }
    res.status(200).json({ message: 'Client supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un client par email
// @route   DELETE /api/clients/email/:email
exports.deleteClientByEmail = async (req, res, next) => {
    try {
      const deletedClient = await Client.findOneAndDelete({ "contact.email": req.params.email });
      if (!deletedClient) {
        return res.status(404).json({ success: false, message: 'Client non trouvé avec cet email.' });
      }
      res.status(200).json({ message: 'Client supprimé avec succès.' });
    } catch (error) {
      next(error);
    }
  };


  
