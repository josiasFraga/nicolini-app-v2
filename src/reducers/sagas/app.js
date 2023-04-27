import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {callApi} from '@services/api';
import AlertHelper from '@components/Alert/AlertHelper';
import CONFIG from '@constants/configs';
import NetInfo from "@react-native-community/netinfo";

function* registerDevice({payload}) {

	const networkStatus = yield NetInfo.fetch();
	
	if ( !networkStatus.isConnected ) {
		yield AlertHelper.show(
			'warn',
			'Sem conexão',
			'Você só pode registrar seu dispositivo quando estiver com internet.',
		  );
		  return true;
	}

	const notifications_id = yield JSON.parse(yield AsyncStorage.getItem('oneSignalToken'))?.userId;


	console.log('[SAGA] - REGISTRANDO DISPOSITIVO');
	console.log(payload);
	
	let data = new FormData();
	let dados = payload;
	dados.notificacao_token = notifications_id;

	data.append('dados', JSON.stringify(dados));

	try {
		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/coletores/add.json',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		console.log('[SAGA] - [REGISTRANDO DISPOSITIVO]', response);

		if ( response.data.status == 'ok' ) {
		} else {
			AlertHelper.show('error', 'Erro', response.data.message);
		}

	} catch ({message, response}) {
		console.error('[SAGA] - [REGISTRANDO DISPOSITIVO]', { message, response });
		AlertHelper.show('error', 'Erro', message);
	}
}

function* login({payload}) {

	const networkStatus = yield NetInfo.fetch();
	
	if ( !networkStatus.isConnected ) {
		yield AlertHelper.show(
			'warn',
			'Sem conexão',
			'Você só pode logar quando seu dispositivo quando estiver com internet.',
		  );
		  payload.setSubmitting(false);
		  return true;
	}


	console.log('[SAGA] - LOGANDO');
	console.debug(payload.submitValues);
	
	let data = new FormData();
	let dados = payload.submitValues;

	data.append('dados', JSON.stringify(dados));

	try {
		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/auth/login.json',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		console.log('[SAGA] - [LOGANDO]', response);

		if ( response.data.status == 'ok' ) {
			yield put({
				type: 'LOGIN_SUCCESS',
				payload: true,
			});

			console.log('[SAGA] - TOKEN ' + response.data.token);

			yield AsyncStorage.setItem('bearerToken', response.data.token);
			yield payload.callback_success();

		} else {
			AlertHelper.show('error', 'Erro', response.data.message);
			yield put({
				type: 'LOGIN_FAILED',
				payload: true,
			});

		}
		payload.setSubmitting(false);

	} catch ({message, response}) {
		payload.setSubmitting(false);

		if ( response.status == 500 ) {
			AlertHelper.show('error', 'Erro', 'Login e/ou senha inválidos');

		} else {
			console.error('[SAGA] - [LOGANDO]', { message, response });
			AlertHelper.show('error', 'Erro', message);

		}
		yield put({
			type: 'LOGIN_FAILED',
			payload: true,
		});
	}
}

function* loadCollections({payload}) {

	try {
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/receber/index.json',
			method: 'GET'
		});

		
		if (response.status == 200) {
			if (response.data.status == 'ok') {	
				yield put({
				  type: 'LOAD_COLLECTIONS_SUCCESS',
				  payload: response.data.data,
				});
	
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
				yield put({
					type: 'LOAD_COLLECTIONS_FAILED',
					payload: {},
				});
	
			}
		} else {
			yield AlertHelper.show('error', 'Erro', response.data.msg);
			yield put({
				type: 'LOAD_COLLECTIONS_FAILED',
				payload: {},
			});

		}

  } catch ({message, response}) {
	console.warn('[ERROR : LOAD COLLECTIONS]', {message, response});
	yield put({
		type: 'LOAD_COLLECTIONS_FAILED',
		payload: {},
	});
    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* loadMyCollections({payload}) {

	const networkStatus = yield NetInfo.fetch();
	
	//SEM INTERNET, BUSCANDO OS DADOS DO LOCAL STORAGE
	if ( !networkStatus.isConnected ) {

		let my_collections = yield AsyncStorage.getItem('my_collections');

		if ( my_collections != null ) {
			yield put({
			  type: 'LOAD_MY_COLLECTIONS_SUCCESS',
			  payload: JSON.parse(my_collections),
			});

		}

		return true;

	}

	//TEM INTERNET, BUSCANDO OS DADOS ONLINE
	try {
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/recebidos/index.json',
			method: 'GET'
		});

		if (response.status == 200) {
			if (response.data.status == 'ok') {
				yield put({
				  type: 'LOAD_MY_COLLECTIONS_SUCCESS',
				  payload: response.data.data,
				});
				yield AsyncStorage.setItem('my_collections', JSON.stringify(response.data.data));
	
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
				yield put({
					type: 'LOAD_MY_COLLECTIONS_FAILED',
					payload: {},
				});
	
			}
		} else {
			yield AlertHelper.show('error', 'Erro', response.data.msg);
			yield put({
				type: 'LOAD_MY_COLLECTIONS_FAILED',
				payload: {},
			});

		}

	} catch ({message, response}) {
		console.warn('[ERROR : LOAD MY COLLECTIONS]', {message, response});
		yield put({
			type: 'LOAD_MY_COLLECTIONS_FAILED',
			payload: {},
		});
		yield AlertHelper.show('error', 'Erro', message);
	}
}

function* loadSingleCollectionData({payload}) {

	console.log('carregando dados da coletagem avulsa');
	const value = yield AsyncStorage.getItem('CODIGOS_AVULSOS');

	if (value !== null) {
	  // We have data!!
	  let codigos = JSON.parse(value);
	  let total_itens = 0;
	  let uniqe_itens = 0;

	  let aggrupedItens = []
	  aggrupedItens = Object.values(codigos.reduce((acc, item) => {
		if (!acc[item.barcodescanned]) {
			acc[item.barcodescanned] = {
				barcodescanned: item.barcodescanned,
				qtd: parseFloat(item.qtd),
			};
		} else {
			acc[item.barcodescanned].qtd += parseFloat(item.qtd);
		}
		return acc;
	  }, {}))

		

		yield aggrupedItens.map( async (codigo) => {
			total_itens += codigo.qtd;
		});

		uniqe_itens = aggrupedItens.length;

		yield put({
			type: 'SET_SINGLE_COLLECTION_DATA',
			payload: {
				n_itens: total_itens,
				n_uniqe_itens: uniqe_itens,
			},
		});

	} else {
		yield put({
			type: 'SET_SINGLE_COLLECTION_DATA',
			payload: {
				n_itens: 0,
				n_uniqe_itens: 0,
			},
		});
	}


}

function* loadCentralCollectionData({payload}) {

	console.log('carregando dados da coletagem central');
	const value = yield AsyncStorage.getItem('CODIGOS_CENTRAL');

	if (value !== null) {
	  // We have data!!
	  let codigos = JSON.parse(value);
	  let total_itens = 0;
	  let uniqe_itens = 0;

	  let aggrupedItens = []
	  aggrupedItens = Object.values(codigos.reduce((acc, item) => {
		if (!acc[item.barcodescanned]) {
			acc[item.barcodescanned] = {
				barcodescanned: item.barcodescanned,
				qtd: parseFloat(item.qtd),
			};
		} else {
			acc[item.barcodescanned].qtd += parseFloat(item.qtd);
		}
		return acc;
	  }, {}))

		

		yield aggrupedItens.map( async (codigo) => {
			total_itens += codigo.qtd;
		});

		uniqe_itens = aggrupedItens.length;

		yield put({
			type: 'SET_CENTRAL_COLLECTION_DATA',
			payload: {
				n_itens: total_itens,
				n_uniqe_itens: uniqe_itens,
			},
		});

	} else {
		yield put({
			type: 'SET_CENTRAL_COLLECTION_DATA',
			payload: {
				n_itens: 0,
				n_uniqe_itens: 0,
			},
		});
	}


}

function* loadInvertCollectionData({payload}) {

	console.log('carregando dados da coletagem invert');
	const value = yield AsyncStorage.getItem('CODIGOS_INVERT');

	if (value !== null) {
	  // We have data!!
	  let codigos = JSON.parse(value);
	  let total_itens = 0;
	  let uniqe_itens = 0;

	  let aggrupedItens = []
	  aggrupedItens = Object.values(codigos.reduce((acc, item) => {
		if (!acc[item.barcodescanned]) {
			acc[item.barcodescanned] = {
				barcodescanned: item.barcodescanned,
				qtd: parseFloat(item.qtd),
			};
		} else {
			acc[item.barcodescanned].qtd += parseFloat(item.qtd);
		}
		return acc;
	  }, {}))

		

		yield aggrupedItens.map( async (codigo) => {
			total_itens += codigo.qtd;
		});

		uniqe_itens = aggrupedItens.length;

		yield put({
			type: 'SET_INVERT_COLLECTION_DATA',
			payload: {
				n_itens: total_itens,
				n_uniqe_itens: uniqe_itens,
			},
		});

		console.log("Carregou os dados");

	} else {
		yield put({
			type: 'SET_INVERT_COLLECTION_DATA',
			payload: {
				n_itens: 0,
				n_uniqe_itens: 0,
			},
		});

		console.log("Não achou dados lidos");
	}


}

function* startCollection({payload}) {

	const networkStatus = yield NetInfo.fetch();
	
	if ( !networkStatus.isConnected ) {
		yield AlertHelper.show(
			'warn',
			'Sem conexão',
			'Você só pode iniciar uma coletagem quando seu dispositivo quando estiver com internet.',
		  );
		  return true;
	}

	console.log('[SAGA] - COMEÇANDO COLETAGEM');
	console.log(payload);
	
	let data = new FormData();
	let dados = payload;

	data.append('dados', JSON.stringify(dados));

	try {
		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/recebidos/add.json',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		console.log('[SAGA] - [COMEÇANDO COLETAGEM]', response);

		if ( response.data.status == 'ok' ) {
			yield put({
				type: 'START_COLLECTION_SUCCESS',
				payload: true,
			});

			yield payload.callback_success();
	
		} else {
			AlertHelper.show('error', 'Erro', response.data.message);
			yield put({
				type: 'START_COLLECTION_FAILED',
				payload: true,
			});

		}

	} catch ({message, response}) {
		console.error('[SAGA] - [COMEÇANDO COLETAGEM]', { message, response });
		AlertHelper.show('error', 'Erro', message);
		yield put({
			type: 'START_COLLECTION_FAILED',
			payload: true,
		});
	}
}

function* finishCollection({payload}) {

	const networkStatus = yield NetInfo.fetch();
	
	if ( !networkStatus.isConnected ) {
		yield AlertHelper.show(
			'warn',
			'Sem conexão',
			'Você só pode finalizar uma coletagem quando seu dispositivo quando estiver com internet.',
		  );
		  return true;
	}

	console.log('[SAGA] - FINALIZANDO COLETAGEM');
	
	let data = new FormData();
	let dados = payload.data;

	data.append('dados', JSON.stringify(dados));

	try {
		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/recebidos/finaliza.json',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		console.log('[SAGA] - [FINALIZANDO COLETAGEM]', response);

		if ( response.data.status == 'ok' ) {
			yield put({
				type: 'FINISH_COLLECTION_SUCCESS',
				payload: true,
			});

			yield payload.callback_success();
	
		} else {
			AlertHelper.show('error', 'Erro', response.data.message);
			yield put({
				type: 'FINISH_COLLECTION_FAILED',
				payload: true,
			});

		}

	} catch ({message, response}) {
		console.error('[SAGA] - [FINALIZANDO COLETAGEM]', { message, response });
		AlertHelper.show('error', 'Erro', message);
		yield put({
			type: 'FINISH_COLLECTION_FAILED',
			payload: true,
		});
	}
}

function* loadGoods({payload}) {

	console.log('carregando produtos');

	const networkStatus = yield NetInfo.fetch();
	
	//SEM INTERNET, NÃO ATUALIZA A LISTA DE MERCADORIAS
	if ( !networkStatus.isConnected ) {
		return true;

	}

	//TEM INTERNET, BUSCANDO OS DADOS ONLINE
	try {
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/mercadorias/index.json',
			method: 'GET'
		});

		if (response.status == 200) {
			if (response.data.status == 'ok') {
				yield put({
				  type: 'LOAD_GOODS_SUCCESS',
				  payload: {},
				});
				console.log('Lista de mercadorias atualizada com sucesso!');
				yield AsyncStorage.setItem('goods', JSON.stringify(response.data.data));
	
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
				yield put({
					type: 'LOAD_GOODS_FAILED',
					payload: {},
				});
	
			}
		} else {
			yield AlertHelper.show('error', 'Erro', response.data.msg);
			yield put({
				type: 'LOAD_GOODS_FAILED',
				payload: {},
			});

		}

	} catch ({message, response}) {
		console.warn('[ERROR : LOAD GOODS]', {message, response});
		yield put({
			type: 'LOAD_GOODS_FAILED',
			payload: {},
		});
		yield AlertHelper.show('error', 'Erro', message);
	}
	


}

function* registerLastScan({payload}) {
	const currentDate = new Date();
	yield put({
		type: 'SET_LAST_SCAN',
		payload: currentDate,
	});
	console.log('[SAGA] last scan atualizado ' + currentDate);

}

export default function* () {
	yield takeLatest('REGISTER_DEVICE', registerDevice);
	yield takeLatest('LOGIN_TRIGGER', login);
	yield takeLatest('LOAD_SINGLE_COLLECTION_DATA',	loadSingleCollectionData);
	yield takeLatest('LOAD_CENTRAL_COLLECTION_DATA',loadCentralCollectionData);
	yield takeLatest('LOAD_INVERT_COLLECTION_DATA',	loadInvertCollectionData);
	yield takeLatest('LOAD_COLLECTIONS', loadCollections);
	yield takeLatest('LOAD_MY_COLLECTIONS', loadMyCollections);
	yield takeLatest('START_COLLECTION', startCollection);
	yield takeLatest('LOAD_GOODS', loadGoods);
	yield takeLatest('REGISTER_LAST_SCAN', registerLastScan);
	yield takeLatest('FINISH_COLLECTION', finishCollection);
	
}