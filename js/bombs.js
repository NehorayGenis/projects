"use strict";
var gMines = [];
const BOMB = "🧨";
var prevBoards = [];
const FLAG = "🚩";
var flagCounter = 0;

function plantMines(board) {
  gMines = [];
  if (gLevel.SIZE) {
    gLevel.MINES=4
  }
  var counter=0;
  var ranI = getRandomIntInt(0, board.length);
  var ranJ = getRandomIntInt(0, board.length);
  var bomb = {
      i: ranI,
      j: ranJ,   
  };
  gMines.push(bomb);
  board[ranI][ranJ].isMine = true;
  while (counter<gLevel.SIZE-1) {
      ranI = getRandomIntInt(0, board.length);
      ranJ = getRandomIntInt(0, board.length);
      if(!board[ranI][ranJ].isMine) {
        bomb = {
            i: ranI,
            j: ranJ,   
        };
          board[ranI][ranJ].isMine = true;
          gMines.push(bomb);

      counter++;}
  }
  console.log(gMines);

}

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
function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j];
    var location = {
        i: i,
        j: j,
    };
    if (gFirstClick) {
        if (cell.isMine) {
            for (var i = 0; i < gMines.length; i++) {
                if (gMines[i]===cell) {
                    plantMines(board);
                    gMines.splice(i,1);
                    cell.isMine=false;
                }
            };
        }
        gFirstClick=false
    }
  console.log(cell);
  if (cell.isMarked) return
  if (cell.isMine) {
    renderCell(location, BOMB);
    music.play();
    checkGameOver(false)
  } else if (cell.minesAroundCount > 0) {
    renderCell(location, cell.minesAroundCount);
  } else {
    renderCell(location, EMPTY);
  }
}

