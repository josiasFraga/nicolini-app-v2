import React from 'react';
import { View, Text } from 'react-native';

import COLORS from '@constants/colors';
import { Input } from 'react-native-elements';

export default function ColectorScreem (props) {

  const input = React.createRef();
  const [barCodeTyping, setBarCodeTyping] = React.useState("");
  const [barCodeScanned, setbarCodeScanned] = React.useState("");

  React.useEffect(() => {
    const timeOutId = setTimeout(() => setbarCodeScanned(barCodeTyping), 1000);
    return () => clearTimeout(timeOutId);
  }, [barCodeTyping]);

  React.useEffect(() => {
    if ( barCodeScanned >= 6 ) {
      props.handleBarCodeScanned({'type': '','data': barCodeScanned});
      props.setScanned(true);
    }
  }, [barCodeScanned]);
  
  return (
    <View style={{flex: 1, backgroundColor: "black"}}>

      <Input
          name={"qtd"}
          onChangeText={(value)=>{
            setBarCodeTyping(value);
          }}
          value={setBarCodeTyping}
          ref={input}
          autoFocus
          showSoftInputOnFocus={false}
          keyboardType={"numeric"}
          maxLength={60}
          placeholder={'Digite a quatidade'}
          returnKeyType="next"
          inputContainerStyle={{ height: 0, width:0, borderColor: 'black', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30, backgroundColor: "black" }}


      />
    </View>
  );
  
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 10,
    backgroundColor: "#f7f7f7"
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
    color: COLORS.primary
  },
  enterBarcodeManualButtonTitle: {
    color: COLORS.primary
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
};
