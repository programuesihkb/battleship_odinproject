
import Player from '../Player';
import GameBoard from '../Gameboard'; 

export default function GameController() {

  const humanPlayer = Player('human');
  const computerPlayer = Player('computer');
  
  let currentTurn = 'human';
  let gameActive = false; 

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

    const hit = computerPlayer.gameboard.receiveAttack(x, y);
    
    if (computerPlayer.gameboard.allSunk()) {
      gameActive = false;
      return { hit, gameOver: true, winner: 'human' };
    }

    // Switch turn to computer
    currentTurn = 'computer';
    return { hit, gameOver: false };
  }

  // Called by displayController (or automatically after a delay)
  function computerAttack() {
    if (!gameActive) return false;
    if (currentTurn !== 'computer') return false;

    // For now, random move. Later some AI logic here.
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    const hit = humanPlayer.gameboard.receiveAttack(x, y);

    if (humanPlayer.gameboard.allSunk()) {
      gameActive = false;
      return { hit, x, y, gameOver: true, winner: 'computer' };
    }

    currentTurn = 'human';
    return { hit, x, y, gameOver: false };
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