import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, ShoppingCart, Package } from 'lucide-react';
import Card from '../ui/Card';
import { useEstoque } from '../../context/EstoqueContext';
import { formatarMoeda, formatarNumero } from '../../utils/formatters';
import { calcularValorTotal } from '../../utils/helpers';

const EstoqueResumo: React.FC = () => {
  const { produtos, alertas, movimentacoes } = useEstoque();
  
  const valorTotalEstoque = calcularValorTotal(produtos);
  const produtosEmEstoqueBaixo = produtos.filter(p => p.quantidadeEmEstoque <= p.estoqueMinimo);
  
  // Calcular entrada/saída do último período (30 dias)
  const dataAtual = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 30);
  
  const movimentacoesRecentes = movimentacoes.filter(m => {
    const dataMov = new Date(m.data.split('/').reverse().join('-'));
    return dataMov >= dataLimite;
  });
  
  const entradas = movimentacoesRecentes
    .filter(m => m.tipo === 'entrada')
    .reduce((total, m) => total + 1, 0);
    
  const saidas = movimentacoesRecentes
    .filter(m => m.tipo === 'saida')
    .reduce((total, m) => total + 1, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="border-l-4 border-l-blue-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Produtos</p>
            <p className="text-2xl font-semibold text-gray-900">{formatarNumero(produtos.length)}</p>
          </div>
        </div>
      </Card>
      
      <Card className="border-l-4 border-l-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Valor em Estoque</p>
            <p className="text-2xl font-semibold text-gray-900">{formatarMoeda(valorTotalEstoque)}</p>
          </div>
        </div>
      </Card>
      
      <Card className="border-l-4 border-l-yellow-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estoque Baixo</p>
            <p className="text-2xl font-semibold text-gray-900">{produtosEmEstoqueBaixo.length}</p>
            <p className="text-sm text-gray-500">{alertas.filter(a => !a.lido && a.tipo === 'baixo').length} alertas</p>
          </div>
        </div>
      </Card>
      
      <Card className="border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 mr-4">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Movimentações (30d)</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-green-600 mr-4">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{entradas}</span>
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{saidas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EstoqueResumo;