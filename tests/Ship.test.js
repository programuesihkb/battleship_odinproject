import Ship from '../src/Ship';

describe('Ship', () => {
  test('creates a ship with given length and 0 hits', () => {
    const ship = Ship(3);
    expect(ship.getLength()).toBe(3);
    expect(ship.getHits()).toBe(0);
  });

  test('hit() increases hit count', () => {
    const ship = Ship(3);
    ship.hit();
    expect(ship.getHits()).toBe(1);
  });

  test('isSunk() returns false when hits < length', () => {
    const ship = Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test('isSunk() returns true when hits === length', () => {
    const ship = Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('isSunk() returns true when hits > length (defensive)', () => {
    const ship = Ship(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});