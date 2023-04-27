import React, { useState } from 'react';

import {
	StyleSheet,
	View,
	StatusBar,
	FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import {Text, ListItem, SearchBar } from 'react-native-elements';
import GlobalStyle from '@styles/global';
import Header from '@components/Header';

import COLORS from '@constants/colors';

export function CenaRecebimentoFornecedoresItensPeso (props) {
    
    const [produtosPeso, setProdutosPeso] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { itens } = props.route.params;

    const buscaProdutos = async () => {
        const goods = await AsyncStorage.getItem('goods');
        return JSON.parse(goods);

    }

    const opeModalBarCodeRead = (item) => {
        
        props.navigation.dispatch(
            CommonActions.navigate('ModalBarcodeReader', {
                origin: 'recebimento_fornecedores',
                itens: itens,
                setEanRead: item.good.cd_codigoean,
                callbackSuccess: buscaItens
            })
        );
    }

    const buscaItens = async () => {

        setIsLoading(true);   
 
        let goods = await buscaProdutos();
        let scannedItems = await AsyncStorage.getItem('scanned');

        if ( scannedItems != null ) {
            scannedItems = JSON.parse(scannedItems);

        }

        let _produtos = itens.filter((_item)=>{
            let _good = goods.filter((good) => {
                return _item.cd_codigoint == good.cd_codigoint;
            })[0];

            if ( _good.cd_unidade != 'kg' ) {
                return false;
            }

            const buscaUsuario = search.trim().toLocaleLowerCase();
            const buscaTesteNome = String(_good.tx_descricao.toLocaleLowerCase()).includes(buscaUsuario);
            const buscaTesteEan = String(_good.cd_codigoean.toLocaleLowerCase()).includes(buscaUsuario);

            if ( buscaUsuario != '' && !buscaTesteNome && !buscaTesteEan ) {
                return false;
            }

            _item.n_readed = 0;

            if ( scannedItems != null ) {
                let collection = scannedItems.filter((san_itens)=>{
                    return san_itens.cd_codagrupador == _item.cd_codagrupador;
                });

                if ( collection.length > 0 ) {
                    let _item_on_itens_read = collection[0].itens.filter((_item_read)=>{
                        return _item_read.cd_codigoint == _item.cd_codigoint;
    
                    });

                    if ( _item_on_itens_read.length > 0 ) {

                        const total_itens_read = _item_on_itens_read.reduce((acumulador, elemento) => {
                            return acumulador + elemento.qt_qtde;
                        }, 0);

                        _item.n_readed = total_itens_read;

                    }
                }
            }

            _item.good = _good;
            return _item;

        });

        setProdutosPeso(_produtos);        
        setIsLoading(false);

    }

	React.useEffect(() => {	
		buscaItens();

	}, []);


	React.useEffect(() => {	
		buscaItens();

	}, [search]);

    updateSearch = (search) => {
        setSearch(search);
    };

    const renderItem = ({ item }) => (
        <ListItem bottomDivider key={item.cd_id} onPress={()=>{ opeModalBarCodeRead(item) }}>
        <ListItem.Content>
          <ListItem.Title>{item.good.tx_descricao}</ListItem.Title>
          <ListItem.Subtitle>{item.good.cd_codigoean}</ListItem.Subtitle>
        </ListItem.Content>
        <Text>QTD: {item.n_readed}</Text>
      </ListItem>
    );
    
    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            />
            <Header backButton={true} titulo={"Produtos por Peso"} />
            <View style={{ backgroundColor: COLORS.primary}}>
                <Text style={{color: "#FFF", textAlign: "center", fontSize: 18, paddingTop: 10, textTransform: "uppercase"}}>Produtos</Text>
                <View style={[GlobalStyle.row, { justifyContent: "space-around", alignItems: "center"}]}>
                    <View style={{padding: 5, marginRight: 5, flex: 1}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{produtosPeso.length}</Text>
                        <Text style={{color: "#FFF", textAlign: "center"}}>Nº Produtos Encontrados</Text>
                    </View>
                </View>
            </View>
            <SearchBar
                placeholder="Buscar item..."
                onChangeText={this.updateSearch}
                value={search}
                lightTheme={true}
            />
            <View style={[{flex: 1, justifyContent: 'center'}]}>
                <FlatList
                    data={produtosPeso}
                    renderItem={renderItem}
                    keyExtractor={item => item.barcodescanned}
                    onRefresh={buscaItens}
                    refreshing={isLoading}
                    ListEmptyComponent={() => (
                        <Text style={{textAlign: 'center'}}>Nenhum item por peso nessa coletagem.</Text>
                    )}
                />
            
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


export default CenaRecebimentoFornecedoresItensPeso;