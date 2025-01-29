import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native'; // Import Text and View from react-native

const PickerLojas = ({ formik, name, ignoreCodes = [] }) => {
    const dispatch = useDispatch();
    const lojas = useSelector(state => state.appReducer.stores);
    const placeholder = "Selecione uma loja..";
    const nameField = name || 'loja';

    const buscaLojas = () => {
        dispatch({ type: 'LOAD_STORES', payload: {} });
    };

    useEffect(() => {
        console.log('buscando lojas...');
        buscaLojas();
    }, []);

    return (
        <View>
            <Picker
                selectedValue={formik.values[name]}
                onValueChange={(itemValue) => {
                    formik.setFieldValue(nameField, itemValue);
                }}
            >
                <Picker.Item label={placeholder} value="" />
                {lojas.map((loja, index) => { 
                    if (ignoreCodes.includes(loja.Loja)) {
                        return null;
                    }
                    return (<Picker.Item key={"option_loja_" + index} label={loja.Loja} value={loja.Loja} />)
                })}
            </Picker>
            <View style={{marginLeft: 15, marginTop: 0, paddingTop: 0, marginBottom: 10}}>
            {formik.errors[nameField] && (
                <Text style={{ color: 'red' }}>{formik.errors[nameField]}</Text> // Style as needed
            )}
            </View>
        </View>
    );
};

export default PickerLojas;
