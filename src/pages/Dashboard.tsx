import React from 'react';
import EstoqueResumo from '../components/dashboard/EstoqueResumo';
import ProdutosRecentes from '../components/dashboard/ProdutosRecentes';
import GraficosCategorias from '../components/dashboard/GraficosCategorias';
import EstoqueAlert from '../components/dashboard/EstoqueAlert';

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      
      <EstoqueResumo />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ProdutosRecentes />
        </div>
        <div>
          <EstoqueAlert />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficosCategorias />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Movimentações Recentes</h2>
          <p className="text-gray-500 text-sm">O gráfico de movimentações será exibido aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;