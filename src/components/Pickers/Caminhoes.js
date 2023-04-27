import RNPickerSelect from 'react-native-picker-select';
import React from 'react';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '@constants/colors';
import { connect} from 'react-redux';
 
export class Caminhoes extends React.Component<Props> {
    render() {
        return (
            <RNPickerSelect
                onValueChange={async (value, index) => { 
  
                    if ( this.props.selecionado != value ) {
                        console.log('entrou no change value');
                        console.log('value ' + value);
                        console.log('oldvalue ' + this.props.selecionado);
                        console.log('motorista ' + this.props.caminhoesList[(index-1)]['user_id']);
                        if ( this.props.caminhoesList[(index-1)]['user_id'] != null ) {
                            await AsyncStorage.setItem('veiculo_selecionado_motorista_id', this.props.caminhoesList[(index-1)]['user_id']);
                        } else {
                            await AsyncStorage.removeItem('veiculo_selecionado_motorista_id');
                        }
                        await this.props.selectCaminhao(value);
                        await this.props.buscarDadosMotoristaCaminhao(value);

                        await AsyncStorage.getItem("viagem_ativa", (err, result) => {
                            let viagem = JSON.parse(result);
                            if (  viagem != null && typeof(viagem.id)  != 'undefined') {
                                this.props.buscarDespesas({viagem_id: viagem_id});
                                this.props.buscarAbastecimentos({viagem_id: viagem_id});
                            }
                     
                         });

                         await this.props.buscarHistoricoViagens();

                    }
                }}
                placeholder={{
                    label: 'Selecione um veículo...',
                    value: '',
                }}
                value={this.props.selecionado}
                items={this.props.caminhoesList}
                style={defaultStyles}
            />
        );
    }
};

const defaultStyles = StyleSheet.create({
    viewContainer: {
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderRadius: 25,
        width: 150,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
    },
    modalViewTop: {
        flex: 1,
    },
    modalViewMiddle: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#000',
        zIndex: 2,
    },
    chevronContainer: {
        flexDirection: 'row',
    },
    chevron: {
        width: 15,
        height: 15,
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderTopWidth: 1.5,
        borderRightWidth: 1.5,
    },
    chevronUp: {
        marginLeft: 11,
        transform: [{ translateY: 4 }, { rotate: '-45deg' }],
    },
    chevronDown: {
        marginLeft: 22,
        transform: [{ translateY: -5 }, { rotate: '135deg' }],
    },
    chevronActive: {
        borderColor: '#000',
    },
    done: {
        color: '#000',
        fontWeight: '600',
        fontSize: 17,
        paddingTop: 1,
        paddingRight: 11,
    },
    doneDepressed: {
        fontSize: 19,
    },
    modalViewBottom: {
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    placeholder: {
        color: COLORS.primary,
    },
    headlessAndroidPicker: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        color: 'transparent',
        opacity: 0,
    },
});

const mapDispatchToProps = dispatch => ({
    
    buscarDadosMotoristaCaminhao(caminhao_id) {
        dispatch({
        type: 'BUSCA_DADOS_MOTORISTA_CAMINHAO',
        payload: {
            caminhao_id: caminhao_id
        }
        });
    },
    selectCaminhao(value) {
        dispatch({
            type: 'SELECIONA_CAMINHAO',
            payload: {
                value
            }
        })
    },
    buscarDespesas(viagem_id) {
      dispatch({
        type: 'BUSCA_DESPESAS',
        payload: {
          viagem_id: viagem_id
        }
      });
    },
    buscarAbastecimentos(viagem_id) {
      dispatch({
        type: 'BUSCA_ABASTECIMENTOS',
        payload: {
          viagem_id: viagem_id
        }
      });
    },
    buscarHistoricoViagens() {
      dispatch({
        type: 'BUSCA_VIAGENS',
        payload: {}
      });
    },
})

const mapStateToProps = state => ({
	caminhoesList: state.appReducer.caminhoes_usuario,
	selecionado: state.appReducer.caminhao_selected
});


export default connect(mapStateToProps, mapDispatchToProps)(Caminhoes);