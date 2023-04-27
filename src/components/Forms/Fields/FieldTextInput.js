import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

import COLORS from '@constants/colors';
import GlobalStyle from '@styles/global';

type Props = {};
export default class FieldTextInput extends React.Component<Props> {
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
    formated = 'R$ ' + formated;

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

  render() {
    //const { input, ...inputProps } = props;
    const {isFocused} = this.state;
    const {
      placeholder,
      labelText,
      labelStyle,
      keyboardType,
      maxLength,
      multiline,
      returnKeyType,
      refField,
      onEnter,
      input: {onChange, name, onBlur, onFocus, value, ...inputProps},
      meta,
      mask,
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

    return (
      <View>
        <Text
          style={
            meta.touched && meta.error
              ? [
                  GlobalStyle.text,
                  GlobalStyle.label,
                  labelStyle,
                  GlobalStyle.colorErrorValidation,
                ]
              : [GlobalStyle.text, GlobalStyle.label, labelStyle]
          }>
          {labelText}
        </Text>
        <TextInput
          style={
            this.props.multiline
              ? [GlobalStyle.textareaAndroid, GlobalStyle.inputText]
              : [GlobalStyle.inputAndroid, GlobalStyle.inputText]
          }
          underlineColorAndroid={
            meta.touched && meta.error
              ? COLORS.errorColor
              : isFocused
              ? COLORS.INPUT_ANDROID_UNDERLINE_FOCUSED
              : COLORS.INPUT_ANDROID_UNDERLINE
          }
          onBlur={() => {
            this.handleBlur;
            onBlur;
          }}
          onFocus={() => {
            this.handleFocus;
            onFocus;
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          returnKeyType={returnKeyType}
          ref={refField}
          onSubmitEditing={onEnter}
          placeholderTextColor={COLORS.placeholderTextColor}
          onChangeText={text => {

            if ( text == '' ) {
              onChange('');
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

            onChange(formated);
          }}
          name={name}
          value={value}
          secureTextEntry={this.props.secureTextEntry}
          textContentType={this.props.textContentType}
        />
        {meta.touched &&
          (meta.error && (
            <Text style={[GlobalStyle.errorValidation]}>{meta.error}</Text>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
