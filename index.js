(async()=> {
  //fetch piano keys and song data
  const res = await fetch('https://api.jsonbin.io/b/5ff52537a2070e409d6ea6de/2', {
    method: 'GET',
    headers: {'secret-key': '$2b$10$7oyVmSNdXvcuR2yBac6FyOZTFRFsaA7mKo4l3jpnpTWp3KYKfR2Ta'}
  });
  const data = await res.json();
  const pianoKeys = data.piano;
  const songs = data.songs;
  
  const lightKeyStyle = {
  background: 'lightGreen'
}

// piano key
class Key extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.playSound = this.playSound.bind(this);
    this.lightKey = this.lightKey.bind(this)
  }
  componentDidMount(){
    document.addEventListener('keydown', this.handleKeyPress);
  }
  compomentWillMount(){
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  handleKeyPress(e){
    if (this.props.keydownActive){
    e.preventDefault();
    if (e.keyCode == this.props.keyCode) {
      this.playSound();
    }}
  }
  playSound(){
    // if in game mode, activate next hint before playsound
    if(this.props.gameActive){
      this.props.guessSong();
    }
    const audio = document.getElementById(this.props.keyCode);
    audio.currentTime = 0;
    audio.play();
    this.props.updateDisplay(this.props.noteId);
    this.lightKey();
    if(!this.props.sustain) {
      setTimeout(() => {audio.pause()}, 800)
    }
    setTimeout(()=> {this.setState({active: false})}, 100)
  }
  lightKey(){
    this.setState({active: true});
  }
  render(){
    return (
      <div
        id={this.props.noteId}
        className={this.props.keyType}
        onClick={this.playSound}
        style={this.state.active? lightKeyStyle: {}}
      >
        <audio
          id={this.props.keyCode}
          src={this.props.audioUrl}
        />
        <p>{this.props.keyTrigger}</p>
      </div>
    )
  }
}

class KeySet extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    let keys = pianoKeys.map(key => {
      return (
        <Key
          noteId = {key.noteId}
          keyTrigger = {key.keyTrigger}
          keyCode = {key.keyCode}
          keyType = {key.type}
          audioUrl = {key.audioUrl}
          updateDisplay={this.props.updateDisplay}
          sustain={this.props.sustain}
          keydownActive={this.props.keydownActive}
          gameActive={this.props.gameActive}
          guessSong={this.props.guessSong}
        />
      )
    })
    return (
      <div className = 'keyboard'>
        {keys}
      </div>
    )
  }
}

class KeyBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      display: '',
      sustain: false,
      gameActive: false,
      keydownActive: true,
      gameLevel: 0,
      keyIndex: 0,
      guess: ''
    };
    this.updateDisplay = this.updateDisplay.bind(this);
    this.toggleSustain = this.toggleSustain.bind(this);
    this.guessSong = this.guessSong.bind(this);
    this.checkGuess = this.checkGuess.bind(this);
    this.updateGuess = this.updateGuess.bind(this);
    this.toggleKeydown = this.toggleKeydown.bind(this)
    };
  updateDisplay(note){
      this.setState({
        display: note
      })};
  toggleSustain(){
    this.setState({
      sustain: !this.state.sustain
    });
  }
  guessSong(){
    
    let songNotes = songs[this.state.gameLevel].notes;
    hint(this.state.gameLevel, this.state.keyIndex);
    //First game display instructions
    if (this.state.gameLevel== 0){
      this.updateDisplay('Play the highlighted keys and guess the song!');
    };
    
    //Last note 
    if (this.state.keyIndex == songNotes.length-1){
      this.setState({keyIndex: 0});
      this.setState({gameActive: false});
    } else{
      this.setState({keyIndex: this.state.keyIndex+1});
      this.setState({gameActive: true});
    }
  
    };
  
  toggleKeydown(){
    this.setState({keydownActive: !this.state.keydownActive})
  }
  updateGuess(event){
    this.setState({guess: event.target.value});
  }
  checkGuess(event){
    event.preventDefault();
    let correct = songs[this.state.gameLevel].name;
    //display if correct
    if(this.state.guess.toLowerCase() == correct.toLowerCase()){
      //correct & last game
      if(this.state.gameLevel== songs.length-1){
        this.updateDisplay("That's all. You rock!");
        this.setState({gameLevel: 0})
      //correct & not last
      } else {
      this.updateDisplay("Correct! Play another!");
      this.setState({gameLevel: this.state.gameLevel+1});
      }
    //display if incorrect  
    } else {
      //incorrect & last game
      if(this.state.gameLevel== songs.length-1){
      this.updateDisplay("Sorry! It's actually "+ correct+ ". Game over!");
      this.setState({gameLevel: 0})
      //incorrect & not last game
      } else {
      this.updateDisplay("Sorry! It's actually "+ correct+ ". Play another!");
      this.setState({gameLevel: this.state.gameLevel+1});
      }
    }
    this.setState({guess: ''});
    this.toggleKeydown();
  }
  render(){
    return (
      <div className='container'>
        <div className='controls'>
          <div className='sustain'>
            <p>Sustain</p>
            <div className='slider'>
              <div onClick={this.toggleSustain} className={this.state.sustain? 'slide-right': 'slide-left'}></div>
            </div>
          </div>
          <div className='display'><p>{this.state.display}</p></div>
          <div className='game' >
            <i className='fa fa-play fa-lg' onClick={this.guessSong}></i>
            <p onClick={this.guessSong}>Guess a Song</p>
            <br/>
            <form onSubmit={this.checkGuess}>
            <input value={this.state.guess} onClick={this.toggleKeydown} onChange={this.updateGuess}/>
            </form>
          </div>
        </div>
        <KeySet 
          updateDisplay={this.updateDisplay} 
          sustain={this.state.sustain}
          keydownActive={this.state.keydownActive}
          gameActive={this.state.gameActive}
          guessSong={this.guessSong}
          />
      </div>
    )
  }
  
}

ReactDOM.render(<KeyBoard />, document.getElementById('root'))



function hint(gameLevel, keyIndex){
  let key = songs[gameLevel].notes[keyIndex];
  let id = $.escapeSelector(key);
  $('#'+id).css('background','LightBlue')
  }
  
})()


