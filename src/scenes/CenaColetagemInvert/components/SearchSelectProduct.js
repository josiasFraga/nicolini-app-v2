import React, { useMemo, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput
} from 'react-native';

const SearchSelectProduct = ({ visible, setVisible, allLines, openReaderBarCode }) => {
  const [searchText, setSearchText] = useState('');

  // Filtra os itens verificando se o texto digitado aparece em qualquer um dos campos:
  // produto, cod_barras ou cod_interno.
  const filteredData = useMemo(() => {
    const lowerSearchText = searchText.toLowerCase();
    return allLines.filter(item =>
      String(item.produto || '').toLowerCase().includes(lowerSearchText) ||
      String(item.cod_barras || '').toLowerCase().includes(lowerSearchText) ||
      String(item.cod_interno || '').toLowerCase().includes(lowerSearchText)
    );
  }, [allLines, searchText]);

  // Renderiza cada item da lista
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => openReaderBarCode(item.cod_barras)}>
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.produto}</Text>
      <Text style={styles.itemSubText}>Código de Barras: {item.cod_barras}</Text>
      <Text style={styles.itemSubText}>Código Interno: {item.cod_interno}</Text>
    </View>
    </TouchableOpacity>
  ), []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(!visible)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Selecione um Produto</Text>
          
          {/* Campo de busca */}
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar"
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* FlatList para renderizar os itens filtrados */}
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.cod_barras}-${index}`}
            renderItem={renderItem}
            style={styles.list}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />

          {/* Botão para fechar o modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(!visible)}
          >
            <Text style={styles.textStyle}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  list: {
    flex: 1,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubText: {
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SearchSelectProduct;
