angular.module('App')
.directive('focusOn', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      scope.$watch(attr.focusOn, function (focusOnValue) {
        if (focusOnValue) {
          element[0].focus();
        }
      })
    }
  };
});