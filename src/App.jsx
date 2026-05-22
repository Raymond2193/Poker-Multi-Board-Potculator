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


  function handleNumBoardChange(e) {
    const newCount = Number(e.target.value);
    setNumBoards(newCount);

    const NumBoards(newCount);

    const newPlayers = players.map((player) => {
      const newRanks = []
      for (let i = 0; i < newCount; ++i) {
        newRanks[i] = player.ranks[i] || 0;
      }
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
          onChange={(e) => setNumBoards(Number(e.target.value))}
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
    </>
  )
}

export default App
