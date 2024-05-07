import PlayerInfoCard from './components/PlayerInfoCard'
import PlayerStatHistCard from './components/PlayerStatHistCard'

import Button from '@mui/material/Button'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import './App.css'

import { useState } from 'react'

function App() {

  const [playerIdEntered, setPlayerIdEntered] = useState<boolean>(false)
  const [playerId, setPlayerId] = useState<number|null>(null)

  return (
    <>
    {playerIdEntered && playerId ? (
      <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Button sx={{
            minWidth: 0,
            width: '50px',
            height: '50px',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            border: '2px solid #a688fa', 
            borderRadius: '10px' 
          }}
          onClick={() => setPlayerIdEntered(false)}
          >
            <ArrowBackIosNewIcon sx={{color: 'white'}} />
          </Button>
        </div>
        <PlayerInfoCard player_id={playerId} />
        <PlayerStatHistCard player_id={playerId} />
      </>
    ) : (

      <div className='App'>
        <div className='App-header'>
          <h1>osu! Stats</h1>
          <input type='text' placeholder='Enter Player ID' onChange={(e) => setPlayerId(parseInt(e.target.value))} />
          <Button variant='contained' onClick={() => setPlayerIdEntered(true)}>Submit</Button>
        </div>
      </div>
  
    )}
      
    </>
  )
}

export default App
