import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, ListItem, SearchBar } from 'react-native-elements';
import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';
import COLORS from '@constants/colors';
import { useDispatch, useSelector } from 'react-redux';

// Importações do Realm
import { RealmContext } from '@configs/realmConfig'; // Ajuste o caminho do seu config

// Pegamos os hooks de dentro do contexto
const {useQuery} = RealmContext;

const CenaListaItensLidos = ({ origin }) => {
  const dispatch = useDispatch();

  const allLines = useQuery('InvertLine'); 

  // Redux state
  const collection_data = useSelector(
    (state) => state.appReducer.invert_collection_data
  );

  // Local state
  const [fileDataNItems, setFileDataNItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [itens, setItens] = useState([]);
  const [search, setSearch] = useState("");

  // Load data from Redux saga or store
  const loadData = useCallback(() => {
    dispatch({
      type: 'LOAD_INVERT_COLLECTION_DATA',
      payload: {},
    });
  }, [dispatch]);

  // Check the uploaded file in AsyncStorage
  const checkUploadedFile = useCallback(async () => {
	setFileDataNItems(allLines.length);
  }, [allLines]);

  // Fetch scanned items from AsyncStorage
  const buscaItens = useCallback(async () => {
    let db_table = 'CODIGOS_AVULSOS';

    if (origin === "separacao_central") {
      db_table = "CODIGOS_CENTRAL";
    } else if (origin === "coletagem_invert") {
      db_table = "CODIGOS_INVERT";
    }

    setIsLoading(true);

    try {
      const value = await AsyncStorage.getItem(db_table);
      if (value !== null) {
        let codigos = JSON.parse(value);
        if (search.trim() !== "") {
          const buscaUsuario = search.trim().toLowerCase();
          codigos = codigos.filter((codigo) => {
            return (
              codigo.produto.toLowerCase().includes(buscaUsuario) ||
              codigo.barcodescanned.toLowerCase().includes(buscaUsuario)
            );
          });
        }
        codigos = codigos.sort((a, b) => (a.produto > b.produto ? 1 : -1));
        setItens(codigos);
      }
    } catch (error) {
      console.log(error);
      AlertHelper.show('error', 'Erro', 'Ocorreu um erro ao contar os dados');
    }

    setIsLoading(false);
  }, [origin, search]);

  // Update search text and trigger fetch
  const updateSearch = (text) => {
    setSearch(text);
    buscaItens();
  };

  // Equivalent to componentDidMount
  useEffect(() => {
    loadData();
    checkUploadedFile();
    buscaItens();
  }, [loadData, checkUploadedFile, buscaItens]);

  // Render a single item in the list
  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.produto}</ListItem.Title>
        <ListItem.Subtitle>{item.barcodescanned}</ListItem.Subtitle>
      </ListItem.Content>
      <Text>QTD: {item.qtd}</Text>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
      <Header backButton titulo="Itens Lidos" />

      <View style={{ backgroundColor: COLORS.primary }}>
        <Text style={styles.headerText}>Produtos</Text>
        <View style={[GlobalStyle.row, styles.statsContainer]}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{fileDataNItems}</Text>
            <Text style={styles.statLabel}>Lidos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{collection_data.n_itens}</Text>
            <Text style={styles.statLabel}>Coletados</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{collection_data.n_uniqe_itens}</Text>
            <Text style={styles.statLabel}>Únicos Coletados</Text>
          </View>
        </View>
      </View>

      <SearchBar
        placeholder="Buscar item..."
        onChangeText={updateSearch}
        value={search}
        lightTheme
      />

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <FlatList
          data={itens}
          renderItem={renderItem}
          keyExtractor={(item) => item.barcodescanned}
          onRefresh={buscaItens}
          refreshing={isLoading}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center' }}>Nenhum item escaneado.</Text>
          )}
        />
      </View>
    </View>
  );
};

export default CenaListaItensLidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    paddingTop: 10,
    textTransform: "uppercase",
  },
  statsContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  statBox: {
    padding: 5,
    flex: 1,
  },
  statNumber: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  statLabel: {
    color: "#FFF",
    textAlign: "center",
  },
});
