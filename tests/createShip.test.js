import createShip from '../src/createShip';

describe('createShip', () => {
  test('creates a ship with given length and 0 hits', () => {
    const ship = createShip(3);
    expect(ship.getLength()).toBe(3);
    expect(ship.getHits()).toBe(0);
  });

  test('hit() increases hit count', () => {
    const ship = createShip(3);
    ship.hit();
    expect(ship.getHits()).toBe(1);
  });

  test('isSunk() returns false when hits < length', () => {
    const ship = createShip(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test('isSunk() returns true when hits === length', () => {
    const ship = createShip(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('isSunk() returns true when hits > length (defensive)', () => {
    const ship = createShip(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});