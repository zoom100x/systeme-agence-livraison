import React, { useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useLivreurs, useCreateLivreur, useUpdateLivreur, useDeleteLivreur } from '../../hooks/useApi';
import { Search, Plus, Edit, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import LivreurForm from '../../components/admin/LivreurForm';

const LivreursPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
  });

  const { data: livreurs = [], isLoading } = useLivreurs();
  const createLivreurMutation = useCreateLivreur();
  const updateLivreurMutation = useUpdateLivreur();
  const deleteLivreurMutation = useDeleteLivreur();


  const safeSearchTerm = searchTerm?.toLowerCase() || '';

  // Filtrer les livreurs
  const filteredLivreurs = livreurs.filter(livreur =>
    livreur.nom?.toLowerCase().includes(safeSearchTerm) ||
    livreur.email?.toLowerCase().includes(safeSearchTerm) ||
    livreur.telephone?.includes(searchTerm)
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      motDePasse: '',
    });
  };

  const handleCreateLivreur = useCallback(async () => {
    try {
      await createLivreurMutation.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création du livreur:', error);
    }
  }, [formData, createLivreurMutation]);

  const handleUpdateLivreur = useCallback(async () => {
    try {
      const updateData = { ...formData };
      // Ne pas envoyer le mot de passe s'il est vide
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateLivreurMutation.mutateAsync({
        id: selectedLivreur._id,
        data: updateData,
      });
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedLivreur(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du livreur:', error);
    }
  }, [formData, updateLivreurMutation, selectedLivreur]);

  const handleEditLivreur = (livreur) => {
    setSelectedLivreur(livreur);
    setFormData({
      prenom: livreur.prenom || '',
      nom: livreur.nom || '',
      email: livreur.email || '',
      telephone: livreur.telephone || '',
      motDePasse: '', // Ne pas pré-remplir le mot de passe
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteLivreur = async (livreurId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      try {
        await deleteLivreurMutation.mutateAsync(livreurId);
      } catch (error) {
        console.error('Erreur lors de la suppression du livreur:', error);
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
          <h1 className="text-3xl font-bold tracking-tight">Livreurs</h1>
          <p className="text-muted-foreground">
            Gérez votre équipe de livreurs
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau livreur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau livreur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau livreur à votre équipe.
              </DialogDescription>
            </DialogHeader>
            <LivreurForm 
              onSubmit={handleCreateLivreur} 
              submitLabel="Créer le livreur" 
              formData={formData}
              handleInputChange={handleInputChange}
              createLivreurMutation={createLivreurMutation}
            />
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

      {/* Tableau des livreurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des livreurs ({filteredLivreurs.length})</CardTitle>
          <CardDescription>
            Tous vos livreurs enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livreur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'embauche</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLivreurs.map((livreur) => (
                <TableRow key={livreur._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Truck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="font-medium">{`${livreur.nom} ${livreur.prenom}`}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3" />
                        {livreur.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-3 w-3" />
                        {livreur.telephone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Actif
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(livreur.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLivreur(livreur)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLivreur(livreur._id)}
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
          
          {filteredLivreurs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun livreur trouvé pour cette recherche.' : 'Aucun livreur enregistré.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le livreur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du livreur.
            </DialogDescription>
          </DialogHeader>
          <LivreurForm 
            onSubmit={handleUpdateLivreur} 
            submitLabel="Mettre à jour" 
            isEdit={true}
            formData={formData}
            handleInputChange={handleInputChange}
            updateLivreurMutation={updateLivreurMutation}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LivreursPage;