import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { fetchCashTransactions, addCashTransaction } from '../utils/database';

// Tipo para transação do caixa
type CashTransaction = {
  id: string;
  type: 'Entrada' | 'Saída';
  amount: number;
  date: string;
};

const CashPage = () => {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);

  // Função para buscar e calcular o saldo
  const loadTransactions = async () => {
    try {
      const data = await fetchCashTransactions();
      setTransactions(data);

      // Calcula o saldo com base nas transações
      const totalBalance = data.reduce((acc, transaction) => {
        return transaction.type === 'Entrada'
          ? acc + transaction.amount
          : acc - transaction.amount;
      }, 0);
      setBalance(totalBalance);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as transações do caixa.');
    }
  };

  // Função para adicionar uma transação fictícia (exemplo)
  const handleAddTransaction = (type: 'Entrada' | 'Saída') => {
    const newTransaction: CashTransaction = {
      id: String(Date.now()),
      type,
      amount: Math.floor(Math.random() * 100) + 1, // Valor aleatório
      date: new Date().toISOString().split('T')[0],
    };

    try {
      addCashTransaction(
        newTransaction.id,
        newTransaction.type,
        newTransaction.amount,
        newTransaction.date
      );
      loadTransactions(); // Atualiza a lista após adicionar
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a transação.');
    }
  };

  useEffect(() => {
    loadTransactions(); // Carrega as transações ao montar o componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saldo do Caixa</Text>
      <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.type}</Text>
            <Text style={styles.itemText}>R$ {item.amount.toFixed(2)}</Text>
            <Text style={styles.itemText}>Data: {item.date}</Text>
          </View>
        )}
      />
      <Button title="Adicionar Entrada" onPress={() => handleAddTransaction('Entrada')} />
      <Button title="Adicionar Saída" onPress={() => handleAddTransaction('Saída')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default CashPage;
