import React from 'react';
import {StyleSheet, TextInput, View, Text, Picker} from 'react-native';

import COLORS from '@constants/colors';
import GlobalStyle from '@styles/global';

type Props = {};
export default class FieldPicker extends React.Component<Props> {
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
      pickerProps,
      children,
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
      <View style={[styles.inputContainer, styles.input]}>
        <Picker
          selectedValue={value}
          onValueChange={value => onChange(value)}
          mode="dialog"
          {...inputProps}
          {...pickerProps}>
          {children}
        </Picker>
        {meta.touched &&
          (meta.error && (
            <Text style={[GlobalStyle.errorValidation]}>{meta.error}</Text>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    marginLeft: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.84,
    elevation: 4,
    color: '#315a79',
    fontSize: 20,
    paddingHorizontal: 15,
  },
});
