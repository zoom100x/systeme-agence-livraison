import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  clientService, 
  productService, 
  orderService, 
  livreurService 
} from '../services/api';

// Hooks pour les clients
export const useClients = (params = {}) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getClients(params).then(res => res.data),
  });
};

export const useClient = (id) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Hooks pour les produits
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params).then(res => res.data),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories().then(res => res.data),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hooks pour les commandes
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getAllOrders(params).then(res => res.data),
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useOrdersByClient = (clientId) => {
  return useQuery({
    queryKey: ['orders', 'client', clientId],
    queryFn: () => orderService.getOrdersByClient(clientId).then(res => res.data),
    enabled: !!clientId,
  });
};

export const useOrdersByStatus = (status) => {
  return useQuery({
    queryKey: ['orders', 'status', status],
    queryFn: () => orderService.getOrdersByStatus(status).then(res => res.data),
    enabled: !!status,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderDelivery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, deliveryData }) => orderService.updateOrderDelivery(id, deliveryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Hooks pour les livreurs
export const useLivreurs = () => {
  return useQuery({
    queryKey: ['livreurs'],
    queryFn: async () => {
      const res = await livreurService.getLivreurs();
      const data = res?.data;

      if (!data || !Array.isArray(data)) {
        // If the expected array is under data.livreurs, adjust here:
        if (Array.isArray(data.livreurs)) return data.livreurs;

        // Fallback to empty array
        return [];
      }

      return data;
    }
  });
};

export const useLivreur = (id) => {
  return useQuery({
    queryKey: ['livreur', id],
    queryFn: () => livreurService.getLivreur(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useDeliveries = (livreurId) => {
  return useQuery({
    queryKey: ['deliveries', livreurId],
    queryFn: () => livreurService.getDeliveries(livreurId).then(res => res.data),
    enabled: !!livreurId,
  });
};

export const useCreateLivreur = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => livreurService.createLivreur(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livreurs'] });
    },
  });
};

export const useUpdateLivreur = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => livreurService.updateLivreur(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livreurs'] });
    },
  });
};

export const useDeleteLivreur = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: livreurService.deleteLivreur,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livreurs'] });
    },
  });
};

