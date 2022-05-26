"use strict";
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gMines = [];
const BOMB = "🧨";
var gCounter = 0;
var gUserPicks = false;
var userCellPicks=[];
var gUserPicksCounter=gLevel.MINES;


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
  while (userCellPicks.length>0) {
    var elCell=userCellPicks.pop()
    var cell=gBoard[elCell.i][elCell.j]
    cell.isMine = true;
    console.log(cell);
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

//check the left click on each cell
function cellClicked(elCell, i, j) {
  bestTimeUpdate();
  if (!gGame.isOn) return;
  copyMat(gBoard);
  if (gUserPicks) {
    var cell={
      i:i,
      j:j
    }
    userCellPicks.push(cell)
    gUserPicksCounter--;
    if (gUserPicksCounter===0) {
      gUserPicks=false;
      plantMines(gBoard, location);
    }
    return
  }
  var cell = gBoard[i][j];
  var location = {
    i: i,
    j: j,
  };
  
  if (gFirstClick ) {

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
    var heartStr = "";
    for (var i = 0; i < gLifeCounter; i++) {
      heartStr += LIFE;
    }
    gElLife.innerText = heartStr;
  } else if (cell.minesAroundCount > 0) {
    renderCell(location, cell.minesAroundCount);
  } else {
    revealNeighbor(i, j, gBoard);
    renderCell(location, EMPTY);
  }
}

function userPicks() {
  gUserPicks = true;

}

function boom() {
  var countCell=0;
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

// function trackCells(){
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard.length; j++) {
//       var cell=gBoard[i][j]
//       if(cell.isMine===true){
//         gBombLocations.push(cell)
//       } 
//     }
//   }
// }