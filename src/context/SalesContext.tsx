import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAllVendas, addVenda } from '../utils/database';
import { Venda } from '../types/types';

type SalesContextData = {
  vendas: Venda[];
  registrarVenda: (venda: Venda) => Promise<void>;
  carregarVendas: () => void;
};

const SalesContext = createContext<SalesContextData | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Função para carregar todas as vendas do banco de dados
  const carregarVendas = async () => {
    try {
      const vendasObtidas = await fetchAllVendas();
      setVendas(vendasObtidas);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    }
  };

  // Função para registrar uma nova venda
  const registrarVenda = async (novaVenda: Venda) => {
    try {
      await addVenda(novaVenda); // Adiciona ao banco de dados
      await carregarVendas(); // Atualiza a lista de vendas
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
    }
  };

  useEffect(() => {
    carregarVendas(); // Carrega as vendas ao montar o contexto
  }, []);

  return (
    <SalesContext.Provider value={{ vendas, registrarVenda, carregarVendas }}>
      {children}
    </SalesContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales deve ser usado dentro de SalesProvider');
  }
  return context;
};
