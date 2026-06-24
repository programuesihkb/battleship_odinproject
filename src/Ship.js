
export default function Ship(length, name = '') {
  let hits = 0;

  function hit() {
    hits++;
  }

  function isSunk() {
    return hits >= length;
  }

  function getHits() {
    return hits;
  }

  function getLength() {
    return length;
  }

  function getName() {
    return name;
  }

  return {
    hit,
    isSunk,
    getHits,
    getLength,
    getName,
  };
}