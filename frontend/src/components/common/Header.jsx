import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { LogOut, User, Truck, Shield } from 'lucide-react';

const Header = ({ title = 'Dashboard' }) => {
  const { user, logout, isAdmin, isLivreur } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (user?.identite?.prenom || user?.identite?.nom) {
      return ((user.identite?.prenom?.charAt(0) || '') + (user.identite?.nom?.charAt(0) || '')).toUpperCase();
    }
    if (user?.nom) return user.nom.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
    return 'U';
  };

  const getRoleIcon = () => {
    if (isAdmin()) return <Shield className="h-4 w-4" />;
    if (isLivreur()) return <Truck className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getRoleLabel = () => {
    if (isAdmin()) return 'Administrateur';
    if (isLivreur()) return 'Livreur';
    return 'Utilisateur';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">Delivery Manager</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.identite ? `${user.identite.prenom} ${user.identite.nom}` : (user?.nom || 'Utilisateur')}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.contact?.email || user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem disabled>
                <div className="flex items-center space-x-2">
                  {getRoleIcon()}
                  <span className="text-sm">{getRoleLabel()}</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

