import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

// Placeholder para os dados do histórico de caixa
const cashData = [
  { id: '1', type: 'Entrada', amount: 100.0, date: '2024-11-10' },
  { id: '2', type: 'Saída', amount: 30.0, date: '2024-11-10' },
  { id: '3', type: 'Entrada', amount: 200.0, date: '2024-11-11' },
];

// Saldo inicial fictício
const initialBalance = 270.0;

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saldo do Caixa</Text>
      <Text style={styles.balance}>R$ {initialBalance.toFixed(2)}</Text>
      <FlatList
        data={cashData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.type}</Text>
            <Text style={styles.itemText}>R$ {item.amount.toFixed(2)}</Text>
            <Text style={styles.itemText}>Data: {item.date}</Text>
          </View>
        )}
      />
      <Button title="Adicionar Entrada" onPress={() => {}} />
      <Button title="Adicionar Saída" onPress={() => {}} />
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

console.log('Dados de caixa na Home:', cashData);

export default Home;