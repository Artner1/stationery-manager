import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { fetchCashTransactions, addCashTransaction } from '../utils/database';

const CashPage = () => {
  const [balance, setBalance] = useState<number>(0); // Saldo atual do caixa
  const [amount, setAmount] = useState<string>(''); // Valor a ser adicionado ou retirado

  // Função para carregar o saldo inicial
  const loadBalance = async () => {
    try {
      const transactions = await fetchCashTransactions();

      // Calcula o saldo com base nas transações
      const totalBalance = transactions.reduce((acc, transaction) => {
        return transaction.type === 'Entrada'
          ? acc + transaction.amount
          : acc - transaction.amount;
      }, 0);

      setBalance(totalBalance);
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
      Alert.alert('Erro', 'Não foi possível carregar o saldo do caixa.');
    }
  };

  // Função para adicionar entrada ou saída
  const handleTransaction = async (type: 'Entrada' | 'Saída') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const value = Number(amount);

    try {
      const date = new Date().toISOString().split('T')[0]; // Data atual
      await addCashTransaction(String(Date.now()), type, value, date); // Registra a transação
      setAmount(''); // Limpa o campo de entrada
      loadBalance(); // Atualiza o saldo
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
      Alert.alert('Erro', 'Não foi possível registrar a transação.');
    }
  };

  useEffect(() => {
    loadBalance(); // Carrega o saldo ao montar o componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saldo do Caixa</Text>
      <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>

      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Digite o valor"
      />

      <Button title="Adicionar Entrada" onPress={() => handleTransaction('Entrada')} />
      <Button title="Adicionar Saída" onPress={() => handleTransaction('Saída')} />
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
  label: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default CashPage;
