import {useEffect} from 'react'

export default function Key(props) {
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        // remove note played to clean up display and key highlight
        const myTimeout = setTimeout(() => props.setNotePlayed(''), 1500);
        // clean up
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            clearTimeout(myTimeout);
        };
    });

    function playSound(){
        // set key to be active
        props.setNotePlayed(props.noteId)

        // play key sound with sustain option
        const shortDur = 800;
        const audio = document.getElementById(props.keyCode);
        audio.currentTime = 0;
        audio.play()
            .then(() => {
                if(!props.sustain) {
                    setTimeout(() => {
                        audio.pause()}, shortDur);
                    }
                })
    }

    // event handler
    function handleKeyPress(event){
        if (props.keydownActive){
            event.preventDefault();
            if (event.keyCode == props.keyCode) {
                playSound();
            }
        }
    }

    const keyClass = props.hint === props.noteId && props.gameActive? 'hint': 
        props.notePlayed === props.noteId? 'active': '';

    return (
      <div
        id={props.noteId}
        className={`${props.keyType} ${keyClass}`}
        onClick={playSound}>
        <audio
          id={props.keyCode}
          src={props.audioUrl}/>
        <p>{props.keyTrigger}</p>
      </div>
    )
}