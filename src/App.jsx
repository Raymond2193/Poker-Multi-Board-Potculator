import { useState } from 'react'
import calculate from './lib/calculator.js'
import './App.css'

function App() {
  const [numBoards, setNumBoards] = useState(1);
  const [preExistingPot, setPreExistingPot] = useState(0);
  const [nextId, setNextId] = useState(3);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", chips: 0, ranks: [0] },
    { id: 2, name: "Player 2", chips: 0, ranks: [0] },
  ]);

  function validate() {
    const errs = [];

    if (players.length < 2) {
      errs.push("At least 2 players are required.");
    }

    if (numBoards < 1) {
      errs.push("Number of boards must be at least 1.");
    }

    if (preExistingPot < 0) {
      errs.push("Pre-existing pot cannot be negative.");
    }

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const label = player.name.trim() !== "" ? player.name.trim() : "Player " + (i + 1);

      if (player.name.trim() === "") {
        errs.push("Player " + (i + 1) + " must have a name.");
      }

      if (player.chips <= 0) {
        errs.push(label + ": chips must be greater than 0.");
      }

      for (let b = 0; b < numBoards; b++) {
        if (player.ranks[b] < 1) {
          errs.push(label + ": enter a rank for Board " + (b + 1) + " (1 = best hand).");
        }
      }
    }

    return errs;
  }

  function handleAddPlayer() {
    const newPlayer = {
      id: nextId,
      name: "Player " + (players.length + 1),
      chips: 0,
      ranks: new Array(numBoards).fill(0),
    };
    setNextId(nextId + 1);
    setPlayers([...players, newPlayer]);
    setErrors([]);
  }

  function handleRemovePlayer(index) {
    if (players.length <= 2) return;
    const newPlayers = [...players.slice(0, index), ...players.slice(index + 1)];
    setPlayers(newPlayers);
    setErrors([]);
  }

  function handlePlayerChange(index, field, value) {
    const newPlayers = players.map((player, i) => {
      if (i === index) {
        return { ...player, [field]: value };
      } else {
        return player;
      }
    });
    setPlayers(newPlayers);
    setErrors([]);
  }

  function handleRankChange(playerIndex, boardIndex, value) {
    const newPlayers = players.map((player, i) => {
      if (i === playerIndex) {
        const newRanks = player.ranks.map((rank, b) => {
          if (b === boardIndex) {
            return value;
          } else {
            return rank;
          }
        });
        return { ...player, ranks: newRanks };
      } else {
        return player;
      }
    });
    setPlayers(newPlayers);
    setErrors([]);
  }

  function handleNumBoardChange(e) {
    const newCount = Number(e.target.value);
    setNumBoards(newCount);

    const newPlayers = players.map((player) => {
      const newRanks = [];
      for (let i = 0; i < newCount; ++i) {
        newRanks[i] = player.ranks[i] || 0;
      }
      return { ...player, ranks: newRanks };
    });

    setPlayers(newPlayers);
    setErrors([]);
  }

  function handleCalculate() {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      setResult(null);
      return;
    }
    setErrors([]);
    const output = calculate(players, numBoards, preExistingPot);
    setResult(output);
  }

  const gridCols = "1fr 130px " + Array(numBoards).fill("72px").join(" ") + " 40px";

  return (
    <div className="app">
      <header className="app-header">
        <h1>Potculator</h1>
        <p className="subtitle">Multi-board poker payout calculator</p>
      </header>

      <main className="app-main">
        <section className="config-row">
          <label className="config-field">
            <span className="config-label">Boards</span>
            <input
              className="config-input"
              type="number"
              min="1"
              value={numBoards}
              onChange={handleNumBoardChange}
              onFocus={(e) => e.target.select()}
            />
          </label>
          <label className="config-field">
            <span className="config-label">Pre-existing Pot</span>
            <input
              className="config-input"
              type="number"
              min="0"
              value={preExistingPot}
              onChange={(e) => setPreExistingPot(Number(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </label>
        </section>

        <section className="players-section">
          <div className="players-header" style={{ gridTemplateColumns: gridCols }}>
            <span className="col-label">Player</span>
            <span className="col-label">Chips In</span>
            {Array.from({ length: numBoards }).map((_, b) => (
              <span key={b} className="col-label col-center">B{b + 1} Rank</span>
            ))}
            <span className="col-label"></span>
          </div>

          <div className="players-body">
            {players.map((player, index) => (
              <div key={player.id} className="player-row" style={{ gridTemplateColumns: gridCols }}>
                <input
                  className="player-input player-name-input"
                  type="text"
                  value={player.name}
                  placeholder="Player name"
                  onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                />
                <input
                  className="player-input chips-input"
                  type="number"
                  min="1"
                  value={player.chips}
                  onChange={(e) => handlePlayerChange(index, "chips", Number(e.target.value))}
                  onFocus={(e) => e.target.select()}
                />
                {player.ranks.map((rank, boardIndex) => (
                  <input
                    key={boardIndex}
                    className="player-input rank-input"
                    type="number"
                    min="1"
                    value={rank}
                    onChange={(e) => handleRankChange(index, boardIndex, Number(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
                <button
                  className="btn-remove"
                  onClick={() => handleRemovePlayer(index)}
                  disabled={players.length <= 2}
                  title="Remove player"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button className="btn-add" onClick={handleAddPlayer}>
            + Add Player
          </button>
        </section>

        {errors.length > 0 && (
          <div className="errors">
            {errors.map((err, i) => (
              <p key={i} className="error-item">⚠ {err}</p>
            ))}
          </div>
        )}

        <button className="btn-calculate" onClick={handleCalculate}>
          Calculate ▶
        </button>

        {result && (
          <section className="results-panel">
            <div className="results-header">
              <span>Player</span>
              <span>Chips Out</span>
            </div>
            <div className="results-body">
              {players.map((player) => (
                <div key={player.id} className="result-row">
                  <span className="result-name">{player.name}</span>
                  <span className="result-chips">{result[player.id].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App
