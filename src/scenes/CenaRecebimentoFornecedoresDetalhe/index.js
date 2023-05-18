import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	StatusBar,
	Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Button, Text, Icon, Image } from 'react-native-elements';
import { CommonActions, StackActions } from '@react-navigation/native';
import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

export default function CenaRecebimentoFornecedoresDetalhe ({ route, navigation }) {

    const dispatch = useDispatch();
    const { cod_agrupador, type } = route.params;
    const my_collections = useSelector(state => state.appReducer.my_collections);
    const last_scan = useSelector(state => state.appReducer.last_scan);
    const is_finishing = useSelector(state => state.appReducer.is_finishing_collection);
    const [collection, setCollection] = useState([]);
    const [nLidos, setNLidos] = useState(0);
    const [nEscaneados, setNEscaneados] = useState(0);
    const [nEscaneadosUnicos, setNEscaneadosUnicos] = useState(0);

    const componentDidMount = () => {

        let _collection_type = my_collections.filter((item)=>{
            return item.type == type;
        });
        
        if ( _collection_type.length == 0 ){ 
            navigation.dispatch(StackActions.pop(1));
            return true;
        }

        let _collection = _collection_type[0].data.filter((item)=>{
            return item.cd_codagrupador == cod_agrupador;
        });

        if ( _collection.length > 0 ) {
            setCollection(_collection[0]);
            setNLidos(_collection[0].itens.length);
        }

    }

    const loadScannedData = async () => {
        
        let scannedItems = await AsyncStorage.getItem('scanned');

        if ( scannedItems != null ) {

            scannedItems = JSON.parse(scannedItems);

            let collection = scannedItems.filter((item)=>{
                return item.cd_codagrupador == cod_agrupador;
            });

            if ( collection.length > 0 ) {
                let _nEscaneados = 0;
                collection[0].itens.map((_item)=>{
                    _nEscaneados += _item.qt_qtde;
                    
                });
                
                setNEscaneados(_nEscaneados);
                setNEscaneadosUnicos(collection[0].itens.length);
            }

        
        }
    }

    const removeScanned = async(show_alert = true) => {
    
        let scannedItems = await AsyncStorage.getItem('scanned');

        if ( scannedItems != null ) {
            scannedItems = JSON.parse(scannedItems);
            scannedItems = scannedItems.filter((scannedItem)=>{
                return scannedItem.cd_codagrupador != cod_agrupador;
            });
            AsyncStorage.setItem('scanned', JSON.stringify(scannedItems));
        }
    
        let missin_on_invoice = await AsyncStorage.getItem('missin_on_invoice');

        if ( missin_on_invoice != null ) {
            missin_on_invoice = JSON.parse(missin_on_invoice);
            missin_on_invoice = missin_on_invoice.filter((miv)=>{
                return miv.cd_codagrupador != cod_agrupador;
            });
            AsyncStorage.setItem('missin_on_invoice', JSON.stringify(missin_on_invoice));
        }        

        dispatch({
            type: 'REGISTER_LAST_SCAN',
            payload: {}
        });

        if ( show_alert ) {
            AlertHelper.show(
                'success',
                'Tudo certo',
                'Registros excluídos',
            );

        }
    }

    const _finishCollection = async() => {
    
        let scannedItems = await AsyncStorage.getItem('scanned');

        if ( scannedItems == null || JSON.parse(scannedItems).length == 0 ) {
            Alert.alert(
                "Atenção!",
                "Nenhum item foi coletado ainda",
                [
                    {
                        text: "Ok",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            );
    
            return false;
        }

        scannedItems = JSON.parse(scannedItems);

        scannedItems = scannedItems.filter((scannedItem)=>{
            return scannedItem.cd_codagrupador == cod_agrupador;
        });

        if ( scannedItems.length == 0 || scannedItems[0].itens.length == 0 ) {
            Alert.alert(
                "Atenção!",
                "Nenhum item foi coletado ainda",
                [
                    {
                        text: "Ok",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            );
    
            return false;
        }

        

        let produtosForaDaColetagem = await AsyncStorage.getItem('missin_on_invoice');

        if ( produtosForaDaColetagem == null ) {
            produtosForaDaColetagem = [];
    
        } else {
            produtosForaDaColetagem = JSON.parse(produtosForaDaColetagem);

            produtosForaDaColetagem = produtosForaDaColetagem.filter((miv)=>{
                return miv.cd_codagrupador = cod_agrupador;
            })

            if ( produtosForaDaColetagem.length == 0 ) {
                produtosForaDaColetagem = [];                
            } else {
                produtosForaDaColetagem = produtosForaDaColetagem[0].itens;
            }
    
        }

        dispatch({
            type: 'FINISH_COLLECTION',
            payload: {
                data: {
                    itens_to_save: produtosForaDaColetagem,
                    itens: scannedItems[0].itens,
                    cd_codagrupador: cod_agrupador,
                    type: type
                },
                callback_success: async () => {

                    await removeScanned(false);
                    
                    dispatch({
                        type: 'LOAD_MY_COLLECTIONS',
                        payload: {}
                    })

                    AlertHelper.show(
                        'success',
                        'Tudo certo',
                        'Coletagem finalizada com sucesso!',
                    );
    
                    navigation.dispatch(StackActions.pop(1)); 

                }
            }
        });
    }

	React.useEffect(() => {	
		componentDidMount();

	}, [my_collections]);

	React.useEffect(() => {	
		loadScannedData();

	}, [last_scan]);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            />

            <Header backButton={true} titulo={"Coletagem " + cod_agrupador} />

            <View style={{ backgroundColor: COLORS.primary}}>
                <Text style={{color: "#FFF", textAlign: "center", fontSize: 18, paddingTop: 10, textTransform: "uppercase"}}>Produtos</Text>
                <View style={[GlobalStyle.row, { justifyContent: "space-around", alignItems: "center"}]}>
                    <View style={{padding: 5, marginRight: 5, flex: 1}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{nLidos}</Text>
                        <Text style={{color: "#FFF", textAlign: "center"}}>Lidos</Text>
                    </View>
                    <View style={{padding: 5, marginRight: 5, flex: 1}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{nEscaneados}</Text>
                        <Text style={{color: "#FFF", textAlign: "center"}}>Coletados</Text>
                    </View>
                    <View style={{padding: 5, marginLeft: 5, flex: 1}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{nEscaneadosUnicos}</Text>
                        <Text style={{color: "#FFF", textAlign: "center"}}>Únicos Coletados</Text>
                    </View>
                </View>
            </View>

            <View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'center'}]}>

                {type == 'coletagens' && 
                <>
                <View style={styles.innerSpace}>
                    <Button
                        icon={
                            <View style={{marginRight: 20}}>
                            <Icon
                            name="barcode"
                            size={20}
                            type='antdesign'
                            iconStyle={{color: COLORS.secondary}}
                            />
                            </View>
                        }
                        disabled={collection.length == 0}
                        titleStyle={{}}
                        buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
                        title="Ler código de barras"
                        onPress={() => { 
                            navigation.dispatch(
                                CommonActions.navigate('ModalBarcodeReader', {
                                    origin: 'recebimento_fornecedores',
                                    itens: collection.itens,
                                })
                            );

                        }}
                    />
                </View>

                <View style={styles.innerSpace}>
                    <Button
                        icon={
                            <View style={{marginRight: 20}}>
                                <Icon
                                    name="balance-scale"
                                    size={20}
                                    type='font-awesome'
                                    iconStyle={{color: COLORS.secondary}}
                                />
                            </View>
                        }
                        disabled={collection.length == 0}
                        titleStyle={{}}
                        buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
                        title="Produtos por peso"
                        onPress={() => { 
                            navigation.dispatch(
                                CommonActions.navigate('CenaRecebimentoFornecedoresItensPeso', {
                                    itens: collection.itens,
                                })
                            );

                        }}
                    />
                </View>

                <View style={styles.innerSpace}>
                    <Button
                        icon={
                            <View style={{marginRight: 20}}>
                            <Icon
                            name="list"
                            size={20}
                            type='feather'
                            iconStyle={{color: COLORS.secondary}}
                            />
                            </View>
                        }
                        titleStyle={{}}
                        buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
                        title="Visualizar itens escaneados"
                        onPress={() => { 

                            navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'RecebimentoFornecedoresItensEscaneados',
                                    params: {
                                        cod_agrupador: cod_agrupador,
                                    },
                                })
                            );
                        }}
                    />
                </View>
                </>
                }
                {type == 'recontagens' &&
                <View style={styles.innerSpace}>
                    <Button
                        icon={
                            <View style={{marginRight: 20}}>
                                <Icon
                                    name="list"
                                    size={20}
                                    type='font-awesome'
                                    iconStyle={{color: COLORS.secondary}}
                                />
                            </View>
                        }
                        disabled={collection.length == 0}
                        titleStyle={{}}
                        buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
                        title="Produtos a serem recontados"
                        onPress={() => { 
                            navigation.dispatch(
                                CommonActions.navigate('RecebimentoFornecedoresItensRecontar', {
                                    itens: collection.itens,
                                })
                            );

                        }}
                    />
                </View>
                }

                <View style={styles.innerSpace}>
                    <Button
                        icon={
                            <View style={{marginRight: 20}}>
                            <Icon
                            name="export"
                            size={20}
                            type='fontisto'
                            iconStyle={{color: COLORS.secondary}}
                            />
                            </View>
                        }
                        titleStyle={{color: COLORS.secondary}}
                        disabled={is_finishing}
                        buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
                        type='outline'
                        title="Finalizar Coletagem"
                        onPress={() => {
                            Alert.alert(
                            "Atenção!",
                            "Você tem certeza que deseja finalizar esta coletagem?",
                            [
                                {
                                text: "Não",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                                },
                                { text: "Tenho", onPress: async () => {
                                    _finishCollection();
                                } }
                            ],
                            { cancelable: false }
                            );

                        }}
                    />
                </View>
                <View style={GlobalStyle.spaceMedium} />
                <View style={styles.innerSpace}>
                    <Button
                        icon={
                            <View style={{marginRight: 20}}>
                            <Icon
                            name="clear"
                            size={15}
                            type='material'
                            iconStyle={{color: COLORS.primary}}
                            />
                            </View>
                        }
                        titleStyle={{color: COLORS.primary}}
                        buttonStyle={{borderRadius: 25, paddingVertical: 10}}
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
                                { text: "Tenho", onPress: async () => {
                                    removeScanned();
                                } }
                            ],
                            { cancelable: false }
                            );
                            
                        }}
                    />
                </View>
            </View>
            <View style={[GlobalStyle.secureMargin, {justifyContent: 'flex-end'}]}>
                <View style={styles.bgImage}>
                    <Image source={IMAGES.BALL_BG} style={{ width: 140, height: 140 }} />
                </View>
            </View>
        </View>
    );
}

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
		bottom:-50,
		right: -20,
		alignSelf: 'flex-end',
	}
});

/*const mapStateToProps = state => ({
	collection_data: state.appReducer.invert_collection_data
});


const mapDispatchToProps = dispatch => ({
    loadData() {
        dispatch({
            type: 'LOAD_INVERT_COLLECTION_DATA',
            payload: {}
        })
    },
})*/