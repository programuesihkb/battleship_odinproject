import GameBoard from '../src/Gameboard'; 

describe('GameBoard', () => {
  test('places a ship and adds it to ships list', () => {
    const gb = GameBoard();
    gb.placeShip(3, 0, 0, 'horizontal');
    expect(gb.ships.length).toBe(1);
  });

  test('receiveAttack hits a ship at occupied coordinate', () => {
    const gb = GameBoard();
    gb.placeShip(3, 0, 0, 'horizontal');
    expect(gb.receiveAttack(0, 0)).toBe(true);
    expect(gb.ships[0].getHits()).toBe(1);
  });

  test('receiveAttack records a miss at empty coordinate', () => {
    const gb = GameBoard();
    gb.placeShip(3, 0, 0, 'horizontal');
    expect(gb.receiveAttack(5, 5)).toBe(false);
    expect(gb.getMissedAttacks()).toEqual([[5, 5]]);
  });

  test('allSunk returns false when ships remain afloat', () => {
    const gb = GameBoard();
    gb.placeShip(2, 0, 0, 'horizontal');
    gb.receiveAttack(0, 0);
    expect(gb.allSunk()).toBe(false);
  });

  test('allSunk returns true when every ship is sunk', () => {
    const gb = GameBoard();
    gb.placeShip(2, 0, 0, 'horizontal');
    gb.receiveAttack(0, 0);
    gb.receiveAttack(1, 0);
    expect(gb.allSunk()).toBe(true);
  });

  test('placeShip throws when out of bounds', () => {
    const gb = GameBoard();
    expect(() => gb.placeShip(3, 9, 0, 'horizontal')).toThrow();
  });

  test('placeShip throws when ships overlap', () => {
    const gb = GameBoard();
    gb.placeShip(3, 0, 0, 'horizontal');
    expect(() => gb.placeShip(3, 0, 0, 'vertical')).toThrow();
  });
});