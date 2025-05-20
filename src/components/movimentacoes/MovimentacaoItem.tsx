import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Movimentacao } from '../../types';
import { useEstoque } from '../../context/EstoqueContext';
import { truncarTexto } from '../../utils/formatters';

interface MovimentacaoItemProps {
  movimentacao: Movimentacao;
}

const MovimentacaoItem: React.FC<MovimentacaoItemProps> = ({ movimentacao }) => {
  const { obterProdutoPorId } = useEstoque();
  const produto = obterProdutoPorId(movimentacao.produtoId);
  
  if (!produto) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div 
          className={`p-2 rounded-full mr-4 ${
            movimentacao.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {movimentacao.tipo === 'entrada' ? (
            <ArrowUpRight className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDownLeft className="h-5 w-5 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900">
            {movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}: {produto.nome}
          </h3>
          <p className="text-sm text-gray-500">
            {movimentacao.data} • {movimentacao.responsavel}
          </p>
        </div>
        
        <div className="ml-4 text-right">
          <div className={`text-base font-medium ${
            movimentacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
          }`}>
            {movimentacao.tipo === 'entrada' ? '+' : '-'}{movimentacao.quantidade} {produto.unidade}
          </div>
          {movimentacao.observacao && (
            <p className="text-sm text-gray-500">{truncarTexto(movimentacao.observacao, 30)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovimentacaoItem;