"use strict";
const LIFE = "❤";
const FLAG = "🚩";
const EMPTY = "";
const BLOCKED = "🔲";
const HINT = "💡";
const SAFE="🔐"

var gBoard;
var bombLocations = [];
var gFirstClick = true;
var gLifeCounter = 3;
var gHintCounter = 3;
var gflagCounter = 0;
var gSafeCounter=3;
var gOpenedCells=[];

const music = new Audio("sound/electronic-impact-hard-10018.mp3");
var gLifeDisplay = document.querySelector(".lifes");
var gResetEmoji = document.querySelector(".emoji");
var gHintDisplay = document.querySelector(".hints");
var gSafeDisplay=document.querySelector(".safe");
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

// starting the game

function init(size=4) {
  gFirstClick = true;
  
  gLifeCounter = 3;
  gflagCounter = 0;
  gLifeDisplay.innerText = "❤❤❤";
  gResetEmoji.innerText = "😊";
  gHintDisplay.innerText='💡💡💡'
  gSafeDisplay.innerText='safe click'
  gSafeCounter = 3;
  gSafeCounter=3
  gGame.isOn = true;
  gBoard = buildBoard();

  console.table(gBoard);
  printMat(gBoard, ".board-container");
}

// standart build board function
function buildBoard() {
 var size=gLevel.SIZE
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = createCell();
    }
  }
  console.table(board);
  return board;
}

//function that ends the game and changes according to win or lose

function checkGameOver(win) {
  gGame.isOn = false;
  win ? (gResetEmoji.innerText = "😆") : (gResetEmoji.innerText = "😒");

  gResetEmoji.style.display = "inline-block";
}

//checks if the user marked all the bombs
function checkFlags() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gflagCounter >= gLevel.MINES) {
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
  var cell = gBoard[i][j];
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
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      var location = {
        i: i,
        j: j,
      };
      mat[i][j].isShown=true;
      updateOpenCells(mat[i][j])
      var value = mat[i][j].minesAroundCount;
      if (value > 0) {
        renderCell(location, value);
      } else {
        renderCell(location, EMPTY);
      }
    }
  }
}

function setMineAmount(size){
  if (size===4) {
    gLevel.SIZE=4
    gLevel.MINES=2
    init();
  }else if (size===8) {
    gLevel.SIZE=8
    gLevel.MINES=12
    init();
    
  }else {
    gLevel.SIZE=12
    gLevel.MINES=30
    init();
    
    
  }
}
function revealHint() {
  if (gFirstClick) return;
  if (gHintCounter === 0) return;

  var ranI = getRandomIntInt(0, gBoard.length-1);
  var ranIdx = getRandomIntInt(0, gBoard.length-1);
  var ranJ = getRandomIntInt(0, gBoard.length-1);
  var location = {
    i: ranI,
    j: ranJ,
  };
  console.log(gBoard[ranI][ranJ]);
  // var ranCell=gOpenedCells[ranIdx]
  while (gBoard[ranI][ranJ].isShown) {
    ranI = getRandomIntInt(0, gBoard.length-1);
    ranJ = getRandomIntInt(0, gBoard.length-1);
    location = {
      i: ranI,
      j: ranJ,
    };
  }
  var revealInerval = setInterval(function () {
    if (gBoard[ranI][ranJ].isMine) {
      renderCell(location, BOMB);
    } else if (gBoard[ranI][ranJ].minesAroundCount > 0) {
      renderCell(location, gBoard[ranI][ranJ].minesAroundCount);
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
  if (gHintCounter===0) hintStr='no more hints'
  gHintDisplay.innerText=hintStr;

}

function safeCell(){
  if (gFirstClick) return;
  if (gSafeCounter === 0) return;
  var ranI = getRandomIntInt(0, gBoard.length-1);
  var ranJ = getRandomIntInt(0, gBoard.length-1);
  var cell=gBoard[ranI][ranJ]
  var location={
    i:ranI,
    j:ranJ
  }
  console.log(cell);
  while (gBoard[ranI][ranJ].isShown && gBoard[ranI][ranJ].isMine) {
    cell=gBoard[ranI][ranJ]
    console.log(cell.isShown);
     ranI = getRandomIntInt(0, gBoard.length-1);
     ranJ = getRandomIntInt(0, gBoard.length-1);
     var location={
      i:ranI,
      j:ranJ
    }
  }
  if (cell.minesAroundCount > 0) {
    renderCell(location, cell.minesAroundCount);
  } else {
    renderCell(location, EMPTY);
  }
  setTimeout(function(){
    renderCell(location, BLOCKED);
  },3000)
  gSafeCounter--;
  var safeStr = "";
  for (var i = 0; i < gSafeCounter; i++) {
    safeStr += SAFE;
  }
  if (gSafeCounter===0) safeStr='no more safe clicks'
  gSafeDisplay.innerText=safeStr;
}

function updateOpenCells(cell){
  gOpenedCells.push(cell);
}

/*BUGS
reveal hint dosent work properly,will show already hinted cells
UI kinsa sucks
*/