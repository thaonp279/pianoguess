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

    const background = props.hint === props.noteId && props.gameActive
        ? 'bg-sky-300'
        : props.notePlayed === props.noteId
            ? 'bg-green-300'
            : props.keyType === 'black'
                ? 'bg-black'
                : 'bg-white';

    return (
      <div
        id={props.noteId}
        className={`group inline-block border-solid border-2 border-black hover:border-green-300 rounded-md cursor-pointer  
        ${props.keyType === 'black'
            ? 'absolute w-[25px] h-[170px] text-white translate-x-[-50%] z-10'
            : 'relative w-[50px] h-[250px]'} 
        ${background}`}
        onClick={playSound}>
        <audio
          id={props.keyCode}
          src={props.audioUrl}/>
        <p className="absolute bottom-0 left-1/2 translate-x-[-50%]">{props.keyTrigger}</p>
      </div>
    )
}