import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import {  getIn } from 'formik';

import COLORS from '@constants/colors';
import GlobalStyle from '@styles/global';

type Props = {};
export default class FieldTextInputRound extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  state = {
    isFocused: false,
  };

  handleFocus = event => {
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({isFocused: false});

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  number_format = (number, decimals, dec_point, thousands_sep) => {
    var n = number,
      prec = decimals;
    var toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return (Math.round(n * k) / k).toString();
    };
    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
    var dec = typeof dec_point === 'undefined' ? '.' : dec_point;
    var s = prec > 0 ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec);
    //fix for IE parseFloat(0.55).toFixed(0) = 0;
    var abs = toFixedFix(Math.abs(n), prec);
    var _, i;
    if (abs >= 1000) {
      _ = abs.split(/\D/);
      i = _[0].length % 3 || 3;
      _[0] =
        s.slice(0, i + (n < 0)) + _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
      s = _.join(dec);
    } else {
      s = s.replace('.', dec);
    }
    var decPos = s.indexOf(dec);
    if (prec >= 1 && decPos !== -1 && s.length - decPos - 1 < prec) {
      s += new Array(prec - (s.length - decPos - 1)).join(0) + '0';
    } else if (prec >= 1 && decPos === -1) {
      s += dec + new Array(prec).join(0) + '0';
    }
    return s;
  };

  maskMoney = (text) => {
    let numberPattern = /\d+/g;
    let formated = text.match(numberPattern).join('');
    formated = formated / 100;
    formated = this.number_format(formated, 2, ',', '.');
    //formated = 'R$ ' + formated;

    if (formated == 'R$ 0,00') {
      formated = '';
    }

    return formated;
  }

  maskPhone = (text) => {
    let x = text.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    let retorno = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    return retorno;
  }

  maskCPF = (text) => {
    return text
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
  }

  maskCNPJ = (text) => {
    let x = text.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    let retorno  = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');

    return retorno;
  }

  maskCEP = (text) => {
    let x = text.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
    let retorno = x[1] + '-' + x[2];

    return retorno;
  }

  maskNumber = (text) => {
    return text.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
  }
  
  maskPlaca = (text) => {
    let retorno = '';
    let x =  text.match(/([A-Z]{0,3})([0-9]{0,1})([0-9A-Z]{0,1})([0-9]{0,2})/);

    if ( x[1].length < 3 ) {
      return x[1];
    } else if ( x[2] == '' ) {
      return x[1]+x[2];
    } else if ( x[3] == '' ) {
      return x[1]+x[2]+x[3];
    }

    retorno = x[1]+x[2]+x[3]+x[4];
    return retorno;   

  }

  render() {
    const {
      placeholder,
      field, 
      keyboardType,
      maxLength,
      multiline,
      labelText,
      returnKeyType,
      onEnter,
      mask,
      referencia,
      labelStyle,
      form, 
      autoCapitalize,
      autoCorrect,
      editable,
      key,
      ...inputProps
    } = this.props;

    const formStates = [
      'active',
      'autofilled',
      'asyncValidating',
      'dirty',
      'invalid',
      'pristine',
      'submitting',
      'touched',
      'valid',
      'visited',
      'error',
    ];

    const {value, onChange, onBlur} = field;
    const error = getIn(form.errors, field.name);
    const touch = getIn(form.touched, field.name);

    let _onFocus = () => {};

    if ( typeof this.props._onFocus != 'undefined' ) {
      _onFocus = this.props._onFocus
    }

    let _onChange = ()=>{};
    if ( typeof this.props._onChange != 'undefined' ) {
      _onChange = this.props._onChange;
    }

    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={
            form.touched && form.error
              ? this.props.multiline
                ? [
                    GlobalStyle.textareaAndroid,
                    GlobalStyle.text,
                    styles.fieldError,
                  ]
                : [
                    GlobalStyle.inputAndroid,
                    GlobalStyle.text,
                    styles.fieldError,
                  ]
              : this.props.multiline
              ? [GlobalStyle.textareaAndroid, GlobalStyle.text, styles.input]
              : [GlobalStyle.inputAndroid, GlobalStyle.text, styles.input]
          }
          /*underlineColorAndroid={
            form.touched && form.error
              ? COLORS.errorColor
              : isFocused
              ? COLORS.INPUT_ANDROID_UNDERLINE_FOCUSED
              : COLORS.INPUT_ANDROID_UNDERLINE
          }*/
          underlineColorAndroid="#FFF"
          onBlur={() => {
            this.handleBlur;
            onBlur;
          }}
          onFocus={() => {
            this.handleFocus;
            _onFocus();
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          returnKeyType={returnKeyType}
          ref={referencia}
          onSubmitEditing={onEnter}
          placeholderTextColor={COLORS.placeholderTextColor}
          onChangeText={text => {

            if ( text == '' ) {
              _onChange('');
              form.setFieldValue(field.name, '');
              return;
            }

            let formated = text;
            if (mask == 'money') {
              formated = this.maskMoney(text);
            }
            if (mask == 'phone') {
              formated = this.maskPhone(text);
            }
            if (mask == 'cpf') {
              formated = this.maskCPF(text);
            }
            if (mask == 'cnpj') {
              formated = this.maskCNPJ(text);
            }
            if (mask == 'cep') {
              formated = this.maskCEP(text);
            }
            if (mask == 'number') {
              formated = this.maskNumber(text);
            }
            if (mask == 'placa') {
              formated = this.maskPlaca(text);
            }

            form.setFieldValue(field.name, formated);
            //form.setFieldValue(formated, text);
            _onChange(formated);
          }}
          name={field.name}
          value={value}
          secureTextEntry={this.props.secureTextEntry}
          textContentType={this.props.textContentType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
        />
        {form.touched[field.name] &&
          (form.errors[field.name] && (
            <Text style={[GlobalStyle.errorValidation]}>{form.errors[field.name]}</Text>
          ))}
          { ( (!form.touched[field.name]) && form.errors[field.name]) && !touch &&
            (error && (
              <Text style={[GlobalStyle.errorValidation]}>{error}</Text>
            ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    marginLeft: 3,
    marginRight: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    color: '#315a79',
    fontSize: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  fieldError: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    flex: 1,
    marginLeft: 3,
    marginRight: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    color: '#315a79',
    fontSize: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
});
