import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useOrders, useUpdateOrderStatus, useUpdateOrderDelivery } from '../../hooks/useApi';
import { Search, Filter, Eye, Edit, Package, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import { formatDate, formatPrice } from '../../utils/helpers';

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    adresseLivraison: '',
  });

  const { data: orders = [], isLoading } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const updateDeliveryMutation = useUpdateOrderDelivery();

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.client_id?.identite?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.produits?.some(p => p.produit_id?.nom?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, statut) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, statut });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleEditDelivery = (order) => {
    setSelectedOrder(order);
    setDeliveryData({
      adresseLivraison: formatAdresse(order.adresse_livraison),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDelivery = async (e) => {
    e.preventDefault();
    try {
      await updateDeliveryMutation.mutateAsync({
        id: selectedOrder._id,
        deliveryData: {
          adresse_livraison: parseAdresse(deliveryData.adresseLivraison),
        },
      });
      setIsEditDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations de livraison:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente':
        return <Clock className="h-4 w-4" />;
      case 'expédiée':
        return <Truck className="h-4 w-4" />;
      case 'livrée':
        return <CheckCircle className="h-4 w-4" />;
      case 'annulée':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
        <p className="text-muted-foreground">
          Gérez toutes les commandes et leur statut de livraison
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par client, ID commande ou produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Toutes les commandes avec leur statut actuel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm">
                    {order._id?.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.client_id?.identite?.civilite} {order.client_id?.identite?.prenom} {order.client_id?.identite?.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.client_id?.contact?.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.client_id?.contact?.telephones?.find(t => t.estPrincipal)?.numero || order.client_id?.contact?.telephones?.[0]?.numero}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.produits?.slice(0, 2).map((produit, index) => (
                        <div key={index} className="text-sm">
                          {produit.produit_id?.nom} x{produit.quantite}
                        </div>
                      ))}
                      {order.produits?.length > 2 && (
                        <div className="text-sm text-muted-foreground">
                          +{order.produits.length - 2} autres
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(getOrderTotal(order))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={ORDER_STATUS_COLORS[order.statut]}>
                        {getStatusIcon(order.statut)}
                        <span className="ml-1">{ORDER_STATUS_LABELS[order.statut] || order.statut}</span>
                      </Badge>
                      <Select
                        value={order.statut}
                        onValueChange={(value) => handleStatusChange(order._id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                            <SelectItem key={status} value={status}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(order.date_commande)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDelivery(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Aucune commande trouvée pour ces critères.' 
                  : 'Aucune commande enregistrée.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogDescription>
              Informations complètes sur la commande #{selectedOrder?._id?.slice(-8)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm">{selectedOrder.client_id?.identite?.civilite} {selectedOrder.client_id?.identite?.prenom} {selectedOrder.client_id?.identite?.nom}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.client_id?.contact?.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.client_id?.contact?.telephones?.find(t => t.estPrincipal)?.numero || selectedOrder.client_id?.contact?.telephones?.[0]?.numero}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <Badge className={ORDER_STATUS_COLORS[selectedOrder.statut]}>
                    {ORDER_STATUS_LABELS[selectedOrder.statut] || selectedOrder.statut}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Produits commandés</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.produits?.map((produit, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{produit.produit_id?.nom}</span>
                      <span>x{produit.quantite} - {formatPrice(produit.produit_id?.prix * produit.quantite)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Adresse de livraison</Label>
                <AdresseDetails adresse={selectedOrder.adresse_livraison || selectedOrder.client_id?.adresses?.[0]} />
              </div>
              {selectedOrder.livreur_id && (
                <div>
                  <Label className="text-sm font-medium">Livreur</Label>
                  <p className="text-sm">{selectedOrder.livreur_id?.nom}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.livreur_id?.email}</p>
                </div>
              )}
              {selectedOrder.paiement && (
                <div>
                  <Label className="text-sm font-medium">Paiement</Label>
                  <p className="text-sm">Mode: {selectedOrder.paiement.mode}</p>
                  <p className="text-sm">Statut: {selectedOrder.paiement.statut}</p>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold">{formatPrice(getOrderTotal(selectedOrder))}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition de livraison */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'adresse de livraison</DialogTitle>
            <DialogDescription>
              Mettez à jour l'adresse de livraison
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDelivery} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adresseLivraison">Adresse de livraison</Label>
              <Input
                id="adresseLivraison"
                value={deliveryData.adresseLivraison}
                onChange={(e) => setDeliveryData(prev => ({
                  ...prev,
                  adresseLivraison: e.target.value
                }))}
                placeholder="Adresse complète de livraison"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateDeliveryMutation.isPending}>
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;


// Helper to format adresse object as string
function formatAdresse(adresse) {
  if (!adresse) return '';
  return [adresse.ligne1, adresse.ligne2, adresse.codePostal, adresse.ville, adresse.pays].filter(Boolean).join(', ');
}
// Helper to parse adresse string back to object (simple version)
function parseAdresse(adresseStr) {
  // This should be improved for real use
  const [ligne1 = '', ligne2 = '', codePostal = '', ville = '', pays = 'Maroc'] = adresseStr.split(',').map(s => s.trim());
  return { ligne1, ligne2, codePostal, ville, pays };
}
// Component to display adresse details
function AdresseDetails({ adresse }) {
  if (!adresse) return <span className="text-muted-foreground">Non renseignée</span>;
  return (
    <div className="space-y-1">
      <div>{adresse.alias && <span className="font-medium">{adresse.alias} </span>}{adresse.ligne1}</div>
      {adresse.ligne2 && <div>{adresse.ligne2}</div>}
      <div>{adresse.codePostal} {adresse.ville}, {adresse.pays}</div>
      {adresse.type && <div>Type: {adresse.type}</div>}
      {adresse.instructions && <div>Instructions: {adresse.instructions}</div>}
      {adresse.horairesLivraison && (
        <div>Horaires: {adresse.horairesLivraison.jours?.join(', ')} {adresse.horairesLivraison.creneau}</div>
      )}
    </div>
  );
}
// Helper to calculate total
function getOrderTotal(order) {
  if (!order?.produits) return 0;
  return order.produits.reduce((sum, p) => sum + (p.produit_id?.prix || 0) * p.quantite, 0);
}

