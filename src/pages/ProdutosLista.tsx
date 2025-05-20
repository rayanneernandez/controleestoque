import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import ProdutoItem from '../components/produtos/ProdutoItem';
import FiltrosProduto from '../components/produtos/FiltrosProduto';
import { useEstoque } from '../context/EstoqueContext';
import { filtrarProdutos } from '../utils/helpers';

const ProdutosLista: React.FC = () => {
  const { produtos, filtroAtual, aplicarFiltro, limparFiltro, removerProduto } = useEstoque();
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  
  const produtosFiltrados = filtrarProdutos(produtos, filtroAtual);
  
  const handleRemoverProduto = (id: string) => {
    setConfirmarExclusao(id);
  };
  
  const confirmarRemocao = () => {
    if (confirmarExclusao) {
      removerProduto(confirmarExclusao);
      setConfirmarExclusao(null);
    }
  };
  
  const cancelarRemocao = () => {
    setConfirmarExclusao(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
        <Link to="/produtos/novo">
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            Novo Produto
          </Button>
        </Link>
      </div>
      
      <FiltrosProduto
        filtro={filtroAtual}
        aplicarFiltro={aplicarFiltro}
        limparFiltro={limparFiltro}
      />
      
      {confirmarExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar exclusão</h3>
            <p className="text-gray-500 mb-4">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={cancelarRemocao}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmarRemocao}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-500 mb-6">
            {filtroAtual.categoria || filtroAtual.fornecedor || filtroAtual.termo ? 
              'Não há produtos correspondentes aos filtros aplicados.' : 
              'Nenhum produto foi cadastrado ainda.'}
          </p>
          
          {filtroAtual.categoria || filtroAtual.fornecedor || filtroAtual.termo ? (
            <Button
              variant="outline"
              onClick={limparFiltro}
            >
              Limpar Filtros
            </Button>
          ) : (
            <Link to="/produtos/novo">
              <Button
                variant="primary"
                icon={<Plus className="h-5 w-5" />}
              >
                Cadastrar Produto
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtosFiltrados.map(produto => (
            <ProdutoItem
              key={produto.id}
              produto={produto}
              onRemove={handleRemoverProduto}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProdutosLista;