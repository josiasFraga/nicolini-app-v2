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
	DirectoryPickerResponse,
	DocumentPickerResponse,
	isInProgress,
	types,
  } from 'react-native-document-picker'

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

import { connect} from 'react-redux';

type Props = {};
export class CenaSeparacaoCentral extends Component<Props> {

	constructor(props) {
		super(props);
		this.state = {
			file_data: [],
			file_data_n_itens: 0
		};
	}

    componentDidMount = async () => {
        this.props.loadData();
		await this.checkUploadedFile();
    }

	checkUploadedFile = async () => {
		
		const value = await AsyncStorage.getItem('UPLOADED_FILE_CENTRAL_COLLECTION');
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
		console.log(file);
		const type = file[0].type;

		if ( type != "application/octet-stream" ) {

			AlertHelper.show(
				'info',
				'Atenção',
				'Tipo de arquivo não aceito',
			);

			return false;
		}
		
		let content = '';

		try{
			content = await RNFS.readFile(file[0].fileCopyUri, 'utf8');
		} catch (e) {
			console.log('Erro ao ler o documento como UTF-8');
			console.log(e);
			console.log('Tentado ler em outra codificação');
			try{
				content = await RNFS.readFile(file[0].fileCopyUri, 'ascii');
				console.log(content);
			} catch (e2) {
				console.log('Erro ao ler o documento');

				AlertHelper.show(
					'error',
					'Erro',
					'Erro ao ler o documento',
				);
			}
		}
	
		let content_lines = content.split(/\r?\n/);
		let content_to_save = [];
		let ignored_items = [];

		content_lines.map((ct) => {
		
			let loja = '';
			let pedido = '';
			let cod_interno = '';
			let cod_barras = '';
			let produto = '';
			let quatidade = '';
			let rest = '';

			if ( ct.length == 87 ) {
				loja = ct.substring(0, 4);
				pedido = ct.substring(4, 10);
				cod_interno = ct.substring(10, 28);
				cod_barras = ct.substring(28, 41);
				produto = ct.substring(41, 73);
				quatidade = ct.substring(73, 79);
				rest = ct.substring(79, 87);
			}

			else if ( ct.length == 86 ) {
				loja = ct.substring(0, 4);
				pedido = ct.substring(4, 10);
				cod_interno = ct.substring(10, 28);
				cod_barras = ct.substring(28, 40);
				produto = ct.substring(40, 72);
				quatidade = ct.substring(72, 78);
				rest = ct.substring(78, 86);
			}
			else if ( ct.length == 85 ) {
				loja = ct.substring(0, 4);
				pedido = ct.substring(4, 10);
				cod_interno = ct.substring(10, 28);
				cod_barras = ct.substring(28, 39);
				produto = ct.substring(39, 71);
				quatidade = ct.substring(71, 77);
				rest = ct.substring(77, 85);
			}
			else if ( ct.length == 84 ) {
				loja = ct.substring(0, 4);
				pedido = ct.substring(4, 10);
				cod_interno = ct.substring(10, 28);
				cod_barras = ct.substring(28, 38);
				produto = ct.substring(38, 70);
				quatidade = ct.substring(70, 76);
				rest = ct.substring(76, 84);
			}
			else {
				console.log(ct.length);
				console.log(ct);
				ignored_items.push(ct);
				return false;
			}

			if ( loja != "" ) {
				content_to_save.push({
					loja: loja,
					pedido: pedido,
					cod_interno: cod_interno.trim(),
					cod_barras: cod_barras,
					produto: produto.trim(),
					qtd: quatidade,
					rest: rest,
				});
			}
		})

		if ( content_to_save.length > 0 ) {

            await AsyncStorage.setItem(
              'UPLOADED_FILE_CENTRAL_COLLECTION',
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
                <Header backButton={true} titulo={"Separação Central"} />
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
										name: 'ModalBarcodeReader',
										params: {
											origin: "separacao_central"
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
											origin: "separacao_central"
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
										AsyncStorage.removeItem('CODIGOS_CENTRAL');
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
										await AsyncStorage.removeItem('CODIGOS_CENTRAL');
										await AsyncStorage.removeItem('UPLOADED_FILE_CENTRAL_COLLECTION');
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
						title="Importar Pedido"
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
	collection_data: state.appReducer.central_collection_data
});


const mapDispatchToProps = dispatch => ({
    loadData() {
        dispatch({
            type: 'LOAD_CENTRAL_COLLECTION_DATA',
            payload: {}
        })
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CenaSeparacaoCentral);