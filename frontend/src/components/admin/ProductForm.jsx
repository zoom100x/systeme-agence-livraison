import React, { useCallback } from 'react';
import { Label } from '../ui/label';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { DialogFooter } from '../ui/dialog';


const ProductForm = ({ onSubmit, submitLabel, isEdit = false, formData, setFormData, handleInputChange, createProductMutation, updateProductMutation, categories}) => {

    const onFormSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit();
    }, [onSubmit]);

    const onInputChange = useCallback((e) => {
        handleInputChange(e);
    }, [handleInputChange]);


    return (
        <form onSubmit={onFormSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nom">Nom du produit</Label>
                <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={onInputChange}
                    placeholder="Nom du produit"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    placeholder="Description du produit"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="prix">Prix (€)</Label>
                    <Input
                        id="prix"
                        name="prix"
                        type="number"
                        step="0.01"
                        value={formData.prix}
                        onChange={onInputChange}
                        placeholder="0.00"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={onInputChange}
                        placeholder="0"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="categories">Catégories</Label>
                <select
                    id="categories"
                    name="categories"
                    multiple
                    value={formData.categories}
                    onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData(prev => ({ ...prev, categories: selected }));
                    }}
                    className="border rounded px-3 py-2 w-full"
                    required
                >
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.nom}
                        </option>
                    ))}
                </select>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                    {submitLabel}
                </Button>
            </DialogFooter>
        </form>
    )
};

export default ProductForm;