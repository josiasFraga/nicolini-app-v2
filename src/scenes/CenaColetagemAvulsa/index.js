import React, {Component} from 'react';

import {
	StyleSheet,
	View,
	StatusBar,
	Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Button, Text, Icon, Image } from 'react-native-elements';
import { CommonActions } from '@react-navigation/native';
import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

import { connect} from 'react-redux';

type Props = {};
export class CenaColetagemAvulsa extends Component<Props> {

    componentDidMount = () => {
        this.props.loadData();
    }

	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>
                <Header backButton={true} titulo={"Coletagem Avulsa"} />
                <View style={[GlobalStyle.row, { justifyContent: "center", backgroundColor: COLORS.primary}]}>
                    <View style={{padding: 5, marginRight: 5}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.props.collection_data.n_itens}</Text>
                        <Text style={{color: "#FFF"}}>Itens Coletados</Text>
                    </View>
                    <View style={{padding: 5, marginLeft: 5}}>
                        <Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.props.collection_data.n_uniqe_itens}</Text>
                        <Text style={{color: "#FFF"}}>Itens Únicos Coletados</Text>
                    </View>
                </View>
				<View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'center'}]}>
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
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Ler código de barras"
							onPress={() => { 
								this.props.navigation.dispatch(
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
							
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							type='outline'
							title="Exportar registros"
							onPress={() => {

								this.props.navigation.dispatch(
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
									  { text: "Tenho", onPress: () => {
										AsyncStorage.removeItem('CODIGOS_AVULSOS');

                                        this.props.loadData();

										AlertHelper.show(
											'success',
											'Tudo certo',
											'Registros excluídos',
										);
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

const mapStateToProps = state => ({
	collection_data: state.appReducer.single_collection_data
});


const mapDispatchToProps = dispatch => ({
    loadData() {
        dispatch({
            type: 'LOAD_SINGLE_COLLECTION_DATA',
            payload: {}
        })
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CenaColetagemAvulsa);