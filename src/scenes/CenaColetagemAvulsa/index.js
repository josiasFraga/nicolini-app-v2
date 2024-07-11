import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Icon, Image } from 'react-native-elements';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

const CenaColetagemAvulsa = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const collection_data = useSelector(state => state.appReducer.single_collection_data);

  useEffect(() => {
    dispatch(loadData());
  }, [dispatch]);

  const loadData = () => ({
    type: 'LOAD_SINGLE_COLLECTION_DATA',
    payload: {},
  });

  const showAlert = (mensagem) => {
    Alert.alert(
      "Atenção",
      mensagem,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }

  const sendDataToBackend = async (values, setSubmitting, resetForm) => {
    const value = await AsyncStorage.getItem('CODIGOS_AVULSOS');

    if (value === null) {
      showAlert('A lista de coleta está vazia');
      return;
    }

    let codigos = JSON.parse(value)
    var codesToFile = [];

    codesToFile = Object.values(codigos.reduce((acc, item) => {
      if (!acc[item.barcodescanned]) {
        acc[item.barcodescanned] = {
          barcodescanned: item.barcodescanned,
          qtd: parseFloat(item.qtd),
        };
      } else {
        acc[item.barcodescanned].qtd += parseFloat(item.qtd);
      }
      return acc;
    }, {}));
	
	dispatch({
		type: 'SEND_SINGLE_SPLIT',
		payload: {
			submitValues: codesToFile,
			storeCode: values.storeCode,
			setSubmitting: setSubmitting,
			callbackSuccess: () => {
				resetForm();
				setModalVisible(false);
			}
		}
	})
    
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <Header backButton={true} titulo={"Coletagem Avulsa"} />
      <View style={[GlobalStyle.row, { justifyContent: "center", backgroundColor: COLORS.primary }]}>
        <View style={{ padding: 5, marginRight: 5 }}>
          <Text style={{ textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold" }}>{collection_data.n_itens}</Text>
          <Text style={{ color: "#FFF" }}>Itens Coletados</Text>
        </View>
        <View style={{ padding: 5, marginLeft: 5 }}>
          <Text style={{ textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold" }}>{collection_data.n_uniqe_itens}</Text>
          <Text style={{ color: "#FFF" }}>Itens Únicos Coletados</Text>
        </View>
      </View>
      <View style={[GlobalStyle.secureMargin, { flex: 1, justifyContent: 'center' }]}>
        <View style={styles.innerSpace}>
          <Button
            icon={
              <View style={{ marginRight: 20 }}>
                <Icon
                  name="barcode"
                  size={20}
                  type='antdesign'
                  iconStyle={{ color: COLORS.secondary }}
                />
              </View>
            }
            titleStyle={{}}
            buttonStyle={{ borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary }}
            title="Ler código de barras"
            onPress={() => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'ModalBarcodeReader',
                  params: {
                    origin: "avulsa"
                  },
                })
              );
            }}
          />
        </View>
        <View style={styles.innerSpace}>
          <Button
            icon={
              <View style={{ marginRight: 20 }}>
                <Icon
                  name="database"
                  size={20}
                  type='fontisto'
                  iconStyle={{ color: COLORS.secondary }}
                />
              </View>
            }
            titleStyle={{ color: COLORS.secondary }}
            buttonStyle={{ borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary }}
            type='outline'
            title="Enviar dados WMS"
            onPress={() => setModalVisible(true)}
          />
        </View>
        <View style={styles.innerSpace}>
          <Button
            icon={
              <View style={{ marginRight: 20 }}>
                <Icon
                  name="export"
                  size={20}
                  type='fontisto'
                  iconStyle={{ color: COLORS.secondary }}
                />
              </View>
            }
            titleStyle={{ color: COLORS.secondary }}
            buttonStyle={{ borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary }}
            type='outline'
            title="Exportar registros"
            onPress={() => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'ModalExportar',
                })
              );
            }}
          />
        </View>
        <View style={styles.innerSpace}>
          <Button
            icon={
              <View style={{ marginRight: 20 }}>
                <Icon
                  name="clear"
                  size={15}
                  type='material'
                  iconStyle={{ color: COLORS.primary }}
                />
              </View>
            }
            titleStyle={{ color: COLORS.primary }}
            buttonStyle={{ borderRadius: 25, paddingVertical: 10 }}
            type='outline'
            title="Limpar registros"
            onPress={() => {
              Alert.alert(
                "Atenção!",
                "Você tem certeza que deseja limpar os dados?",
                [
                  {
                    text: "Não",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "Tenho", onPress: () => {
                      AsyncStorage.removeItem('CODIGOS_AVULSOS');
                      dispatch(loadData());
                      AlertHelper.show(
                        'success',
                        'Tudo certo',
                        'Registros excluídos',
                      );
                    }
                  }
                ],
                { cancelable: false }
              );
            }}
          />
        </View>
      </View>
      <View style={[GlobalStyle.secureMargin, { justifyContent: 'flex-end' }]}>
        <View style={styles.bgImage}>
          <Image source={IMAGES.BALL_BG} style={{ width: 140, height: 140 }} />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Formik
              initialValues={{ storeCode: '' }}
              validationSchema={Yup.object({
                storeCode: Yup.string()
                  .required('Código da loja é obrigatório'),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => sendDataToBackend(values, setSubmitting, resetForm)}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View>
                  <Text style={styles.modalText}>Digite o código da loja</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('storeCode')}
                    onBlur={handleBlur('storeCode')}
                    value={values.storeCode}
                    placeholder="Código da loja"
                  />
                  {errors.storeCode && touched.storeCode ? (
                    <Text style={styles.errorText}>{errors.storeCode}</Text>
                  ) : null}
                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={handleSubmit}
                      title="Enviar"
					  disabled={isSubmitting}
                      buttonStyle={styles.modalButton}
                    />
                    <Button
                      onPress={() => setModalVisible(!modalVisible)}
                      title="Cancelar"
                      buttonStyle={styles.modalButton}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: 200
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    marginHorizontal: 10,
    backgroundColor: COLORS.primary
  },
  errorText: {
    color: 'red'
  }
});

export default CenaColetagemAvulsa;
