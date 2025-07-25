import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/useApi';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import ClientForm from '../../components/admin/ClientForm';
import { useCallback } from 'react';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const initialFormData = {
    identite: {
      civilite: '',
      nom: '',
      prenom: '',
      dateNaissance: '',
    },
    contact: {
      email: '',
      telephones: [
        { type: 'mobile', numero: '', estPrincipal: true },
      ],
      notification: { sms: false, email: false, push: false },
    },
    adresses: [
      {
        alias: '',
        type: '',
        ligne1: '',
        ligne2: '',
        codePostal: '',
        ville: '',
        pays: 'Maroc',
        instructions: '',
        horairesLivraison: { jours: [], creneau: '' },
      },
    ],
    paiement: { mode: '', statut: 'non payé' },
    compte: {
      statut: 'actif',
      dernierAcces: '',
      preferences: { langue: 'fr', devise: 'EUR' },
    },
    metadata: {},
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  const { data: clients = [], isLoading } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  // Filtrer les clients selon le terme de recherche
  const filteredClients = clients.filter(client => {
    const nom = client.identite?.nom?.toLowerCase() || '';
    const prenom = client.identite?.prenom?.toLowerCase() || '';
    const email = client.contact?.email?.toLowerCase() || '';
    const telephones = (client.contact?.telephones || []).map(t => t.numero).join(' ');
    return (
      nom.includes(searchTerm.toLowerCase()) ||
      prenom.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      telephones.includes(searchTerm)
    );
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Support nested fields and arrays
    if (name.startsWith('identite.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, identite: { ...prev.identite, [key]: value } }));
    } else if (name.startsWith('contact.email')) {
      setFormData(prev => ({ ...prev, contact: { ...prev.contact, email: value } }));
    } else if (name.startsWith('contact.telephones.')) {
      // e.g. contact.telephones.0.numero or contact.telephones.0.type
      const [, , idx, field] = name.split('.');
      setFormData(prev => {
        const telephones = [...prev.contact.telephones];
        telephones[Number(idx)] = {
          ...telephones[Number(idx)],
          [field]: field === 'estPrincipal' ? checked : value,
        };
        return { ...prev, contact: { ...prev.contact, telephones } };
      });
    } else if (name.startsWith('contact.notification.')) {
      const key = name.split('.')[2];
      setFormData(prev => ({ ...prev, contact: { ...prev.contact, notification: { ...prev.contact.notification, [key]: checked } } }));
    } else if (name.startsWith('adresses.')) {
      // e.g. adresses.0.ligne1
      const [, idx, field, subfield] = name.split('.');
      setFormData(prev => {
        const adresses = [...prev.adresses];
        if (field === 'horairesLivraison') {
          if (subfield === 'jours') {
            // Multi-select for jours
            const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
            adresses[Number(idx)].horairesLivraison.jours = options;
          } else {
            adresses[Number(idx)].horairesLivraison[subfield] = value;
          }
        } else {
          adresses[Number(idx)][field] = value;
        }
        return { ...prev, adresses };
      });
    } else if (name.startsWith('paiement.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, paiement: { ...prev.paiement, [key]: value } }));
    } else if (name.startsWith('compte.')) {
      const key = name.split('.')[1];
      if (key === 'preferences') {
        const prefKey = name.split('.')[2];
        setFormData(prev => ({ ...prev, compte: { ...prev.compte, preferences: { ...prev.compte.preferences, [prefKey]: value } } }));
      } else {
        setFormData(prev => ({ ...prev, compte: { ...prev.compte, [key]: value } }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError('');
  };

  const handleCreateClient = useCallback(
    async (e) => {

      setError('');
      try {
        await createClientMutation.mutateAsync(formData);
        setIsCreateDialogOpen(false);
        resetForm();
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la création du client');
      }
    }, [formData, createClientMutation])

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormData({
      identite: { ...client.identite },
      contact: {
        ...client.contact,
        telephones: client.contact?.telephones?.length ? client.contact.telephones.map(t => ({ ...t })) : [{ type: 'mobile', numero: '', estPrincipal: true }],
        notification: { ...client.contact?.notification },
      },
      adresses: client.adresses?.length ? client.adresses.map(a => ({ ...a, horairesLivraison: { ...a.horairesLivraison } })) : [
        {
          alias: '',
          type: '',
          ligne1: '',
          ligne2: '',
          codePostal: '',
          ville: '',
          pays: 'Maroc',
          instructions: '',
          horairesLivraison: { jours: [], creneau: '' },
        },
      ],
      paiement: { ...client.paiement },
      compte: {
        ...client.compte,
        preferences: { ...client.compte?.preferences },
      },
      metadata: client.metadata || {},
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = useCallback(async (e) => {
    setError('');
    try {
      await updateClientMutation.mutateAsync({
        id: selectedClient._id,
        data: formData,
      });
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedClient(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du client');
    }
  }, [formData, updateClientMutation, selectedClient]);

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteClientMutation.mutateAsync(clientId);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression du client');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau client à votre base de données.
              </DialogDescription>
            </DialogHeader>
            <ClientForm
              onSubmit={handleCreateClient}
              submitLabel="Créer le client"
              error={error}
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              createClientMutation={createClientMutation}
              updateClientMutation={updateClientMutation} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients ({filteredClients.length})</CardTitle>
          <CardDescription>
            Tous vos clients enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell className="font-medium">
                    {client.identite?.civilite} {client.identite?.prenom} {client.identite?.nom}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3" />
                        {client.contact?.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-3 w-3" />
                        {client.contact?.telephones?.find(t => t.estPrincipal)?.numero || client.contact?.telephones?.[0]?.numero}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-3 w-3" />
                      {formatAdresse(client.adresses?.[0])}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(client.compte?.dateCreation)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClient(client._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun client trouvé pour cette recherche.' : 'Aucun client enregistré.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client.
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            onSubmit={handleUpdateClient}
            submitLabel="Mettre à jour"
            error={error}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            createClientMutation={createClientMutation}
            updateClientMutation={updateClientMutation} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;

function formatAdresse(adresse) {
  if (!adresse) return '';
  return [adresse.ligne1, adresse.ligne2, adresse.codePostal, adresse.ville, adresse.pays].filter(Boolean).join(', ');
}

