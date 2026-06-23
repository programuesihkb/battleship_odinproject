// 2. DOM Module (or displayController.js)
// This handles all visual updates and event wiring. It:

// Renders the boards (ship positions for your board, attack results for opponent's)
// Listens for clicks and calls methods on the game controller
// Updates the DOM when the controller tells it to (hit/miss, turn, win)
// Manages UI state (disable buttons during CPU turn, etc.)

// It doesn't know the game rules. It only knows "when X happens in the game,
//  render Y in the DOM" and "when user clicks Z, tell the controller."

import GameController from './gameController';

const gameController = GameController();


function onShipPlaced(x, y, length, orientation) {
  gameController.getHumanPlayer().gameboard.placeShip(length, x, y, orientation);

  // Update the DOM to show the ship placement
  displayModule.showShipPlacement(x, y, length, orientation);
  
}

function onGameStart() {
  // Auto-place computer ships
  gameController.getComputerPlayer().gameboard.placeShip(4, 0, 0, 'horizontal');
  gameController.getComputerPlayer().gameboard.placeShip(3, 5, 5, 'vertical');
  gameController.getComputerPlayer().gameboard.placeShip(2, 9, 9, 'horizontal');
  gameController.getComputerPlayer().gameboard.placeShip(1, 0, 9, 'vertical');


  gameController.startGame();
}

// During gameplay
function onCellClicked(x, y) {
  const result = gameController.playerAttack(x, y);
  
  if (result.hit) {
    displayModule.showHit(x, y); 
  } else {
    displayModule.showMiss(x, y);
  }

  if (result.gameOver) {
    displayModule.showWinScreen(result.winner);
  } else {
    // After a short delay, trigger computer's move
    setTimeout(() => {
      const computerResult = gameController.computerAttack();
      displayModule.showComputerAttack(computerResult.x, computerResult.y, computerResult.hit);
      if (computerResult.gameOver) {
        displayModule.showWinScreen(computerResult.winner);
      }
    }, 1000);
  }
}