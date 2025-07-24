import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';

const LivreurLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Espace Livreur" />
      
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default LivreurLayout;

