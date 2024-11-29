import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCash } from '../context/CashContext';
import { useSales } from '../context/SalesContext';
import { useInventory } from '../context/InventoryContext';
import { useNavigation } from '@react-navigation/native';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const { saldoAtual, transacoes } = useCash(); // Consome saldo e transações do contexto
  const { vendas } = useSales();
  const { produtos } = useInventory();

  const dataAtual = new Date().toISOString().split('T')[0];
  const vendasDoDia = vendas.filter((venda) => venda.data === dataAtual);
  const produtosBaixos = produtos.filter((produto) => produto.quantidade <= 5);
  const totalVendasDoDia = vendasDoDia.reduce((total, venda) => {
  const valorVenda = Number(venda.total); // Converte para número
    return total + (isNaN(valorVenda) ? 0 : valorVenda); // Adiciona ao total se for válido
  }, 0);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, Marcos! 🌟</Text>
      <Text style={styles.subtitle}>Aqui está um resumo do seu negócio:</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo do Caixa</Text>
          <Text style={styles.cardValue}>R$ {saldoAtual.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
        <Text style={styles.cardTitle}>Vendas de Hoje</Text>
          <Text style={styles.cardValue}>
            R$ {totalVendasDoDia.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produtos com Estoque Baixo</Text>
          <Text style={styles.cardValue}>{produtosBaixos.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Últimas Transações</Text>
      <FlatList
        data={transacoes.slice(-5)}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>
              {item.type} - R$ {item.amount.toFixed(2)} | {item.date}
            </Text>
          </View>
        )}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Vendas' as never)} 
        >
          <Text style={styles.buttonText}>Registrar Venda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Estoque' as never)} 
        >
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Caixa' as never)} 
        >
          <Text style={styles.buttonText}>Ver Caixa</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionText: {
    fontSize: 14,
    color: '#555',
  },
  actionsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Home;
