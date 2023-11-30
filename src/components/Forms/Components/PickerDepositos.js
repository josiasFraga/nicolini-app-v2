import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native'; // Import Text and View from react-native

const depositos = [
    {id: 1, name: 'Sede'},
    {id: 2, name: 'ACC'},
    {id: 3, name: 'CDA'},
];

const PickerDepositos = ({ formik }) => {
    const placeholder = "Selecione um depósito..";
    const name = "deposito";


    return (
        <View>
            <Picker
                selectedValue={formik.values[name]}
                onValueChange={(itemValue) => {
                    formik.setFieldValue(name, itemValue);
                }}
            >
                <Picker.Item label={placeholder} value="" />
                {depositos.map((deposito, index) => (
                    <Picker.Item key={"option_deposito_" + index} label={deposito.name} value={deposito.id} />
                ))}
            </Picker>
            {formik.touched[name] && formik.errors[name] && (
                <Text style={{ color: 'red' }}>{formik.errors[name]}</Text> // Style as needed
            )}
        </View>
    );
};

export default PickerDepositos;
