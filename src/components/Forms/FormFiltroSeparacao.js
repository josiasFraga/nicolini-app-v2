import React from 'react';
import { View } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import COLORS from '@constants/colors';
import PickerLojas from './Components/PickerLojas';
import PickerDepositos from './Components/PickerDepositos';

export default function FormFiltroSeparacao(props) {
  const formik = props.formik;
  const maskDate = (text) => {
    // Remove all non-digit characters
    let cleaned = text.replace(/\D/g, '');
  
    // Match groups: first two digits, next two digits, and last four digits
    let match = cleaned.match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
  
    // Construct the date string with '/' separators
    let dateStr = '';
    if (match) {
      dateStr += match[1] ? match[1] : '';
      dateStr += match[2] ? '/' + match[2] : '';
      dateStr += match[3] ? '/' + match[3] : '';
    }
  
    return dateStr;
  }

  return (
    <>
    <View>

        <PickerLojas formik={formik} name={'loja'} />

        <PickerDepositos formik={formik} />
    
        <Input
            label="Data"
            onChangeText={(value)=>{

                if ( value == "" ) {
                    formik.setFieldValue('data', value);
                    return;
                }

                data = maskDate(value);
                formik.setFieldValue('data', data)
            }}
            onBlur={formik.handleBlur('data')}
            value={formik.values.data}
            errorMessage={formik.touched.data && formik.errors.data}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={10}
            placeholder='Digite uma data'
        />
        <Button
            titleStyle={{}}
            buttonStyle={{borderRadius: 25, paddingVertical: 10, backgroundColor: COLORS.primary}}
            title="Filtrar"
            onPress={formik.handleSubmit}
            disabled={formik.isSubmiting}
            loading={formik.isSubmiting}
        />
    </View>
    </>
  );
}