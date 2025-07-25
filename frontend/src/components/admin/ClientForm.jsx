import React, { useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { DialogFooter } from '../../components/ui/dialog';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../components/ui/collapsible';


const ClientForm = ({ onSubmit, submitLabel, error, formData, setFormData, handleInputChange, createClientMutation, updateClientMutation }) => {
    
    const onFormSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit();
    }, [onSubmit]);

    const onInputChange = useCallback((e) => {
        handleInputChange(e);
    }, [handleInputChange]);
    
    const civiliteOptions = [
      { value: '', label: 'Sélectionner' },
      { value: 'M', label: 'M' },
      { value: 'Mme', label: 'Mme' },
    ];
    const telephoneTypeOptions = [
      { value: 'mobile', label: 'Mobile' },
      { value: 'fixe', label: 'Fixe' },
      { value: 'professionnel', label: 'Professionnel' },
    ];
    const adresseTypeOptions = [
      { value: '', label: 'Sélectionner' },
      { value: 'livraison', label: 'Livraison' },
      { value: 'facturation', label: 'Facturation' },
      { value: 'les deux', label: 'Les deux' },
    ];
    const paiementModeOptions = [
      { value: '', label: 'Sélectionner' },
      { value: 'carte bancaire', label: 'Carte bancaire' },
      { value: 'espèces', label: 'Espèces' },
      { value: 'paypal', label: 'Paypal' },
      { value: 'virement', label: 'Virement' },
    ];
    const paiementStatutOptions = [
      { value: 'payé', label: 'Payé' },
      { value: 'non payé', label: 'Non payé' },
      { value: 'en attente', label: 'En attente' },
    ];
    const compteStatutOptions = [
      { value: 'actif', label: 'Actif' },
      { value: 'inactif', label: 'Inactif' },
      { value: 'suspendu', label: 'Suspendu' },
    ];
    const langueOptions = [
      { value: 'fr', label: 'Français' },
      { value: 'en', label: 'Anglais' },
    ];
    const deviseOptions = [
      { value: 'EUR', label: 'EUR' },
      { value: 'MAD', label: 'MAD' },
      { value: 'USD', label: 'USD' },
    ];
    const joursOptions = [
      { value: 'lundi', label: 'Lundi' },
      { value: 'mardi', label: 'Mardi' },
      { value: 'mercredi', label: 'Mercredi' },
      { value: 'jeudi', label: 'Jeudi' },
      { value: 'vendredi', label: 'Vendredi' },
      { value: 'samedi', label: 'Samedi' },
      { value: 'dimanche', label: 'Dimanche' },
    ];
    
    return (

        <form onSubmit={onFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {/* Identité */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" className="w-full text-left font-bold">Identité</Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="space-y-2">
                        <Label htmlFor="identite.civilite">Civilité</Label>
                        <select id="identite.civilite" name="identite.civilite" value={formData.identite.civilite} onChange={onInputChange} required className="w-full border rounded p-2">
                            {civiliteOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identite.prenom">Prénom</Label>
                        <Input id="identite.prenom" name="identite.prenom" value={formData.identite.prenom} onChange={onInputChange} placeholder="Jean" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identite.nom">Nom</Label>
                        <Input id="identite.nom" name="identite.nom" value={formData.identite.nom} onChange={onInputChange} placeholder="Dupont" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identite.dateNaissance">Date de naissance</Label>
                        <Input id="identite.dateNaissance" name="identite.dateNaissance" type="date" value={formData.identite.dateNaissance || ''} onChange={onInputChange} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            {/* Contact */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" className="w-full text-left font-bold">Contact</Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="space-y-2">
                        <Label htmlFor="contact.email">Email</Label>
                        <Input id="contact.email" name="contact.email" type="email" value={formData.contact.email} onChange={onInputChange} placeholder="jean.dupont@email.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Téléphones</Label>
                        {formData.contact.telephones.map((tel, idx) => (
                            <div key={idx} className="flex gap-2 items-center mb-2">
                                <select name={`contact.telephones.${idx}.type`} value={tel.type} onChange={onInputChange} className="border rounded p-2">
                                    {telephoneTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <Input name={`contact.telephones.${idx}.numero`} value={tel.numero} onChange={onInputChange} placeholder="Numéro" required />
                                <label className="flex items-center gap-1">
                                    <input type="checkbox" name={`contact.telephones.${idx}.estPrincipal`} checked={!!tel.estPrincipal} onChange={onInputChange} /> Principal
                                </label>
                                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, contact: { ...prev.contact, telephones: prev.contact.telephones.filter((_, i) => i !== idx) } }))} disabled={formData.contact.telephones.length === 1}>-</Button>
                                {idx === formData.contact.telephones.length - 1 && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, contact: { ...prev.contact, telephones: [...prev.contact.telephones, { type: 'mobile', numero: '', estPrincipal: false }] } }))}>+</Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Notifications</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1">
                                <input type="checkbox" name="contact.notification.sms" checked={formData.contact.notification.sms} onChange={onInputChange} /> SMS
                            </label>
                            <label className="flex items-center gap-1">
                                <input type="checkbox" name="contact.notification.email" checked={formData.contact.notification.email} onChange={onInputChange} /> Email
                            </label>
                            <label className="flex items-center gap-1">
                                <input type="checkbox" name="contact.notification.push" checked={formData.contact.notification.push} onChange={onInputChange} /> Push
                            </label>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            {/* Adresses */}
            <Collapsible>
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" className="w-full text-left font-bold">Adresses</Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {formData.adresses.map((adr, idx) => (
                        <div key={idx} className="border rounded p-3 mb-2 space-y-2">
                            <Input name={`adresses.${idx}.alias`} value={adr.alias} onChange={onInputChange} placeholder="Alias (Maison, Bureau...)" />
                            <select name={`adresses.${idx}.type`} value={adr.type} onChange={onInputChange} className="border rounded p-2">
                                {adresseTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <Input name={`adresses.${idx}.ligne1`} value={adr.ligne1} onChange={onInputChange} placeholder="Adresse (ligne 1)" required />
                            <Input name={`adresses.${idx}.ligne2`} value={adr.ligne2} onChange={onInputChange} placeholder="Adresse (ligne 2)" />
                            <Input name={`adresses.${idx}.codePostal`} value={adr.codePostal} onChange={onInputChange} placeholder="Code Postal" required />
                            <Input name={`adresses.${idx}.ville`} value={adr.ville} onChange={onInputChange} placeholder="Ville" required />
                            <Input name={`adresses.${idx}.pays`} value={adr.pays} onChange={onInputChange} placeholder="Pays" required />
                            <Input name={`adresses.${idx}.instructions`} value={adr.instructions} onChange={onInputChange} placeholder="Instructions de livraison" />
                            <div>
                                <Label>Horaires de livraison</Label>
                                <select name={`adresses.${idx}.horairesLivraison.jours`} multiple value={adr.horairesLivraison.jours} onChange={onInputChange} className="border rounded p-2 w-full">
                                    {joursOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <Input name={`adresses.${idx}.horairesLivraison.creneau`} value={adr.horairesLivraison.creneau} onChange={onInputChange} placeholder="Créneau (ex: 12h-14h)" />
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, adresses: prev.adresses.filter((_, i) => i !== idx) }))} disabled={formData.adresses.length === 1}>-</Button>
                            {idx === formData.adresses.length - 1 && (
                                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, adresses: [...prev.adresses, { alias: '', type: '', ligne1: '', ligne2: '', codePostal: '', ville: '', pays: 'Maroc', instructions: '', horairesLivraison: { jours: [], creneau: '' } }] }))}>+</Button>
                            )}
                        </div>
                    ))}
                </CollapsibleContent>
            </Collapsible>
            {/* Paiement */}
            <Collapsible>
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" className="w-full text-left font-bold">Paiement</Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="space-y-2">
                        <Label htmlFor="paiement.mode">Mode de paiement</Label>
                        <select id="paiement.mode" name="paiement.mode" value={formData.paiement.mode} onChange={onInputChange} required className="w-full border rounded p-2">
                            {paiementModeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paiement.statut">Statut du paiement</Label>
                        <select id="paiement.statut" name="paiement.statut" value={formData.paiement.statut} onChange={onInputChange} required className="w-full border rounded p-2">
                            {paiementStatutOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            {/* Compte */}
            <Collapsible>
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" className="w-full text-left font-bold">Compte</Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="space-y-2">
                        <Label htmlFor="compte.statut">Statut du compte</Label>
                        <select id="compte.statut" name="compte.statut" value={formData.compte.statut} onChange={onInputChange} required className="w-full border rounded p-2">
                            {compteStatutOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compte.preferences.langue">Langue</Label>
                        <select id="compte.preferences.langue" name="compte.preferences.langue" value={formData.compte.preferences.langue} onChange={onInputChange} required className="w-full border rounded p-2">
                            {langueOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compte.preferences.devise">Devise</Label>
                        <select id="compte.preferences.devise" name="compte.preferences.devise" value={formData.compte.preferences.devise} onChange={onInputChange} required className="w-full border rounded p-2">
                            {deviseOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <DialogFooter>
                <Button type="submit" disabled={createClientMutation.isPending || updateClientMutation.isPending}>
                    {submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}

export default ClientForm;