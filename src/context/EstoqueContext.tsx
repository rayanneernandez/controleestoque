import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Produto, 
  Movimentacao, 
  Categoria, 
  Fornecedor, 
  AlertaEstoque,
  Filtro 
} from '../types';
import { 
  produtos as produtosIniciais,
  categorias as categoriasIniciais,
  fornecedores as fornecedoresIniciais,
  movimentacoes as movimentacoesIniciais,
  alertas as alertasIniciais
} from '../data/mockData';
import { gerarId, verificarEstoqueBaixo, verificarDataVencimento } from '../utils/helpers';
import { formatarData } from '../utils/formatters';

interface EstoqueContextType {
  produtos: Produto[];
  categorias: Categoria[];
  fornecedores: Fornecedor[];
  movimentacoes: Movimentacao[];
  alertas: AlertaEstoque[];
  filtroAtual: Filtro;
  adicionarProduto: (produto: Omit<Produto, 'id' | 'dataCadastro'>) => void;
  atualizarProduto: (id: string, produto: Partial<Produto>) => void;
  removerProduto: (id: string) => void;
  registrarMovimentacao: (movimentacao: Omit<Movimentacao, 'id' | 'data'>) => void;
  adicionarCategoria: (categoria: Omit<Categoria, 'id'>) => void;
  adicionarFornecedor: (fornecedor: Omit<Fornecedor, 'id'>) => void;
  marcarAlertaComoLido: (id: string) => void;
  aplicarFiltro: (filtro: Filtro) => void;
  limparFiltro: () => void;
  obterProdutoPorId: (id: string) => Produto | undefined;
  obterCategoriaPorId: (id: string) => Categoria | undefined;
  obterFornecedorPorId: (id: string) => Fornecedor | undefined;
  obterMovimentacoesPorProduto: (produtoId: string) => Movimentacao[];
}

interface EstoqueProviderProps {
  children: ReactNode;
}

const EstoqueContext = createContext<EstoqueContextType | undefined>(undefined);

export const EstoqueProvider: React.FC<EstoqueProviderProps> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciais);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(fornecedoresIniciais);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(movimentacoesIniciais);
  const [alertas, setAlertas] = useState<AlertaEstoque[]>(alertasIniciais);
  const [filtroAtual, setFiltroAtual] = useState<Filtro>({});

  // Verificar alertas de estoque baixo e vencimento
  useEffect(() => {
    const verificarAlertas = () => {
      const novosAlertas: AlertaEstoque[] = [];
      
      produtos.forEach(produto => {
        // Verificar estoque baixo
        if (verificarEstoqueBaixo(produto)) {
          const alertaExistente = alertas.find(
            a => a.produtoId === produto.id && a.tipo === 'baixo' && !a.lido
          );
          
          if (!alertaExistente) {
            novosAlertas.push({
              id: gerarId(),
              produtoId: produto.id,
              tipo: 'baixo',
              mensagem: `Estoque baixo: ${produto.nome} (${produto.quantidadeEmEstoque}/${produto.estoqueMinimo})`,
              data: formatarData(new Date()),
              lido: false
            });
          }
        }
        
        // Verificar vencimento
        if (verificarDataVencimento(produto)) {
          const alertaExistente = alertas.find(
            a => a.produtoId === produto.id && a.tipo === 'vencimento' && !a.lido
          );
          
          if (!alertaExistente) {
            novosAlertas.push({
              id: gerarId(),
              produtoId: produto.id,
              tipo: 'vencimento',
              mensagem: `Produto próximo ao vencimento: ${produto.nome} (${produto.validade})`,
              data: formatarData(new Date()),
              lido: false
            });
          }
        }
      });
      
      if (novosAlertas.length > 0) {
        setAlertas(prev => [...prev, ...novosAlertas]);
      }
    };
    
    verificarAlertas();
  }, [produtos, alertas]);

  const adicionarProduto = (produto: Omit<Produto, 'id' | 'dataCadastro'>) => {
    const novoProduto: Produto = {
      ...produto,
      id: gerarId(),
      dataCadastro: formatarData(new Date())
    };
    
    setProdutos(prev => [...prev, novoProduto]);
  };

  const atualizarProduto = (id: string, dadosProduto: Partial<Produto>) => {
    setProdutos(prev => 
      prev.map(produto => 
        produto.id === id ? { ...produto, ...dadosProduto } : produto
      )
    );
  };

  const removerProduto = (id: string) => {
    setProdutos(prev => prev.filter(produto => produto.id !== id));
    setMovimentacoes(prev => prev.filter(movimentacao => movimentacao.produtoId !== id));
    setAlertas(prev => prev.filter(alerta => alerta.produtoId !== id));
  };

  const registrarMovimentacao = (movimentacao: Omit<Movimentacao, 'id' | 'data'>) => {
    const novaMovimentacao: Movimentacao = {
      ...movimentacao,
      id: gerarId(),
      data: formatarData(new Date())
    };
    
    setMovimentacoes(prev => [...prev, novaMovimentacao]);
    
    // Atualizar quantidade em estoque
    const produto = produtos.find(p => p.id === movimentacao.produtoId);
    if (produto) {
      const novaQuantidade = movimentacao.tipo === 'entrada' 
        ? produto.quantidadeEmEstoque + movimentacao.quantidade
        : produto.quantidadeEmEstoque - movimentacao.quantidade;
        
      atualizarProduto(produto.id, { quantidadeEmEstoque: novaQuantidade });
    }
  };

  const adicionarCategoria = (categoria: Omit<Categoria, 'id'>) => {
    const novaCategoria: Categoria = {
      ...categoria,
      id: gerarId()
    };
    
    setCategorias(prev => [...prev, novaCategoria]);
  };

  const adicionarFornecedor = (fornecedor: Omit<Fornecedor, 'id'>) => {
    const novoFornecedor: Fornecedor = {
      ...fornecedor,
      id: gerarId()
    };
    
    setFornecedores(prev => [...prev, novoFornecedor]);
  };

  const marcarAlertaComoLido = (id: string) => {
    setAlertas(prev => 
      prev.map(alerta => 
        alerta.id === id ? { ...alerta, lido: true } : alerta
      )
    );
  };

  const aplicarFiltro = (filtro: Filtro) => {
    setFiltroAtual(filtro);
  };

  const limparFiltro = () => {
    setFiltroAtual({});
  };

  const obterProdutoPorId = (id: string) => {
    return produtos.find(produto => produto.id === id);
  };

  const obterCategoriaPorId = (id: string) => {
    return categorias.find(categoria => categoria.id === id);
  };

  const obterFornecedorPorId = (id: string) => {
    return fornecedores.find(fornecedor => fornecedor.id === id);
  };

  const obterMovimentacoesPorProduto = (produtoId: string) => {
    return movimentacoes.filter(movimentacao => movimentacao.produtoId === produtoId);
  };

  return (
    <EstoqueContext.Provider value={{
      produtos,
      categorias,
      fornecedores,
      movimentacoes,
      alertas,
      filtroAtual,
      adicionarProduto,
      atualizarProduto,
      removerProduto,
      registrarMovimentacao,
      adicionarCategoria,
      adicionarFornecedor,
      marcarAlertaComoLido,
      aplicarFiltro,
      limparFiltro,
      obterProdutoPorId,
      obterCategoriaPorId,
      obterFornecedorPorId,
      obterMovimentacoesPorProduto
    }}>
      {children}
    </EstoqueContext.Provider>
  );
};

export const useEstoque = (): EstoqueContextType => {
  const context = useContext(EstoqueContext);
  if (context === undefined) {
    throw new Error('useEstoque deve ser usado dentro de um EstoqueProvider');
  }
  return context;
};