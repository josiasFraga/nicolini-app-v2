 // Formik x React Native example

 import React, { useState, useEffect } from 'react';

 import { CheckBox } from 'react-native-elements'

 import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';

 import { Formik } from 'formik';
 import GlobalStyle from '@styles/global';
 import AlertHelper from '@components/Alert/AlertHelper';
import { useDispatch } from 'react-redux';

 export const FormConfigs = (props) => {

    const dispatch = useDispatch();
    const [tipoLeitura, setTipoLeitura] = useState("camera");

    const getSettings = async () => {
        try {
            const value = await AsyncStorage.getItem('SETTINGS');
  
            if (value !== null) {
                let settings = JSON.parse(value);
                if ( settings.dispositivo_leitura == "coletor" ) {
                    setTipoLeitura("coletor");
                }
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    const setSettings = async () => {
        const values_to_save = {dispositivo_leitura: tipoLeitura};
        console.log(values_to_save);
        try {
            await AsyncStorage.setItem(
                "SETTINGS",
                JSON.stringify(values_to_save)
            );
            AlertHelper.show(
                'success',
                'Tudo Certo',
                'Configurações atualizadas com sucesso!',
            );
            console.log("Configurações salvas com sucesso!");
        }
        catch(e) {

            console.log(e);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao atualizar as configurações',
            );
            return false;
        }

        return true;
    }

    useEffect(() => {
        getSettings();
    }, [])

    return(

    <Formik

        onSubmit={async () => {
            //setSettings();

            return true;
        }}

    >

        {({ handleChange, handleBlur, handleSubmit, values }) => (

        <View style={[GlobalStyle.fullyScreem]}>
        
                <View style={{flex: 1}}>

                    <View style={GlobalStyle.secureMargin}>
                        <Text>Dispositivo de Leitura</Text>

                    </View>
      
                    <CheckBox
        
                        title='Câmera'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={tipoLeitura == "camera"}
                        onPress={() => {setTipoLeitura("camera")}}
                    />
      
                    <CheckBox
        
                        title='Coletor ZEBRA'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={tipoLeitura == "coletor"}
                        onPress={() => {setTipoLeitura("coletor")}}
                    />

                    <View style={GlobalStyle.spaceSmall} />           
                    
                    <View style={GlobalStyle.secureMargin}>
                        <TouchableOpacity
                            onPress={()=>{setSettings()}} 
                            style={[GlobalStyle.defaultButton, {width: "100%"}]}
                        >
                            <Text style={GlobalStyle.defaultButtonText}>Salvar Configurações</Text>
                        </TouchableOpacity>
                    </View>


                </View>


        </View>

        )}

    </Formik>

    )
};

 const styles = StyleSheet.create({
    barcode: {
        fontSize: 20,
        textAlign: 'center'
    }
 });
