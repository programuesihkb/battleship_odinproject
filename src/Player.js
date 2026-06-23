import GameBoard from './gameboard'; 

export default function Player(type = 'human') {
  if (type !== 'human' && type !== 'computer') {
    throw new Error('Player type must be "human" or "computer"');
  }

  const gameboard = GameBoard();

  function getType() {
    return type;
  }

  return {
    type,
    gameboard,
    getType,
  };
}