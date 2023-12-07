import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	StyleSheet,
	View,
	StatusBar,
	Alert,
	FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Button, Text, Icon, ListItem } from 'react-native-elements';
import { CommonActions } from '@react-navigation/native';
import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';
import FormFiltroSeparacao from '@components/Forms/FormFiltroSeparacao';
import { useFormik } from 'formik';
import * as yup from 'yup';


import COLORS from '@constants/colors';

// Function to validate and parse Brazilian date format (DD/MM/YYYY)
const isValidBRDate = (value) => {
	const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  
	if (!dateFormatRegex.test(value)) {
	  return false; // Does not match the format
	}
  
	const parts = value.split('/');
	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10) - 1; // Month is 0-based in JavaScript
	const year = parseInt(parts[2], 10);
  
	const date = new Date(year, month, day);
  
	// Check if the date is valid
	return date && date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
  };
  
// Custom Yup method for Brazilian date validation
yup.addMethod(yup.string, 'brDate', function (message) {
return this.test('brDate', message, function (value) {
	const { path, createError } = this;

	if (!isValidBRDate(value)) {
	return createError({ path, message: message || 'Data inválida. Formato deve ser DD/MM/YYYY.' });
	}

	return true;
});
});

const ValidateSchema = yup.object().shape({
	loja: yup.string().required('Filtro de loja é obrigatório'),
	deposito: yup.number().required('Filtro de depósito é obrigatória'),
	data: yup.string().brDate().required('Filtro de data é obrigatório'),
});

export const CenaSeparacaoCentral = (props) => {
    const dispatch = useDispatch();
    const separacoes = useSelector(state => state.appReducer.splits);

    const [showForm, setShowForm] = useState(true);
    const [mySplits, setMySplits] = useState([]);
    const [nItensLidos, setNItensLidos] = useState(0);
    const [nItensColetados, setNItensColetados] = useState(0);
    const [nItensUnicosColetados, setNItensUnicosColetados] = useState(0);

    useEffect(() => {
		if ( separacoes.length > 0 ) {
			setShowForm(false);
		}
    }, [separacoes]);

	useEffect(() => {
		loadMySplits();
    }, []);

	const loadMySplits = async () => {

		console.log('Carregando my splits');

		try {
			let my_splits = await AsyncStorage.getItem('my_splits');
  
            if (my_splits !== null) {

                my_splits = JSON.parse(my_splits);
				let n_itens = 0;
				let total_itens = 0;

				my_splits.map((item) => {
					if ( item._qtd_coletada > 0 ) {
						total_itens += item._qtd_coletada;
						n_itens++;
					}
				});
	
				console.log(my_splits.length + ' splits encontradas');

				setMySplits(my_splits);
				setNItensLidos(my_splits.length);
				setNItensColetados(total_itens);
				setNItensUnicosColetados(n_itens);
            } else {
				setNItensLidos(0);
				setNItensColetados(0);
				setNItensUnicosColetados(0);
				setMySplits([]);
				console.log('Senhuma split encontrada');
			}
        }
        catch(e) {
            console.log(e);
        }


	}

	const limpaLeituras = async () => {
		console.log('Limpando leituras');

		try {
			let my_splits = await AsyncStorage.getItem('my_splits');
  
            if (my_splits !== null) {

                my_splits = JSON.parse(my_splits);

				my_splits.map((item) => {
					item._qtd_coletada = parseFloat(0);
					return item;
				});
				
				await AsyncStorage.setItem('my_splits', JSON.stringify(my_splits));
	
				console.log(my_splits.length + ' splits encontradas');

				setMySplits(my_splits);
				setNItensLidos(my_splits.length);
				setNItensColetados(0);
				setNItensUnicosColetados(0);
            } else {
				setNItensLidos(0);
				setNItensColetados(0);
				setNItensUnicosColetados(0);
				setMySplits([]);
				console.log('Senhuma split encontrada');
			}
        }
        catch(e) {
            console.log(e);
        }
	}

	const formik = useFormik({
		initialValues: { 
			loja: '', 
			deposito: '',
			data: ''
		},
		validationSchema: ValidateSchema,
		onSubmit: (values, {setSubmitting, resetForm}) => {

			let submitValues = values;
			setSubmitting(true);
		  
			dispatch({
				type: 'LOAD_SPLITS',
				payload: {
					submitValues: submitValues,
					setSubmitting: setSubmitting,
					callback_success: () => {
					}
				}
			})
		},
	});

	const iniciaSeparacao = () => {
		Alert.alert('Atenção!', 'Deseja realmente iniciar a separação ?', [
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Iniciar', onPress: () => {
                formik.setSubmitting(true);
				dispatch({
					type: 'START_SPLIT',
					payload: {
						submitValues: formik.values,
						setSubmitting: formik.setSubmitting,
						callback_success: () => {
							loadMySplits();
						}
					}
				})
                
            }},
        ]);
    }

	const finalizaSeparacao = () => {
		Alert.alert('Atenção!', 'Deseja realmente finalizar a separação?', [
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Finalizar', onPress: () => {
                formik.setSubmitting(true);
				dispatch({
					type: 'END_SPLIT',
					payload: {
						submitValues: mySplits,
						setSubmitting: formik.setSubmitting,
						callback_success: () => {
							loadMySplits();
						}
					}
				})
                
            }},
        ]);
    }

	const RenderItem = (props) => {
        const split = props.item;
		let deposito = "";

		if ( split.Separacao === 1 ) {
			deposito = "SEDE";
		}
		else if ( split.Separacao === 2 ) {
			deposito = "ACC";
		}
		else if ( split.Separacao === 3 ) {
			deposito = "CDA";
		}
        return (
            <ListItem bottomDivider onPress={() => {
				iniciaSeparacao();
			}}>
                <ListItem.Content>
                  <ListItem.Title>Loja: {split.Loja}</ListItem.Title>
                  <ListItem.Subtitle>Depósito: {deposito}</ListItem.Subtitle>
                  <ListItem.Subtitle>Data: {split.DtBox}</ListItem.Subtitle>
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
			<Header backButton={true} titulo={"Separação Central"} />

			<View style={{ backgroundColor: COLORS.primary}}>
				<Text style={{color: "#FFF", textAlign: "center", fontSize: 18, paddingTop: 10, textTransform: "uppercase"}}>Produtos</Text>
				<View style={[GlobalStyle.row, { justifyContent: "space-around", alignItems: "center"}]}>
					<View style={{padding: 5, marginRight: 5, flex: 1}}>
						<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{nItensLidos}</Text>
						<Text style={{color: "#FFF", textAlign: "center"}}>Lidos</Text>
					</View>
					<View style={{padding: 5, marginRight: 5, flex: 1}}>
						<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{nItensColetados}</Text>
						<Text style={{color: "#FFF", textAlign: "center"}}>Coletados</Text>
					</View>
					<View style={{padding: 5, marginLeft: 5, flex: 1}}>
						<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{nItensUnicosColetados}</Text>
						<Text style={{color: "#FFF", textAlign: "center"}}>Únicos Coletados</Text>
					</View>
				</View>
			</View>

			{ mySplits.length === 0 &&
			<View style={[GlobalStyle.secureMargin, {flex: 1}]}>
				{ 
					( showForm &&
						<>
							<View style={GlobalStyle.spaceSmall} />
							<FormFiltroSeparacao formik={formik} />
						</>
					)
				}
				{ 
					( (separacoes.length > 0 || !showForm) &&
						<>
							<View style={GlobalStyle.spaceSmall} />
						
							<Button
								titleStyle={{}}
								buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
								title="Mostrar Filtros"
								onPress={()=> setShowForm(true)}
							/>
						</>
					)
				}
		
				<FlatList
					data={separacoes}
					renderItem={({item}) => <RenderItem item={item} />}
					keyExtractor={(item, index) => index.toString()}
					onRefresh={() => {
						formik.handleSubmit();
					}}
					refreshing={formik.isSubmitting}
					ListEmptyComponent={()=>{
						if ( formik.isSubmitting ) {
							return null;
						}
						return <Text>Nenhuma separação encontrada</Text>
					}}
				/>

			</View>
			}

			
			{ mySplits.length  > 0 &&
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

						props.navigation.dispatch(
							CommonActions.navigate({
								name: 'ModalBarcodeReader',
								params: {
									origin: "separacao_central",
									callbackSuccess: loadMySplits
								},
							})
						);
					}}
					loading={formik.isSubmitting}
					disabled={formik.isSubmitting}
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
					title="Finalizar Separação"
					onPress={() => {
						finalizaSeparacao();
					}}
					loading={formik.isSubmitting}
					disabled={formik.isSubmitting}
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
					title="Limpar leituras"
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
								limpaLeituras();
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
					loading={formik.isSubmitting}
					disabled={formik.isSubmitting}
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
					title="Cancelar Separação"
					onPress={() => {
						Alert.alert(
							"Atenção!",
							"Esta ação apagará também os dados coletados. Você tem certeza?",
							[
								{
								text: "Não",
								onPress: () => console.log("Cancel Pressed"),
								style: "cancel"
								},
								{ text: "Tenho", onPress: async () => {
								await AsyncStorage.removeItem('CODIGOS_CENTRAL');
								await AsyncStorage.removeItem('my_splits');
								loadMySplits();
								AlertHelper.show(
									'success',
									'Tudo certo',
									'Separação Cancelada',
								);
								} }
							],
							{ cancelable: false }
							);
						
					}}
					loading={formik.isSubmitting}
					disabled={formik.isSubmitting}
				/>
			</View>
			</>
			}

			
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

export default CenaSeparacaoCentral;