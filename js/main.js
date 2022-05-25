"use strict";
var gBoard;
var bombLocations = [];
var bombCounter = 9;
var flagCounter=0;
const music = new Audio('sound/electronic-impact-hard-10018.mp3');
var gFirstClick=true;


var gLevel = {
    SIZE: 4,
    MINES: 2
   };

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
   }
   var gResetEmoji=document.querySelector('.emoji')



function init() {
    gResetEmoji.innerText='😊'
    gGame.isOn= true;
  gBoard = buildBoard();

  setMinesNegsCount(gBoard);

  console.table(gBoard);
  printMat(gBoard, ".board-container");
}

function buildBoard(size = 4) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = createCell();
      
    }
  }
  plantMines(board);
  console.table(board);
  return board;
}
function checkGameOver(win) {
    gGame.isOn=false;
    win ? gResetEmoji.innerText='😆':gResetEmoji.innerText='😒';
   
    gResetEmoji.style.display='inline-block'
}

function checkFlags(){
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if(flagCounter>=gLevel.MINES) {
            
            checkGameOver(true);
            return
        }else{return}
        }
    }
}

function createCell() {
  var cell = {
    minesAroundCount: 0,
    isShown: true,
    isMine: false,
    isMarked: false,
  };

  return cell;
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
  var cell = gBoard[i][j];
  if(!cell.isMarked){
  var location = {
    i: i,
    j: j,
  };
  cell.isMarked = true;
  renderCell(location, FLAG);
  if (cell.isMarked && cell.isMine) {
      flagCounter++;
  }
  checkFlags();
}else{
    var location = {
        i: i,
        j: j,
    };
    cell.isMarked = false;
    renderCell(location, BLOCKED);  
    flagCounter--;    
}
}