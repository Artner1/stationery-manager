import React, { useState } from 'react';
import { View, FlatList, Text, Button, Alert, StyleSheet, Modal, TextInput } from 'react-native';
import { useInventory } from '../context/InventoryContext';

const Inventory = () => {
  const { produtos, adicionarProduto, atualizarProduto, removerProduto } = useInventory();
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoPreco, setNovoPreco] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [nomeProduto, setNomeProduto] = useState(''); 
  const [adicionarModalVisible, setAdicionarModalVisible] = useState(false); 

  
  const handleEdit = (produto: any) => {
    setProdutoSelecionado(produto);
    setNovoPreco(String(produto.preco));
    setNovaQuantidade(String(produto.quantidade));
    setModalVisible(true);
  };

  
  const confirmarEdicao = () => {
    if (!novoPreco || !novaQuantidade) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const preco = parseFloat(novoPreco);
    const quantidade = parseInt(novaQuantidade, 10);

    if (isNaN(preco) || isNaN(quantidade)) {
      Alert.alert('Erro', 'Digite valores válidos.');
      return;
    }

    atualizarProduto(produtoSelecionado.id, preco, quantidade);
    Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
    setModalVisible(false);
  };

  
  const handleDelete = (produtoId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            removerProduto(produtoId);
            Alert.alert('Sucesso', 'Produto excluído com sucesso!');
          },
        },
      ]
    );
  };

  
  const confirmarAdicao = () => {
    if (!nomeProduto || !novoPreco || !novaQuantidade) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const preco = parseFloat(novoPreco);
    const quantidade = parseInt(novaQuantidade, 10);

    if (isNaN(preco) || isNaN(quantidade)) {
      Alert.alert('Erro', 'Digite valores válidos.');
      return;
    }

    adicionarProduto({ id: Date.now().toString(), nome: nomeProduto, preco, quantidade });
    Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
    setNomeProduto('');
    setNovoPreco('');
    setNovaQuantidade('');
    setAdicionarModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventário</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Produto: {item.nome}</Text>
            <Text style={styles.itemText}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.itemText}>Preço: R$ {item.preco.toFixed(2)}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Editar" onPress={() => handleEdit(item)} />
              <Button
                title="Excluir"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />

      {/* Botão para adicionar produto */}
      <Button title="Adicionar Produto" onPress={() => setAdicionarModalVisible(true)} />

      {/* Modal de Edição */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Preço"
              keyboardType="numeric"
              value={novoPreco}
              onChangeText={setNovoPreco}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={novaQuantidade}
              onChangeText={setNovaQuantidade}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={confirmarEdicao} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Adição */}
      <Modal
        visible={adicionarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAdicionarModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Produto"
              value={nomeProduto}
              onChangeText={setNomeProduto}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              keyboardType="numeric"
              value={novoPreco}
              onChangeText={setNovoPreco}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={novaQuantidade}
              onChangeText={setNovaQuantidade}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setAdicionarModalVisible(false)} />
              <Button title="Adicionar" onPress={confirmarAdicao} />
            </View>
          </View>
        </View>
      </Modal>
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
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Inventory;
