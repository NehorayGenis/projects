
function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < mat[0].length; j++) {
      cell = BLOCKED;
      var className = `cell cell-${i}-${j}`;
      strHTML += `<td class="${className}" oncontextmenu="cellMarked(this,${i}, ${j});return false; " onclick="cellClicked(this, ${i}, ${j}) "> ${cell}  </td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function checkBoard(rows, cols, value, board) {
  var valueLocate = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (board[i][j] === value) {
        valueLocate.push ( {
          i: i,
          j: j,
        })
      }
    }
  }
  return valueLocate;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function countNeighbors(cellI, cellJ, mat, value) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;

      if (mat[i][j].isMine) neighborsCount++;
    }
  }
  return neighborsCount;
}
