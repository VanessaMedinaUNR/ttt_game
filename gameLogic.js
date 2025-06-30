/**
 * Vanessa Medina
 * @file gameLogic.js
 * @description Handles UI and DOM interactions for Tic-Tac-Toe.
 */


/**
 * Check for a win in the current board state.
 * @param {string[]} board - Array of 9 strings ("X", "O", or "")
 * @returns {{ winner: string|null, winningCombo: number[]|null }}
 */

export function checkWinner(board) {
    const winConditions = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], winningCombo: condition };
        }
    }

    return { winner: null, winningCombo: null };
}

/**
 * Determine if the board is full with no winner.
 * @param {string[]} board
 * @returns {boolean}
 */

export function isDraw(board) {
    return board.every(cell => cell !== "");
}

/**
 * Switch to the next player.
 * @param {string} currentPlayer - "X" or "O"
 * @returns {string} - "O" if X, "X" if O
 */

export function getNextPlayer(currentPlayer) {
    return currentPlayer === "X" ? "O" : "X";
}
