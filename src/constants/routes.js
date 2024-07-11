import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CenaHome from '@scenes/CenaHome';
import CenaLogin from '@scenes/CenaLogin';
import CenaSplash from '@scenes/CenaSplash';
import CenaColetagemAvulsa from '@scenes/CenaColetagemAvulsa';
import CenaSeparacaoCentral from '@scenes/CenaSeparacaoCentral';
import CenaConfigs from '@scenes/CenaConfigs';
import ModalBarcodeReader from '@components/Modals/ModalBarcodeReader';
import ModalExportar from '@components/Modals/ModalExportar';
import CenaColetagemInvert from '@scenes/CenaColetagemInvert';
import CenaRecebimentoFornecedores from '@scenes/CenaRecebimentoFornecedores';
import CenaRecebimentoFornecedoresDetalhe from '@scenes/CenaRecebimentoFornecedoresDetalhe';
import CenaListaItensLidos from '@scenes/CenaListaItensLidos';
import CenaLoja from '@scenes/CenaLoja';
import CenaDeposito from '@scenes/CenaDeposito';
import CenaRecebimentoFornecedoresItensEscaneados from '@scenes/CenaRecebimentoFornecedoresItensEscaneados';
import CenaRecebimentoFornecedoresItensPeso from '@scenes/CenaRecebimentoFornecedoresItensPeso';
import CenaRecebimentoFornecedoresItensRecontar from '@scenes/CenaRecebimentoFornecedoresItensRecontar';
import CenaRegistroPallets from '@scenes/CenaRegistroPallets';

import ListaColetagens from '@scenes/ListaColetagens';


const Stack = createNativeStackNavigator();

class Routes extends React.Component {
  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Splash" component={CenaSplash} />
        <Stack.Screen name="Login" component={CenaLogin} />
        <Stack.Screen name="Home" component={CenaHome} />
        <Stack.Screen name="Loja" component={CenaLoja} />
        <Stack.Screen name="ColtagemAvulsa" component={CenaColetagemAvulsa} />
        <Stack.Screen name="ModalBarcodeReader" component={ModalBarcodeReader} />
        <Stack.Screen name="ModalExportar" component={ModalExportar} />
        <Stack.Screen name="SeparacaoCentral" component={CenaSeparacaoCentral} />
        <Stack.Screen name="Configs" component={CenaConfigs} />
        <Stack.Screen name="ColetagemInvert" component={CenaColetagemInvert} />
        <Stack.Screen name="CenaRecebimentoFornecedores" component={CenaRecebimentoFornecedores} />
        <Stack.Screen name="CenaRecebimentoFornecedoresDetalhe" component={CenaRecebimentoFornecedoresDetalhe} />
        <Stack.Screen name="ListaItensLidos" component={CenaListaItensLidos} />
        <Stack.Screen name="Deposito" component={CenaDeposito} />
        <Stack.Screen name="ListaColetagens" component={ListaColetagens} />
        <Stack.Screen name="RecebimentoFornecedoresItensEscaneados" component={CenaRecebimentoFornecedoresItensEscaneados} />
        <Stack.Screen name="CenaRecebimentoFornecedoresItensPeso" component={CenaRecebimentoFornecedoresItensPeso} />
        <Stack.Screen name="RecebimentoFornecedoresItensRecontar" component={CenaRecebimentoFornecedoresItensRecontar} />
        <Stack.Screen name="RegistroPallets" component={CenaRegistroPallets} />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}


export default Routes;
