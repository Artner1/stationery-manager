import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Produto, Venda } from '../types/types';
import db, { fetchAllProdutos, addProduto, addVenda } from '../utils/database';


export interface InventoryContextData {
  produtos: Produto[];
  carregarProdutos: () => void;
  adicionarProduto: (produto: Produto) => void;
  atualizarProduto: (produtoId: string, preco: number, quantidade: number) => void;
  removerProduto: (produtoId: string) => void;
}


const InventoryContext = createContext<InventoryContextData>({} as InventoryContextData);


export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  
  const carregarProdutos = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM produtos;',
        [],
        (_, { rows }) => {
          const items = rows._array as Produto[];
          setProdutos(items);
        },
        (_, error) => {
          console.error('Erro ao carregar produtos:', error);
          return false;
        }
      );
    });
  };

  
  const adicionarProduto = (produto: Produto) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO produtos (id, nome, preco, quantidade) VALUES (?, ?, ?, ?);',
          [produto.id, produto.nome, produto.preco, produto.quantidade],
          () => carregarProdutos(), 
          (_, error) => {
            console.error('Erro ao adicionar produto:', error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Erro na transação ao adicionar produto:', error);
      }
    );
  };

  // Função para atualizar um produto no banco de dados
  const atualizarProduto = (produtoId: string, preco: number, quantidade: number) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE produtos SET preco = ?, quantidade = ? WHERE id = ?;',
          [preco, quantidade, produtoId],
          () => carregarProdutos(), // Atualiza a lista após editar
          (_, error) => {
            console.error('Erro ao atualizar produto:', error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Erro na transação ao atualizar produto:', error);
      }
    );
  };

  // Função para remover um produto do banco de dados
  const removerProduto = (produtoId: string) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM produtos WHERE id = ?;',
          [produtoId],
          () => carregarProdutos(), // Atualiza a lista após remover
          (_, error) => {
            console.error('Erro ao remover produto:', error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Erro na transação ao remover produto:', error);
      }
    );
  };

  
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS produtos (
          id TEXT PRIMARY KEY NOT NULL,
          nome TEXT NOT NULL,
          preco REAL NOT NULL,
          quantidade INTEGER NOT NULL
        );`,
        [],
        () => carregarProdutos(), 
        (_, error) => {
          console.error('Erro ao criar tabela:', error);
          return false;
        }
      );
    });
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        produtos,
        carregarProdutos,
        adicionarProduto,
        atualizarProduto,
        removerProduto,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};


export const useInventory = (): InventoryContextData => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory deve ser usado dentro de um InventoryProvider');
  }
  return context;
};