import React from 'react';
import { FormExportar } from '@components/Forms/FormExportar';
import { useRoute } from '@react-navigation/native';


export default function ModalExportar() {
  const route = useRoute();
  const origin = route?.params?.origin;
  console.log('origin', origin);

    return (
      <FormExportar origin={origin} />
    )
}
