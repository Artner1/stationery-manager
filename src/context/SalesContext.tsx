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

  
  const carregarVendas = async () => {
    try {
      const vendasObtidas = await fetchAllVendas();
  
      // Garante que todas as vendas tenham o campo total calculado
      const vendasComTotal = vendasObtidas.map((venda) => ({
        ...venda,
        total: venda.total ?? venda.preco * venda.quantidade, // Calcula se estiver ausente
      }));
  
      setVendas(vendasComTotal);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    }
  };
  

  const registrarVenda = async (novaVenda: Venda) => {
    try {
      // Calcula o total da venda antes de registrar
      const total = novaVenda.preco * novaVenda.quantidade;
      const vendaComTotal = { ...novaVenda, total };
  
      await addVenda(vendaComTotal); // Adiciona ao banco de dados
      await carregarVendas(); // Atualiza a lista de vendas
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
    }
  };
  

  useEffect(() => {
    carregarVendas(); 
  }, []);

  return (
    <SalesContext.Provider value={{ vendas, registrarVenda, carregarVendas }}>
      {children}
    </SalesContext.Provider>
  );
};


export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales deve ser usado dentro de SalesProvider');
  }
  return context;
};
