 // Formik x React Native example

 import React, { useState, useEffect, useRef } from 'react';

 import { TextInput, View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';

 import { Formik } from 'formik';
 import GlobalStyle from '@styles/global';

 export const FromEnterBarcode = (props) => {
    const refContainer = useRef(TextInput);
    
    const validate = (values, props /* only available when using withFormik */) => {

        const errors = {};
     
        if (!values.codeEntered || values.codeEntered == '') {     
          errors.codeEntered = 'Digite o código de barras';     
        }
    
        return errors;
     
      };
    return(

   <Formik
     validate={validate}
     initialValues={{ codeEntered: '' }}

     onSubmit={(values) => {
         let bce = values.codeEntered;
         console.log(bce);
        props.handleBarCodeScanned({'type': '','data': bce});
    }}

   >

     {({ handleChange, handleBlur, handleSubmit, values }) => (

       <View style={[GlobalStyle.secureMargin, GlobalStyle.fullyScreem]}>
           <View style={[GlobalStyle.contentVerticalMiddle, GlobalStyle.fullyScreem, GlobalStyle.row]}>
            <View style={{flex: 1}}>
                <Text style={styles.barcode}>Digite o código de barras abaixo:</Text>
                <View style={[GlobalStyle.column, {alignItems: 'center', marginTop: 30}]}>
                    <View>                        

                        <TextInput
                        name={"codeEntered"}
                        onChangeText={handleChange('codeEntered')}
                        onBlur={handleBlur('codeEntered')}
                        value={values.codeEntered}
                        autoFocus
                        //showSoftInputOnFocus={false}
                        keyboardType={"numeric"}
                        ref={refContainer}
                        maxLength={13}
                        minLength={5}
                        placeholder={'Digite o código de barras aqui'}
                        returnKeyType="next"
                        style={{ height: 70, borderColor: 'gray', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30 }}
                        />
                    </View>

                </View>

				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss();
                        handleSubmit()}
                    } 
                    style={GlobalStyle.defaultButton}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss();
                        props.backToScanner()
                    }} 
                    style={[GlobalStyle.clearCircleButton, {alignSelf: 'center', paddingHorizontal: 30, borderRadius: 15, height: 50}]}
					>
                    <Text style={[GlobalStyle.clearCircleButtonText, {borderRadius: 3}]}>Voltar ao scanner</Text>
                    </TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
                </View>


            </View>

           </View>

       </View>

     )}

   </Formik>

 )};

 const styles = StyleSheet.create({
    barcode: {
        fontSize: 20,
        textAlign: 'center'
    }
 });