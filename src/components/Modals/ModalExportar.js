import React, { useState, useEffect } from 'react';
import {  StyleSheet } from 'react-native';
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

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
});