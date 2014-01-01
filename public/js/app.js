angular.module('App', []);

angular.module('App')
.controller('AppCtrl', ['$scope', '$document', function ($scope, $document) {

  var startHour = 5;
  var endHour = 23;
  $scope.halfHours = [];
  for (var time = startHour; time <= endHour; time += 0.5) {
    $scope.halfHours.push({ time: time });
  }

  $scope.showTime = function (time) {
    return time == Math.floor(time);
  };

  $scope.formatTime = function (time) {
    if (time > 12) {
      time -= 12;
    }
    return time;
  }

  $document.bind('keydown', function (evt) {
    preventDefaults(evt);
    if (isCtrlA(evt)) {
      addBlock();
    }
    console.log(evt);
  });

  function isCtrlA(evt) {
    var ctrlKeyPressed = (evt.ctrlKey || evt.metaKey);
    var letterAPressed = (evt.keyCode == 65);
    return letterAPressed && ctrlKeyPressed;
  }

  function isUpOrDownArrow(evt) {
    return evt.keyCode == 40 || evt.keyCode == 38;
  }

  function preventDefaults(evt) {
    if (isCtrlA(evt) || isUpOrDownArrow(evt)) {
      evt.preventDefault();
    }
  }

  function addBlock() {
    console.log('should add time block');
  }

}]);