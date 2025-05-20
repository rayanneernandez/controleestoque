import { Produto, Movimentacao, AlertaEstoque, Filtro } from '../types';

export const gerarId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const filtrarProdutos = (produtos: Produto[], filtro: Filtro): Produto[] => {
  let produtosFiltrados = [...produtos];

  if (filtro.categoria) {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === filtro.categoria);
  }

  if (filtro.fornecedor) {
    produtosFiltrados = produtosFiltrados.filter(p => p.fornecedor === filtro.fornecedor);
  }

  if (filtro.termo) {
    const termo = filtro.termo.toLowerCase();
    produtosFiltrados = produtosFiltrados.filter(
      p => p.nome.toLowerCase().includes(termo) || 
           p.descricao.toLowerCase().includes(termo) || 
           p.codigo.toLowerCase().includes(termo)
    );
  }

  if (filtro.ordenacao) {
    produtosFiltrados.sort((a, b) => {
      if (filtro.ordenacao === 'nome') {
        return filtro.direcao === 'asc' 
          ? a.nome.localeCompare(b.nome) 
          : b.nome.localeCompare(a.nome);
      } 
      else if (filtro.ordenacao === 'estoque') {
        return filtro.direcao === 'asc'
          ? a.quantidadeEmEstoque - b.quantidadeEmEstoque
          : b.quantidadeEmEstoque - a.quantidadeEmEstoque;
      }
      else if (filtro.ordenacao === 'preco') {
        return filtro.direcao === 'asc'
          ? a.preco - b.preco
          : b.preco - a.preco;
      }
      return 0;
    });
  }

  return produtosFiltrados;
};

export const verificarEstoqueBaixo = (produto: Produto): boolean => {
  return produto.quantidadeEmEstoque <= produto.estoqueMinimo;
};

export const verificarDataVencimento = (produto: Produto): boolean => {
  if (!produto.validade) return false;
  
  const dataValidade = new Date(produto.validade.split('/').reverse().join('-'));
  const hoje = new Date();
  const diferencaDias = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
  
  return diferencaDias <= 30; // Alerta para produtos que vencem em 30 dias ou menos
};

export const calcularValorTotal = (produtos: Produto[]): number => {
  return produtos.reduce((total, produto) => {
    return total + (produto.preco * produto.quantidadeEmEstoque);
  }, 0);
};

export const contarCategoria = (produtos: Produto[], categoriaId: string): number => {
  return produtos.filter(p => p.categoria === categoriaId).length;
};

export const calcularMaisVendidos = (movimentacoes: Movimentacao[], produtos: Produto[]): Produto[] => {
  const saidasPorProduto = new Map<string, number>();
  
  movimentacoes
    .filter(m => m.tipo === 'saida')
    .forEach(m => {
      const atual = saidasPorProduto.get(m.produtoId) || 0;
      saidasPorProduto.set(m.produtoId, atual + m.quantidade);
    });

  const produtosComVendas = Array.from(saidasPorProduto.entries())
    .map(([produtoId, quantidade]) => {
      const produto = produtos.find(p => p.id === produtoId);
      return { produto, quantidade };
    })
    .filter(item => item.produto !== undefined)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5)
    .map(item => item.produto as Produto);

  return produtosComVendas;
};