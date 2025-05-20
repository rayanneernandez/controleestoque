import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Produto } from '../../types';
import { useEstoque } from '../../context/EstoqueContext';
import { formatarMoeda } from '../../utils/formatters';

interface ProdutoItemProps {
  produto: Produto;
  onRemove: (id: string) => void;
}

const ProdutoItem: React.FC<ProdutoItemProps> = ({ produto, onRemove }) => {
  const { obterCategoriaPorId, obterFornecedorPorId } = useEstoque();
  
  const categoria = obterCategoriaPorId(produto.categoria);
  const fornecedor = obterFornecedorPorId(produto.fornecedor);
  
  const getEstoqueStatus = (): { label: string; variant: string } => {
    if (produto.quantidadeEmEstoque <= 0) {
      return { label: 'Esgotado', variant: 'danger' };
    } else if (produto.quantidadeEmEstoque <= produto.estoqueMinimo) {
      return { label: 'Baixo', variant: 'warning' };
    } else {
      return { label: 'Normal', variant: 'success' };
    }
  };
  
  const status = getEstoqueStatus();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-2">
          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="h-12 w-12 rounded-md object-cover mr-4"
            />
          ) : (
            <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center mr-4">
              <span className="text-gray-500 text-xs">Sem img</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate">
              <Link to={`/produtos/${produto.id}`} className="hover:text-blue-600">
                {produto.nome}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {fornecedor?.nome || 'Fornecedor não informado'} • {produto.codigo}
            </p>
          </div>
          
          <div className="ml-2">
            <Badge variant={status.variant as any}>
              {status.label}
            </Badge>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 mr-2">
                {formatarMoeda(produto.preco)}
              </span>
              {categoria && (
                <Badge 
                  variant="primary" 
                  size="sm"
                  className={categoria.cor ? `bg-opacity-20 text-opacity-90 bg-${categoria.cor} text-${categoria.cor}` : ''}
                >
                  {categoria.nome}
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-600 mr-1">
                Estoque:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {produto.quantidadeEmEstoque} {produto.unidade}
              </span>
              {produto.estoqueMinimo > 0 && (
                <span className="ml-1 text-xs text-gray-500">
                  (Min: {produto.estoqueMinimo})
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link to={`/movimentacoes/nova?produtoId=${produto.id}`}>
              <Button 
                variant="outline" 
                size="sm"
                icon={<ArrowUpDown className="h-4 w-4" />}
              >
                Movimentar
              </Button>
            </Link>
            <Link to={`/produtos/editar/${produto.id}`}>
              <Button 
                variant="outline" 
                size="sm"
                icon={<Edit className="h-4 w-4" />}
              >
                Editar
              </Button>
            </Link>
            <Button 
              variant="danger" 
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => onRemove(produto.id)}
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoItem;