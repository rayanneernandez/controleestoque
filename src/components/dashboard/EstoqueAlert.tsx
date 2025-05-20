import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useEstoque } from '../../context/EstoqueContext';
import { Link } from 'react-router-dom';

const EstoqueAlert: React.FC = () => {
  const { produtos } = useEstoque();
  
  const produtosEstoqueBaixo = produtos
    .filter(produto => produto.quantidadeEmEstoque <= produto.estoqueMinimo)
    .sort((a, b) => (a.quantidadeEmEstoque / a.estoqueMinimo) - (b.quantidadeEmEstoque / b.estoqueMinimo))
    .slice(0, 5);
    
  return (
    <Card>
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Produtos com Estoque Baixo</h3>
      </div>
      
      {produtosEstoqueBaixo.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhum produto com estoque baixo no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {produtosEstoqueBaixo.map(produto => {
            const percentagem = (produto.quantidadeEmEstoque / produto.estoqueMinimo) * 100;
            
            return (
              <div key={produto.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Link to={`/produtos/${produto.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {produto.nome}
                    </Link>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>
                        {produto.quantidadeEmEstoque} / {produto.estoqueMinimo} {produto.unidade}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          percentagem <= 25 ? 'bg-red-500' : 
                          percentagem <= 50 ? 'bg-yellow-500' : 'bg-orange-400'
                        }`}
                        style={{ width: `${Math.min(percentagem, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <Link to={`/movimentacoes/nova?produtoId=${produto.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Repor
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {produtosEstoqueBaixo.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link 
            to="/produtos?filtro=estoque-baixo" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Ver todos os produtos com estoque baixo →
          </Link>
        </div>
      )}
    </Card>
  );
};

export default EstoqueAlert;