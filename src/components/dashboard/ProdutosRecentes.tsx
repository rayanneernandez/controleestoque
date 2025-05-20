import React from 'react';
import { useEstoque } from '../../context/EstoqueContext';
import Card from '../ui/Card';
import { formatarMoeda } from '../../utils/formatters';
import { truncarTexto } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Link } from 'react-router-dom';

const ProdutosRecentes: React.FC = () => {
  const { produtos, obterCategoriaPorId } = useEstoque();
  
  // Ordenar produtos por data de cadastro (mais recentes primeiro)
  const produtosRecentes = [...produtos]
    .sort((a, b) => {
      const dataA = new Date(a.dataCadastro.split('/').reverse().join('-'));
      const dataB = new Date(b.dataCadastro.split('/').reverse().join('-'));
      return dataB.getTime() - dataA.getTime();
    })
    .slice(0, 5);
    
  return (
    <Card title="Produtos Recentes">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtosRecentes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-sm text-gray-500 text-center">
                  Nenhum produto cadastrado
                </td>
              </tr>
            ) : (
              produtosRecentes.map((produto) => {
                const categoria = obterCategoriaPorId(produto.categoria);
                const statusEstoque = 
                  produto.quantidadeEmEstoque <= 0 ? 'esgotado' :
                  produto.quantidadeEmEstoque <= produto.estoqueMinimo ? 'baixo' : 'normal';
                
                return (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {produto.imagem ? (
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="h-10 w-10 rounded-md object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-xs">Sem img</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/produtos/${produto.id}`} className="hover:text-blue-600">
                              {truncarTexto(produto.nome, 25)}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500">{produto.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge 
                        variant="primary" 
                        className={categoria?.cor ? `bg-opacity-20 text-opacity-90 bg-${categoria.cor} text-${categoria.cor}` : ''}
                      >
                        {categoria?.nome || 'Sem categoria'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatarMoeda(produto.preco)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {produto.quantidadeEmEstoque} {produto.unidade}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {statusEstoque === 'esgotado' && (
                        <Badge variant="danger">Esgotado</Badge>
                      )}
                      {statusEstoque === 'baixo' && (
                        <Badge variant="warning">Estoque Baixo</Badge>
                      )}
                      {statusEstoque === 'normal' && (
                        <Badge variant="success">Normal</Badge>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {produtos.length > 5 && (
        <div className="pt-4 border-t border-gray-200 mt-4">
          <Link to="/produtos" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Ver todos os produtos →
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ProdutosRecentes;