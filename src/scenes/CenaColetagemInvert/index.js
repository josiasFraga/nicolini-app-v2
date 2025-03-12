import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Icon, Image } from 'react-native-elements';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import SearchSelectProduct from './components/SearchSelectProduct';
import Header from '@components/Header';
import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

// Importações do Realm
import { RealmContext } from '@configs/realmConfig'; // Ajuste o caminho do seu config
import Realm from 'realm';

// Pegamos os hooks de dentro do contexto
const {useRealm, useQuery} = RealmContext;


const CenaColetagemInvert = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const realm = useRealm();

  const allLines = useQuery('InvertLine'); 

  // Redux data
  const collection_data = useSelector(
    (state) => state.appReducer.invert_collection_data
  );

  // Local state
  const [fileData, setFileData] = useState([]);
  const [fileDataNItems, setFileDataNItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Load data from Redux saga or your store
   */
  const loadData = useCallback(() => {
    dispatch({
      type: 'LOAD_INVERT_COLLECTION_DATA',
      payload: {},
    });
  }, [dispatch]);

  /**
   * Check the currently uploaded file saved in AsyncStorage
   */
  const checkUploadedFile = useCallback(() => {
    console.log('...lendo dados do Realm');
    // O "allLines" é um Results do Realm; length retorna quantos registros existem.
    setFileDataNItems(allLines.length);
	  setFileData(allLines);

  }, [allLines]);

  /**
   * Equivalent to componentDidMount: load data once
   */
  useEffect(() => {
    loadData();
    checkUploadedFile();
  }, [loadData, checkUploadedFile]);

  /**
   * Handle DocumentPicker and RNFS errors
   */
  const handleError = (err) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('DocumentPicker was cancelled');
    } else if (isInProgress(err)) {
      console.warn('Multiple pickers were opened, only the last will be considered.');
    } else {
      throw err;
    }
  };

  /**
   * Read and upload file from DocumentPicker result
   */
  const uploadFile = useCallback(
    async (file) => {
      const type = file[0].type;
      if (type !== 'text/plain') {
        AlertHelper.show('info', 'Atenção', 'Tipo de arquivo não aceito');
        return;
      }

      let content = '';
      console.info('Lendo arquivo...');

      try {
        content = await RNFS.readFile(file[0].fileCopyUri, 'utf8');
      } catch (e) {
        // fallback in case 'utf8' fails
        content = await RNFS.readFile(file[0].fileCopyUri, 'ascii');
      }

      const contentLines = content.split(/\r?\n/);
      const contentToSave = [];
      const ignoredItems = [];

      contentLines.forEach((line) => {
        // Ensure we have the exact positions
        if (line.length < 83) {
          ignoredItems.push(line);
          return;
        }

        const cod_barras = line.substring(0, 13);
        const cod_interno = line.substring(14, 23).trim();
        const produto = line.substring(24, 75).trim();
        const rest = line.substring(75, 83);

        contentToSave.push({
          cod_barras,
          cod_interno,
          produto,
          rest,
        });
      });

      if (contentToSave.length > 0) {
        try {
		  console.log('...tentando salvar dados do arquivo');
          realm.write(() => {
            contentToSave.forEach((item) => {
              realm.create('InvertLine', {
                _id: new Realm.BSON.ObjectId(),
                cod_barras: item.cod_barras,
                cod_interno: item.cod_interno,
                produto: item.produto,
                rest: item.rest,
              });
            });
          });
		      console.log('-> dados do arquivo salvos');
          setFileData(contentToSave);
          setFileDataNItems(contentToSave.length);

          if (ignoredItems.length > 0) {
            AlertHelper.show(
              'info',
              'Informação',
              `Arquivo importado com sucesso! ${ignoredItems.length} registros foram ignorados por não estarem no padrão esperado.`
            );
            return;
          }

          AlertHelper.show('success', 'Tudo certo', 'Arquivo importado com sucesso!');
        } catch (storageErr) {
          console.log('Error saving to AsyncStorage:', storageErr);
          AlertHelper.show('error', 'Erro', 'Não foi possível salvar o arquivo.');
        }
      } else {
        AlertHelper.show('error', 'Erro', 'Dados inválidos');
      }
    },
    []
  );

  /**
   * Clear only scanned codes
   */
  const clearScannedCodes = () => {
    Alert.alert(
      'Atenção!',
      'Você tem certeza que deseja limpar os dados?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Tenho',
          onPress: async () => {
            await AsyncStorage.removeItem('CODIGOS_INVERT');
            AlertHelper.show('success', 'Tudo certo', 'Registros excluídos');
            // Optionally reload data or update states
            loadData();
          },
        },
      ],
      { cancelable: false }
    );
  };

  /**
   * Clear everything, including the uploaded file
   */
  const clearAllData = () => {
    Alert.alert(
      'Atenção!',
      'Esta ação apagará também os dados coletados. Deseja continuar?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Tenho',
          onPress: async () => {
            await AsyncStorage.removeItem('CODIGOS_INVERT');
			      await realm.write(() => {
              // Apaga tudo no Realm (caso você tenha mais de um schema, cuidado!)
              realm.deleteAll();
            });
            // Reload local states
            loadData();
            checkUploadedFile();
            AlertHelper.show('success', 'Tudo certo', 'Registros excluídos');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const openReaderBarCode = (barcode) => {
    setModalVisible(false);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ModalBarcodeReader',
        params: {
        origin: "coletagem_invert",
        setEanRead: barcode,
        },
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Header backButton titulo="Coletagem Invent" />

      {/* Top data info */}
      <View style={{ backgroundColor: COLORS.primary }}>
        <Text
          style={{
            color: '#FFF',
            textAlign: 'center',
            fontSize: 18,
            paddingTop: 10,
            textTransform: 'uppercase',
          }}
        >
          Produtos
        </Text>
        <View
          style={[
            GlobalStyle.row,
            { justifyContent: 'space-around', alignItems: 'center' },
          ]}
        >
          <View style={{ padding: 5, marginRight: 5, flex: 1 }}>
            <Text
              style={{ textAlign: 'center', fontSize: 18, color: '#FFF', fontWeight: 'bold' }}
            >
              {fileDataNItems}
            </Text>
            <Text style={{ color: '#FFF', textAlign: 'center' }}>Lidos</Text>
          </View>

          <View style={{ padding: 5, marginRight: 5, flex: 1 }}>
            <Text
              style={{ textAlign: 'center', fontSize: 18, color: '#FFF', fontWeight: 'bold' }}
            >
              {collection_data.n_itens}
            </Text>
            <Text style={{ color: '#FFF', textAlign: 'center' }}>Coletados</Text>
          </View>

          <View style={{ padding: 5, marginLeft: 5, flex: 1 }}>
            <Text
              style={{ textAlign: 'center', fontSize: 18, color: '#FFF', fontWeight: 'bold' }}
            >
              {collection_data.n_uniqe_itens}
            </Text>
            <Text style={{ color: '#FFF', textAlign: 'center' }}>Únicos Coletados</Text>
          </View>
        </View>
      </View>

      <View style={[GlobalStyle.secureMargin, { flex: 1, justifyContent: 'center' }]}>
        {fileData.length > 0 ? (
          <>
            {/* Ler código de barras */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="barcode" size={20} type="antdesign" iconStyle={{ color: COLORS.secondary }} />
                  </View>
                }
                titleStyle={{}}
                buttonStyle={{
                  borderRadius: 25,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                }}
                title="Ler código de barras"
                onPress={() => {
                  navigation.dispatch(
                  CommonActions.navigate({
                    name: 'ModalBarcodeReader',
                    params: {
                    origin: "coletagem_invert"
                    },
                  })
                  );
                }}
              />
            </View>

            {/* Visualizar itens escaneados */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="list" size={20} type="feather" iconStyle={{ color: COLORS.secondary }} />
                  </View>
                }
                titleStyle={{}}
                buttonStyle={{
                  borderRadius: 25,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                }}
                title="Visualizar itens escaneados"
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'ListaItensLidos',
                      params: {
                        origin: 'coletagem_invert',
                      },
                    })
                  );
                }}
              />
            </View>

            {/* Buscar produto */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="search" size={20} type="feather" iconStyle={{ color: COLORS.secondary }} />
                  </View>
                }
                titleStyle={{}}
                buttonStyle={{
                  borderRadius: 25,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                }}
                title="Buscar/Selecionar produto"
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>

            {/* Exportar registros */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="export" size={20} type="fontisto" iconStyle={{ color: COLORS.secondary }} />
                  </View>
                }
                titleStyle={{ color: COLORS.secondary }}
                buttonStyle={{
                  borderRadius: 25,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                }}
                type="outline"
                title="Exportar registros"
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'ModalExportar',
                      params: {
                        origin: 'coletagem_invert',
                      },
                    })
                  );
                }}
              />
            </View>

            {/* Limpar registros (somente os escaneados) */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="clear" size={15} type="material" iconStyle={{ color: COLORS.primary }} />
                  </View>
                }
                titleStyle={{ color: COLORS.primary }}
                buttonStyle={{ borderRadius: 25, paddingVertical: 10 }}
                type="outline"
                title="Limpar registros"
                onPress={clearScannedCodes}
              />
            </View>

            {/* Limpar arquivo lido (e dados coletados) */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="clear" size={15} type="material" iconStyle={{ color: COLORS.primary }} />
                  </View>
                }
                titleStyle={{ color: COLORS.primary }}
                buttonStyle={{ borderRadius: 25, paddingVertical: 10 }}
                type="outline"
                title="Limpar arquivo lido"
                onPress={clearAllData}
              />
            </View>
          </>
        ) : (
          <>
            {/* Importar Arquivo */}
            <View style={styles.innerSpace}>
              <Button
                icon={
                  <View style={{ marginRight: 20 }}>
                    <Icon name="upload-to-cloud" size={20} type="entypo" iconStyle={{ color: COLORS.secondary }} />
                  </View>
                }
                titleStyle={{ color: COLORS.secondary }}
                buttonStyle={{
                  borderRadius: 25,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                }}
                type="outline"
                title="Importar Arquivo"
                onPress={async () => {
                  try {
                    const pickerResult = await DocumentPicker.pickSingle({
                      presentationStyle: 'fullScreen',
                      copyTo: 'cachesDirectory',
                    });
                    uploadFile([pickerResult]);
                  } catch (e) {
                    handleError(e);
                  }
                }}
              />
            </View>
          </>
        )}
      </View>

      <SearchSelectProduct
        visible={modalVisible}
        setVisible={setModalVisible}
        allLines={allLines}
        openReaderBarCode={openReaderBarCode}
      />

      {/* Background Image */}
      <View style={[GlobalStyle.secureMargin, { justifyContent: 'flex-end' }]}>
        <View style={styles.bgImage}>
          <Image source={IMAGES.BALL_BG} style={{ width: 140, height: 140 }} />
        </View>
      </View>
    </View>
  );
};

export default CenaColetagemInvert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: { 
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  text: {
    fontFamily: 'Mitr-Regular',
    lineHeight: 18,
  },
  textMedium: {
    fontFamily: 'Mitr-Medium',
    marginBottom: 3,
  },
  centerFully: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 7,
  },
  innerSpace: {
    padding: 15,
  },
  discountBox: {
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 15,
    borderRadius: 15,
    margin: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonVisitante: {
    marginTop: 15,
  },
  buttonCadastrarText: {
    textAlign: 'center',
    color: '#FFF',
  },
  bgImage: {
    width: 120,
    height: 120,
    position: 'absolute',
    zIndex: 999,
    bottom: -50,
    right: -20,
    alignSelf: 'flex-end',
  },
});
