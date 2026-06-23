import Ship from './ship'; 

export default function GameBoard() {
  const SIZE = 10;

  const board = Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(null));
  const ships = [];
  const missedAttacks = [];

  function isValidCoord(x, y) {
    return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
  }


  function placeShip(length, x, y, orientation = 'horizontal') {
    const cells = [];

    
    for (let i = 0; i < length; i++) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;

      if (!isValidCoord(cx, cy)) {
        throw new Error('Ship placement out of bounds');
      }
      if (board[cy][cx] !== null) {
        throw new Error('Ship overlaps another ship');
      }
      cells.push([cx, cy]);
    }

    const ship = Ship(length);
    cells.forEach(([cx, cy]) => {
      board[cy][cx] = ship;
    });
    ships.push(ship);
    return ship;
  }


  function receiveAttack(x, y) {
    if (!isValidCoord(x, y)) {
      throw new Error('Attack out of bounds');
    }

    const target = board[y][x];
    if (target === null) {
      missedAttacks.push([x, y]);
      return false; // missed
    }

    target.hit();
    return true; // hit
  }

  function getMissedAttacks() {
    return missedAttacks;
  }

  function allSunk() {
    return ships.every((ship) => ship.isSunk());
  }

  return {
    board,
    ships,
    placeShip,
    receiveAttack,
    getMissedAttacks,
    allSunk,
  };
}