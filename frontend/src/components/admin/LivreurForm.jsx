import React, { useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DialogFooter } from '../ui/dialog';

const LivreurForm = ({ onSubmit, submitLabel, isEdit = false, formData, handleInputChange, createLivreurMutation, updateLivreurMutation }) => {
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
        <Label htmlFor="prenom">Prenom</Label>
        <Input
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={onInputChange}
          placeholder="Jean"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={onInputChange}
          placeholder="Dupont"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="jean.dupont@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          name="telephone"
          value={formData.telephone}
          onChange={onInputChange}
          placeholder="06 12 34 56 78"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motDePasse">
          {isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
        </Label>
        <Input
          id="motDePasse"
          name="motDePasse"
          type="password"
          value={formData.motDePasse}
          onChange={onInputChange}
          placeholder="••••••••"
          required={!isEdit}
        />
        {isEdit && (
          <p className="text-sm text-muted-foreground">
            Laissez vide pour conserver le mot de passe actuel
          </p>
        )}
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={createLivreurMutation?.isPending || updateLivreurMutation?.isPending}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default LivreurForm;