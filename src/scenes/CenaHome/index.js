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
import { getUniqueId } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

type Props = {};
export default class CenaHome extends Component<Props> {

	state = {
		deviceId: '',
	}

	componentDidMount = async () => {
		const deviceId = await getUniqueId();
		this.setState({deviceId: deviceId});

	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>
				<View style={styles.imageContainer}>
					<Image source={IMAGES.LOGO} style={{ width: 150, height: 120 }} />
				</View>
				<View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'flex-end'}]}>
					<View style={styles.innerSpace}>
						<Button
							icon={
								<View style={{marginRight: 20}}>
								<Icon
								name="store-outline"
								size={23}
								type='material-community'
								iconStyle={{color: COLORS.secondary}}
								/>
								</View>
							}
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Loja"
							onPress={() => { 
								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'Loja',
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
								name="warehouse"
								size={20}
								type='material-community'
								iconStyle={{color: COLORS.secondary}}
								/>
								</View>
							}
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Depósito"
							onPress={() => { 

								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'Deposito',
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
								name="player-settings"
								size={20}
								type='fontisto'
								iconStyle={{color: COLORS.secondary}}
								/>
								</View>
							}
							titleStyle={{}}
							buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
							title="Configurações"
							onPress={() => {
								this.props.navigation.dispatch(
									CommonActions.navigate({
										name: 'Configs',
									})
								);

							}}
						/>
					</View>
					<View style={GlobalStyle.spaceMedium} />
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
							title="Deslogar"
							onPress={() => {
								Alert.alert(
									"Atenção!",
									"Você tem certeza que deseja deslogar? Todos os dados de coletagens serão apagados",
									[
									  {
										text: "Não",
										onPress: () => console.log("Cancel Pressed"),
										style: "cancel"
									  },
									  { text: "Tenho", onPress: () => {
										AsyncStorage.removeItem('bearerToken');
										AsyncStorage.removeItem('my_collections');

										
										this.props.navigation.dispatch(
											CommonActions.navigate({
												name: 'Login',
											})
										); 
									  } }
									],
									{ cancelable: false }
								  );
								
							}}
						/>
					</View>
					<View style={styles.innerSpace}>
						<Text style={{textAlign: 'center', color: '#999', fontSize: 12}}>ID do dispositivo: {this.state.deviceId}</Text>
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
