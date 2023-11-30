import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native'; // Import Text and View from react-native

const PickerLojas = ({ formik }) => {
    const dispatch = useDispatch();
    const lojas = useSelector(state => state.appReducer.stores);
    const placeholder = "Selecione uma loja..";
    const name = "loja";

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
                    formik.setFieldValue(name, itemValue);
                }}
            >
                <Picker.Item label={placeholder} value="" />
                {lojas.map((loja, index) => (
                    <Picker.Item key={"option_loja_" + index} label={loja.Loja} value={loja.Loja} />
                ))}
            </Picker>
            {formik.touched[name] && formik.errors[name] && (
                <Text style={{ color: 'red' }}>{formik.errors[name]}</Text> // Style as needed
            )}
        </View>
    );
};

export default PickerLojas;
