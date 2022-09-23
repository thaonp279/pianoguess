import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';

export default function Control(props) {
    /**
     * Control:
     * - sustain pedal (state from props)
     * - display (own state)
     * - the game (state from props)
     */
    const [guess, setGuess] = useState('')
    const [gameLevel, setGameLevel] = useState(0)
    const [keyIndex, setKeyIndex] = useState(0)
    const [display, setDisplay] = useState('')

    useEffect(() => {
        if(props.gameActive && props.notePlayed === props.hint){ // show next hint if played current hint
            nextHint();
        }
        if (props.notePlayed) { // keep showing last message unless new message is not empty
            setDisplay(props.notePlayed);
        }
    }, [props.notePlayed])

    function nextHint(){
        let songNotes = props.songs[gameLevel].notes;
        props.setHint(songNotes[keyIndex]);

        // calculate value of next hint
        if (keyIndex == songNotes.length - 1){
            setKeyIndex(0)
            props.setGameActive(false)
        } else{
            setKeyIndex(prevIdx => prevIdx + 1)
            props.setGameActive(true)
        }
    };

    function checkGuess(event){
        event.preventDefault();
        let correct = props.songs[gameLevel].name;
        //display if correct
        if (guess.toLowerCase() == correct.toLowerCase()){
            //correct & last game
            if (gameLevel== props.songs.length-1) {
                setDisplay("That's all. You rock!");
                setGameLevel(0);
            //correct & not last
            } else {
                setDisplay("Correct! Play another!");
                setGameLevel(prevLevel => prevLevel + 1);
            }

        //display if incorrect  
        } else {
            //incorrect & last game
            if (gameLevel == props.songs.length-1) {
                setDisplay(`Sorry! It's actually ${correct}. Game over!`);
                setGameLevel(0)
            //incorrect & not last game
            } else {
                setDisplay(`Sorry! It's actually ${correct}. Play another!`);
                setGameLevel(prevLevel => prevLevel + 1)
            }
        }

        // clear current game
        setGuess('');
        setKeyIndex(0);
        props.setHint('');
        props.setGameActive(false);
        props.setKeydownActive(true);
    }

    function handlePlay() {
        //First game display instructions
        if (gameLevel== 0){
            setDisplay('Play the highlighted keys and guess the song!')
        };
        // First hint
        if (keyIndex == 0) {
            nextHint();
        }
    }

    return (
      <div className='controls'>
        <div className='sustain'>
          <p>Sustain</p>
          <div className='slider'>
            <div 
              onClick={props.setSustain} 
              className={props.sustain? 'slide-right': 'slide-left'}></div>
          </div>
        </div>
        <div className='display'><p>{display}</p></div>
        <div className='game'>
          <FontAwesomeIcon icon={faPlay} onClick={handlePlay}/>
          <p onClick={handlePlay}>Guess a Song</p>
          <br/>
          <form onSubmit={checkGuess}>
          <input 
            value={guess} 
            onClick={() => props.setKeydownActive(false)} 
            onChange={(event) => setGuess(event.target.value)}/>
          </form>
        </div>
      </div>
    )
}