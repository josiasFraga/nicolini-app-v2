import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const callApi = async (call) => {
    let {
        endpoint,
        method = 'GET',
        params = null,
        data = null,
        headers = {},
        showJSON = false
    } = call

    let url = endpoint
    let defaultHeaders = {};

    // Merge headers info
    if ( method == 'POST' ) {
        defaultHeaders = {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        };
    } else {
        defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    const authToken = await AsyncStorage.getItem('bearerToken');

    console.log('INFO ' + authToken);

    if ( authToken != null ) {
        defaultHeaders = Object.assign(defaultHeaders, {'Authorization': `Bearer ${authToken}`});
    }

    headers = Object.assign({}, defaultHeaders, headers);

    console.debug('[CALL API URL]', url);
    console.debug('[CALL API COMPLETE]', { headers, method, url, params, data });

    if (showJSON)
        console.log('[CALL API JSON DATA]', JSON.stringify(data));

    let request = {
        headers,
        method,
        url
    };

    if (params) request.params = params;
    if (data) request.data = data;

    console.log('[REQUEST]', request)

    return axios(request);
}