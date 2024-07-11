import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, StatusBar, TextInput, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';

import COLORS from '@constants/colors';  
import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';

const ValidateSchema = yup.object().shape({
  lpallets: yup.array().of(
    yup.object().shape({
      palletNumber: yup.string().required('Número do pallet é obrigatório'),
    })
  ).min(1, 'Você deve adicionar pelo menos um pallet')
});

const CenaRegistroPallets = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <Header 
        backButton={true} 
        titulo={"Registro de Pallets"} 
        styles={{backgroundColor: COLORS.primary}} 
        titleStyle={{color: '#f7f7f7'}} 
        iconColor='#f7f7f7'
      />
      <Formik
        initialValues={{ lpallets: [{ palletNumber: '' }] }}
        validationSchema={ValidateSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          dispatch({
            type: 'SAVE_PALLETS',
            payload: {
              submitValues: values,
              setSubmitting: setSubmitting,
              callback_success: () => {
                resetForm();
              }
            }
          });
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
          <View style={styles.formContainer}>
            <ScrollView>
              <FieldArray name="lpallets">
                {({ push, remove }) => (
                  <View>
                    {values.lpallets.map((pallet, index) => (
					<View key={index}>
                      <View style={styles.palletContainer}>
                        <TextInput
                          style={styles.input}
                          onChangeText={handleChange(`lpallets.${index}.palletNumber`)}
                          onBlur={handleBlur(`lpallets.${index}.palletNumber`)}
                          value={pallet.palletNumber}
                          placeholder="Número do pallet"
                        />
                        <Button
                          title="Remover"
                          onPress={() => remove(index)}
                          buttonStyle={styles.removeButton}
                          icon={{
                            name: 'delete',
                            type: 'material',
                            color: 'white',
                          }}
                        />
                      </View>
                        {errors.lpallets && errors.lpallets[index] && touched.lpallets && touched.lpallets[index] && (
                          <Text style={styles.error}>{errors.lpallets[index].palletNumber}</Text>
                        )}
					</View>
                    ))}
                    <Button
                      title="Adicionar Pallet"
                      onPress={() => push({ palletNumber: '' })}
                      buttonStyle={styles.addButton}
                    />
                  </View>
                )}
              </FieldArray>
              {errors.lpallets && touched.lpallets && typeof errors.lpallets === 'string' && (
                <Text style={styles.error}>{errors.lpallets}</Text>
              )}
            </ScrollView>
            <Button
              title="Registrar Pallets"
              onPress={handleSubmit}
              disabled={isSubmitting}
			  buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
              containerStyle={styles.submitButtonContainer}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  palletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    marginBottom: 20,
  },
  removeButton: {
    backgroundColor: 'red',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CenaRegistroPallets;
