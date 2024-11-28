import React, { createContext, useContext, useEffect, useState } from 'react';
import { addCashTransaction, fetchCashTransactions } from '../utils/database';

export type CashTransaction = {
  id: number;
  type: 'Entrada' | 'Saída';
  amount: number;
  date: string;
};

type CashContextData = {
  transacoes: CashTransaction[];
  carregarTransacoes: () => Promise<void>;
  registrarTransacao: (type: 'Entrada' | 'Saída', amount: number) => Promise<void>;
};

const CashContext = createContext<CashContextData | undefined>(undefined);

export const CashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transacoes, setTransacoes] = useState<CashTransaction[]>([]);

  // Função para carregar todas as transações do caixa
  const carregarTransacoes = async () => {
    try {
      const transacoesObtidas = await fetchCashTransactions();
      setTransacoes(transacoesObtidas);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  // Função para registrar manualmente uma entrada ou saída no caixa
  const registrarTransacao = async (type: 'Entrada' | 'Saída', amount: number) => {
    try {
      const date = new Date().toISOString();
      await addCashTransaction(type, amount, date); // Adiciona a transação no banco de dados
      await carregarTransacoes(); // Atualiza as transações
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
    }
  };

  useEffect(() => {
    carregarTransacoes(); // Carrega as transações ao montar o contexto
  }, []);

  return (
    <CashContext.Provider value={{ transacoes, carregarTransacoes, registrarTransacao, }}>
      {children}
    </CashContext.Provider>
  );
};

// Hook personalizado para usar o contexto do caixa
export const useCash = () => {
  const context = useContext(CashContext);
  if (!context) {
    throw new Error('useCash deve ser usado dentro de CashProvider');
  }
  return context;
};
