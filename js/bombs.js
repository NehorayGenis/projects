"use strict";
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gMines = [];
const BOMB = "🧨";
var gCounter = 0;
var gUserPicks = false;
var userCellPicks = [];
var gUserPicksCounter = gLevel.MINES;
var gHintedCells = [];

// randomly places mines in the field while checking if its the first click and checking that no cell will comeout twice
function plantMines(board, locateCell) {
  gMines = [];
  if (gLevel.SIZE === 4) {
    gLevel.MINES = 2;
  } else if (gLevel.SIZE === 8) {
    gLevel.MINES = 12;
  } else {
    gLevel.MINES = 30;
  }
  var amountOfMines = gLevel.MINES;

  if (amountOfMines === 2) {
    gLifeCounter--;
  }
  while (userCellPicks.length > 0) {
    var elCell = userCellPicks.pop();
    var cell = gBoard[elCell.i][elCell.j];
    cell.isMine = true;
    gMines.push(elCell);
    gCounter++;
  }

  while (gCounter < amountOfMines) {
    var ranI = getRandomIntInt(0, board.length);
    var ranJ = getRandomIntInt(0, board.length);
    if (!board[ranI][ranJ].isMine && ranI !== locateCell.i && ranJ !== locateCell.j) {
      var bomb = {
        i: ranI,
        j: ranJ,
      };
      board[ranI][ranJ].isMine = true;
      gMines.push(bomb);
      gCounter++;
    }
  }

  setMinesNegsCount(board);
  // console.log(gMines);
}

// sets the mine's neighbor count
function setMinesNegsCount(board) {
  var counter = 0;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      counter = countNeighbors(i, j, board, BOMB);
      if (counter > 0 && board[i][j] !== BOMB) {
        board[i][j].minesAroundCount = counter;
      }
    }
  }
}
function renderCell2(cell, location) {
  gHintedCells.push(location);
  cell.isShown = true;
  updateOpenCells(cell);
  var value = cell.minesAroundCount;
  if (cell.isMine) {
    renderCell(location, BOMB);
    cell.isShown = false;
  } else if (value > 0) {
    renderCell(location, value);
    cell.isShown = false;
  } else {
    renderCell(location, EMPTY);
    cell.isShown = false;
  }
}
function revealNeighbors(cell, location) {
  var sentCell=gBoard[location.i][location.j]
  renderCell2(sentCell, location);
  copyMat(gBoard);
  for (var i = location.i - 1; i <= location.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (i === location.i && j === location.j) continue;
      if (j < 0 || j >= gBoard[i].length) continue;
      var cellLocation = {
        i: i,
        j: j,
      };
      if (gBoard[i][j].isShown) continue
      renderCell2(gBoard[i][j], cellLocation)
    }
  }
  setTimeout(function () {
    printMat(gBoard, ".board-container");
  }, 1000);

  gHintCounter--;
  updateCounter(gElHint,HINT,gHintCounter)
  gHintIsOn = false;
}
function updateCounter(elCounter,value,count){
  var valueStr = "";
  for (var i = 0; i < count; i++) {
    valueStr += value;
  }
  elCounter.innerText = valueStr;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//check the left click on each cell
function cellClicked(elCell, i, j) {
  bestTimeUpdate();
  if (!gGame.isOn) return;
  if (gHintIsOn && gHintCounter>0) {
    var location = {
      i: i,
      j: j,
    };
    revealNeighbors(elCell, location);
    return;
  }
  copyMat(gBoard);
  if (gUserPicks) {
    var cell = {
      i: i,
      j: j,
    };
    userCellPicks.push(cell);
    gUserPicksCounter--;
    if (gUserPicksCounter === 0) {
      gUserPicks = false;
      plantMines(gBoard, location);
    }
    return;
  }
  var cell = gBoard[i][j];
  var location = {
    i: i,
    j: j,
  };

  if (gFirstClick) {
    update_timer();
    plantMines(gBoard, location);
    gFirstClick = false;
  }
  if (cell.isShown) return;

  if (cell.isMarked) return;

  cell.isShown = true;
  updateOpenCells(cell);
  if (cell.isMine && gLifeCounter === 1) {
    renderCell(location, BOMB);
    music.play();
    gElLife.innerText = "0";
    checkGameOver(false);
  } else if (cell.isMine) {
    renderCell(location, BOMB);
    music.play();
    gLifeCounter--;
    gflagCounter++;
    updateCounter(gElLife,LIFE,gLifeCounter)
  } else if (cell.minesAroundCount > 0) {
    renderCell(location, cell.minesAroundCount);
  } else {
    renderCell(location, EMPTY);
    fullReveal(i, j)
  }
}

function userPicks() {
  gUserPicks = true;
}

function boom() {
  var countCell = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      countCell++;
      if (i + 1 === 7 || j + 1 === 7 || countCell % 7 === 0) {
        var location = {
          i: i,
          j: j,
        };
        var elCell = getCellId(location);
        gBoard[i][j].isMine = true;
      }
    }
  }
  printMat(gBoard, ".board-container");
}

function getCellId(location) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  return elCell;
}
