import { useState } from 'react'
import KeySet from './components/KeySet'
import Control from './components/Control'


function App(props) {
  const [sustain, setSustain] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const [keydownActive, setKeydownActive] = useState(true)
  const [notePlayed, setNotePlayed] = useState('')
  const [hint, setHint] = useState(props.songs[0].notes[0])

  return (
    <div className='container'>
      <Control
        songs={props.songs}
        sustain={sustain}
        setSustain={() => {setSustain(prevSustain => !prevSustain)}}
        setKeydownActive={setKeydownActive}
        hint={hint}
        setHint={setHint}
        gameActive={gameActive}
        setGameActive={setGameActive}
        notePlayed={notePlayed}
      />
      <KeySet 
        hint={hint}
        pianoKeys={props.pianoKeys}
        sustain={sustain}
        keydownActive={keydownActive}
        gameActive={gameActive}
        notePlayed={notePlayed}
        setNotePlayed={(note) => setNotePlayed(note)}
        />
    </div>
  )
}

export default App
