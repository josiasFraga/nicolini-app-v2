import React from 'react';
import {
	StyleSheet,
	View,
	StatusBar,
    Alert,
    FlatList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle from '@styles/global';
import Header from '@components/Header';
import { ListItem, Text } from 'react-native-elements'
import { StackActions, useNavigation } from '@react-navigation/native';

function CenaListaColetagens (props) {
	const dispatch = useDispatch();
    const navigation = useNavigation();

    const is_loading = useSelector(state => state.appReducer.is_loading_collections);
    const is_starting_collection = useSelector(state => state.appReducer.is_starting_collection);
    const collections = useSelector(state => state.appReducer.collections);

    const loadItems = () => {
        dispatch({
			type: 'LOAD_COLLECTIONS',
			payload: {}
		})

    }

	React.useEffect(() => {	
		loadItems();

	}, []);

    const getCollection = (cod_agrupador) => {
        Alert.alert('Atenção!', 'Deseja realmente iniciar a coletagem #' + cod_agrupador, [
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Iniciar', onPress: () => {
                dispatch({
                    type: 'START_COLLECTION',
                    payload: {
                        cd_codagrupador: cod_agrupador,
                        callback_success: () => {
                            dispatch({
                                type: 'LOAD_MY_COLLECTIONS',
                                payload: {}
                            })
                            navigation.dispatch(StackActions.pop(1));
                        }
                    }
                })
                
            }},
          ]);
    }

    const RenderItem = (props) => {
        const collection = props.item;
        return (
            <ListItem bottomDivider onPress={() => getCollection(collection.cd_codagrupador)} disabled={is_starting_collection}>
                <ListItem.Content>
                  <ListItem.Title>Fornecedor: {collection.fornecedor_nome_fantasia}</ListItem.Title>
                  <ListItem.Subtitle>Cód Agrupador: {collection.cd_codagrupador}</ListItem.Subtitle>
                  <ListItem.Subtitle>Tipo: Contagem</ListItem.Subtitle>
                  <ListItem.Subtitle>Cód Chave: {collection.cd_chave}</ListItem.Subtitle>
                  <ListItem.Subtitle>Loja: {collection.loja_nome_fantasia}</ListItem.Subtitle>
                  <ListItem.Subtitle>Data: {collection.ultatu_br}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )
    }

	return (
		<View style={styles.container}>
			<StatusBar
				translucent={true}
				backgroundColor={'transparent'}
				barStyle={'dark-content'}
			/>
            <Header backButton={true} titulo={"Coletagens em Aberto"} />

			<View style={GlobalStyle.secureMargin}>
                <FlatList
                    data={collections}
                    renderItem={({item}) => <RenderItem item={item} />}
                    keyExtractor={item => item.cd_codagrupador}
                    onRefresh={() => {
                        loadItems();
                    }}
                    refreshing={is_loading}
                    ListEmptyComponent={()=>{
                        if ( is_loading ) {
                            return null;
                        }
                        return <Text>Nenhuma coletagem aberta</Text>
                    }}
                />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	container: {
		flex: 1,
	}
});

export default CenaListaColetagens;