import 'react-native-gesture-handler';
import Routes from '@constants/routes';
import { StatusBar, Alert } from 'react-native';
import React from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import AlertHelper from '@components/Alert/AlertHelper';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';
import store from './store';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {RealmContext} from '@configs/realmConfig';
const {RealmProvider} = RealmContext;

function App() {

  const showAlert = (mensagem:any) => {
    Alert.alert(
      "OneSignal",
      mensagem,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }

  const saveNotificationsID = async () => {

    const deviceState = await OneSignal.getDeviceState();
    
    await AsyncStorage.setItem(
      'oneSignalToken',
      JSON.stringify(deviceState),
    );

    console.debug(deviceState.userId);
  }

  React.useEffect(() => {  
    /* O N E S I G N A L   S E T U P */
    OneSignal.setAppId("8d933c6b-74db-4259-9866-889c10da7fcd");

    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log("Prompt response:", response);
    });

    /* O N E S I G N A L  H A N D L E R S */
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
        console.log("OneSignal: notification will show in foreground:", notifReceivedEvent);
        let notif = notifReceivedEvent.getNotification();

        const button1 = {
            text: "Cancelar",
            onPress: () => { notifReceivedEvent.complete(); },
            style: "cancel"
        };

        const button2 = { text: "Ok", onPress: () => { notifReceivedEvent.complete(notif); }};

        AlertHelper.show('info', notif.title, notif.body);
       // Alert.alert("Complete notification?", "Test", [ button1, button2], { cancelable: true });
    });
    OneSignal.setNotificationOpenedHandler(notification => {
        console.log("OneSignal: notification opened:", notification);
    });
    OneSignal.setInAppMessageClickHandler(event => {
        console.log("OneSignal IAM clicked:", event);
    });
    OneSignal.addEmailSubscriptionObserver((event) => {
        console.log("OneSignal: email subscription changed: ", event);
    });
    OneSignal.addSubscriptionObserver(event => {
        console.log("OneSignal: subscription changed:", event);
        saveNotificationsID();
        //this.showAlert("notification id: "+deviceState.userId);
        //this.showAlert("OneSignal: subscription changed: "+event.to.isSubscribed);
        //this.setState({ isSubscribed: event.to.isSubscribed})//

    });
    OneSignal.addPermissionObserver(event => {
        console.log("OneSignal: permission changed:", event);
        //this.showAlert("OneSignal: permission changed: "+JSON.stringify(event));
    });

    saveNotificationsID();
  }, []);


  return (
    <SafeAreaProvider>
      <RealmProvider>
      <Provider store={store}>
        <Routes />
      </Provider>
      </RealmProvider>

      <DropdownAlert
        defaultContainer={{
          padding: 8,
          paddingTop: StatusBar.currentHeight,
          flexDirection: 'row',
        }}
        ref={ref => AlertHelper.setDropDown(ref)}
        onClose={() => AlertHelper.invokeOnClose()}
        //StatusBar={{translucent: true}}
        translucent={true}
        inactiveStatusBarBackgroundColor={'transparent'}
        //inactiveStatusBarStyle={'dark-content'}
      />
    </SafeAreaProvider>
  );
}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
});
