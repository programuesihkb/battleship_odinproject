import Player from '../Player.js';
import GameBoard from '../Gameboard.js';

export default function GameController() {

  const humanPlayer = Player('human');
  const computerPlayer = Player('computer');

  let currentTurn = 'human';
  let gameActive = false;
  const computerAttackedCells = new Set();

  function getHumanPlayer() {
    return humanPlayer;
  }

  function getComputerPlayer() {
    return computerPlayer;
  }

  function getCurrentTurn() {
    return currentTurn;
  }

  function isGameActive() {
    return gameActive;
  }

  // Called by displayController after both players have placed ships
  function startGame() {
    gameActive = true;
    currentTurn = 'human';
  }

  // Called by displayController when human clicks to attack
  function playerAttack(x, y) {
    if (!gameActive) return false;
    if (currentTurn !== 'human') return false;

    const { hit, ship } = computerPlayer.gameboard.receiveAttack(x, y);
    const sunk = ship ? ship.isSunk() : false;

    if (computerPlayer.gameboard.allSunk()) {
      gameActive = false;
      return { hit, sunk, ship, shipName: ship?.getName(), gameOver: true, winner: 'human' };
    }

    currentTurn = 'computer';
    return { hit, sunk, ship, shipName: ship?.getName(), gameOver: false };
}

  function computerAttack() {
    if (!gameActive) return false;
    if (currentTurn !== 'computer') return false;

    const available = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (!computerAttackedCells.has(`${x},${y}`)) available.push([x, y]);
      }
    }
    if (available.length === 0) return false;

    const [x, y] = available[Math.floor(Math.random() * available.length)];
    computerAttackedCells.add(`${x},${y}`);

    const { hit, ship } = humanPlayer.gameboard.receiveAttack(x, y);
    const sunk = ship ? ship.isSunk() : false;

    if (humanPlayer.gameboard.allSunk()) {
      gameActive = false;
      return { hit, x, y, sunk, ship, shipName: ship?.getName(), gameOver: true, winner: 'computer' };
    }

    currentTurn = 'human';
    return { hit, x, y, sunk, ship, shipName: ship?.getName(), gameOver: false };
      }

  return {
    getHumanPlayer,
    getComputerPlayer,
    getCurrentTurn,
    isGameActive,
    startGame,
    playerAttack,
    computerAttack,
  };
}