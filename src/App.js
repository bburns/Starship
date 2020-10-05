import React from 'react';
import './App.css';
import starship from './starship'


function App() {
  React.useEffect(() => {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")
    starship.run(context)
    canvas.onkeydown = event => starship.onKeyDown(event)
    canvas.onkeyup = event => starship.onKeyUp(event)
    canvas.focus()
  }, [])
  return (
    <div className="App">
      <canvas width="800" height="400" tabIndex="1" />
    </div>
  );
}

export default App;
