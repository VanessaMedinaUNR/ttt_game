/**
 * Vanessa Medina
 * @file index.js
 * @description UI code for Tic-Tac-Toe with JSON state persistence via File System Access API.
 */

import { checkWinner, isDraw, getNextPlayer } from './gameLogic.js';

const cells = document.querySelectorAll(".cell");
const status = document.querySelector("#statusTxt");
const restartBtn = document.querySelector("#restartBtn");
const loadBtn = document.querySelector("#loadFileBtn");
const newBtn = document.querySelector("#newFileBtn");

newBtn.addEventListener("click", createNewGameFile);

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let lastWinner = null;
let fileHandle = null;

/**
 * Initializes the game and UI.
 */
function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    loadBtn.addEventListener("click", openGameFile);
    
    running = false;  // game starts stopped
    currentPlayer = "X";  // or null or blank, up to you
    status.textContent = "Press Start to begin.";
    restartBtn.textContent = "Start";
}
initializeGame();

/**
 * Prompt each player to guess a die roll (1-6).
 * Determine which player starts (closest guess).
 * Sets currentPlayer to "O" or "X" accordingly.
 */
function determineStartingPlayer() {
  let p1Guess = parseInt(prompt("Player 1, guess a number from 1 to 6:"), 10);
  let p2Guess = parseInt(prompt("Player 2, guess a number from 1 to 6:"), 10);

  if (
    isNaN(p1Guess) || p1Guess < 1 || p1Guess > 6 ||
    isNaN(p2Guess) || p2Guess < 1 || p2Guess > 6
  ) {
    alert("Invalid guesses. Defaulting Player 1 to start.");
    currentPlayer = "O";
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  alert(`Rolled a ${roll}!`);

  const diffP1 = Math.abs(roll - p1Guess);
  const diffP2 = Math.abs(roll - p2Guess);

  if (diffP1 < diffP2) {
    currentPlayer = "O";
    alert("Player 1 starts (O)!");
  } else if (diffP2 < diffP1) {
    currentPlayer = "X";
    alert("Player 2 starts (O)!");
  } else {
    currentPlayer = "O";
    alert("Tie! Player 1 starts (O)!");
  }
}

/**
 * Prompts the user to select a JSON file for game state.
 */
async function openGameFile() {
  [fileHandle] = await window.showOpenFilePicker({
    types: [{ description: "Tic-Tac-Toe JSON", accept: { "application/json": [".json"] } }]
  });
  const file = await fileHandle.getFile();
  const text = await file.text();
  const state = JSON.parse(text);
  loadGameState(state);
}

/**
 * Loads the game JSON state and updates UI.
 * @param {{ board: string[], currentPlayer: string, running: boolean }} state
 */
function loadGameState(state) {
  options = state.board;
  currentPlayer = state.currentPlayer;
  running = state.running;

  cells.forEach((cell, index) => {
    cell.textContent = options[index];
    cell.style.color = "black";
  });

  status.textContent = running ? `${currentPlayer}'s turn` : "Game Over";
}

/**
 * Saves the current game state to the file.
 */
async function saveGameState() {
  if (!fileHandle) return;
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify({
    board: options,
    currentPlayer,
    running
  }, null, 2));
  await writable.close();
}

/**
 * Handles clicks on cells: updates and re-evaluates.
 * @this {HTMLElement}
 */
function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");
  if (options[cellIndex] !== "" || !running) return;

  options[cellIndex] = currentPlayer;
  this.textContent = currentPlayer;
  this.style.color = "black";

  evaluateBoard();
  saveGameState();
}

/**
 * Evaluates the board and updates status/UI based on logic.
 */
function evaluateBoard() {
  const { winner, winningCombo } = checkWinner(options);
  if (winner) {
    status.textContent = `${winner} wins!`;
    highlightWinningCells(winningCombo);
    running = false;
    lastWinner = winner;
    restartBtn.textContent = "Start";
  } else if (isDraw(options)) {
    status.textContent = "Draw!";
    running = false;
    restartBtn.textContent = "Start";
  } else {
    currentPlayer = getNextPlayer(currentPlayer);
    status.textContent = `${currentPlayer}'s turn`;
    restartBtn.textContent = "Clear";
  }
}

/**
 * Highlights the winning cells in red.
 * @param {number[]} combo
 */
function highlightWinningCells(combo) {
  combo.forEach(i => cells[i].style.color = "red");
}

/**
 * Resets or starts the game based on current state.
 */
function restartGame() {
  if (running) {
    running = false;
    restartBtn.textContent = "Start";
    status.textContent = "Game stopped.";
  } else {
    options = Array(9).fill("");
    if (lastWinner) {
      currentPlayer = lastWinner;
    } else {
      determineStartingPlayer();
    }
    running = true;
    status.textContent = `${currentPlayer}'s turn`;
    restartBtn.textContent = "Clear";
    cells.forEach(cell => {
      cell.textContent = "";
      cell.style.color = "black";
    });
  }
  saveGameState();
}

/**
 * Prompts the user to create a new game state file.
 */
async function createNewGameFile() {
  fileHandle = await window.showSaveFilePicker({
    suggestedName: "tic-tac-toe.json",
    types: [
      {
        description: "JSON Game State",
        accept: { "application/json": [".json"] }
      }
    ]
  });

  options = Array(9).fill("");
  currentPlayer = "X";
  running = true;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.color = "black";
  });

  status.textContent = `${currentPlayer}'s turn`;
  restartBtn.textContent = "Clear";

  await saveGameState();
}
