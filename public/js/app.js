angular.module('App', []);

angular.module('App')
.controller('AppCtrl', ['$scope', '$document', 'keyService', '$timeout', '$window', 'storageService',
function ($scope, $document, keys, $timeout, $window, storageService) {
  var startHour = 5;
  var endHour = 23;

  $scope.halfHours = [];
  $scope.blocks = [];
  $scope.selectedBlock = null;

  for (var time = startHour; time < endHour; time += 0.5) {
    $scope.halfHours.push({ time: time, blocks: [] });
  }

  $scope.loading = true;
  storageService.onBlocksValue(function (blocks) {
    $scope.loading = false;
    $scope.blocks = blocks || [];
    updateSelectedBlock($scope.blocks);
    syncHalfHourBlocks({ skipSave: true });
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
    var borderStyle = '1px solid #ddd';
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

  $scope.getBlockId = function (block) {
    return 'block-' + $scope.blocks.indexOf(block);
  }

  keys.onKeydown(function (evt) {
    if ($scope.editing) {
      handleEditModeEvent(evt);
    } else {
      handleCommandModeEvent(evt);
    }
  });

  function handleEditModeEvent(evt) {
    if (keys.isEscape(evt) || keys.isEnter(evt)) {
      exitEditSelectedBlock();
    }
  }

  function handleCommandModeEvent(evt) {
    keys.preventDefaults(evt);
    if (keys.isCtrlA(evt)) {
      addBlock();
    } else if (keys.isCtrlS(evt)) {
      saveBlocks();
    } else if (keys.isCtrlUpOrDown(evt)) {
      keys.isUp(evt)
        ? shrinkSelectedBlock()
        : growSelectedBlock();
    } else if (keys.isShiftUpOrDown(evt)) {
      keys.isUp(evt)
        ? moveSelectedBlockUp()
        : moveSelectedBlockDown();
    } else if (keys.isUpOrDown(evt)) {
      keys.isUp(evt)
        ? selectPreviousBlock()
        : selectNextBlock();
    } else if (keys.isEnter(evt) || keys.isO(evt) || keys.isDoubleC(evt)) {
      editSelectedBlock({ selectText: keys.isDoubleC(evt)});
    } else if (keys.isEscape(evt)) {
      $scope.$apply(function () {
        $scope.selectedBlock = null;
      });
    } else if (keys.isCtrlDelete(evt)) {
      deleteSelectedBlock();
    }
  }
  
  function addBlock() {
    var blockStart = startHour;
    if ($scope.selectedBlock) {
      blockStart = $scope.selectedBlock.start;
    }
    var block = { start: blockStart, size: 1, name: 'New block' };
    $scope.blocks.push(block);
    $scope.selectedBlock = block;
    syncHalfHourBlocks();
  }

  function saveBlocks() {
    storageService.saveBlocks($scope.blocks);
  }

  function shrinkSelectedBlock() {
    if (!$scope.selectedBlock) return;
    if ($scope.selectedBlock.size == 1) return;
    $scope.selectedBlock.size--;
    syncHalfHourBlocks();
    scrollToBlock($scope.selectedBlock);
  }

  function growSelectedBlock() {
    if (!$scope.selectedBlock) return;
    $scope.selectedBlock.size++;
    syncHalfHourBlocks();
    scrollToBlock($scope.selectedBlock);
  }

  function moveSelectedBlockUp() {
    if (!$scope.selectedBlock) return;
    $scope.selectedBlock.start -= 0.5;
    if ($scope.selectedBlock.start < startHour) {
      $scope.selectedBlock.start = endHour - 0.5;
    }
    syncHalfHourBlocks();
    scrollToBlock($scope.selectedBlock);
  }

  function moveSelectedBlockDown() {
    if (!$scope.selectedBlock) return;
    $scope.selectedBlock.start += 0.5;
    if ($scope.selectedBlock.start == endHour) {
      $scope.selectedBlock.start = startHour;
    }
    syncHalfHourBlocks();
    scrollToBlock($scope.selectedBlock);
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
    scrollToBlock($scope.selectedBlock);
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
    scrollToBlock($scope.selectedBlock);
  }

  function editSelectedBlock(opt) {
    if (!$scope.selectedBlock) return;
    $scope.editing = true;
    $scope.$digest();
    var blockElem = $('#' + $scope.getBlockId($scope.selectedBlock));
    var input = blockElem.find('input');
    input.focus();
    if (opt && opt.selectText) {
      input.select();
    }
  }

  function exitEditSelectedBlock() {
    if (!$scope.selectedBlock) return;
    $scope.editing = false;
    saveBlocks();
    var blockElem = $('#' + $scope.getBlockId($scope.selectedBlock));
    var input = blockElem.find('input');
    input.blur();
    $scope.$digest();
  }

  function deleteSelectedBlock() {
    if (!$scope.selectedBlock) return;
    var blockToDelete = $scope.selectedBlock;
    if ($scope.blocks.indexOf(blockToDelete) == 0) {
      selectNextBlock();
    } else {
      selectPreviousBlock();
    }
    $scope.blocks = _.reject($scope.blocks, function (block) { 
      return block == blockToDelete; 
    });
    syncHalfHourBlocks();
  }

  function syncHalfHourBlocks(opt) {
    $scope.blocks.sort(function (a, b) {
      return a.start - b.start;
    });

    var skipSave = opt && opt.skipSave;
    if (!skipSave) {
      saveBlocks();
    }

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
  }

  function scrollToBlock(block) {
    var blockElem = $('#' + $scope.getBlockId(block));
    var blockHeight = blockElem.height() * block.size;
    var scrollTop = null;
    var blockIsAboveWindow = blockElem.offset().top < $($window).scrollTop();
    var blockIsBelowWindow = blockElem.offset().top + blockHeight > $($window).scrollTop() + $window.innerHeight;

    if (blockIsAboveWindow) {
      scrollTop = blockElem.offset().top - 80;
    } else if (blockIsBelowWindow) {
      scrollTop = blockElem.offset().top - $window.innerHeight + 80 + blockHeight;
    } else {
      return;
    }

    angular.element('html, body').animate({
      scrollTop: scrollTop
    }, 100);
  }

  function updateSelectedBlock(newBlocks) {
    if ($scope.selectedBlock) {
      $scope.selectedBlock = _.find(newBlocks, function (block) {
        return block.name == $scope.selectedBlock.name &&
               block.time == $scope.selectedBlock.time;
      });
    } else {
      $scope.selectedBlock = newBlocks[0] || null;
    }
  }



}]);