import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useEstoque } from '../context/EstoqueContext';

const NovoProduto: React.FC = () => {
  const navigate = useNavigate();
  const { categorias, fornecedores, adicionarProduto } = useEstoque();
  
  const [dadosProduto, setDadosProduto] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    preco: 0,
    quantidadeEmEstoque: 0,
    estoqueMinimo: 0,
    unidade: 'un',
    codigo: '',
    fornecedor: '',
    localArmazenamento: '',
    validade: '',
    imagem: '',
  });
  
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Converter valores numéricos para números
    if (type === 'number') {
      setDadosProduto({
        ...dadosProduto,
        [name]: value !== '' ? parseFloat(value) : 0,
      });
    } else {
      setDadosProduto({
        ...dadosProduto,
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
    
    if (!dadosProduto.nome.trim()) {
      novosErros.nome = 'Nome do produto é obrigatório';
    }
    
    if (!dadosProduto.categoria) {
      novosErros.categoria = 'Selecione uma categoria';
    }
    
    if (dadosProduto.preco < 0) {
      novosErros.preco = 'Preço não pode ser negativo';
    }
    
    if (dadosProduto.quantidadeEmEstoque < 0) {
      novosErros.quantidadeEmEstoque = 'Quantidade não pode ser negativa';
    }
    
    if (!dadosProduto.unidade.trim()) {
      novosErros.unidade = 'Unidade é obrigatória';
    }
    
    if (!dadosProduto.codigo.trim()) {
      novosErros.codigo = 'Código do produto é obrigatório';
    }
    
    if (!dadosProduto.fornecedor) {
      novosErros.fornecedor = 'Selecione um fornecedor';
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
      adicionarProduto(dadosProduto);
      setLoading(false);
      navigate('/produtos');
    }, 500);
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
        <h1 className="text-2xl font-semibold text-gray-900 ml-4">Novo Produto</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <Input
                label="Nome do Produto *"
                id="nome"
                name="nome"
                value={dadosProduto.nome}
                onChange={handleChange}
                error={erros.nome}
                fullWidth
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={3}
                value={dadosProduto.descricao}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ></textarea>
            </div>
            
            <Select
              label="Categoria *"
              id="categoria"
              name="categoria"
              value={dadosProduto.categoria}
              onChange={handleChange}
              error={erros.categoria}
              options={[
                { value: '', label: 'Selecione uma categoria' },
                ...categorias.map(cat => ({
                  value: cat.id,
                  label: cat.nome
                }))
              ]}
              fullWidth
            />
            
            <Select
              label="Fornecedor *"
              id="fornecedor"
              name="fornecedor"
              value={dadosProduto.fornecedor}
              onChange={handleChange}
              error={erros.fornecedor}
              options={[
                { value: '', label: 'Selecione um fornecedor' },
                ...fornecedores.map(forn => ({
                  value: forn.id,
                  label: forn.nome
                }))
              ]}
              fullWidth
            />
            
            <Input
              label="Código *"
              id="codigo"
              name="codigo"
              value={dadosProduto.codigo}
              onChange={handleChange}
              error={erros.codigo}
              fullWidth
            />
            
            <Input
              label="Preço *"
              id="preco"
              name="preco"
              type="number"
              min="0"
              step="0.01"
              value={dadosProduto.preco}
              onChange={handleChange}
              error={erros.preco}
              fullWidth
            />
            
            <Input
              label="Quantidade em Estoque *"
              id="quantidadeEmEstoque"
              name="quantidadeEmEstoque"
              type="number"
              min="0"
              value={dadosProduto.quantidadeEmEstoque}
              onChange={handleChange}
              error={erros.quantidadeEmEstoque}
              fullWidth
            />
            
            <Input
              label="Estoque Mínimo"
              id="estoqueMinimo"
              name="estoqueMinimo"
              type="number"
              min="0"
              value={dadosProduto.estoqueMinimo}
              onChange={handleChange}
              fullWidth
            />
            
            <Input
              label="Unidade *"
              id="unidade"
              name="unidade"
              value={dadosProduto.unidade}
              onChange={handleChange}
              error={erros.unidade}
              helpText="Ex: un, kg, cx, etc."
              fullWidth
            />
            
            <Input
              label="Local de Armazenamento"
              id="localArmazenamento"
              name="localArmazenamento"
              value={dadosProduto.localArmazenamento}
              onChange={handleChange}
              fullWidth
            />
            
            <Input
              label="Data de Validade"
              id="validade"
              name="validade"
              type="date"
              value={dadosProduto.validade}
              onChange={handleChange}
              fullWidth
            />
            
            <Input
              label="URL da Imagem"
              id="imagem"
              name="imagem"
              value={dadosProduto.imagem}
              onChange={handleChange}
              helpText="Insira uma URL válida para a imagem do produto"
              fullWidth
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/produtos')}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              icon={<Save className="h-5 w-5" />}
              loading={loading}
            >
              Salvar Produto
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NovoProduto;