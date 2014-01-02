angular.module('App')
.service('keyService', ['$document', function ($document) {
  var _mostRecentKeyDownEvt = null;
  function saveMostRecentKeyDownEvt(evt) {
    _mostRecentKeyDownEvt = evt;
  }

  return {
    onKeydown: function (callback) {
      $document.bind('keydown', function (evt) {
        callback(evt);
        saveMostRecentKeyDownEvt(evt);
      });
    },
    isCtrlA: function (evt) {
      var letterAPressed = (evt.keyCode == 'A'.charCodeAt(0));
      return letterAPressed && this.ctrlKeyPressed(evt);
    },
    isCtrlS: function (evt) {
      var letterSPressed = (evt.keyCode == 'S'.charCodeAt(0));
      return letterSPressed && this.ctrlKeyPressed(evt);
    },
    isUp: function (evt) {
      return evt.keyCode == 38 || // up arrow
             evt.keyCode == 'K'.charCodeAt(0);
    },
    isDown: function (evt) {
      return evt.keyCode == 40 || // down arrow
             evt.keyCode == 'J'.charCodeAt(0);
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
          this.isO(evt) ||
          this.isDoubleC(evt)) {
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
      return evt.keyCode == 'O'.charCodeAt(0);
    },
    isEscape: function (evt) {
      return evt.keyCode == 27;
    },
    isDelete: function (evt) {
      return evt.keyCode == 8;
    },
    isCtrlDelete: function (evt) {
      return this.ctrlKeyPressed(evt) && this.isDelete(evt);
    },
    isDoubleC: function (evt) {
      if (!_mostRecentKeyDownEvt) return false;
      return 'C'.charCodeAt(0) == evt.keyCode &&
             'C'.charCodeAt(0) == _mostRecentKeyDownEvt.keyCode;
    }
  }
}]);