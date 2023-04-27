import React from 'react';

import {
	StyleSheet,
	View,
	StatusBar,
} from 'react-native';

import {Button, Icon } from 'react-native-elements';
import { CommonActions } from '@react-navigation/native';
import Header from '@components/Header';
import MinhasColetagens from './components/MinhasColetagens';

import COLORS from '@constants/colors';

export function CenaRecebimentoFornecedores (props) {

    listaColetagens = () => {
        props.navigation.dispatch(
            CommonActions.navigate({
                name: 'ListaColetagens'
            })
        );
    
    }

    return (
        <View style={styles.container}>

            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            />

            <Header backButton={true} titulo={"Recebimento de Fornecedores"} />

            <View style={[{flex: 1, justifyContent: 'center'}]}>
                
                <MinhasColetagens />
 
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
                        titleStyle={{color: COLORS.secondary}}
                        
                        buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
                        type='outline'
                        title="Iniciar Nova Coletagem"
                        onPress={listaColetagens}
                    />
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

export default CenaRecebimentoFornecedores;