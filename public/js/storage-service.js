angular.module('App')
.service('storageService', function () {
  var firebaseRef = new Firebase('https://time-blocks-of-glory.firebaseio.com/');
  var _onValueCallback = null;
  return {
    onBlocksValue: function (callback) {
      if (_onValueCallback) {
        firebaseRef.off('value', _onValueCallback);
      }

      _onValueCallback = function (blocksJsonStringSnapshot) {
        var blocks = JSON.parse(blocksJsonStringSnapshot.val());
        callback(blocks);
      };
      firebaseRef.on('value', _onValueCallback);
    },
    saveBlocks: function (blocks) {
      var blocksJsonString = JSON.stringify(blocks);
      firebaseRef.set(blocksJsonString);
    }
  };
});