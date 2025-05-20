import React, { useState } from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { useEstoque } from '../../context/EstoqueContext';
import { Filtro } from '../../types';

interface FiltrosProdutoProps {
  filtro: Filtro;
  aplicarFiltro: (filtro: Filtro) => void;
  limparFiltro: () => void;
}

const FiltrosProduto: React.FC<FiltrosProdutoProps> = ({
  filtro,
  aplicarFiltro,
  limparFiltro
}) => {
  const { categorias, fornecedores } = useEstoque();
  const [filtroLocal, setFiltroLocal] = useState<Filtro>(filtro);
  const [filtroPainel, setFiltroPainel] = useState(false);
  
  const toggleFiltroPainel = () => {
    setFiltroPainel(!filtroPainel);
  };
  
  const handleChangeFiltro = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFiltroLocal({ ...filtroLocal, [name]: value });
  };
  
  const handleChangeOrdenacao = (campo: 'nome' | 'estoque' | 'preco') => {
    if (filtroLocal.ordenacao === campo) {
      // Alternar direção se já estiver ordenando por este campo
      setFiltroLocal({
        ...filtroLocal,
        direcao: filtroLocal.direcao === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Definir novo campo e direção padrão asc
      setFiltroLocal({
        ...filtroLocal,
        ordenacao: campo,
        direcao: 'asc'
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aplicarFiltro(filtroLocal);
  };
  
  const handleLimpar = () => {
    setFiltroLocal({});
    limparFiltro();
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="h-4 w-4" />}
            onClick={toggleFiltroPainel}
          >
            Filtros
          </Button>
          
          {(filtro.categoria || filtro.fornecedor || filtro.termo || filtro.ordenacao) && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={handleLimpar}
              className="ml-2"
            >
              Limpar
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={filtroLocal.ordenacao === 'nome' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleChangeOrdenacao('nome')}
            className="px-2"
          >
            Nome
            {filtroLocal.ordenacao === 'nome' && (
              filtroLocal.direcao === 'asc' ? 
                <SortAsc className="h-4 w-4 ml-1" /> : 
                <SortDesc className="h-4 w-4 ml-1" />
            )}
          </Button>
          
          <Button
            variant={filtroLocal.ordenacao === 'estoque' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleChangeOrdenacao('estoque')}
            className="px-2"
          >
            Estoque
            {filtroLocal.ordenacao === 'estoque' && (
              filtroLocal.direcao === 'asc' ? 
                <SortAsc className="h-4 w-4 ml-1" /> : 
                <SortDesc className="h-4 w-4 ml-1" />
            )}
          </Button>
          
          <Button
            variant={filtroLocal.ordenacao === 'preco' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleChangeOrdenacao('preco')}
            className="px-2"
          >
            Preço
            {filtroLocal.ordenacao === 'preco' && (
              filtroLocal.direcao === 'asc' ? 
                <SortAsc className="h-4 w-4 ml-1" /> : 
                <SortDesc className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
      </div>
      
      {filtroPainel && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Buscar por nome, código ou descrição"
                id="termo"
                name="termo"
                value={filtroLocal.termo || ''}
                onChange={handleChangeFiltro}
                placeholder="Digite sua busca..."
                fullWidth
              />
              
              <Select
                label="Categoria"
                id="categoria"
                name="categoria"
                value={filtroLocal.categoria || ''}
                onChange={handleChangeFiltro}
                options={[
                  { value: '', label: 'Todas as categorias' },
                  ...categorias.map(cat => ({
                    value: cat.id,
                    label: cat.nome
                  }))
                ]}
                fullWidth
              />
              
              <Select
                label="Fornecedor"
                id="fornecedor"
                name="fornecedor"
                value={filtroLocal.fornecedor || ''}
                onChange={handleChangeFiltro}
                options={[
                  { value: '', label: 'Todos os fornecedores' },
                  ...fornecedores.map(forn => ({
                    value: forn.id,
                    label: forn.nome
                  }))
                ]}
                fullWidth
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={handleLimpar}
                className="mr-2"
              >
                Limpar
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="sm"
              >
                Aplicar Filtros
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Tags de filtros ativos */}
      {(filtro.categoria || filtro.fornecedor || filtro.termo) && (
        <div className="flex flex-wrap items-center mt-2">
          <span className="text-sm text-gray-500 mr-2">Filtros ativos:</span>
          
          {filtro.termo && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
              Busca: {filtro.termo}
            </span>
          )}
          
          {filtro.categoria && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
              Categoria: {categorias.find(c => c.id === filtro.categoria)?.nome}
            </span>
          )}
          
          {filtro.fornecedor && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
              Fornecedor: {fornecedores.find(f => f.id === filtro.fornecedor)?.nome}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltrosProduto;