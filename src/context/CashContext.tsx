import React, { createContext, useContext, useEffect, useState } from 'react';
import { addCashTransaction, fetchCashTransactions } from '../utils/database';

export type CashTransaction = {
  id: string; 
  type: 'Entrada' | 'Saída';
  amount: number;
  date: string;
};

type CashContextData = {
  transacoes: CashTransaction[];
  saldoAtual: number;
  carregarTransacoes: () => Promise<void>;
  registrarTransacao: (type: 'Entrada' | 'Saída', amount: number) => Promise<void>;
};

const CashContext = createContext<CashContextData | undefined>(undefined);

export const CashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transacoes, setTransacoes] = useState<CashTransaction[]>([]);

  
  const calcularSaldoAtual = (): number => {
    return transacoes.reduce((saldo, transacao) => {
      return transacao.type === 'Entrada' ? saldo + transacao.amount : saldo - transacao.amount;
    }, 0);
  };

  const carregarTransacoes = async () => {
    try {
      const transacoesObtidas = await fetchCashTransactions();
      setTransacoes(transacoesObtidas);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const registrarTransacao = async (type: 'Entrada' | 'Saída', amount: number) => {
    try {
      const date = new Date().toISOString();
      const id = Date.now().toString(); 
      await addCashTransaction(id, type, amount, date);
      await carregarTransacoes(); 
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  return (
    <CashContext.Provider
      value={{
        transacoes,
        saldoAtual: calcularSaldoAtual(),
        carregarTransacoes,
        registrarTransacao,
      }}
    >
      {children}
    </CashContext.Provider>
  );
};

export const useCash = () => {
  const context = useContext(CashContext);
  if (!context) {
    throw new Error('useCash deve ser usado dentro de CashProvider');
  }
  return context;
};
