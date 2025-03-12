import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	StatusBar,
	Alert,
} from 'react-native';
import {Button, Text, Icon, Image } from 'react-native-elements';
import { CommonActions } from '@react-navigation/native';
import GlobalStyle from '@styles/global';
import Header from '@components/Header';

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

type Props = {};
export default class CenaDeposito extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>
                <Header backButton={true} titulo={"Depósito"} />
				<View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'flex-end'}]}>
	
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
							title="Separação Central"
							onPress={() => { 

								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'SeparacaoCentral'
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
								name="barcode"
								size={20}
								type='antdesign'
								iconStyle={{color: COLORS.secondary}}
								/>
								</View>
							}
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Coletagem Invent"
							onPress={() => {
								

								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'ColetagemInvert',
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
								name="barcode"
								size={20}
								type='antdesign'
								iconStyle={{color: COLORS.secondary}}
								/>
								</View>
							}
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Recebimento de Fornecedores"
							onPress={() => {
								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'CenaRecebimentoFornecedores',
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
								type='entypo'
								iconStyle={{color: COLORS.secondary}}
								/>
								</View>
							}
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Registro Pallets"
							onPress={() => {
								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'RegistroPallets',
									})
								);

							}}
						/>
					</View>
				</View>
				<View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'flex-end'}]}>
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
