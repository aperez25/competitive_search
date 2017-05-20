/*
The function "makeMove" is already written for you.
You do not need to modify it, but you should read it.

It will choose moves intelligently once minimax,
which it invokes, evaluates different board-states
correctly.  It is the ONLY function invoked when
you play against the computer after starting up
the server.

Input: A state object, representing the Connect 4 board.

Output: Returns an integer indicating the column
where the piece will be dropped.
*/

const makeMove = (state) => {

	// Find whose move it is; 'x' or 'o'
	const playerMoving = state.nextMovePlayer;

	// state.legalMoves returns an array of integer values,
	// which indicate the locations (0 through 6)
	// where one can currently legally drop a piece.
	const allLegalMoves = state.legalMoves();

	// To get a successor state following a move,
	// just call state.move(someMove).  This returns
	// the board state after that move has been made.
	// It autmatically switches the player whose
	// move it is, adds the piece to the board, etc.
	//
	const newState = state.move(allLegalMoves[0]);

	// The following is the guts of the make-move function.
	// It evaluates each possible successor state with
	// minimax, and performs the move that leads to the best
	// state.
	const depth = 4;

	let bestMoveIndex = null;
	let bestMoveValue = null;
	allLegalMoves.forEach( (legalMove, i) => {

		const potentialState = state.move(legalMove)

		// Sets the playerMoving to be the maximizer.
		// This variable gets handed down in the recursive
		// minimax call unchanged.

		const stateValue = minimax(potentialState, depth, playerMoving);
		// const stateValue = minimaxAlphaBetaWrapper (potentialState, depth, playerMoving)

		if (stateValue > bestMoveValue || bestMoveValue === null){
			bestMoveIndex = i;
			bestMoveValue = stateValue;
		}

	});
	return allLegalMoves[bestMoveIndex]

}

const heuristic = (state, maximizingPlayer) => {
  const minimizingPlayer = (maximizingPlayer === 'x') ? 'o' : 'x';
	// return a score with weights based on line length
	const playerScore = player =>
	// array of possible line lengths
		[2, 3, 4].reduce((acc, lineLength) =>
			acc + (state.numLines(lineLength, player) * lineLength), 0);
	return playerScore(maximizingPlayer) - playerScore(minimizingPlayer);
}

const minimax = (state, depth, maximizingPlayer) => {
	let possibleStates = state.nextStates(),
		currentPlayer = state.nextMovePlayer;
	// check for base case
	if (depth === 0 || !possibleStates.length) return heuristic(state, maximizingPlayer);
	 else {
		// find the next possible moves
		let possibleStatevalues = possibleStates.map(nextState => minimax(nextState, depth - 1, maximizingPlayer))
		// check the currentPlayer and find score accordingly
			if (maximizingPlayer === currentPlayer) return Math.max.apply(null, possibleStatevalues);
			else return Math.min.apply(null, possibleStatevalues);
	}
}

/* minimaxAlphaBetaWrapper is a pre-written function, but it will not work
   unless you fill in minimaxAB within it.
   It is called with the same values with which minimax itself is called.*/
const minimaxAlphaBetaWrapper = (state, depth, maximizingPlayer) => {
	let possibleStates = state.nextStates(),
	currentPlayer = state.nextMovePlayer;
    /*
    Alpha is the BEST value currently guaranteed to the maximizing player, if they play well, no matter what the minimizing player does; this is why it is a very low number to start with.

    Beta is the BEST value currently guaranteed to the minimizing player, if they play well, no matter what the maximizing player does; this is why it is a very high value to start with.
	*/
	const minimaxAB = (state, depth, alpha, beta) => {

		if (depth === 0 || !possibleStates.length) return heuristic(state, maximizingPlayer);
		else {
			if (maximizingPlayer === currentPlayer) {
				let bestMoveSoFar = -100000;
				for (var i = 0; i < possibleStates.length; i++) {
					let nextState = possibleStates[i];
					let valueOfState = minimaxAB(nextState, depth - 1, alpha, beta);
					alpha = Math.max(alpha, valueOfState);
					bestMoveSoFar = Math.max(bestMoveSoFar, valueOfState);
						if (alpha > beta) {
							return bestMoveSoFar;
						}
				}
			return bestMoveSoFar;
		} else {
				let bestMoveSoFar = 100000;
				for (var i = 0; i < possibleStates.length; i++) {
					let nextState = possibleStates[i];
					let valueOfState = minimaxAB(nextState, depth - 1, alpha, beta);
					beta = Math.min(beta, valueOfState);
					bestMoveSoFar = Math.min(bestMoveSoFar, valueOfState)
						if (alpha > beta) {
							return bestMoveSoFar;
						}
				}
			return bestMoveSoFar;
		}
	}
	}
	return minimaxAB(state, depth, alpha, beta);
}

module.exports = { makeMove, minimax, heuristic };
