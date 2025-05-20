import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useEstoque } from '../context/EstoqueContext';
import MovimentacaoItem from '../components/movimentacoes/MovimentacaoItem';

const MovimentacoesLista: React.FC = () => {
  const { movimentacoes } = useEstoque();
  
  // Ordenar movimentações por data (mais recentes primeiro)
  const movimentacoesOrdenadas = [...movimentacoes].sort((a, b) => {
    const dataA = new Date(a.data.split('/').reverse().join('-'));
    const dataB = new Date(b.data.split('/').reverse().join('-'));
    return dataB.getTime() - dataA.getTime();
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Movimentações</h1>
        <Link to="/movimentacoes/nova">
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            Nova Movimentação
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Entradas (Total)</h3>
            <p className="text-2xl font-semibold text-green-600">
              {movimentacoes.filter(m => m.tipo === 'entrada').length}
            </p>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Saídas (Total)</h3>
            <p className="text-2xl font-semibold text-red-600">
              {movimentacoes.filter(m => m.tipo === 'saida').length}
            </p>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Última Movimentação</h3>
            <p className="text-lg font-medium text-gray-900">
              {movimentacoesOrdenadas.length > 0 ? movimentacoesOrdenadas[0].data : 'N/A'}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        {movimentacoesOrdenadas.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma movimentação encontrada</h3>
            <p className="text-gray-500 mb-6">
              Não há movimentações de estoque registradas no sistema.
            </p>
            
            <Link to="/movimentacoes/nova">
              <Button
                variant="primary"
                icon={<Plus className="h-5 w-5" />}
              >
                Registrar Movimentação
              </Button>
            </Link>
          </div>
        ) : (
          movimentacoesOrdenadas.map(movimentacao => (
            <MovimentacaoItem key={movimentacao.id} movimentacao={movimentacao} />
          ))
        )}
      </div>
    </div>
  );
};

export default MovimentacoesLista;