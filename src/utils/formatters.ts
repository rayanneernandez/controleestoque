export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatarData = (data: Date): string => {
  return data.toLocaleDateString('pt-BR');
};

export const formatarDataHora = (data: Date): string => {
  return data.toLocaleString('pt-BR');
};

export const formatarNumero = (numero: number): string => {
  return numero.toLocaleString('pt-BR');
};

export const truncarTexto = (texto: string, tamanho: number): string => {
  if (texto.length <= tamanho) return texto;
  return texto.substring(0, tamanho) + '...';
};