import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	StatusBar,
	FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Text, ListItem, SearchBar } from 'react-native-elements';
import GlobalStyle from '@styles/global';
import Header from '@components/Header';

import COLORS from '@constants/colors';

export function CenaRecebimentoFornecedoresItensEscaneados (props) {
    const { cod_agrupador } = props.route.params;
    const [itens, setItens] = useState([]);
    const [search, setSearch] = useState('');
    const [totalItens, setTotalItens] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const buscaItens = async () => {
        setIsLoading(true);
        let scannedItems = await AsyncStorage.getItem('scanned');

        if ( scannedItems != null ) {

            scannedItems = JSON.parse(scannedItems);
            let _items = [];

            let collection = scannedItems.filter((item)=>{
                return item.cd_codagrupador == cod_agrupador;
            });

            if ( collection.length > 0 ) {
                _items = collection[0].itens.filter((_item)=>{
    
                    const buscaUsuario = search.trim().toLocaleLowerCase();       
                    return buscaUsuario == '' || (String(_item.tx_descricao.toLocaleLowerCase()).includes(buscaUsuario) || String(_item.cd_ean.toLocaleLowerCase()).includes(buscaUsuario));

                })
            }

            setItens(_items);
        
        }
        setIsLoading(false);

    }

	React.useEffect(() => {	
		buscaItens();

	}, []);

	React.useEffect(() => {	

        if ( itens.length > 0 ) {

            let _total_itens = 0;
            itens.map((_item)=>{
                _total_itens += parseFloat(_item.qt_qtde);
            });

            setTotalItens(_total_itens);

        }

	}, [itens]);

	React.useEffect(() => {	
		buscaItens();

	}, [search]);

    updateSearch = (search) => {
        setSearch(search);
    };

    const renderItem = ({ item }) => (
        <ListItem bottomDivider key={item.cd_id}>
        <ListItem.Content>
          <ListItem.Title>{item.tx_descricao}</ListItem.Title>
          <ListItem.Subtitle>{item.cd_ean}</ListItem.Subtitle>
          <ListItem.Subtitle>{item.dt_validade}</ListItem.Subtitle>
        </ListItem.Content>
        <Text>QTD: {item.qt_qtde}</Text>
      </ListItem>
    );
    
    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            />
            <Header backButton={true} titulo={"Itens coletados " + cod_agrupador} />
            <View style={{ backgroundColor: COLORS.primary}}>
                <Text style={{color: "#FFF", textAlign: "center", fontSize: 18, paddingTop: 10, textTransform: "uppercase"}}>Produtos</Text>
                <View style={[GlobalStyle.row, { justifyContent: "space-around", alignItems: "center"}]}>
                    <View style={{padding: 5, marginRight: 5, flex: 1}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{totalItens}</Text>
                        <Text style={{color: "#FFF", textAlign: "center"}}>Coletados</Text>
                    </View>
                    <View style={{padding: 5, marginLeft: 5, flex: 1}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{itens.length}</Text>
                        <Text style={{color: "#FFF", textAlign: "center"}}>Únicos Coletados</Text>
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
                    data={itens}
                    renderItem={renderItem}
                    keyExtractor={item => item.barcodescanned}
                    onRefresh={buscaItens}
                    refreshing={isLoading}
                    ListEmptyComponent={() => (
                        <Text style={{textAlign: 'center'}}>Nenhum item escaneado.</Text>
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


export default CenaRecebimentoFornecedoresItensEscaneados;