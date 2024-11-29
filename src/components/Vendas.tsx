import React from 'react';
import { View, FlatList, Button, Alert, Text, StyleSheet } from 'react-native';
import { useSales } from '../context/SalesContext';
import { useInventory } from '../context/InventoryContext';

const Sales = () => {
  const { produtos } = useInventory(); 
  const { vendas, registrarVenda } = useSales(); 

  const handleAddVenda = async (produto_id: string, preco: number) => {
    const quantidade = 1; 
    const novaVenda = {
      id: String(Date.now()),
      produto_id,
      quantidade,
      preco,
      total: quantidade * preco, 
      data: new Date().toISOString().split('T')[0],
    };

    try {
      await registrarVenda(novaVenda);
      Alert.alert('Sucesso', 'Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      Alert.alert('Erro', 'Não foi possível registrar a venda.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Venda</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <Text style={styles.itemText}>Preço: R$ {item.preco.toFixed(2)}</Text>
            <Button
              title={`Registrar Venda de ${item.nome}`}
              onPress={() => handleAddVenda(item.id, item.preco)}
            />
          </View>
        )}
      />

      <Text style={styles.subtitle}>Histórico de Vendas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Produto ID: {item.produto_id}</Text>
            <Text style={styles.itemText}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.itemText}>Preço: R$ {item.preco?.toFixed(2) || '0.00'}</Text>
            <Text style={styles.itemText}>
              Total: R$ {item.total?.toFixed(2) || (item.quantidade * item.preco)?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.itemText}>Data: {item.data}</Text>
          </View>
        )}
      />
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default Sales;
