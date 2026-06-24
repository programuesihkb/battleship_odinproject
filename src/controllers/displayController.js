import GameController from './gameController.js';

const gameController = GameController();

const SHIP_TYPES = [
  { length: 4, name: 'Ormen' },
  { length: 3, name: 'Skidbladnir' },
  { length: 2, name: 'Drekar' },
  { length: 1, name: 'Naglfar' },
];

function randomPlaceShips(gameboard) {
  for (const { length, name } of SHIP_TYPES) {
    let placed = false;
    while (!placed) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      try {
        gameboard.placeShip(length, x, y, orientation, name);
        placed = true;
      } catch (e) {
        console.warn(`Failed to place ${name} at (${x}, ${y}) ${orientation}: ${e.message}`);
      }
    }
  }
}

function getShipPlacements(board) {
  const map = new Map();
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const s = board[y][x];
      if (!s) continue;
      if (!map.has(s)) map.set(s, { ship: s, minX: x, minY: y, maxX: x, maxY: y });
      const e = map.get(s);
      e.minX = Math.min(e.minX, x);
      e.minY = Math.min(e.minY, y);
      e.maxX = Math.max(e.maxX, x);
      e.maxY = Math.max(e.maxY, y);
    }
  }
  return [...map.values()].map((e) => ({
    ship: e.ship,
    x: e.minX,
    y: e.minY,
    length: Math.max(e.maxX - e.minX, e.maxY - e.minY) + 1,
    horizontal: e.maxX - e.minX >= e.maxY - e.minY,
  }));
}

function makeSprite(p, sunk = false) {
  const sprite = document.createElement('div');
  sprite.className = 'ship-sprite' + (p.horizontal ? '' : ' vertical') + (sunk ? ' sunk-reveal' : '');
  if (p.horizontal) {
    sprite.style.gridColumn = `${p.x + 1} / span ${p.length}`;
    sprite.style.gridRow = `${p.y + 1}`;
  } else {
    sprite.style.gridColumn = `${p.x + 1}`;
    sprite.style.gridRow = `${p.y + 1} / span ${p.length}`;
  }
  return sprite;
}

function renderBoard(boardEl, gameboard, showShips) {
  boardEl.innerHTML = '';
  const board = gameboard.board;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      boardEl.appendChild(cell);
    }
  }

  // Always add the ship layer — populated for player, empty for computer (fills on sink)
  const layer = document.createElement('div');
  layer.className = 'ship-layer';
  if (showShips) {
    for (const p of getShipPlacements(board)) {
      layer.appendChild(makeSprite(p));
    }
  }
  boardEl.appendChild(layer);
}

function revealSunkShip(boardEl, gameboard, ship) {
  const layer = boardEl.querySelector('.ship-layer');
  if (!layer) return;
  const placement = getShipPlacements(gameboard.board).find((p) => p.ship === ship);
  if (!placement) return;
  layer.appendChild(makeSprite(placement, true));
}

function buildFleetTracker(trackerEl) {
  trackerEl.innerHTML = '';
  for (const { length, name } of SHIP_TYPES) {
    const row = document.createElement('div');
    row.className = 'fleet-ship';
    row.dataset.name = name;

    const label = document.createElement('span');
    label.className = 'ship-label';
    label.textContent = name.charAt(0).toUpperCase() + name.slice(1);

    const cells = document.createElement('div');
    cells.className = 'ship-cells';
    for (let i = 0; i < length; i++) {
      const cell = document.createElement('span');
      cell.className = 'ship-cell';
      cells.appendChild(cell);
    }

    row.appendChild(label);
    row.appendChild(cells);
    trackerEl.appendChild(row);
  }
}

function markFleetShipSunk(trackerEl, shipName) {
  const row = trackerEl.querySelector(`.fleet-ship[data-name="${shipName}"]`);
  if (row) row.classList.add('sunk');
}

function markCell(boardEl, x, y, hit) {
  const cell = boardEl.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  if (cell) cell.classList.add(hit ? 'hit' : 'miss');
}

function setStatus(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg;
}

function showEndScreen(title, subtitle) {
  const overlay = document.createElement('div');
  overlay.className = 'win-overlay';
  overlay.innerHTML = `
    <div class="win-card">
      <h2>${title}</h2>
      <p>${subtitle}</p>
      <button class="nav-button" id="restart-btn">Play Again</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('restart-btn').addEventListener('click', () => location.reload());
}

export function init() {
  const playerBoardEl = document.getElementById('player-board');
  const computerBoardEl = document.getElementById('computer-board');
  const playerFleetEl = document.getElementById('player-fleet');
  const computerFleetEl = document.getElementById('computer-fleet');

  randomPlaceShips(gameController.getHumanPlayer().gameboard);
  randomPlaceShips(gameController.getComputerPlayer().gameboard);

  renderBoard(playerBoardEl, gameController.getHumanPlayer().gameboard, true);
  renderBoard(computerBoardEl, gameController.getComputerPlayer().gameboard, false);

  buildFleetTracker(playerFleetEl);
  buildFleetTracker(computerFleetEl);

  gameController.startGame();
  setStatus('Your turn — click the enemy board to attack.');

  computerBoardEl.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    if (!gameController.isGameActive() || gameController.getCurrentTurn() !== 'human') return;
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

    const x = +cell.dataset.x;
    const y = +cell.dataset.y;
    const result = gameController.playerAttack(x, y);
    if (!result) return;

    markCell(computerBoardEl, x, y, result.hit);

    if (result.sunk) {
      revealSunkShip(computerBoardEl, gameController.getComputerPlayer().gameboard, result.ship);
      markFleetShipSunk(computerFleetEl, result.shipName);
      setStatus(`You sunk their ${result.shipName}!`);
    }

    if (result.gameOver) {
      showEndScreen('Victory!', 'You sunk all enemy ships!');
      return;
    }

    if (!result.sunk) setStatus('Enemy is thinking…');
    computerBoardEl.classList.add('disabled');

    setTimeout(() => {
      const cr = gameController.computerAttack();
      if (!cr) return;
      markCell(playerBoardEl, cr.x, cr.y, cr.hit);

      if (cr.sunk) {
        markFleetShipSunk(playerFleetEl, cr.shipName);
      }

      computerBoardEl.classList.remove('disabled');

      if (cr.gameOver) {
        showEndScreen('Defeat!', 'The enemy sunk all your ships.');
      } else {
        setStatus(cr.sunk ? `Enemy sunk your ${cr.shipName}!` : 'Your turn — click the enemy board to attack.');
      }
    }, 700);
  });

  document.getElementById('new-game-btn')?.addEventListener('click', () => location.reload());
}
