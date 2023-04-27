import {StyleSheet} from 'react-native';
import CONFIG from '@constants/configs';
import COLORS from '@constants/colors';

export default StyleSheet.create({
  fullyScreem: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  shadowContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowOffset:{  width: 50,  height: 50,  },
    shadowColor: 'red',
    shadowRadius: 15,
    shadowOpacity: 0.8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 20,
    margin: 20,
    marginBottom: 50
  },
  shadowContainer2: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowOffset:{  width: 30,  height: 30,  },
    shadowColor: 'red',
    shadowRadius: 15,
    shadowOpacity: 0.8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 10,
    margin: 5,
    marginBottom: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  centerItems: {
    alignItems: 'center',
  },
  secureMargin: {
    paddingHorizontal: 15,
  },
  bgWhite: {
    backgroundColor: '#FFF',
  },
  divider: {
    backgroundColor: '#eee',
    height: 10,
  },
  dividerSmall: {
    backgroundColor: '#eee',
    height: 5,
  },
  contentVerticalMiddle: {
    alignItems: 'center',
  },
  //tipography
  textCenterVertically: {
    textAlignVertical: 'center',
  },
  text: {
    fontFamily: 'Mitr-Regular',
  },
  textSmall: {
    fontSize: 13,
    color: '#898A8F'
  },
  textMedium: {
    fontFamily: 'Mitr-Medium',
    marginBottom: 3,
  },
  title: {
    fontSize: 22,
    color: COLORS.title,
  },
  title2: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.title,
  },
  minimum_text: {
    color: COLORS.minimum_text,
    fontFamily: 'Mitr-Light',
    fontSize: 13,
  },
  slim_text: {
    fontFamily: 'Mitr-Light',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  fontDark: {
    color: COLORS.darkText,
  },
  sizeFive: {
    fontSize: 12,
  },
  textCenter: {
    textAlign: 'center',
  },
  //header
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  header_overlaid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pageTitle: {
    color: COLORS.primary,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  //spaces
  paddingStatusBar: {
    paddingTop: CONFIG.STATUSBAR_HEIGHT,
  },
  marginStatusBar: {
    marginTop: CONFIG.STATUSBAR_HEIGHT,
  },
  spaceExtraSmall: {
    width: '100%',
    height: 10,
  },
  spaceSmall: {
    width: '100%',
    height: 20,
  },
  spaceMedium: {
    width: '100%',
    height: 30,
  },
  spaceBig: {
    width: '100%',
    height: 50,
  },
  //forms
  label: {
    color: COLORS.label,
  },
  inputAndroid: {
    height: 50,
    fontSize: 14,
  },
  textareaAndroid: {
    height: 80,
    fontWeight: "bold"
  },
  inputText: {
    color: COLORS.primary,
    fontSize: 20
  },
  errorValidation: {
    color: COLORS.errorColor,
    //fontFamily: 'Mitr-Light',
    fontSize: 12,
    textAlign: 'right',
    textAlignVertical: 'center',
    paddingRight: 15,
  },
  colorErrorValidation: {
    color: COLORS.errorColor,
  },
  //buttons
  buttonContainer: {
    backgroundColor: COLORS.button,
    alignItems: 'center',
    height: 40,
    flexDirection: 'column',
    borderRadius: 3,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.buttonText,
  },
  buttonContainerLoading: {
    backgroundColor: COLORS.buttonLoading,
    alignItems: 'center',
    height: 40,
    flexDirection: 'column',
    borderRadius: 3,
    justifyContent: 'center',
  },
  buttonCircleContainerLoading: {
    backgroundColor: COLORS.buttonLoading,
    alignItems: 'center',
    height: 50,
    flexDirection: 'column',
    borderRadius: 25,
    justifyContent: 'center',
  },
  defaultButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 50
  },
  defaultButtonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#f7f7f7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  defaultSmallButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 7
  },
  defaultSmallButtonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#f7f7f7',
    fontWeight: 'bold',
    fontSize: 13,
  },
  clearCircleButton: {
    borderWidth: 2,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    borderColor: '#CCC',
    marginVertical: 10,
  },
  clearCircleButtonText: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  //search without feedback
  buttonSearch: {
    width: '100%',
    backgroundColor: '#eeeeee',
    height: 40,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonSearchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  buttonSearchText: {
    fontSize: 16,
    color: '#999',
  },
  //tabbar
  iconTabBar: {
    color: COLORS.tabBarIcon,
  },
  textTabBar: {
    color: COLORS.tabBarText,
    fontSize: 12,
    fontFamily: 'Mitr-Light',
  },
  iconTabBarSelected: {
    color: COLORS.tabBarIconActive,
  },
  textTabBarSelected: {
    color: COLORS.tabBarTextActive,
    fontSize: 12,
  },
  //list
  listItemTitle: {
    color: COLORS.darkText,
    //fontFamily: 'Mitr-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listMarker: {
    backgroundColor: '#999',
    color: '#FFF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    fontSize: 8,
  },
  listItemSubtitleText: {
    color: '#999',
  },
  emptyListText: {
    textAlign: 'center',
    paddingVertical: 15,
  },
  //segment
  tabsContainerStyle: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  tabStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
  },
  tabTextStyle: {
    color: '#999',
  },
  activeTabStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#A60000',
  },
  activeTabTextStyle: {
    color: '#A60000',
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
  firstTabStyle: {
    borderRightWidth: 0,
    borderRightColor: 'transparent',
  },
  lastTabStyle: {},
  //footer

  footer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
    backgroundColor: '#FFF',
  },
  //modal
  modalTitle: {
    color: '#333',
    textAlign: 'center',
    paddingVertical: 15,
    fontSize: 25,
    fontWeight: 'bold'
  },
  modalSubtitle: {
    color: '#333',
    textAlign: 'center',
    paddingVertical: 15,
    fontSize: 23,
    fontWeight: 'bold'
  },
  labelMarker: {
    marginRight: 12,
    color: '#2e5878',
  },
  topBoxRight: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    zIndex: 99999,
  },
  
  sectionHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7
  },
  sectionHeaderText: {
    textAlign: 'left',
    fontSize: 16,
    color: "#f7f7f7", 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
});
