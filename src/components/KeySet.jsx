import { useEffect } from 'react'
import Key from './Key'

export default function KeySet(props) {
    let keys = props.pianoKeys.map(key => {
        return (
          <Key
            key={key.keyCode}
            noteId={key.noteId}
            keyTrigger={key.keyTrigger}
            keyCode={key.keyCode}
            keyType={key.type}
            audioUrl={key.audioUrl}
            sustain={props.sustain}
            keydownActive={props.keydownActive}
            gameActive={props.gameActive}
            setNotePlayed={(note) => props.setNotePlayed(note)}
            notePlayed={props.notePlayed}
            hint={props.hint}
          />)
        })
    return (
        <div className = 'keyboard'>
          {keys}
        </div>
    )
}