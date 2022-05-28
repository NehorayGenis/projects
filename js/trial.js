function fullReveal (startI,startJ){
    var cellI=startI
    var cellJ=startJ
    var cell=gBoard[cellI][cellJ]

    if(cell.minesAroundCount===0&&!cell.isMine){
        for (var i = cellI - 1; i <= cellI + 1; i++) {
          if (i < 0 || i >= gBoard.length) continue;
          for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            cell=gBoard[i][j]
            if (cell.isMine || cell.isShown|| cell.isMarked) continue
            cell.isShown=true;
            if(cell.minesAroundCount===0 && !cell.isMine) fullReveal (i,j)
          }
        }
    }else{
        if (cell.isShown) {
            return
        }else if(cell.minesAroundCount >0 && !cell.isMine) cell.isShown=true
    }
    printMat(gBoard, ".board-container");
}