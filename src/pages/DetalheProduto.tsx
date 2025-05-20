import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, AlertTriangle, ArrowUpDown } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useEstoque } from '../context/EstoqueContext';
import { formatarMoeda, formatarData } from '../utils/formatters';
import MovimentacaoItem from '../components/movimentacoes/MovimentacaoItem';

const DetalheProduto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    obterProdutoPorId, 
    obterCategoriaPorId, 
    obterFornecedorPorId, 
    obterMovimentacoesPorProduto,
    removerProduto
  } = useEstoque();
  
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  
  const produto = obterProdutoPorId(id || '');
  
  if (!produto) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6">
          O produto que você está procurando não foi encontrado ou foi removido.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate('/produtos')}
        >
          Voltar para Lista de Produtos
        </Button>
      </div>
    );
  }
  
  const categoria = obterCategoriaPorId(produto.categoria);
  const fornecedor = obterFornecedorPorId(produto.fornecedor);
  const movimentacoes = obterMovimentacoesPorProduto(produto.id);
  
  // Ordenar movimentações por data (mais recentes primeiro)
  const movimentacoesOrdenadas = [...movimentacoes].sort((a, b) => {
    const dataA = new Date(a.data.split('/').reverse().join('-'));
    const dataB = new Date(b.data.split('/').reverse().join('-'));
    return dataB.getTime() - dataA.getTime();
  });
  
  const getEstoqueStatus = (): { label: string; variant: string } => {
    if (produto.quantidadeEmEstoque <= 0) {
      return { label: 'Esgotado', variant: 'danger' };
    } else if (produto.quantidadeEmEstoque <= produto.estoqueMinimo) {
      return { label: 'Estoque Baixo', variant: 'warning' };
    } else {
      return { label: 'Normal', variant: 'success' };
    }
  };
  
  const status = getEstoqueStatus();
  
  const handleExcluir = () => {
    removerProduto(produto.id);
    navigate('/produtos');
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-5 w-5" />}
          onClick={() => navigate('/produtos')}
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900 ml-4">Detalhe do Produto</h1>
      </div>
      
      {confirmarExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar exclusão</h3>
            <p className="text-gray-500 mb-4">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setConfirmarExclusao(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleExcluir}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Sem imagem</span>
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{produto.nome}</h2>
                  <Badge variant={status.variant as any}>
                    {status.label}
                  </Badge>
                </div>
                
                <div className="text-lg font-medium text-gray-900 mb-4">
                  {formatarMoeda(produto.preco)}
                </div>
                
                <p className="text-gray-600 mb-4">{produto.descricao}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Código</h4>
                    <p className="text-sm text-gray-900">{produto.codigo}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Categoria</h4>
                    <p className="text-sm text-gray-900">{categoria?.nome || 'Não informada'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fornecedor</h4>
                    <p className="text-sm text-gray-900">{fornecedor?.nome || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Data de Cadastro</h4>
                    <p className="text-sm text-gray-900">{produto.dataCadastro}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Local</h4>
                    <p className="text-sm text-gray-900">{produto.localArmazenamento || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Validade</h4>
                    <p className="text-sm text-gray-900">{produto.validade || 'Não informada'}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
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
                    onClick={() => setConfirmarExclusao(true)}
                  >
                    Excluir
                  </Button>
                  <Link to={`/movimentacoes/nova?produtoId=${produto.id}`}>
                    <Button 
                      variant="primary" 
                      size="sm"
                      icon={<ArrowUpDown className="h-4 w-4" />}
                    >
                      Movimentar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Estoque</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-500">Estoque Atual</h4>
                  <span className="text-lg font-medium text-gray-900">
                    {produto.quantidadeEmEstoque} {produto.unidade}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status.variant === 'success' ? 'bg-green-500' :
                      status.variant === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(
                        (produto.quantidadeEmEstoque / (produto.estoqueMinimo * 2)) * 100, 
                        100
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Estoque Mínimo</h4>
                <p className="text-lg font-medium text-gray-900">
                  {produto.estoqueMinimo} {produto.unidade}
                </p>
              </div>
              
              {produto.quantidadeEmEstoque <= produto.estoqueMinimo && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Alerta de Estoque</h4>
                    <p className="text-sm text-yellow-700">
                      Este produto está com estoque abaixo do mínimo recomendado.
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Última Movimentação</h4>
                {movimentacoesOrdenadas.length > 0 ? (
                  <p className="text-base text-gray-900">
                    {movimentacoesOrdenadas[0].tipo === 'entrada' ? 'Entrada' : 'Saída'} de {' '}
                    {movimentacoesOrdenadas[0].quantidade} {produto.unidade} em {' '}
                    {movimentacoesOrdenadas[0].data}
                  </p>
                ) : (
                  <p className="text-base text-gray-500">Sem movimentações</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Card title="Histórico de Movimentações">
        {movimentacoesOrdenadas.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Nenhuma movimentação registrada para este produto.</p>
            
            <div className="mt-4">
              <Link to={`/movimentacoes/nova?produtoId=${produto.id}`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<ArrowUpDown className="h-4 w-4" />}
                >
                  Registrar Movimentação
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {movimentacoesOrdenadas.map(movimentacao => (
              <MovimentacaoItem key={movimentacao.id} movimentacao={movimentacao} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetalheProduto;