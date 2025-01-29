import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, View, StatusBar, TextInput, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import * as yup from 'yup';

import COLORS from '@constants/colors';
import Header from '@components/Header';
import PickerLojas from '@components/Forms/Components/PickerLojas';


const CenaRegistroPallets = (props) => {
	const dispatch = useDispatch();

	const [loja, setLoja] = React.useState('');

	const ValidateSchema = yup.object().shape({
		loja: yup.string().required('Loja é obrigatória'),
		lpallets: yup.array().of(
			yup.object().shape({
				palletNumber: yup
					.string() // Mudamos para string para validar os primeiros caracteres
					.matches(/^\d+$/, 'O número do palete deve conter apenas números') // Garante que só tenha números
					.required('Número do pallet é obrigatório')
					.length(14, 'Número do pallet deve ter exatamente 14 dígitos')
					.test('match-store-code', 'Os 3 primeiros dígitos do pallet devem ser iguais ao código da loja', function (value) {
						if (!value || !loja) return false; // Se não houver valor ou loja, retorna erro
						return value.startsWith(loja); // Verifica se os 3 primeiros dígitos do pallet correspondem ao código da loja
					}),
			})
		).min(1, 'Você deve adicionar pelo menos um pallet')
	});

	// useFormik substitui a tag <Formik>
	const formik = useFormik({
		initialValues: {
			loja: '',
			lpallets: [{ palletNumber: '' }],
		},
		// Criamos o schema dinamicamente para pegar o valor "loja"
		validationSchema: ValidateSchema,
		validateOnChange: true,
		validateOnBlur: true,
		onSubmit: (values, { setSubmitting, resetForm }) => {
		dispatch({
			type: 'SAVE_PALLETS',
			payload: {
			submitValues: values,
			setSubmitting: setSubmitting,
			callback_success: () => {
				resetForm();
			},
			},
		});
		},
	});

	/**
	 * Adiciona um novo pallet à lista
	 */
	const addPallet = () => {
		formik.setFieldValue('lpallets', [
		...formik.values.lpallets,
		{ palletNumber: '' },
		]);
	};

	/**
	 * Remove um pallet pelo índice
	 */
	const removePallet = (index) => {
		if (formik.values.lpallets.length === 1) return; // Impede remover se só existe 1
		const updated = [...formik.values.lpallets];
		updated.splice(index, 1);
		formik.setFieldValue('lpallets', updated);
	};

	useEffect(() => {
		if (formik.values?.loja) {
			setLoja(formik.values.loja);
		}
	}, [formik.values?.loja]);

	return (
		<View style={styles.container}>
		<StatusBar
			translucent={true}
			backgroundColor={'transparent'}
			barStyle={'light-content'}
		/>

		<Header
			backButton={true}
			titulo={'Registro de Pallets'}
			styles={{ backgroundColor: COLORS.primary }}
			titleStyle={{ color: '#f7f7f7' }}
			iconColor="#f7f7f7"
		/>

		<View style={styles.formContainer}>
			<ScrollView>
			{/* Picker de lojas */}
			<PickerLojas
				name="loja"
				formik={formik}
				ignoreCodes={[
				'3', 'ACC', 'ADM', 'ADR', 'CDA', 'CEA', 'CHA', 'CNL', 'DPC',
				'CNL', 'FCH', 'HLD', 'HRT', 'MNT', 'ONP', 'SED', 'SGI', 'PRD',
				]}
				onBlur={() => formik.setFieldTouched('loja', true)}
			/>
			{/* Exibe erro de loja */}
			{formik.touched.loja && formik.errors.loja && (
				<Text style={styles.error}>{formik.errors.loja}</Text>
			)}

			{/* Lista de pallets */}
			{formik.values.lpallets.map((pallet, index) => (
				<View key={index}>
				<View style={styles.palletContainer}>
					<TextInput
					style={styles.input}
					onChangeText={(text) =>
						formik.setFieldValue(`lpallets.${index}.palletNumber`, text)
					}
					onBlur={() =>
						formik.setFieldTouched(`lpallets.${index}.palletNumber`, true)
					}
					value={pallet.palletNumber}
					placeholder="Número do pallet"
					maxLength={14}
					editable={formik.values.loja !== ''}
					/>
					<Button
					title="Remover"
					onPress={() => removePallet(index)}
					buttonStyle={styles.removeButton}
					disabled={
						formik.values.lpallets.length === 1 ||
						!formik.values.loja
					}
					icon={{
						name: 'delete',
						type: 'material',
						color: 'white',
					}}
					/>
				</View>

				{/* Erro específico do palletNumber */}
				{formik.touched.lpallets?.[index]?.palletNumber &&
					formik.errors.lpallets?.[index]?.palletNumber && (
					<Text style={styles.error}>
						{formik.errors.lpallets[index].palletNumber}
					</Text>
					)}
				</View>
			))}

			{/* Botão para adicionar mais pallets */}
			<Button
				title="Adicionar Pallet"
				onPress={addPallet}
				buttonStyle={styles.addButton}
				disabled={!formik.values.loja || formik.values.loja === ''}
			/>

			{/* Erro geral do array, caso ocorra */}
			{formik.errors.lpallets &&
				typeof formik.errors.lpallets === 'string' &&
				formik.touched.lpallets && (
				<Text style={styles.error}>{formik.errors.lpallets}</Text>
				)}
			</ScrollView>

			{/* Botão de submit */}
			<Button
			title="Registrar Pallets"
			onPress={formik.handleSubmit}
			disabled={formik.isSubmitting}
			buttonStyle={{
				borderRadius: 25,
				paddingVertical: 10,
				backgroundColor: COLORS.primary,
			}}
			containerStyle={styles.submitButtonContainer}
			/>
		</View>
		</View>
	);
};

export default CenaRegistroPallets;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  palletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    marginBottom: 20,
  },
  removeButton: {
    backgroundColor: 'red',
    marginLeft: 10,
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
