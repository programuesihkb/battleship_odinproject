import Player from '../src/Player';

describe('Player', () => {
  test('creates a human player by default', () => {
    const player = Player();
    expect(player.getType()).toBe('human');
  });

  test('creates a computer player when specified', () => {
    const player = Player('computer');
    expect(player.getType()).toBe('computer');
  });

  test('throws on invalid player type', () => {
    expect(() => Player('alien')).toThrow();
  });

  test('player has its own gameboard', () => {
    const player = Player('human');
    expect(player.gameboard).toBeDefined();
    expect(player.gameboard.ships).toEqual([]);
  });

  test('two players have separate, independent gameboards', () => {
    const player1 = Player('human');
    const player2 = Player('computer');

    player1.gameboard.placeShip(3, 0, 0, 'horizontal');

    expect(player1.gameboard.ships.length).toBe(1);
    expect(player2.gameboard.ships.length).toBe(0);
  });
});