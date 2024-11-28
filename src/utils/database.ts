import * as SQLite from 'expo-sqlite';
import { Produto, Venda } from '../types/types';

// Abre ou cria o banco de dados
const db = SQLite.openDatabase('papelaria.db');

export const initializeDatabase = () => {
  db.transaction((tx) => {
    // Criação da tabela de produtos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS produtos (
         id TEXT PRIMARY KEY,
         nome TEXT NOT NULL,
         quantidade INTEGER NOT NULL,
         preco REAL NOT NULL
       );`
    );

    // Criação da tabela de vendas
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS vendas (
         id TEXT PRIMARY KEY,
         produto_id TEXT NOT NULL,
         quantidade INTEGER NOT NULL,
         preco REAL NOT NULL,
         data TEXT NOT NULL,
         FOREIGN KEY (produto_id) REFERENCES produtos (id)
       );`
    );

    // Verificar se a tabela "caixa" existe
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS caixa (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         type TEXT NOT NULL,
         amount REAL NOT NULL,
         date TEXT NOT NULL,
         saldo REAL NOT NULL
       );`
    );

    // Inicializa o saldo caso a tabela esteja vazia
    tx.executeSql(
      `SELECT saldo FROM caixa LIMIT 1;`,
      [],
      (_, { rows }) => {
        if (rows.length === 0) {
          tx.executeSql(
            `INSERT INTO caixa (type, amount, date, saldo) VALUES (?, ?, ?, ?);`,
            ['Inicial', 0, new Date().toISOString(), 0],
            () => console.log('Saldo inicial configurado.'),
            (_, error) => {
              console.error('Erro ao configurar saldo inicial:', error);
              return false;
            }
          );
        }
      },
      (_, error) => {
        console.error('Erro ao verificar saldo inicial:', error);
        return false;
      }
    );
  });
};

// Função para adicionar produto
export const addProduto = (produto: Produto) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO produtos (id, nome, quantidade, preco) VALUES (?, ?, ?, ?);',
      [produto.id, produto.nome, produto.quantidade, produto.preco]
    );
  });
};

// Função para registrar venda
export const addVenda = (venda: Venda) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO vendas (id, produto_id, quantidade, preco, data) VALUES (?, ?, ?, ?, ?);',
      [venda.id, venda.produto_id, venda.quantidade, venda.preco, venda.data || null]
    );
  });
};

// Função para buscar todos os produtos
export const fetchAllProdutos = (): Promise<Produto[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM produtos;',
        [],
        (_, { rows: { _array } }) => resolve(_array as Produto[]),
        (_, error) => {
          console.error('Erro ao buscar produtos:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Função para buscar todas as vendas
export const fetchAllVendas = (): Promise<Venda[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM vendas;',
        [],
        (_, { rows: { _array } }) => resolve(_array as Venda[]),
        (_, error) => {
          console.error('Erro ao buscar vendas:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Função para registrar entradas e saídas no caixa
export const addCashTransaction = (
  id: string,
  type: 'Entrada' | 'Saída',
  amount: number,
  date: string
) => {
  db.transaction((tx) => {
    // Busca o saldo atual
    tx.executeSql(
      `SELECT saldo FROM caixa ORDER BY id DESC LIMIT 1;`,
      [],
      (_, { rows }) => {
        const saldoAtual = rows.length > 0 ? rows.item(0).saldo : 0;
        const novoSaldo = type === 'Entrada' ? saldoAtual + amount : saldoAtual - amount;

        // Insere a transação no caixa com o novo saldo
        tx.executeSql(
          `INSERT INTO caixa (type, amount, date, saldo) VALUES (?, ?, ?, ?);`,
          [type, amount, date, novoSaldo],
          () => console.log('Transação registrada com sucesso!'),
          (_, error) => {
            console.error('Erro ao registrar transação:', error);
            return false;
          }
        );
      },
      (_, error) => {
        console.error('Erro ao buscar saldo atual:', error);
        return false;
      }
    );
  });
};

// Função para buscar o histórico do caixa
export const fetchCashTransactions = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM caixa;`,
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => {
          console.error('Erro ao buscar transações do caixa:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export default db;
