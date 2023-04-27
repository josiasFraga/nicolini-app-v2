export default class AlertHelper {
  static dropDown;
  static onClose;

  static setDropDown(dropDown) {
    if (typeof dropDown != undefined) {
      this.dropDown = dropDown;
    }
  }

  static show(type, title, message, interval = 0) {
    if (this.dropDown && message !== false) {
      this.dropDown.alertWithType(type, title, message, {}, interval);
    }
  }

  static setOnClose(onClose) {
    this.onClose = onClose;
  }

  static invokeOnClose() {
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }
}
