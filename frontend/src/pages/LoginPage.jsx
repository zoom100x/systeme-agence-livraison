import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Truck, Shield } from 'lucide-react';
import '../App.css';

const LoginPage = () => {
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    motDePasse: '',
  });
  
  const [livreurCredentials, setLivreurCredentials] = useState({
    email: '',
    motDePasse: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('admin');
  
  const { loginAdmin, loginLivreur } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await loginAdmin(adminCredentials);
      
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLivreurLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await loginLivreur(livreurCredentials);
      
      if (result.success) {
        navigate('/livreur', { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLivreurInputChange = (e) => {
    const { name, value } = e.target;
    setLivreurCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Delivery Manager</CardTitle>
          <CardDescription>
            Connectez-vous à votre espace de gestion
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="livreur" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Livreur
              </TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="admin" className="space-y-4 mt-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@delivery.com"
                    value={adminCredentials.email}
                    onChange={handleAdminInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Mot de passe</Label>
                  <Input
                    id="admin-password"
                    name="motDePasse"
                    type="password"
                    placeholder="••••••••"
                    value={adminCredentials.motDePasse}
                    onChange={handleAdminInputChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter en tant qu\'Admin'
                  )}
                </Button>
              </form>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Compte de démonstration :</p>
                <p>Email: admin@delivery.com</p>
                <p>Mot de passe: admin123</p>
              </div>
            </TabsContent>
            
            <TabsContent value="livreur" className="space-y-4 mt-4">
              <form onSubmit={handleLivreurLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="livreur-email">Email</Label>
                  <Input
                    id="livreur-email"
                    name="email"
                    type="email"
                    placeholder="livreur@delivery.com"
                    value={livreurCredentials.email}
                    onChange={handleLivreurInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="livreur-password">Mot de passe</Label>
                  <Input
                    id="livreur-password"
                    name="motDePasse"
                    type="password"
                    placeholder="••••••••"
                    value={livreurCredentials.motDePasse}
                    onChange={handleLivreurInputChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter en tant que Livreur'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

