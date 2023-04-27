import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	StatusBar
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import IMAGES from '@constants/images';
import NetInfo from "@react-native-community/netinfo";
import { getUniqueId } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CenaSplash (props) {
	const dispatch = useDispatch();

	const componentDidMount = async () => {

		const deviceId = await getUniqueId();
		const authToken = await AsyncStorage.getItem('bearerToken');

		const networkStatus = await NetInfo.fetch();
		if (!networkStatus.isConnected) {
			console.log("Sem internet");

			if ( authToken == null ) {
				setTimeout(() => {
					props.navigation.dispatch(
					CommonActions.reset({
						index: 1,
						routes: [
						  { name: 'Login' },
						],
					  })
					)
				},5000);

			} else {
				setTimeout(() => {
					props.navigation.dispatch(
					CommonActions.reset({
						index: 1,
						routes: [
						  { name: 'Home' },
						],
					  })
					)
				},5000);

			}
		} else {
			console.log("tem internet");

			dispatch({
				type: 'REGISTER_DEVICE',
				payload: {
					tx_coletor: deviceId
				}
			})

			if ( authToken == null ) {
	
				setTimeout(() => {
					props.navigation.dispatch(
					CommonActions.reset({
						index: 1,
						routes: [
						  { name: 'Login' },
						],
					  })
					)
				},5000);

			} else {

				dispatch({
					type: 'LOAD_GOODS',
					payload: {}
				});

				setTimeout(() => {
					props.navigation.dispatch(
					CommonActions.reset({
						index: 1,
						routes: [
						  { name: 'Home' },
						],
					  })
					)
				},5000);

			}
		}

	}

	React.useEffect(() => {
	
		componentDidMount();
	}, [])

	return (
		<View style={styles.container}>
			<StatusBar
				translucent={true}
				backgroundColor={'transparent'}
				barStyle={'dark-content'}
			/>

			<View style={styles.imageContainer}>
				<Image source={IMAGES.LOGO} style={{ width: 200, height: 160 }} />
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

export default CenaSplash;