"use strict";
var gMines = [];
const BOMB = "🧨";
var prevBoards = [];

// randomly places mines in the field while checking if its the first click and checking that no cell will comeout twice
function plantMines(board, locateCell) {
  gMines = [];

  var counter = 0;
  var amountOfMines = gLevel.MINES ;
  var ranI = getRandomIntInt(0, board.length);
  var ranJ = getRandomIntInt(0, board.length);
  while (counter < amountOfMines) {
    ranI = getRandomIntInt(0, board.length);
    ranJ = getRandomIntInt(0, board.length);
    if (!board[ranI][ranJ].isMine &&ranI!==locateCell.i&&ranJ!==locateCell.j) {
      var bomb = {
        i: ranI,
        j: ranJ,
      };
      board[ranI][ranJ].isMine = true;
      gMines.push(bomb);
      counter++;
    }
  }

  setMinesNegsCount(gBoard);
  console.log(gMines);
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

//check the left click on each cell
function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return;

  var cell = gBoard[i][j];
  var location = {
    i: i,
    j: j,
  };

  if (gFirstClick) {
    // setMineAmount(size);
    plantMines(gBoard, location);
    gFirstClick = false;
  }

  if (cell.isMarked) return;
  cell.isShown=true;
  updateOpenCells(cell)
  if (cell.isMine && gLifeCounter === 1) {
    renderCell(location, BOMB);
    music.play();
    gLifeDisplay.innerText = "0";
    checkGameOver(false);
  } else if (cell.isMine) {
    renderCell(location, BOMB);
    music.play();
    gLifeCounter--;
    gflagCounter++;
    var heartStr = "";
    for (var i = 0; i < gLifeCounter; i++) {
      heartStr += LIFE;
    }
    gLifeDisplay.innerText = heartStr;

  } else if (cell.minesAroundCount > 0) {
    renderCell(location, cell.minesAroundCount);
  } else {
    revealNeighbor(i,j,gBoard)
    renderCell(location, EMPTY);
  }
}
