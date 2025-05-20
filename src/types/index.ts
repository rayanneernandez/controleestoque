export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  quantidadeEmEstoque: number;
  estoqueMinimo: number;
  unidade: string;
  codigo: string;
  dataCadastro: string;
  fornecedor: string;
  localArmazenamento?: string;
  validade?: string;
  imagem?: string;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  responsavel: string;
  observacao?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  cor?: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  contato: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  permissoes: string[];
}

export interface AlertaEstoque {
  id: string;
  produtoId: string;
  tipo: 'baixo' | 'vencimento';
  mensagem: string;
  data: string;
  lido: boolean;
}

export interface Filtro {
  categoria?: string;
  fornecedor?: string;
  termo?: string;
  ordenacao?: 'nome' | 'estoque' | 'preco';
  direcao?: 'asc' | 'desc';
}