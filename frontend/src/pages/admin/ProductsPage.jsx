import React, { useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useApi';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import ProductForm from '../../components/admin/productForm';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categories: [], // <-- now an array
    stock: '',
  });

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Filtrer les produits
  const filteredProducts = products.filter(product =>
    product.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categories?.some(cat => cat.nom?.toLowerCase().includes(searchTerm.toLowerCase()))
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
      nom: '',
      description: '',
      prix: '',
      categories: [],
      stock: '',
    });
  };

  const handleCreateProduct = useCallback(async (e) => {
    try {
      await createProductMutation.mutateAsync({
        ...formData,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    }
  }, [formData, createProductMutation])

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      nom: product.nom || '',
      description: product.description || '',
      prix: product.prix?.toString() || '',
      categories: product.categories?.map(cat => cat._id) || [],
      stock: product.stock?.toString() || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = useCallback(async (e) => {
    try {
      await updateProductMutation.mutateAsync({
        id: selectedProduct._id,
        data: {
          ...formData,
          prix: parseFloat(formData.prix),
          stock: parseInt(formData.stock),
        },
      });
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  }, [formData, updateProductMutation, selectedProduct])

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
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
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau produit</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau produit à votre catalogue.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleCreateProduct}
              submitLabel="Créer le produit"
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              createProductMutation={createProductMutation}
              updateProductMutation={updateProductMutation}
              categories={categories} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, description ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Tous vos produits disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.nom}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground">
                          {product.description.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description
                          }
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                      {product.categories?.map(cat => cat.nom).join(', ') || 'Non catégorisé'}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product.prix)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {product.stock} unités
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun produit trouvé pour cette recherche.' : 'Aucun produit enregistré.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
              onSubmit={handleUpdateProduct}
              submitLabel="Mettre à jour"
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              createProductMutation={createProductMutation}
              updateProductMutation={updateProductMutation}
              categories={categories} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;

