import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useEstoque } from '../context/EstoqueContext';

const NovaMovimentacao: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { produtos, registrarMovimentacao } = useEstoque();
  
  // Extrair produtoId da URL se existir
  const params = new URLSearchParams(location.search);
  const produtoIdParam = params.get('produtoId');
  
  const [dadosMovimentacao, setDadosMovimentacao] = useState({
    produtoId: produtoIdParam || '',
    tipo: 'entrada',
    quantidade: 1,
    responsavel: 'Administrador',
    observacao: '',
  });
  
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  // Verificar se o produto selecionado permite a quantidade de saída informada
  useEffect(() => {
    if (dadosMovimentacao.tipo === 'saida' && dadosMovimentacao.produtoId) {
      const produto = produtos.find(p => p.id === dadosMovimentacao.produtoId);
      
      if (produto && dadosMovimentacao.quantidade > produto.quantidadeEmEstoque) {
        setErros(prev => ({
          ...prev,
          quantidade: `Quantidade excede o estoque disponível (${produto.quantidadeEmEstoque} ${produto.unidade})`,
        }));
      } else if (erros.quantidade) {
        setErros(prev => {
          const novoErros = { ...prev };
          delete novoErros.quantidade;
          return novoErros;
        });
      }
    }
  }, [dadosMovimentacao.tipo, dadosMovimentacao.produtoId, dadosMovimentacao.quantidade, produtos, erros.quantidade]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Converter valores numéricos para números
    if (type === 'number') {
      setDadosMovimentacao({
        ...dadosMovimentacao,
        [name]: value !== '' ? parseInt(value, 10) : 0,
      });
    } else {
      setDadosMovimentacao({
        ...dadosMovimentacao,
        [name]: value,
      });
    }
    
    // Limpar erro do campo quando ele for alterado
    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };
  
  const validarCampos = () => {
    const novosErros: { [key: string]: string } = {};
    
    if (!dadosMovimentacao.produtoId) {
      novosErros.produtoId = 'Selecione um produto';
    }
    
    if (!dadosMovimentacao.tipo) {
      novosErros.tipo = 'Selecione o tipo de movimentação';
    }
    
    if (dadosMovimentacao.quantidade <= 0) {
      novosErros.quantidade = 'Quantidade deve ser maior que zero';
    }
    
    if (dadosMovimentacao.tipo === 'saida' && dadosMovimentacao.produtoId) {
      const produto = produtos.find(p => p.id === dadosMovimentacao.produtoId);
      
      if (produto && dadosMovimentacao.quantidade > produto.quantidadeEmEstoque) {
        novosErros.quantidade = `Quantidade excede o estoque disponível (${produto.quantidadeEmEstoque} ${produto.unidade})`;
      }
    }
    
    if (!dadosMovimentacao.responsavel.trim()) {
      novosErros.responsavel = 'Responsável é obrigatório';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarCampos()) {
      return;
    }
    
    setLoading(true);
    
    // Simulando uma operação assíncrona
    setTimeout(() => {
      registrarMovimentacao(dadosMovimentacao);
      setLoading(false);
      navigate('/movimentacoes');
    }, 500);
  };
  
  // Obter informações do produto selecionado
  const produtoSelecionado = produtos.find(p => p.id === dadosMovimentacao.produtoId);
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-5 w-5" />}
          onClick={() => navigate('/movimentacoes')}
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900 ml-4">Nova Movimentação</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Select
              label="Produto *"
              id="produtoId"
              name="produtoId"
              value={dadosMovimentacao.produtoId}
              onChange={handleChange}
              error={erros.produtoId}
              options={[
                { value: '', label: 'Selecione um produto' },
                ...produtos.map(prod => ({
                  value: prod.id,
                  label: `${prod.nome} (${prod.codigo}) - ${prod.quantidadeEmEstoque} ${prod.unidade} em estoque`,
                }))
              ]}
              fullWidth
            />
            
            <Select
              label="Tipo de Movimentação *"
              id="tipo"
              name="tipo"
              value={dadosMovimentacao.tipo}
              onChange={handleChange}
              error={erros.tipo}
              options={[
                { value: 'entrada', label: 'Entrada' },
                { value: 'saida', label: 'Saída' },
              ]}
              fullWidth
            />
            
            <Input
              label="Quantidade *"
              id="quantidade"
              name="quantidade"
              type="number"
              min="1"
              value={dadosMovimentacao.quantidade}
              onChange={handleChange}
              error={erros.quantidade}
              fullWidth
            />
            
            <Input
              label="Responsável *"
              id="responsavel"
              name="responsavel"
              value={dadosMovimentacao.responsavel}
              onChange={handleChange}
              error={erros.responsavel}
              fullWidth
            />
            
            <div className="md:col-span-2">
              <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-1">
                Observação
              </label>
              <textarea
                id="observacao"
                name="observacao"
                rows={3}
                value={dadosMovimentacao.observacao}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          
          {produtoSelecionado && (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Informações do Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Estoque Atual:</span>
                  <span className="ml-2 font-medium">
                    {produtoSelecionado.quantidadeEmEstoque} {produtoSelecionado.unidade}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Estoque Mínimo:</span>
                  <span className="ml-2 font-medium">
                    {produtoSelecionado.estoqueMinimo} {produtoSelecionado.unidade}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Estoque Após Movimentação:</span>
                  <span className={`ml-2 font-medium ${
                    dadosMovimentacao.tipo === 'entrada'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {dadosMovimentacao.tipo === 'entrada'
                      ? produtoSelecionado.quantidadeEmEstoque + dadosMovimentacao.quantidade
                      : produtoSelecionado.quantidadeEmEstoque - dadosMovimentacao.quantidade
                    } {produtoSelecionado.unidade}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/movimentacoes')}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              icon={<Save className="h-5 w-5" />}
              loading={loading}
            >
              Registrar Movimentação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NovaMovimentacao;