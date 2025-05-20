import React from 'react';
import Card from '../ui/Card';
import { useEstoque } from '../../context/EstoqueContext';
import { contarCategoria } from '../../utils/helpers';

const GraficosCategorias: React.FC = () => {
  const { produtos, categorias } = useEstoque();
  
  // Dados para o gráfico de barras
  const categoriasProdutos = categorias.map(categoria => {
    const quantidade = contarCategoria(produtos, categoria.id);
    return {
      id: categoria.id,
      nome: categoria.nome,
      quantidade,
      porcentagem: produtos.length > 0 ? (quantidade / produtos.length) * 100 : 0,
      cor: categoria.cor || '#3B82F6',
    };
  }).sort((a, b) => b.quantidade - a.quantidade);
  
  return (
    <Card title="Distribuição por Categoria">
      {categoriasProdutos.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          Não há dados suficientes para exibir
        </div>
      ) : (
        <div className="space-y-4">
          {categoriasProdutos.map((categoria) => (
            <div key={categoria.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-700">{categoria.nome}</div>
                <div className="text-sm text-gray-500">{categoria.quantidade} produtos</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${categoria.porcentagem}%`,
                    backgroundColor: categoria.cor,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GraficosCategorias;