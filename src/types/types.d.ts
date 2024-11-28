export type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
};

export type Venda = {
  id: string;
  produto_id: string;
  quantidade: number;
  preco: number;
  total: number; 
  data: string;
};
