"use strict";
const LIFE = "❤";
const FLAG = "🚩";
const EMPTY = "";
const BLOCKED = "🔲";
const HINT = "💡";
const SAFE = "🔐";

var gPrevBoards = [];
var gBoard;
var gFirstClick = true;
var gLifeCounter = 3;
var gHintCounter = 3;
var gflagCounter = 0;
var gSafeCounter = 3;
var gOpenedCells = [];
var gTime = 0;

var gBestTime = localStorage.getItem("bestTimes");
var gSize=4;

const music = new Audio("sound/electronic-impact-hard-10018.mp3");
var gElLife = document.querySelector(".lifes");
var gElEmoji = document.querySelector(".emoji");
var gElHint = document.querySelector(".hints");
var gElSafe = document.querySelector(".safe");
var timerInterval;
var elTimer = document.querySelector(".timer");


var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

// starting the game

function init(size = 4) {
  gFirstClick = true;

  bestTimeUpdate();
  gCounter = 0;
  clearInterval(timerInterval);
  elTimer.innerText = "xx:xx:xx";
  gLifeCounter = 3;
  gflagCounter = 0;
  gElLife.innerText = "❤❤❤";
  gElEmoji.innerText = "😊";
  gElHint.innerText = "💡💡💡";
  gElSafe.innerText = "safe click";
  gSafeCounter = 3;
  gGame.isOn = true;
  gBoard = buildBoard();
  printMat(gBoard, ".board-container");
}

// standart build board function
function buildBoard() {
  var size = gLevel.SIZE;
  console.log(size);
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = createCell();
    }
  }
  return board;
}

//function that ends the game and changes according to win or lose

function checkGameOver(win) {
  clearInterval(timerInterval);
  // localStorage.setItem('bestTimes', 200000)
  if (win) {
    if (!gBestTime) {
      localStorage.setItem("bestTimes", gTime);
      gBestTime=gTime;
      bestTimeUpdate();
    }else if (gTime+'' < gBestTime) {
      bestTimeUpdate();
      localStorage.setItem("bestTimes", gTime);
    }
    
  }
  copyMat(gBoard);
  gGame.isOn = false;
  win ? (gElEmoji.innerText = "😆") : (gElEmoji.innerText = "😒");

  gElEmoji.style.display = "inline-block";
}

//checks if the user marked all the bombs
function checkFlags() {
  copyMat(gBoard);
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gflagCounter === gLevel.MINES) {
        checkGameOver(true);
        return;
      } else {
        return;
      }
    }
  }
}

//init each cell for board

function createCell() {
  var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
  };

  return cell;
}

// tracks and marks which cell got a flag on it
function cellMarked(elCell, i, j) {
  if (!gGame.isOn) return;
  if (gflagCounter===gLevel.MINES) return

  copyMat(gBoard);
  var cell = gBoard[i][j];
  if (!cell.isMine&&cell.isMarked) {
    gflagCounter++
  }
  if (!cell.isMarked) {
    var location = {
      i: i,
      j: j,
    };
    cell.isMarked = true;
    renderCell(location, FLAG);
    if (cell.isMarked && cell.isMine) {
      gflagCounter++;
    }
    checkFlags();
  } else {
    var location = {
      i: i,
      j: j,
    };
    cell.isMarked = false;
    renderCell(location, BLOCKED);
    gflagCounter--;
  }
}

function revealNeighbor(cellI, cellJ, mat) {
  copyMat(gBoard);
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      var location = {
        i: i,
        j: j,
      };
      mat[i][j].isShown = true;
      updateOpenCells(mat[i][j]);
      var value = mat[i][j].minesAroundCount;
      if (value > 0) {
        renderCell(location, value);
      } else {
        renderCell(location, EMPTY);
      }
    }
  }
}

function setMineAmount(size) {
  gLevel.SIZE = size;
  
  if (gLevel.SIZE === 4) {
    gLevel.SIZE = size;
    gElLife.innerText='❤❤'
    gLevel.MINES = 2;
    gUserPicksCounter=gLevel.MINES
    init(4);
    
    
  } else if (gLevel.SIZE === 8) {
    gLevel.SIZE = size;
    gLevel.MINES = 12;
    gUserPicksCounter=gLevel.MINES
    init(8);
  } else {
    gLevel.SIZE = size;
    gLevel.MINES = 30;
    gUserPicksCounter=gLevel.MINES
    init(12);
  }
}

function revealHint() {
  var safeCells=[];
  if (!gGame.isOn) return;
  if (gFirstClick) return;
  if (gHintCounter === 0) return;

  var ranI = getRandomIntInt(0, gBoard.length - 1);
  var ranIdx = getRandomIntInt(0, gBoard.length - 1);
  var ranJ = getRandomIntInt(0, gBoard.length - 1);
  var location = {
    i: ranI,
    j: ranJ,
  };
  // var ranCell=gOpenedCells[ranIdx]
  var timeout=0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if(!gBoard[i][j].isShown){
        safeCells.push({
          innerCell:gBoard[i][j],
          i:i,
          j:j
        })
      }     
    }
  }
  var ranI = getRandomIntInt(0, safeCells.length - 1);
  var cell=safeCells.splice(ranI,1)
  var location = {
    i: cell[0].i,
    j:cell[0].j
  };
  cell=cell[0].innerCell;
  var revealInerval = setInterval(function () {
    if (cell.isMine) {
      renderCell(location, BOMB);
    } else if (cell.minesAroundCount > 0) {
      renderCell(location, cell.minesAroundCount);
    } else {
      renderCell(location, EMPTY);
    }
    setTimeout(function () {
      renderCell(location, BLOCKED);
    }, 250);
  }, 500);
  setTimeout(function () {
    clearInterval(revealInerval);
  }, 2000);
  gHintCounter--;
  var hintStr = "";
  for (var i = 0; i < gHintCounter; i++) {
    hintStr += HINT;
  }
  if (gHintCounter === 0) hintStr = "no more hints";
  gElHint.innerText = hintStr;
}

function safeCell() {
  var safeCells=[]
  if (gFirstClick) return;
  if (!gGame.isOn) return;
  if (gSafeCounter === 0) return;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if(!gBoard[i][j].isShown &&!gBoard[i][j].isMine){
        safeCells.push({
          innerCell:gBoard[i][j],
          i:i,
          j:j
        })
      }     
    }
  }
  var ranI = getRandomIntInt(0, safeCells.length - 1);
  var cell=safeCells.splice(ranI,1)
  var location = {
    i: cell[0].i,
    j:cell[0].j
  };
  cell=cell[0].innerCell;

  if (cell.minesAroundCount > 0) {
    renderCell(location, cell.minesAroundCount);
  } else {
    renderCell(location, EMPTY);
  }
  setTimeout(function () {
    renderCell(location, BLOCKED);
  }, 3000);
  gSafeCounter--;
  var safeStr = "";
  for (var i = 0; i < gSafeCounter; i++) {
    safeStr += SAFE;
  }
  if (gSafeCounter === 0) safeStr = "no more safe clicks";
  gElSafe.innerText = safeStr;
}

function updateOpenCells(cell) {
  gOpenedCells.push(cell);
}

function copyMat(board) {
  var prevMat = [];
  prevMat = board.slice();
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
       prevMat[i][j]=Object.assign({}, board[i][j]);

      }
    }
  gPrevBoards.push(prevMat);
}
// maybe its shallows copy instead of deep???
//confired its a clone and still dosent workkkkkkkkk

function trial(){
  var trial=[[1],[2]]
  printMat(trial, ".board-container");
}
function undo() {
  var prevMat = gPrevBoards.pop();
  printMat(prevMat, ".board-container");
}

function update_timer() {
  clearInterval(timerInterval);
  var ms = 0;
  var seconds = 0;
  var mins = 0;
  timerInterval = setInterval(function () {
    gTime += 15;
    if (ms > 1000) {
      seconds++;
      ms = 0;
    }
    if (seconds > 60) {
      mins++;
      seconds = 0;
      ms = 0;
    }
    ms += 15;
    elTimer.innerText = mins+ ":" +seconds + ":" + ms;
  }, 15);
}

function bestTimeUpdate() {
  var elRecord = document.querySelector(".best-time");
  gBestTime
  elRecord.innerText = gBestTime/1000+' S';
}

/*BUGS and todo:
bonus:expanding(hard?),Manually positioned mines(????),Undo(???)
improve:best time(v)
UI kinsa sucks
*/
