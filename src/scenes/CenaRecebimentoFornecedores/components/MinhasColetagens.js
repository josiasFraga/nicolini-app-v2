import React from 'react';
import {
	StyleSheet,
	View,
    SectionList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle from '@styles/global';
import { ListItem, Text } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

function MinhasColetagens (props) {
	const dispatch = useDispatch();
    const navigation = useNavigation();

    const is_loading = useSelector(state => state.appReducer.is_loading_my_collections);
    const collections = useSelector(state => state.appReducer.my_collections);

    const loadItems = () => {
        dispatch({
			type: 'LOAD_MY_COLLECTIONS',
			payload: {}
		})

    }

	React.useEffect(() => {	
		loadItems();

	}, []);

    const collectionDetail = (cod_agrupador, type) => {        
        navigation.dispatch(
            CommonActions.navigate('CenaRecebimentoFornecedoresDetalhe', {
                cod_agrupador: cod_agrupador,
                type: type,
            })
        );

    }

    const RenderItem = (props) => {
        const collection = props.item;
        const type = props.type;
        return (
            <ListItem key={collection.cd_codagrupador} bottomDivider onPress={() => collectionDetail(collection.cd_codagrupador, type)}>
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

			<View style={GlobalStyle.secureMargin}>
                <SectionList
                    sections={collections}
                    renderItem={({item,section}) => <RenderItem item={item} type={section.type} />}
                    renderSectionHeader={({section: {title}}) => {
                        return <Text style={{fontWeight: 'bold'}}>{title}</Text>
                    }}
                      keyExtractor={(item, index) => item + index}
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

export default MinhasColetagens;