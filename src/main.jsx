import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

(async () => {
  
  const res = await fetch('https://api.jsonbin.io/v3/b/632a8be9a1610e638632a239', {
    method: 'GET',
    headers: {'X-Access-Key': '$2b$10$Aia3Ah4hmlS86/9OTz5m2.lC9h65dVsTZICxV488rFWAr/4Q8hDMW'}
  });
  const data = await res.json();
  const pianoKeys = data.record.piano;
  const songs = data.record.songs;

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App 
      pianoKeys={pianoKeys}
      songs={songs}/>
    </React.StrictMode>
  )

})()

