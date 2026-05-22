import { useState } from 'react'
import calculate from './lib/calculator.js'
import './App.css'

function App() {
  const [numBoards, setNumBoards] = useState(1);
  const [preExistingPot, setPreExistingPot] = useState(0);
  const [players, setPlayers] = useState([
    { name: "Player 1", chips: 0, ranks: [0] },
    { name: "Player 2", chips: 0, ranks: [0] },
  ]);

  function handleAddPlayer() {
    const newPlayer = {
      name: "Player " + (players.length + 1),
      chips: 0,
      ranks: new Array(numBoards).fill(0),
    }
    setPlayers([...players, newPlayer]);

  }

  function handleRemovePlayer(index) {
    if (players.length <= 2) return;
    const newPlayers = [...players.slice(0, index), ...players.slice(index + 1)];
    setPlayers(newPlayers);
  }

  function handlePlayerChange(index, field, value) {
    const newPlayers = players.map((player, i) => {
      if (i === index) {
        return { ...player, [field]: value };
      } else {
        return player;
      }
    })
    setPlayers(newPlayers);
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
  }




  function handleNumBoardChange(e) {
    const newCount = Number(e.target.value);
    setNumBoards(newCount);

    const newPlayers = players.map((player) => {
      const newRanks = []
      for (let i = 0; i < newCount; ++i) {
        newRanks[i] = player.ranks[i] || 0;
      }
      return { ...player, ranks: newRanks };
    })

    setPlayers(newPlayers);
  }


  return (
    <>
      <h1>Potculator</h1>
      <label>
        Boards:
        <input
          type="number"
          value={numBoards}
          onChange={handleNumBoardChange}
        />
      </label>
      <p>Boards: {numBoards}</p>


      <label>
        Pot:
        <input
          type="number"
          value={preExistingPot}
          onChange={(e) => setPreExistingPot(Number(e.target.value))}
        />
      </label>
      <p>Pot: {preExistingPot}</p>

      {players.map((player, index) => (
        <div key={index}>
          <input
            type="text"
            value={player.name}
            onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
          />
          <input
            type="number"
            value={player.chips}
            onChange={(e) => handlePlayerChange(index, "chips", Number(e.target.value))}
          />

          {player.ranks.map((rank, boardIndex) => (
            <input
              key={boardIndex}
              type="number"
              value={rank}
              onChange={(e) => handleRankChange(index, boardIndex, Number(e.target.value))}
            />
          ))}

          <button onClick={() => handleRemovePlayer(index)}>-</button>
        </div>
      ))}
      <button onClick={handleAddPlayer}>+ Add Player</button>
    </>
  )
}

export default App
