angular.module('App')
.service('keyService', [function () {
  function isCtrlA(evt) {
    var letterAPressed = (evt.keyCode == 65);
    return letterAPressed && ctrlKeyPressed(evt);
  }

  function isUp(evt) {
    return evt.keyCode == 38;
  }

  function isDown(evt) {
    return evt.keyCode == 40;
  }

  function isUpOrDown(evt) {
    return isUp(evt) || isDown(evt);
  }

  function isCtrlUpOrDown(evt) {
    return ctrlKeyPressed(evt) && isUpOrDown(evt);
  }

  function isShiftUpOrDown(evt) {
    return evt.shiftKey && isUpOrDown(evt);
  }

  function preventDefaults(evt) {
    if (isCtrlA(evt) || isUpOrDown(evt)) {
      evt.preventDefault();
    }
  }

  function ctrlKeyPressed(evt) {
    return evt.ctrlKey || evt.metaKey;
  }

  function isEnter(evt) {
    return evt.keyCode == 13;
  }

  function isEscape(evt) {
    return evt.keyCode == 27;
  }

  function isDelete(evt) {
    return evt.keyCode == 8;
  }

  function isCtrlDelete(evt) {
    return ctrlKeyPressed(evt) && isDelete(evt);
  }

  return {
    isCtrlA: isCtrlA,
    isUp: isUp,
    isDown: isDown,
    isUpOrDown: isUpOrDown,
    isCtrlUpOrDown: isCtrlUpOrDown,
    isShiftUpOrDown: isShiftUpOrDown,
    preventDefaults: preventDefaults,
    isEnter: isEnter,
    isEscape: isEscape,
    isCtrlDelete: isCtrlDelete
  };
  
}]);