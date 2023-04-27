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
var RNFS = require('react-native-fs');
import DocumentPicker, {
	isInProgress,
  } from 'react-native-document-picker'

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

import { connect} from 'react-redux';

type Props = {};
export class CenaColetagemInvert extends Component<Props> {

	constructor(props) {
		super(props);
		this.state = {
			file_data: [],
			file_data_n_itens: 0
		};
	}

    componentDidMount = () => {
        this.props.loadData();
		this.checkUploadedFile();
    }

	checkUploadedFile = async () => {
		
		const value = await AsyncStorage.getItem('UPLOADED_FILE_INVERT_COLLECTION');
		
		if (value !== null) {
		  	let data = JSON.parse(value);
		  	this.setState({file_data_n_itens: data.length, file_data: data});
		} else {
			this.setState({file_data_n_itens: 0, file_data: []});
		}
	}

	handleError = (err) => {
		if (DocumentPicker.isCancel(err)) {
		  console.warn('cancelled')
		  // User cancelled the picker, exit any dialogs or menus and move on
		} else if (isInProgress(err)) {
		  console.warn('multiple pickers were opened, only the last will be considered')
		} else {
		  throw err
		}
	}

	uploadFile = async (file) => {
		const type = file[0].type;

		if ( type != "text/plain" ) {

			AlertHelper.show(
				'info',
				'Atenção',
				'Tipo de arquivo não aceito',
			);

			return false;
		}


		let content = "";

		console.info("Lendo arquivo...")

		try{
			content = await RNFS.readFile(file[0].fileCopyUri, 'utf8')
		} catch(e){
			content = await RNFS.readFile(file[0].fileCopyUri, 'ascii')
		}

		let content_lines = content.split(/\r?\n/);
		let content_to_save = [];
		let ignored_items = [];

		content_lines.map((ct) => {

			if ( ct.length < 83 ) {
				ignored_items.push(ct);
				return false;
			}

			let cod_barras = ct.substring(0, 13);
			let cod_interno = ct.substring(14, 23);
			let produto = ct.substring(24, 75);
			let rest = ct.substring(75, 83);

			content_to_save.push({
				cod_barras: cod_barras,
				cod_interno: cod_interno.trim(),
				produto: produto.trim(),
				rest: rest,
			});
		})

		if ( content_to_save.length > 0 ) {

            await AsyncStorage.setItem(
              'UPLOADED_FILE_INVERT_COLLECTION',
              JSON.stringify(content_to_save)
            );

			this.setState({
				file_data: content_to_save,
				file_data_n_itens: content_to_save.length
			});

			if (ignored_items.length > 0) {

				AlertHelper.show(
					'info',
					'Informação',
					'Arquivo importado com sucesso! ' + ignored_items.length + " registros foram ignorados por não estarem no padrão esperado.",
				);

				return true;
			}

			AlertHelper.show(
				'success',
				'Tudo certo',
				'Arquivo importado com sucesso!',
			);

		} else {

			AlertHelper.show(
				'error',
				'Erro',
				'Dados inválidos',
			);

		}

	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>
                <Header backButton={true} titulo={"Coletagem Invert"} />
                <View style={{ backgroundColor: COLORS.primary}}>
					<Text style={{color: "#FFF", textAlign: "center", fontSize: 18, paddingTop: 10, textTransform: "uppercase"}}>Produtos</Text>
					<View style={[GlobalStyle.row, { justifyContent: "space-around", alignItems: "center"}]}>
						<View style={{padding: 5, marginRight: 5, flex: 1}}>
							<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.state.file_data_n_itens}</Text>
							<Text style={{color: "#FFF", textAlign: "center"}}>Lidos</Text>
						</View>
						<View style={{padding: 5, marginRight: 5, flex: 1}}>
							<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.props.collection_data.n_itens}</Text>
							<Text style={{color: "#FFF", textAlign: "center"}}>Coletados</Text>
						</View>
						<View style={{padding: 5, marginLeft: 5, flex: 1}}>
							<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.props.collection_data.n_uniqe_itens}</Text>
							<Text style={{color: "#FFF", textAlign: "center"}}>Únicos Coletados</Text>
						</View>
					</View>
				</View>
				<View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'center'}]}>
				
				{this.state.file_data.length > 0 && 
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
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Ler código de barras"
							onPress={() => { 

								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'ColeragemInvert',
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

								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'ListaItensLidos',
										params: {
											origin: "coletagem_invert"
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
										params: {
											origin: "coletagem_invert"
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
										AsyncStorage.removeItem('CODIGOS_INVERT');
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
							title="Limpar arquivo lido"
							onPress={() => {
								Alert.alert(
									"Atenção!",
									"Esta ação apagará também os dados coletados?",
									[
									  {
										text: "Não",
										onPress: () => console.log("Cancel Pressed"),
										style: "cancel"
									  },
									  { text: "Tenho", onPress: async () => {
										await AsyncStorage.removeItem('CODIGOS_INVERT');
										await AsyncStorage.removeItem('UPLOADED_FILE_INVERT_COLLECTION');
										this.props.loadData();
										this.checkUploadedFile();
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
				</>
				}

				{this.state.file_data.length == 0 && 
				<>
				<View style={styles.innerSpace}>
					<Button
						icon={
							<View style={{marginRight: 20}}>
							<Icon
							name="upload-to-cloud"
							size={20}
							type='entypo'
							iconStyle={{color: COLORS.secondary}}
							/>
							</View>
						}
						titleStyle={{color: COLORS.secondary}}
						
						buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
						type='outline'
						title="Importar Arquivo"
						onPress={async () => {
								try {
									const pickerResult = await DocumentPicker.pickSingle({
									presentationStyle: 'fullScreen',
									copyTo: 'cachesDirectory',
									})
									this.uploadFile([pickerResult])
								} catch (e) {
									this.handleError(e)
								}
							}
						}
					/>
				</View>
				</>}
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
	collection_data: state.appReducer.invert_collection_data
});


const mapDispatchToProps = dispatch => ({
    loadData() {
        dispatch({
            type: 'LOAD_INVERT_COLLECTION_DATA',
            payload: {}
        })
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CenaColetagemInvert);