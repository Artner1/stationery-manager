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
  data: string;
  total?: number; 
};


