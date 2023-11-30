import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import GlobalStyle from '@styles/global';

export default class FieldPicker extends React.Component {
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
      field, 
      form, 
      enabled,
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

    let _enabled = true;
    if ( typeof enabled != 'undefined' && !enabled )
      _enabled = false;

    const {value} = field;
    const {onChange} = this.props;
    return (
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <Picker
            selectedValue={value}
            mode="dialog"
            onValueChange={value => { 
              onChange(value)
              form.setFieldValue(field.name, value);
            }}
            enabled={_enabled}
            {...inputProps}>
          </Picker>
        </View>
        {form.touched[field.name] &&
          (form.errors[field.name] && (
            <Text style={[GlobalStyle.errorValidation]}>{form.errors[field.name]}</Text>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginBottom: 20,
    paddingVertical: 0
  },
  input: {
    flex: 1,
    marginLeft: 3,
    marginRight: 3,
    color: '#315a79',
    fontSize: 20,
    paddingVertical: 0,
    borderBottomWidth: 0.7
  },
});
