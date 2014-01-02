angular.module('App')
.service('keyService', [function () {
  return {
    isCtrlA: function (evt) {
      var letterAPressed = (evt.keyCode == 65);
      return letterAPressed && this.ctrlKeyPressed(evt);
    },
    isCtrlS: function (evt) {
      var letterSPressed = (evt.keyCode == 83);
      return letterSPressed && this.ctrlKeyPressed(evt);
    },
    isUp: function (evt) {
      return evt.keyCode == 38 || // up arrow
             evt.keyCode == 75;   // letter k
    },
    isDown: function (evt) {
      return evt.keyCode == 40 || // down arrow
             evt.keyCode == 74;   // letter j
    },
    isUpOrDown: function (evt) {
      return this.isUp(evt) || this.isDown(evt);
    },
    isCtrlUpOrDown: function (evt) {
      return this.ctrlKeyPressed(evt) && this.isUpOrDown(evt);
    },

    isShiftUpOrDown: function (evt) {
      return evt.shiftKey && this.isUpOrDown(evt);
    },
    preventDefaults: function (evt) {
      if (this.isCtrlA(evt) || 
          this.isCtrlS(evt) ||
          this.isUpOrDown(evt) || 
          this.isO(evt)) {
        evt.preventDefault();
      }
    },
    ctrlKeyPressed: function (evt) {
      return evt.ctrlKey || evt.metaKey;
    },
    isEnter: function (evt) {
      return evt.keyCode == 13;
    },
    isO: function (evt) {
      return evt.keyCode == 79;
    },
    isEscape: function (evt) {
      return evt.keyCode == 27;
    },
    isDelete: function (evt) {
      return evt.keyCode == 8;
    },
    isCtrlDelete: function (evt) {
      return this.ctrlKeyPressed(evt) && this.isDelete(evt);
    }
  }
}]);