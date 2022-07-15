// create boartd
var origBoard;
// set var for user 
const user = 'X';
// var for ai 
const ai = 'O'; 

//  array to show winning combinations for board
// each combo will need to be checked after each turn 
const winCombos = [
    // hoirzontal
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // verticle
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // diagonal
    [0, 4, 8], [6, 4, 2]
]

//  select all elements in the html file that have a 'cell' class 
//  call start game once the game begins 
const cells = document.querySelectorAll('.cell');
startGame();

// function to start game 
function startGame() {
    // reset game to no style so box disapears 
    document.querySelector(".endgame").style.display = "none";
    // create array to hold each board space 
    origBoard = Array.from(Array(9).keys());
    // clear previous board 
    clearBoard();
}

// clear and call player move 
function clearBoard() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; 
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

// for the user 
function turnClick(square) {
    // make so can only place in empty sqaure 
    if (typeof origBoard[square.target.id] == 'number'){
        // place user move 
        turn(square.target.id, user); 
        // check for tie if not let ai take turn 
        if (!checkWin(origBoard, user) && !checkTie()) turn(bestSpot(), ai);
    }
}

// Takes the turn 
function turn(squareID, player) {
    origBoard[squareID] = player; 
    document.getElementById(squareID).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

// cehck if game is over and theres a winner
function checkWin(board, player) {
    // go throguh each element board array and initialize accumulator and return 
    let plays = board.reduce((a, e,  i) => 
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null; 
    // check player to see if player had played in all spots to have a win
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player}; 
            break;
        }
    }
    // if game not over, return null 
    return gameWon;
}

function gameOver(gameWon) {
    // put who the winner is 
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor 
         = gameWon.player == user ? "pink" : "purple"
    }
    // make it not able to click any more squares 
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == user ? "Yay! You won." : "Oh no, better luck next time."); 
}

// declare winner 
function declareWinner(player) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = player;
} 

// see which spots are currently empty
function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

// ai move 
function bestSpot() {
    return minimax(origBoard, ai).index;
}

// works till here 
function checkTie() {
    // if all squares are full and no one has one
    if (emptySquares().length == 0) {
        for(var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "pink";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Oh man! It's a tie");
        return true;
    }
    return false;
}
// follow
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, user)) {
		return {score: -10};
	} else if (checkWin(newBoard, ai)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == ai) {
			var result = minimax(newBoard, user);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, ai);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === ai) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}