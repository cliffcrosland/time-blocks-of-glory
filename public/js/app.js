angular.module('App', []);

angular.module('App')
.controller('AppCtrl', ['$scope', '$document', 'keyService', '$timeout', function ($scope, $document, keyService, $timeout) {
  var startHour = 5;
  var endHour = 23;

  $scope.halfHours = [];
  $scope.blocks = loadBlocksFromLocalStorage() || [];
  $scope.selectedBlock = null;

  $timeout(function () {
     for (var time = startHour; time < endHour; time += 0.5) {
      $scope.halfHours.push({ time: time, blocks: [] });
    }
    syncHalfHourBlocks();
    $scope.selectedBlock = $scope.blocks[0] || null;
  });
    
  $scope.shouldShowTime = function (time) {
    return time == Math.floor(time);
  };

  $scope.formatTime = function (time) {
    if (time > 12) {
      time -= 12;
    }
    return time;
  }

  $scope.getBlockStyleInHalfHour = function (block, halfHour) {
    var borderStyle = '1px solid #ccc';
    var width = (97 / halfHour.blocks.length) + '%';
    var style = {
      'border-left': borderStyle,
      'border-right': borderStyle,
      'width': width
    };
    if (block.start == halfHour.time) {
      style['border-top'] = borderStyle;
    }
    if (block.start + (block.size - 1) * 0.5 == halfHour.time) {
      style['border-bottom'] = borderStyle;
    }
    return style;
  }

  $scope.isBlockSelected = function (block) {
    return $scope.selectedBlock == block;
  }

  $scope.isEditingBlockName = function (block) {
    return $scope.selectedBlock == block && $scope.editing;
  }

  $scope.isFirstHalfHourOfBlock = function (halfHour, block) {
    return halfHour.time == block.start;
  }

  $document.bind('keydown', function (evt) {
    keyService.preventDefaults(evt);
    if (keyService.isCtrlA(evt)) {
      addBlock();
    } else if (keyService.isShiftUpOrDown(evt)) {
      keyService.isUp(evt)
        ? shrinkSelectedBlock()
        : growSelectedBlock();
    } else if (keyService.isCtrlUpOrDown(evt)) {
      keyService.isUp(evt)
        ? moveSelectedBlockUp()
        : moveSelectedBlockDown();
    } else if (keyService.isUpOrDown(evt)) {
      keyService.isUp(evt)
        ? selectPreviousBlock()
        : selectNextBlock();
    } else if (keyService.isEnter(evt)) {
      toggleEditSelectedBlock();
    } else if (keyService.isEscape(evt)) {
      if ($scope.editing) {
        exitEditSelectedBlock();
      } else if ($scope.selectedBlock) {
        $scope.selectedBlock = null;
      }
    } else if (keyService.isCtrlDelete(evt)) {
      deleteSelectedBlock();
    }
  });
  
  function addBlock() {
    var blockStart = startHour;
    if ($scope.selectedBlock) {
      blockStart = $scope.selectedBlock.start;
    }
    var block = { start: blockStart, size: 1, name: '' };
    $scope.blocks.push(block);
    $scope.selectedBlock = block;
    syncHalfHourBlocks();
  }

  function shrinkSelectedBlock() {
    if (!$scope.selectedBlock) return;
    if ($scope.selectedBlock.size == 1) return;
    $scope.selectedBlock.size--;
    syncHalfHourBlocks();
  }

  function growSelectedBlock() {
    if (!$scope.selectedBlock) return;
    $scope.selectedBlock.size++;
    syncHalfHourBlocks();
  }

  function moveSelectedBlockUp() {
    if (!$scope.selectedBlock) return;
    $scope.selectedBlock.start -= 0.5;
    if ($scope.selectedBlock.start < startHour) {
      $scope.selectedBlock.start = endHour - 0.5;
    }
    syncHalfHourBlocks();
  }

  function moveSelectedBlockDown() {
    if (!$scope.selectedBlock) return;
    $scope.selectedBlock.start += 0.5;
    if ($scope.selectedBlock.start == endHour) {
      $scope.selectedBlock.start = startHour;
    }
    syncHalfHourBlocks();
  }

  function selectPreviousBlock() {
    if ($scope.blocks.length == 0) return;
    if (!$scope.selectedBlock) {
      $scope.selectedBlock = $scope.blocks[$scope.blocks.length - 1];
      return;
    }
    var indexOfSelected = $scope.blocks.indexOf($scope.selectedBlock);
    var prevIndex = indexOfSelected - 1;
    if (prevIndex == -1) {
      prevIndex = $scope.blocks.length - 1;
    }
    $scope.selectedBlock = $scope.blocks[prevIndex];
    $scope.$digest();
  }

  function selectNextBlock() {
    if ($scope.blocks.length == 0) return;
    if (!$scope.selectedBlock) {
      $scope.selectedBlock = $scope.blocks[0];
      return;
    }
    var indexOfSelected = $scope.blocks.indexOf($scope.selectedBlock);
    var nextIndex = indexOfSelected + 1;
    if (nextIndex == $scope.blocks.length) {
      nextIndex = 0;
    }
    $scope.selectedBlock = $scope.blocks[nextIndex];
    $scope.$digest();
  }

  function toggleEditSelectedBlock() {
    if (!$scope.selectedBlock) return;
    $scope.editing = !$scope.editing;
    $scope.$digest();
  }

  function exitEditSelectedBlock() {
    if (!$scope.selectedBlock) return;
    $scope.editing = false;
    $scope.$digest();
  }

  function deleteSelectedBlock() {
    if (!$scope.selectedBlock) return;
    $scope.blocks = _.reject($scope.blocks, function (block) { 
      return block == $scope.selectedBlock; 
    });
    selectNextBlock();
    syncHalfHourBlocks();
  }

  function loadBlocksFromLocalStorage() {
    return localStorage['blocks'] && JSON.parse(localStorage['blocks']);
  }

  function saveBlocksToLocalStorage(blocks) {
    localStorage['blocks'] = JSON.stringify(blocks);
  }

  function syncHalfHourBlocks() {
    $scope.blocks.sort(function (a, b) {
      return a.start - b.start;
    });
    saveBlocksToLocalStorage($scope.blocks);
    _.each($scope.halfHours, function (halfHour) {
      halfHour.blocks = [];
    });
    _.each($scope.blocks, function (block) {
      var start = block.start;
      var end = block.start + block.size * 0.5;
      _.each($scope.halfHours, function (halfHour) {
        if (halfHour.time >= start && halfHour.time < end) {
          halfHour.blocks.push(block);
        }
      });
    });
    $scope.$digest();
  };

}]);