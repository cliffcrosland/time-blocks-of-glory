angular.module('App', []);

angular.module('App')
.controller('AppCtrl', ['$scope', function ($scope) {

  var startHour = 5;
  var endHour = 23;
  $scope.halfHours = [];
  for (var halfHour = startHour; halfHour <= endHour; halfHour += 0.5) {
    $scope.halfHours.push(halfHour);
  }

  $scope.showHalfHour = function (halfHour) {
    return halfHour == Math.floor(halfHour);
  };

  $scope.formatHalfHour = function (halfHour) {
    var time = halfHour;
    if (time > 12) {
      time -= 12;
    }
    return time;
  }

}]);