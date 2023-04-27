import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { channel } from 'redux-saga';
import { call, put, takeEvery, takeLatest, select, take, fork } from 'redux-saga/effects';
import { callApi } from '@services/api';
import AlertHelper from '@components/Alert/AlertHelper';
import CONFIG from '@constants/configs';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';

const getUserLocation = () => new Promise((resolve, reject) => {
	Geolocation.getCurrentPosition(
		location => resolve(location),
		error => resolve(error),
		{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
	);
});   

function* getLocationUpdates({payload}) {
	const permission = yield getLocationPermission(); // se possui permissao ok, senao ele solicita
	
	if (!permission) {
		AlertHelper.show('error', 'Erro', 'Você não possui permissão de localização, verifique e tente novamente.');
	}

	const usuario = JSON.parse(yield AsyncStorage.getItem('usuario'));


	const position = yield getLocation();
	if (position.coords) {
		if ( usuario !== null && typeof(usuario.admin_id) != 'undefined' && usuario.admin_id != null ) {
			yield put({
				type: 'SET_USER_LAT',
				payload: position.coords.latitude
			});
			yield put({
				type: 'SET_USER_LNG',
				payload: position.coords.longitude
			});
		} else {
			//yield getLocationUpdatesFromUserId({});
		}

		if (usuario !== null) { // se está null, o usuário está deslogado
			const ref = database().ref(`/veiculos/`+usuario.id);
			//console.log('ref user');
			//console.log(ref);
			ref.set({
				lat: position.coords.latitude, 
				lng: position.coords.longitude,
				user_name : usuario.nome,
				user_id: usuario.id,
				last_update: new Date().toLocaleString()
			});
		}		
	}
}
function* getLocationUpdatesFromUserId({payload}) {

	const usuario = JSON.parse(yield AsyncStorage.getItem('usuario'));

	if ( usuario !== null && typeof(usuario.admin_id) != 'undefined' && usuario.admin_id == null ) {

		const motorista_id = JSON.parse(yield AsyncStorage.getItem('veiculo_selecionado_motorista_id'));
		console.log('buscando localização do motorista');
		console.log('motorista_id: ' + motorista_id);

		if ( motorista_id != null ) {

			const ref = database().ref(`/veiculos/`+motorista_id);
			ref.once('value').then(snapshot => {
				// snapshot.val() is the dictionary with all your keys/values from the '/store' path
				put({
					type: 'SET_USER_LAT',
					payload: snapshot.val().lat
				});
		
				put({
					type: 'SET_USER_LNG',
					payload: snapshot.val().lng
				});
			  })

			/*try{
				const response = yield call(callApi, { 
					endpoint: ref,
					method: 'GET',
					params: {}
				});
	
				console.log(response);

			} catch ({message, response}) {
				console.warn('ERROR ', { message, response });
		
		
			}*/

			/*console.log('aaaa');
			let env = this;
			const veiculos = yield database()
			.ref(`/veiculos/`+motorista_id)
			.on('value', dados => {
				env.put({
					type: 'SET_USER_LAT',
					payload: dados.val().lat
				});
		
				env.put({
					type: 'SET_USER_LNG',
					payload: dados.val().lng
				});
				console.log('lat '+dados.val().lat);
				console.log('long '+dados.val().lng);

			});

			console.log('scores');
			console.log(veiculos);
			console.log(dados);
			/*const teste = yield database()
			.ref(`/veiculos/`+motorista_id)
			.on('value', snapshot => {
				return snapshot.val();
			});

			console.log('teste');
			console.log(teste);
			
			database()
			.ref(`/veiculos/`+motorista_id)
			.once('*')
			.then(snapshot => {
				if ( snapshot !== null ) {
					put({
						type: 'SET_USER_LAT',
						payload: snapshot.lat
					});
			
					put({
						type: 'SET_USER_LNG',
						payload: snapshot.lng
					});
				}
				console.log('Localização do motorista: ', snapshot);
			});*/


		}

	} else {
		console.log('sem permissão de acesso a localização de um motorista!');
	}

}

function* getLocation() {
	let result = yield getUserLocation();
	if (!result.coords && result.code == 5) {
		return yield getLocation();
	} else if (result.coords) {
		return result;
	} else {
		return {};
	}
} 

function* getLocationPermission() {
	if (Platform.OS === 'ios' ||
			(Platform.OS === 'android' && Platform.Version < 23)) {
		return true;
	}

	const hasPermission = yield PermissionsAndroid.check(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
	);
	if (hasPermission) return true;

	const status = yield PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
	);

	if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

	if (status === PermissionsAndroid.RESULTS.DENIED) {
		AlertHelper.show('error', 'Erro', 'Location permission denied by user.');

	} else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
		AlertHelper.show('error', 'Erro', 'Location permission revoked by user.')          
	}

	return false;
}

export default function* () {
	yield takeLatest('GET_LOCATION_UPDATES', getLocationUpdates);
}