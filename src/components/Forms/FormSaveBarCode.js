 // Formik x React Native example

 import React, { useState, useEffect } from 'react';

 import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { Input } from 'react-native-elements';

 import { Formik } from 'formik';
 import GlobalStyle from '@styles/global';
 import AlertHelper from '@components/Alert/AlertHelper';
import { useDispatch } from 'react-redux';
import { parse, isValid, add  } from 'date-fns';
import * as Yup from 'yup';

const inArray = (array, value) => {
    return array.indexOf(value) !== -1;
}

const maskDate = (text) => {
    return text
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{2})(\d)/, '$1/$2') // captura 2 grupos de numero o primeiro de 2 e o segundo de 1, apos capturar o primeiro grupo ele adiciona uma barra antes do segundo grupo de numero
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1') // captura 4 numeros e não deixa ser digitado mais nada
}

export const FormSaveBarCode = (props) => {
    const input = React.createRef();

    const dispatch = useDispatch();
    const [n_itens, setNItens] = useState(0);
    const [productName, setProductName] = useState("");
    const [goodMinValidity, setGoodMinValidity] = useState("");
    const backToScanner = props.backToScanner;
    const itens = props.itens;

    let db_table = "CODIGOS_AVULSOS";

    if ( props.origin && props.origin == "separacao_central") {
       db_table = "CODIGOS_CENTRAL";
    }

    if ( props.origin && props.origin == "coletagem_invert") {
       db_table = "CODIGOS_INVERT";
    }

    if ( props.origin && props.origin == "recebimento_fornecedores") {
       db_table = "CODIGOS_RECEBIMENTO_FORNECEDORES";
    }

    useEffect(() => {

        async function fetchData() {            

            if ( db_table == "CODIGOS_CENTRAL" ) {

                setGoodMinValidity("");
                try {
                    const value = await AsyncStorage.getItem('UPLOADED_FILE_CENTRAL_COLLECTION');
        
                    if (value !== null) {
                    let produtos = JSON.parse(value);
        
                    const product = produtos.filter((produto) => {
                        return produto.cod_barras == props.barcodescanned;
                    })
        
                    if ( product.length == 0 ) {
                        setProductName("");
                    } else {
                        setProductName(product[0]["produto"]);
                    }                  
                    
            
                    } else {
                        setProductName("");
                    }
                } catch (error) {
                    console.log(error);
                    setProductName("");
                }
            }

            if ( db_table == "CODIGOS_INVERT" ) {

                setGoodMinValidity("");
                try {
                    const value = await AsyncStorage.getItem('UPLOADED_FILE_INVERT_COLLECTION');
        
                    if (value !== null) {
                    let produtos = JSON.parse(value);
        
                    const product = produtos.filter((produto) => {
                        return produto.cod_barras == props.barcodescanned;
                    })
        
                    if ( product.length == 0 ) {
                        setProductName("");
                    } else {
                        setProductName(product[0]["produto"]);
                    }                  
                    
            
                    } else {
                        setProductName("");
                    }
                } catch (error) {
                    console.log(error);
                    setProductName("");
                }
            }

            if ( db_table == 'CODIGOS_RECEBIMENTO_FORNECEDORES' ) {

                let goods = await AsyncStorage.getItem('goods');

                const good = JSON.parse(goods).filter((_good) => {
                    return _good.cd_codigoean == props.barcodescanned;
                });

                if ( good.length == 0 ) {
                    setProductName("");
                    setGoodMinValidity("");

                } else {
                    setProductName(good[0]["tx_descricao"]);
                    if ( parseInt(good[0]["qt_dias_validade"]) > 0 ) {
                        setGoodMinValidity(parseInt(good[0]["qt_dias_validade"]));

                    }
                }
            }
        }

        if ( props.barcodescanned != null && props.barcodescanned != "" ) {
            fetchData();
        }

    }, [props.barcodescanned]);

    let _contaItens = async (code) => {

        let nitens = 0;

        if ( db_table == 'CODIGOS_RECEBIMENTO_FORNECEDORES' ) {
            let scannedItems = await AsyncStorage.getItem('scanned');
            if ( scannedItems != null && JSON.parse(scannedItems).length > 0 ) {
                scannedItems = JSON.parse(scannedItems);

                scannedItems.map((scannedItem) => {
                    if ( scannedItem.cd_codagrupador == itens[0].cd_codagrupador ) {
                        scannedItem.itens.map((_item) => {
                            if ( _item.cd_ean == code ) {
                                nitens = nitens + parseFloat(_item.qt_qtde);
                            }
                        });
                    }
                });

                setNItens(nitens);
                
            }

            return false;
        }

        try {
          const value = await AsyncStorage.getItem(db_table);
          if (value !== null) {
            // We have data!!
            let codigos = JSON.parse(value)
            //let nitens = 0;
            for(let codigo of codigos) {
                if (codigo.barcodescanned == code) {
                    nitens += parseFloat(codigo.qtd);
                }
            }
            setNItens(nitens);
          }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao contar os dados',
            );
        }
    };

    const _checkCodeExistsInFile = async (bar_code) => {
        try {

            let file_name = 'UPLOADED_FILE_CENTRAL_COLLECTION';

            if ( props.origin && props.origin == "coletagem_invert") {
                file_name = "UPLOADED_FILE_INVERT_COLLECTION";
            }
    
          const value = await AsyncStorage.getItem(file_name);

          if (value !== null) {
            let produtos = JSON.parse(value);

            const product = produtos.filter((produto) => {
                return produto.cod_barras == bar_code;
            })

            if ( product.length == 0 ) {
                return false;
            }

            return product[0];
     
          } else {
            return false;
          }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao ler os dados do arquivo.',
            );
            return false;
        }
    };

    const _checkCodeExistsInStore = async (bar_code) => {
        try {

            let goods = await AsyncStorage.getItem('goods');

            const good = JSON.parse(goods).filter((_good) => {
                return _good.cd_codigoean == bar_code;
            });

            if ( itens.length == 0 ) {
                return false;
            }

            if ( good.length > 0 ) {

                const internal_codes_goods = good.map((_good) => {
                    return _good.cd_codigoint;
                });

                let item = itens.filter((_item) => {
                    return inArray(internal_codes_goods, _item.cd_codigoint);
                });
                
                if ( item.length == 0 ) {
                    return false;
                } else {
                    return item[0];
                }


            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao ler os dados do armazenamento.',
            );
            return false;
        }
    };

    const _checkQtdInFile = async (read_product, bar_code, qtd) => {
        try {
          const value = await AsyncStorage.getItem(db_table);
          let qtd_collected = 0;

          if (value !== null) {
            let produtos = JSON.parse(value);

            //procura o codigo de barras nos produtos  ja lidos para verificar a quantidade
            const product_collected = produtos.filter((produto) => {
                return produto.barcodescanned == bar_code;
            });

            //se achou, significa que o operador ja leu, ai setamos aquantidade lida para comparar com o arquivo
            if ( product_collected.length > 0 ) {
                qtd_collected = product_collected[0].qtd;
            }

     
          } 

          const limit = parseFloat(read_product.qtd);
          const limit_max = limit + (( 50*limit) / 100 );
          const new_total = parseFloat(qtd_collected) + parseFloat(qtd);

          if ( new_total >  limit_max ) {
              return limit_max;
          }

          return false;

        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao ler os dados das coletas anteriores.',
            );
            return true;
        }

    }

    let _storeData = async (item, file_register) => {
        try {

            const value = await AsyncStorage.getItem(db_table);
            let codigos = [];
            const qtd_digitada = item.qtd;

            if (value !== null) {
                // We have data!!
                codigos = JSON.parse(value)
            }

            if ( db_table != "CODIGOS_AVULSOS" ) {
                item = file_register;
                item.barcodescanned = item.cod_barras;
                delete item.cod_barras;
            }            

            //procura o código de barras na lista lida
            const searchCodeInList = codigos.filter((item_lista, index) => {
                return item_lista.barcodescanned == item.barcodescanned;
            });

            //se não achou o produto, adiciona na lista lida
            if ( searchCodeInList.length == 0 ) {

                if ( parseFloat(qtd_digitada) < 0 ) {
                    AlertHelper.show(
                        'warning',
                        'Atenção',
                        'A quantidade não pode ser inferior a 0',
                    );
                    return false;

                }

                console.log('não achou o produto na lista, adicionando - ' + item.barcodescanned + ' - ' + parseFloat(qtd_digitada));
                
                let itemToAdd = {
                    barcodescanned: item.barcodescanned,
                    qtd: parseFloat(qtd_digitada),
                };

                if ( item.loja ) {
                    itemToAdd.loja = item.loja;
                }

                if ( item.pedido ) {
                    itemToAdd.pedido = item.pedido;
                }

                if ( item.produto ) {
                    itemToAdd.produto = item.produto;
                }
    
                codigos.push(itemToAdd);

            } //se achou o item na lista lida, atualiza a quantidade
            else {
                
                let stop_code = false;
                codigos = codigos.map((item_lista) => {

                    if ( item_lista.barcodescanned == item.barcodescanned ) {

                        const new_qtd = item_lista.qtd + parseFloat(qtd_digitada);
        
                        if (  new_qtd < 0 ) {
                            AlertHelper.show(
                                'warning',
                                'Atenção',
                                'A quantidade não pode ser inferior a 0',
                            );
                            stop_code = true;
                        }
        
                        item_lista.qtd = new_qtd;

                    }
                    return item_lista;
                });

                if ( stop_code ) {
                    return false;
                }
            }

            await AsyncStorage.setItem(
                db_table,
                JSON.stringify(codigos)
            );
            
            dispatch({
                type: 'LOAD_SINGLE_COLLECTION_DATA',
                payload: {}
            })
            
            dispatch({
                type: 'LOAD_CENTRAL_COLLECTION_DATA',
                payload: {}
            })
            
            dispatch({
                type: 'LOAD_INVERT_COLLECTION_DATA',
                payload: {}
            })

            props.setSaved();
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao salvar',
            );
        }

    };

    let _storeDataNew = async (item, file_register) => {
        try {

            let scannedItems = await AsyncStorage.getItem('scanned');
    
            //monta a array do produto
            let item_item_save = [{
                cd_id: file_register.cd_id,
                cd_codigoint: file_register.cd_codigoint,
                cd_ean: item.barcodescanned,
                qt_qtde: parseFloat(item.qtd),
                dt_validade: item.validity,
                tx_descricao: productName
            }];

            //monta a array da coletagem
            let item_save = [{
                cd_codagrupador: file_register.cd_codagrupador,
                itens: item_item_save
            }];

            //verfica se ja tem alguma coisa armazenada, se tem procura a da atual
            if ( scannedItems != null && JSON.parse(scannedItems).length > 0 ) {
                scannedItems = JSON.parse(scannedItems);

                //procura nas coletagens armazenadas, a coletagem atual
                let searchCollection = scannedItems.filter((scannedItem)=>{
                    return scannedItem.cd_codagrupador == file_register.cd_codagrupador;
                });

                //se achou a coletagem atual, procura pela mercadoria
                if ( searchCollection.length > 0 ) {
                    let good = searchCollection[0].itens.filter((_collection) => {
                        return _collection.cd_codigoint == file_register.cd_codigoint;
                    });

                    //se achou a mercadoria, atualiza a quantidade
                    if ( good.length > 0 ) {
                        searchCollection[0].itens = searchCollection[0].itens.map((_item) => {
                            if (_item.cd_codigoint == file_register.cd_codigoint ) {
                                _item.qt_qtde = parseFloat(_item.qt_qtde) + parseFloat(item.qtd);
                                _item.dt_validade = item.validity;
        
                            }

                            return _item;

                        });

                    //se não achou a mercadoria, cria um registro pra ela
                    } else {
                        good = item_item_save;
                        searchCollection[0].itens.push(good[0]);
                    }

                    //procura a coletagem para atualizar no armazenamento
                    scannedItems = scannedItems.map((scannedItem)=>{
                        if ( scannedItem.cd_codagrupador == file_register.cd_codagrupador ) {
                            scannedItem.itens =  searchCollection[0].itens;
                        }

                        return scannedItem;
                    });

                
                //se não achou a coletagem atual, cria um registro pra ela
                } else {
                    scannedItems.push(item_save);

                }
    
                //salva o registro atualizado no armazenamento
                await AsyncStorage.setItem('scanned', JSON.stringify(scannedItems));
                dispatch({
                    type: 'REGISTER_LAST_SCAN',
                    payload: {}
                })
                props.setSaved();
            
            //se não tem nengum registro de coletagem armazenado, cria o primeiro com a coletagem atual
            } else {
                await AsyncStorage.setItem('scanned', JSON.stringify(item_save));
                dispatch({
                    type: 'REGISTER_LAST_SCAN',
                    payload: {}
                })
                props.setSaved();

            }

        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao salvar',
            );
        }

    };

    let _checkValidity = async (productValidity) => {

        productValidity = parse(productValidity, 'dd/MM/yyyy', new Date());
        const today = new Date();
        const minValidity = add(today, { days: goodMinValidity });

        if ( minValidity.setHours(0, 0, 0, 0) <= productValidity.setHours(0, 0, 0, 0) ) {
            console.log('produto dentro dos padrões de validade');
            return true;
        }

        console.log('produto fora dos padrões de validade');
        return false;
    };

    _contaItens(props.barcodescanned);

    let validation = {
        qtd: Yup.number('O valor deve ser numérico').required('Digite uma quantidade'),
    };

    if ( goodMinValidity != "" ) {
        validation.validity = Yup.string()
        .required('você deve informar a data de validade no formato DD/MM/YYYY')
        .matches(
            /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[012])\/\d{4}$/,
            'A data deve estar no formato DD/MM/YYYY',
        )
        .test('is-valid', 'A data informada é inválida', function (value) {
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            return isValid(parsedDate);
        });

    }

    const validationSchema = Yup.object().shape(validation);

    return(

   <Formik
     initialValues={{ qtd: '', validity: '' }}
     validationSchema={validationSchema}
     onSubmit={async (values) => {

         let bcs = props.barcodescanned.trim();
         let file_exists = {};
         let barcode_exists = {};
         let ckValidity = true;

         if ( db_table == "CODIGOS_CENTRAL") {
            file_exists = await _checkCodeExistsInFile(bcs);
            if ( !file_exists ) {

                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' não existe na lista',
                );
                return false;

            }
            const check_qtd = await _checkQtdInFile(file_exists,bcs,values.qtd);

            if ( check_qtd !== false ) {
    
                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' | ' + file_exists.produto + ' excede o limite de ' + Math.floor(check_qtd) + ' itens',
                );
                return false;

            }
         }
         if ( db_table == "CODIGOS_INVERT") {
            file_exists = await _checkCodeExistsInFile(bcs);
            if ( !file_exists ) {

                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' não existe na lista',
                );
                return false;

            }

         }
         if ( db_table == "CODIGOS_RECEBIMENTO_FORNECEDORES") {

            barcode_exists = await _checkCodeExistsInStore(bcs);
            
            if ( !barcode_exists ) {
                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' não existe na lista de coletagem',
                );
                return false;

            }

         }

         input.current.blur();

         if ( db_table == "CODIGOS_RECEBIMENTO_FORNECEDORES") {

            if ( goodMinValidity != '' ) {
                ckValidity = await _checkValidity(values.validity);

                if ( ckValidity ) {
                    _storeDataNew({'qtd': values.qtd, 'barcodescanned': bcs, 'validity': values.validity}, barcode_exists);
                } else {
                    Alert.alert('Confirmação', 'A validade deste produto está fora dos padrões de validação exigidos para ele.', [
                        {
                          text: 'Revisar Validade',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'Continuar', onPress: () => {
                            _storeDataNew({'qtd': values.qtd, 'barcodescanned': bcs, 'validity': values.validity}, barcode_exists);
                        }},
                      ]);
                }

            } else {
                _storeDataNew({'qtd': values.qtd, 'barcodescanned': bcs, 'validity': values.validity}, barcode_exists);
            }

        } else {
            _storeData({'qtd': values.qtd, 'barcodescanned': bcs}, file_exists);
    
        }
    }}

   >

     {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (

       <View style={[GlobalStyle.secureMargin, GlobalStyle.fullyScreem]}>
           <View style={[GlobalStyle.contentVerticalMiddle, GlobalStyle.fullyScreem, GlobalStyle.row]}>
            <View style={{flex: 1}}>
                {productName != "" && 
                <Text style={styles.barcode}>{productName}</Text>
                }
                <Text style={styles.barcode}>{props.barcodescanned} - {n_itens}</Text>
                <View style={[GlobalStyle.column, {alignItems: 'center', marginTop: 5}]}>
                    <View>
                        <Input
                            name={"qtd"}
                            onChangeText={handleChange("qtd")}
                            onBlur={handleBlur("qtd")}
                            value={values.qtd}
                            ref={input}
                            autoFocus
                            //showSoftInputOnFocus={false}
                            keyboardType={"numeric"}
                            maxLength={db_table == "CODIGOS_AVULSOS" ? 7 : 6}
                            placeholder={'Digite a quatidade'}
                            returnKeyType="next"
                            inputContainerStyle={{ height: 70, width: '100%', borderColor: 'gray', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30 }}
                            errorMessage={errors.qtd}
                        />

                    </View>
                    <View style={GlobalStyle.spaceSmall}></View>
                    { goodMinValidity != '' &&
                    <View>
                        <Input
                            name={"validity"}
                            onChangeText={(value) => {
                                setFieldValue('validity', maskDate(value));              

                            }}
                            onBlur={handleBlur("validity")}
                            value={values.validity}
                            //ref={input2}
                            //autoFocus
                            //showSoftInputOnFocus={false}
                            keyboardType={"numeric"}
                            maxLength={10}
                            placeholder='Digite a validade DD/MM/AAAA'
                            returnKeyType="next"
                            inputContainerStyle={{ height: 70, width: '100%', borderColor: 'gray', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30 }}
                            errorMessage={errors.validity}

                        />


                    </View>
                    }

                </View>
                <View>
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss();
                        input.current.blur();
                        handleSubmit()
                    }} 
                    style={GlobalStyle.defaultButton}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss();
                        input.current.blur();
                        backToScanner()
                    }} 
                    style={[GlobalStyle.clearCircleButton, {alignSelf: 'center', paddingHorizontal: 30, borderRadius: 15, height: 50}]}
                    >
                    <Text style={[GlobalStyle.clearCircleButtonText, {borderRadius: 3}]}>Cancelar</Text>
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
        fontSize: 16,
        textAlign: 'center'
    }
 });
