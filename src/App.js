import React from 'react';
import './App.css';
import starship from './starship'


function App() {
  React.useEffect(() => {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext("2d")
    console.log(canvas)
    console.log(context)
    context.moveTo(0, 0)
    context.lineTo(200, 100)
    context.stroke()
    starship.run(context)
  }, [])
  return (
    <div className="App">
      <canvas width="800" height="400" />
    </div>
  );
}

export default App;
