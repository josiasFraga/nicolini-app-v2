import React from 'react';
import {
    View,
    Text
  } from 'react-native';

import BackButton from '@components/Buttons/BackButton';
import GlobalStyle from '@styles/global';
import CONFIG from '@constants/configs';


type Props = {};
export default class Header extends React.Component<Props> {
  render() {
    return (
        <View
          style={[
            GlobalStyle.header,
            GlobalStyle.paddingStatusBar,
            {
              height: CONFIG.ORIGINAL_HEADER_HEIGHT
            },
            this.props.styles
          ]}>
          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              {this.props.backButton &&(
                <BackButton backScene='pop' iconColor={this.props.iconColor} />
              )}
            </View>
            <View style={{flex: 6}}><Text style={[GlobalStyle.pageTitle, this.props.titleStyle]}>{this.props.titulo}</Text></View>
            <View style={{flex: 1}}>

            </View>
          </View>
        </View>
    );
  }
}
