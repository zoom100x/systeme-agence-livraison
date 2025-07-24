import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useDeliveries, useUpdateOrderStatus } from '../../hooks/useApi';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Navigation,
  Phone,
  User
} from 'lucide-react';
import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import { formatDate, formatPrice } from '../../utils/helpers';

const LivreurDashboard = () => {
  const { user } = useAuth();
  const { data: deliveries = [], isLoading } = useDeliveries(user?.id);
  const updateStatusMutation = useUpdateOrderStatus();

  // Filtrer les livraisons selon leur statut
  const pendingDeliveries = deliveries.filter(delivery => 
    delivery.statut === ORDER_STATUS.PENDING || delivery.statut === ORDER_STATUS.SHIPPED
  );
  
  const completedDeliveries = deliveries.filter(delivery => 
    delivery.statut === ORDER_STATUS.DELIVERED
  );

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id: orderId, 
        status: ORDER_STATUS.DELIVERED 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleMarkAsShipped = async (orderId) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id: orderId, 
        status: ORDER_STATUS.SHIPPED 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const openInMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const DeliveryCard = ({ delivery, showActions = true }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Commande #{delivery._id?.slice(-8)}
            </CardTitle>
            <CardDescription>
              {formatDate(delivery.createdAt)}
            </CardDescription>
          </div>
          <Badge className={ORDER_STATUS_COLORS[delivery.statut]}>
            {ORDER_STATUS_LABELS[delivery.statut]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations client */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <User className="h-5 w-5 text-gray-600" />
          <div>
            <p className="font-medium">{delivery.client?.nom}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{delivery.client?.telephone}</span>
            </div>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-blue-900">Adresse de livraison</p>
            <p className="text-sm text-blue-700">
              {delivery.adresseLivraison || delivery.client?.adresse}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => openInMaps(delivery.adresseLivraison || delivery.client?.adresse)}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Ouvrir dans Maps
            </Button>
          </div>
        </div>

        {/* Instructions de livraison */}
        {delivery.instructionsLivraison && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="font-medium text-yellow-900 mb-1">Instructions spéciales</p>
            <p className="text-sm text-yellow-700">{delivery.instructionsLivraison}</p>
          </div>
        )}

        {/* Produits */}
        <div>
          <p className="font-medium mb-2 flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Produits à livrer
          </p>
          <div className="space-y-2">
            {delivery.produits?.map((produit, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{produit.nom}</span>
                <span className="text-sm font-medium">x{produit.quantite}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(delivery.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            {delivery.statut === ORDER_STATUS.PENDING && (
              <Button
                onClick={() => handleMarkAsShipped(delivery._id)}
                className="flex-1"
                disabled={updateStatusMutation.isPending}
              >
                <Package className="mr-2 h-4 w-4" />
                Marquer comme expédiée
              </Button>
            )}
            
            {delivery.statut === ORDER_STATUS.SHIPPED && (
              <Button
                onClick={() => handleMarkAsDelivered(delivery._id)}
                className="flex-1"
                disabled={updateStatusMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer comme livrée
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec salutation */}
      <div className="bg-white p-6 rounded-lg border">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour {user?.nom} ! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Voici vos livraisons du jour
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À livrer</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingDeliveries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Livraisons en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedDeliveries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Livraisons terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {deliveries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Toutes les livraisons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Livraisons en attente */}
      {pendingDeliveries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-orange-600" />
            Livraisons à effectuer ({pendingDeliveries.length})
          </h2>
          {pendingDeliveries.map((delivery) => (
            <DeliveryCard key={delivery._id} delivery={delivery} />
          ))}
        </div>
      )}

      {/* Livraisons terminées */}
      {completedDeliveries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Livraisons terminées ({completedDeliveries.length})
          </h2>
          {completedDeliveries.slice(0, 5).map((delivery) => (
            <DeliveryCard key={delivery._id} delivery={delivery} showActions={false} />
          ))}
        </div>
      )}

      {/* Message si aucune livraison */}
      {deliveries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune livraison assignée
            </h3>
            <p className="text-gray-600">
              Vous n'avez actuellement aucune livraison à effectuer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LivreurDashboard;

