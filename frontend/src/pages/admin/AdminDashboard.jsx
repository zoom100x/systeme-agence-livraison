import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useOrders, useClients, useProducts, useLivreurs } from '../../hooks/useApi';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: livreurs = [], isLoading: livreursLoading } = useLivreurs();

  // Calculer les statistiques
  const stats = {
    totalClients: clients.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalLivreurs: livreurs.length,
    pendingOrders: orders.filter(order => order.statut === ORDER_STATUS.PENDING).length,
    deliveredOrders: orders.filter(order => order.statut === ORDER_STATUS.DELIVERED).length,
    totalRevenue: orders
      .filter(order => order.statut === ORDER_STATUS.DELIVERED)
      .reduce((sum, order) => sum + (order.total || 0), 0),
  };

  // Données pour le graphique des commandes par statut
  const ordersByStatus = Object.values(ORDER_STATUS).map(status => ({
    name: ORDER_STATUS_LABELS[status],
    value: orders.filter(order => order.statut === status).length,
  }));

  // Données pour le graphique des commandes par mois (simulé)
  const ordersByMonth = [
    { month: 'Jan', orders: 12 },
    { month: 'Fév', orders: 19 },
    { month: 'Mar', orders: 15 },
    { month: 'Avr', orders: 25 },
    { month: 'Mai', orders: 22 },
    { month: 'Juin', orders: 30 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (ordersLoading || clientsLoading || productsLoading || livreursLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité de livraison
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          description="Clients enregistrés"
          trend="+12% ce mois"
        />
        <StatCard
          title="Produits"
          value={stats.totalProducts}
          icon={Package}
          description="Produits disponibles"
        />
        <StatCard
          title="Commandes"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description="Total des commandes"
          trend="+8% ce mois"
        />
        <StatCard
          title="Livreurs"
          value={stats.totalLivreurs}
          icon={Truck}
          description="Livreurs actifs"
        />
      </div>

      {/* Cartes de statut des commandes */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Commandes à traiter
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
              {stats.deliveredOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Commandes terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenus générés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commandes par mois</CardTitle>
            <CardDescription>
              Évolution du nombre de commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des commandes</CardTitle>
            <CardDescription>
              Commandes par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

