# Norse Battleship

A browser-based Battleship game with a Viking theme, built as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship) JavaScript curriculum.

**Play it here:** [Norse Battleship - Elion Emini](https://programuesihkb.github.io/battleship_odinproject/)

## About

This project follows the classic Battleship rules: place your fleet, take turns attacking your opponent's grid, and sink every ship to win. It was built using vanilla JavaScript (factory functions, no classes), with game logic kept fully separate from the DOM so it could be unit tested in isolation with Jest.

## Features

- 10x10 grid for each player
- Random ship placement for both the human and computer fleets
- Click-to-attack interface with hit/miss feedback
- Visual ship sprites that reveal once a ship is fully sunk
- Win/lose end screen with a restart option

## Architecture

- `Ship` — tracks a single ship's length, hits, and sunk status
- `Gameboard` — places ships, receives attacks, tracks misses, reports if all ships are sunk
- `Player` — wraps a `Gameboard`, distinguishes human vs. computer
- `gameController` — owns both players, manages turn order and win conditions
- `displayController` — the only module that touches the DOM; renders boards, wires up click listeners, and reflects game state visually

## Known limitations / planned improvements

- **Computer moves are currently random.** There's no real targeting logic yet (e.g. following up around a hit) — that's a planned improvement.
- **Turns currently always alternate**, even after a hit. In the traditional Battleship rules, a player who lands a hit gets to go again. This isn't implemented yet but is planned, since right now the computer gets a turn even if the player just hit one of its ships.

## Note on AI assistance

Parts of this project were built with help from Claude (Anthropic). It was particularly useful for getting up to speed on structuring the board rendering (e.g. how to overlay ship sprites correctly across multiple cells, including rotating sprites for vertical ships) and for working through changes to the game logic (like tracking sunk ships and wiring the controller layer together). The core game design and implementation decisions are my own; AI assistance was used as a learning and debugging aid along the way.
