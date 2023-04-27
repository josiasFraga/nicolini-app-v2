import React from 'react';
import {Icon} from 'react-native-elements';
import { StackActions, CommonActions, useNavigation } from '@react-navigation/native';
import COLORS from '@constants/colors';

export default function BackButton(props) {

    let cenaToOpen = props.backScene;
    const navigation = useNavigation();

    return (
      <Icon
        name="chevron-small-left"
        type="entypo"
        color={
          typeof props.iconColor != 'undefined'
            ? props.iconColor
            : COLORS.backButton
        }
        size={30}
        onPress={() => {
          if ( cenaToOpen == 'pop' ) {
            navigation.dispatch(StackActions.pop(1)); 

          } else {
            navigation.dispatch(
              CommonActions.navigate({
                name: cenaToOpen,
              })
            ); 

          }
        }}
        containerStyle={{backgroundColor: 'transparent'}}
      />
    );
}
