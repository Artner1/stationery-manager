import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Produto, Venda } from '../types/types';
import db, { fetchAllProdutos, addProduto, addVenda } from '../utils/database';

// Interface do contexto
export interface InventoryContextData {
  produtos: Produto[];
  carregarProdutos: () => void;
  adicionarProduto: (produto: Produto) => void;
  atualizarProduto: (produtoId: string, preco: number, quantidade: number) => void;
  removerProduto: (produtoId: string) => void;
}

// Criação do contexto
const InventoryContext = createContext<InventoryContextData>({} as InventoryContextData);

// Provider do contexto
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Função para carregar os produtos do banco de dados
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

  // Função para adicionar um produto ao banco de dados
  const adicionarProduto = (produto: Produto) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO produtos (id, nome, preco, quantidade) VALUES (?, ?, ?, ?);',
          [produto.id, produto.nome, produto.preco, produto.quantidade],
          () => carregarProdutos(), // Atualiza a lista após inserir
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

  // Criação da tabela no banco de dados, se não existir
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
        () => carregarProdutos(), // Carrega os produtos após criar a tabela
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

// Hook para usar o contexto
export const useInventory = (): InventoryContextData => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory deve ser usado dentro de um InventoryProvider');
  }
  return context;
};