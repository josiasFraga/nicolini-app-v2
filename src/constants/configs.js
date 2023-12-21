import {Dimensions, Platform, StatusBar} from 'react-native';

export default {
  dimensions: Dimensions.get('window'),
  platform: Platform.OS,
  baseUrl: 'http://192.168.0.107',
  url: 'http://192.168.0.107',
  //baseUrl: 'http://192.168.1.108:8765',
  //url: 'http://192.168.1.108:8765',
  googleUrl: 'https://maps.googleapis.com/maps/api/',
  googleKey: 'AIzaSyBioeO6fXInXQGFfUdIJEFR9pGxbZT8sYU',
  defaultToken: '9oeUG4w8p}%k3$',
  timeBounceSearch: 1500,
  STATUSBAR_HEIGHT: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  ORIGINAL_HEADER_HEIGHT:
    Platform.OS === 'ios' ? 70 + 20 : 70 - 24 + StatusBar.currentHeight,
  ORIGINAL_HEADER_HEIGHT_WITHOUT_STATUS_BAR:
    Platform.OS === 'ios' ? 70 : 70 - 24,
};
