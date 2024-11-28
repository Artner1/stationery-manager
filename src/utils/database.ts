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

    // Verificar se a coluna "saldo" já existe na tabela "caixa"
    tx.executeSql(
      `PRAGMA table_info(caixa);`,
      [],
      (_, { rows }) => {
        const hasSaldoColumn = rows._array.some((row: any) => row.name === 'saldo');

        if (!hasSaldoColumn) {
          console.log('Atualizando tabela "caixa" para adicionar a coluna "saldo"...');

          // Criar uma tabela temporária com a nova estrutura
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS caixa_temp (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               type TEXT NOT NULL,
               amount REAL NOT NULL,
               date TEXT NOT NULL,
               saldo REAL NOT NULL
             );`
          );

          // Copiar os dados da tabela antiga para a nova tabela
          tx.executeSql(
            `INSERT INTO caixa_temp (id, type, amount, date, saldo)
             SELECT id, type, amount, date, 0 FROM caixa;`
          );

          // Remover a tabela antiga
          tx.executeSql(`DROP TABLE IF EXISTS caixa;`);

          // Renomear a tabela temporária para "caixa"
          tx.executeSql(`ALTER TABLE caixa_temp RENAME TO caixa;`);

          console.log('Tabela "caixa" atualizada com sucesso.');
        }
      },
      (_, error) => {
        console.error('Erro ao verificar a tabela "caixa":', error);
        return false;
      }
    );

    // Verifica e inicializa o saldo caso não exista nenhuma entrada no caixa
    tx.executeSql(
      `SELECT saldo FROM caixa LIMIT 1;`,
      [],
      (_, { rows }) => {
        if (rows.length === 0) {
          // Insere uma entrada inicial com saldo 0
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
          return true; // Retorna true para indicar que o erro foi tratado
        }
      );
    });
  });
};

// Função para registrar entradas e saídas no caixa
export const addCashTransaction = (
id: string, type: string, amount: number, date: string, type: 'Entrada' | 'Saída', amount: number, date: string) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT saldo FROM caixa ORDER BY id DESC LIMIT 1;`,
      [],
      (_, { rows }) => {
        const saldoAtual = rows.length > 0 ? rows.item(0).saldo : 0;
        const novoSaldo = type === 'Entrada' ? saldoAtual + amount : saldoAtual - amount;

        // Insere a transação no caixa
        tx.executeSql(
          `INSERT INTO caixa (type, amount, date, saldo) VALUES (?, ?, ?, ?);`,
          [type, amount, date, novoSaldo],
          (_, result) => console.log('Transação registrada:', result),
          (_, error) => {
            console.error('Erro ao registrar transação:', error);
            return true; // Retorna true para indicar que o erro foi tratado
          }
        );
      },
      (_, error) => {
        console.error('Erro ao buscar saldo atual:', error);
        return true;
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
          return true;
        }
      );
    });
  });
};

export default db;
