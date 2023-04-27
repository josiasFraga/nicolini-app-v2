import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import AlertHelper from './AlertHelper';

type Props = {};
class Alert extends React.Component<Props> {
  renderMessage() {
    if (this.props.errorMessage === false || this.props.errorMessage == '') {
      return null;
    }
    let error_message = this.props.errorMessage;

    //this.props.hideErrorMessage();
    return AlertHelper.show('error', 'Erro', error_message);
  }

  render() {
    return <View>{this.renderMessage()}</View>;
  }
}

const mapDispatchToProps = dispatch => ({
  hideErrorMessage() {
    dispatch({
      type: 'HIDE_ERROR_MESSAGE',
      payload: '',
    });
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(Alert);
