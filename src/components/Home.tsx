import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'; // Alterei para BottomTabNavigationProp
import { RootTabParamList } from '../types/navigation'; // Certifique-se de que o caminho está correto

const Home: React.FC = () => {
  // Tipagem do hook de navegação para Bottom Tab Navigator
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, Rafaela! 🌟</Text>
      <Text style={styles.subtitle}>Aqui está um resumo do seu negócio:</Text>

      {/* Outros elementos da tela aqui... */}

      {/* Botões de Ação Rápida */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Sales')} // Navega para a aba de vendas
        >
          <Text style={styles.buttonText}>Registrar Venda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Inventory')} // Navega para a aba de inventário (exemplo)
        >
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CashPage')} // Navega para a aba de caixa
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
  actionsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
